import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { laadOpenTrades, OpenTrade } from '../storage/storage';
import { haalLivePrijs } from '../engine/cryptoAnalyzer';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const TASK_NAME = 'kader-price-check';
const KEY_COOLDOWN = 'kader_notif_cooldown';
const COOLDOWN_MS = 6 * 60 * 60 * 1000;   // max 1 notif per trade per 6h
const BACKGROUND_INTERVAL_MINUTES = 10;

// ---------------------------------------------------------------------------
// Notification channel setup (Android)
// ---------------------------------------------------------------------------
export async function stelMeldingenIn(): Promise<void> {
  await Notifications.setNotificationChannelAsync('kader', {
    name: 'Kader Trade-alerts',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#2563EB',
    sound: 'default',
  });

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
}

// ---------------------------------------------------------------------------
// Permission request
// ---------------------------------------------------------------------------
export async function vraagMeldingToestemming(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

// ---------------------------------------------------------------------------
// Cooldown helpers
// ---------------------------------------------------------------------------
async function laadCooldowns(): Promise<Record<string, number>> {
  try {
    const raw = await AsyncStorage.getItem(KEY_COOLDOWN);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

async function slaaCooldownOp(sleutel: string): Promise<void> {
  const cd = await laadCooldowns();
  cd[sleutel] = Date.now();
  await AsyncStorage.setItem(KEY_COOLDOWN, JSON.stringify(cd));
}

async function isCooldownActief(sleutel: string): Promise<boolean> {
  const cd = await laadCooldowns();
  const laatste = cd[sleutel];
  if (!laatste) return false;
  return Date.now() - laatste < COOLDOWN_MS;
}

// ---------------------------------------------------------------------------
// Core: check one trade against its live price
// ---------------------------------------------------------------------------
interface MeldingResultaat {
  verstuurd: boolean;
  reden?: string;
}

async function controleerTrade(trade: OpenTrade, livePrijs: number): Promise<MeldingResultaat> {
  const { symbool, entry, stopLoss, takeProfit } = trade;
  const risk   = entry - stopLoss;
  const reward = takeProfit - entry;

  let type: string | null = null;
  let titel = '';
  let body  = '';

  if (livePrijs <= stopLoss) {
    type  = `stop_${symbool}`;
    titel = `🛑 VERKOOP NU — ${symbool}`;
    body  = `Prijs ${livePrijs.toFixed(4)} heeft de stop loss ${stopLoss.toFixed(4)} geraakt. Open eToro en sluit de positie.`;
  } else if (livePrijs >= takeProfit) {
    type  = `tp_${symbool}`;
    titel = `🎯 NEEM WINST — ${symbool}`;
    body  = `Prijs ${livePrijs.toFixed(4)} heeft het take profit doel ${takeProfit.toFixed(4)} bereikt. Tijd om winst te pakken.`;
  } else if (risk > 0 && (entry - livePrijs) / risk >= 0.75) {
    type  = `nadert_stop_${symbool}`;
    titel = `⚠️ LET OP — ${symbool} nadert stop`;
    body  = `Prijs ${livePrijs.toFixed(4)} is 75%+ op weg naar stop loss ${stopLoss.toFixed(4)}.`;
  } else if (reward > 0 && (livePrijs - entry) / reward >= 0.75) {
    type  = `nadert_tp_${symbool}`;
    titel = `📈 OVERWEEG WINST — ${symbool}`;
    body  = `Prijs ${livePrijs.toFixed(4)} is 75%+ op weg naar take profit ${takeProfit.toFixed(4)}. Overweeg gedeeltelijke winst.`;
  }

  if (!type) return { verstuurd: false };

  if (await isCooldownActief(type)) return { verstuurd: false, reden: 'cooldown' };

  await Notifications.scheduleNotificationAsync({
    content: { title: titel, body, sound: 'default', data: { symbool, type } },
    trigger: null,
  });
  await slaaCooldownOp(type);
  return { verstuurd: true, reden: type };
}

// ---------------------------------------------------------------------------
// Public: controleer alle open trades (call vanuit foreground & background)
// ---------------------------------------------------------------------------
export async function controleerAlleOpenTrades(): Promise<void> {
  const trades = await laadOpenTrades();
  if (!trades.length) return;

  await Promise.allSettled(
    trades.map(async (trade) => {
      const prijs = await haalLivePrijs(trade.symbool);
      if (prijs != null) await controleerTrade(trade, prijs);
    })
  );
}

// ---------------------------------------------------------------------------
// Background fetch task
// ---------------------------------------------------------------------------
TaskManager.defineTask(TASK_NAME, async () => {
  try {
    await controleerAlleOpenTrades();
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export async function registreerAchtergrondTaak(): Promise<void> {
  try {
    const status = await BackgroundFetch.getStatusAsync();
    if (
      status === BackgroundFetch.BackgroundFetchStatus.Restricted ||
      status === BackgroundFetch.BackgroundFetchStatus.Denied
    ) return;

    const isGeregistreerd = await TaskManager.isTaskRegisteredAsync(TASK_NAME);
    if (!isGeregistreerd) {
      await BackgroundFetch.registerTaskAsync(TASK_NAME, {
        minimumInterval: BACKGROUND_INTERVAL_MINUTES * 60,
        stopOnTerminate: false,
        startOnBoot: true,
      });
    }
  } catch { /* background fetch not available in Expo Go */ }
}

export async function deregistreerAchtergrondTaak(): Promise<void> {
  try {
    const isGeregistreerd = await TaskManager.isTaskRegisteredAsync(TASK_NAME);
    if (isGeregistreerd) await BackgroundFetch.unregisterTaskAsync(TASK_NAME);
  } catch { /* ignore */ }
}
