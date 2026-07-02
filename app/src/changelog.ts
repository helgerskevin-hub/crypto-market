// Bron voor het in-app wijzigingenscherm en de "nieuw in deze versie"-melding.
// Handmatig gelijk houden met CHANGELOG.md in de projectmap. Nieuwste eerst.

export interface ChangelogEntry {
  versie: string;
  datum: string;
  punten: string[];
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    versie: '0.0.3',
    datum: '2026-07-02',
    punten: [
      'Coin detail-scherm: tik op een coin op Markt, Grote Kansen of in je portfolio voor een full-screen overzicht met koersgrafiek, entry/stop/take-profit-lijnen, verse indicatoren en een onderbouwing van het advies. De grafiek toont datum- en prijslabels en reageert op aanraken: sleep over de lijn voor de exacte datum en koers op dat punt',
      'Meer "waarom kopen"-onderbouwing in het uitklapvak van de kaart op het Marktscherm',
      'Wijzigingenoverzicht in de app onder Instellingen, plus een eenmalige melding bij de eerste start na een update',
      'Dark/light mode: systeem, licht of donker via het tandwiel-icoon',
      'Error boundary zodat een kapotte component niet de hele app laat crashen',
      'Offline-melding op Markt- en Kansen-scherm gedeeld via één component',
      'Trade aanpassen in Mijn Trades: stop-loss en take-profit wijzigen, R/R herberekend',
      'Favorietenlijst op het Marktscherm: coins markeren met een ster, sorteren bovenaan',
      'Fear & Greed Index zichtbaar op het Marktscherm naast de Kader-marktbalk',
    ],
  },
  {
    versie: '0.0.2',
    datum: '2026-07-02',
    punten: [
      'Toetsenbord bedekte niet langer de invulvelden in de modal-formulieren (Trade toevoegen, Trade bijhouden, Trader beoordelen)',
    ],
  },
  {
    versie: '0.0.1',
    datum: '2026-06-28',
    punten: [
      'Eerste volledige release van de Kader-app (com.kader.app)',
      'Officieel Kader-logo in iconen en in de app',
      'Marktsentimentbalk (SELL/BALANCED/BUY)',
      'Skeleton-laadstate en pull-to-refresh op Markt en Kansen',
      'LayoutAnimation respecteert reduced-motion',
    ],
  },
];

export function nieuwsteVersie(): string {
  return CHANGELOG[0]?.versie ?? '0.0.0';
}
