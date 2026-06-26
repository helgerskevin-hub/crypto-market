# TODO

Onze gezamenlijke takenlijst voor de Crypto Copy-Trading app.
We kunnen hier dingen aan toevoegen en afvinken terwijl we werken.

## Hoe werkt dit? (voor noobs 👍)

Dit is gewoon een tekstbestand. Elke taak is een regel die begint met `- [ ]`.

- `- [ ]` = nog te doen (leeg vakje)
- `- [x]` = klaar (afgevinkt)

Afvinken doe je door de spatie tussen de blokhaken te vervangen door een `x`.
Op GitHub en in veel editors zie je dan een echt aanvinkbaar vakje. ✅

Voeg gerust nieuwe taken toe onderaan de juiste sectie. Geen verkeerde manier — typ
gewoon een nieuwe regel die begint met `- [ ]`.

---

## 🔥 Nu mee bezig

_(Verplaats hier de taak waar we op dit moment aan werken, zodat we het overzicht houden.)_

- [ ] **Overstap naar een echte native app.** Besluit: **React Native + Expo (TypeScript)**
  — zie [`docs/native-app-techniekkeuze.md`](docs/native-app-techniekkeuze.md). Kevin
  bekijkt de UX/UI-pointers in dat document. Eerstvolgende stap: kale Expo-app opzetten
  en lokaal een installeerbare APK bouwen (eenmalig JDK 17 installeren; Android-SDK staat er al).

## 💡 Ideeën / wensen

_(Dingen die je leuk of handig zou vinden, nog niet ingepland.)_

- [ ] Naam voor de app bedenken
- [ ] Inloggen? Zo ja, database?
- [ ] Wens: portfolio uit eToro kunnen halen zodat je je trades niet zelf hoeft in te vullen

## 🛠️ Te doen

### Migratie naar native app (React Native + Expo)
- [ ] Kale Expo-app opzetten + lokaal een installeerbare APK bouwen (bewijs dat de gratis bouw-/sideload-loop werkt). Eenmalig JDK 17 installeren.
- [ ] Analyse-engine porten: `engine.js` overzetten naar de Expo-app (TypeScript). Python `src/` blijft de referentie/"bron van waarheid" voor de berekeningen.
- [ ] Schermen (her)bouwen op basis van Kevin's UX/UI-keuzes: Marktanalyse, Grote kansen, Mijn Trades, eToro-traders, onboarding.
- [ ] Pushmeldingen + lokale opslag aansluiten (`expo-notifications`, `expo-sqlite`).
- [ ] Desktop-versie (Python web-UI: `app.py` + `app_ui.py`) uitfaseren/verwijderen zodra de native app de functies overneemt.

### Functioneel / inhoud
- [ ] Begrijpen wat de "score" (0–100) van een coin betekent (zie `crypto_analyzer.py`) — uitleg in de app. **Uitgesteld:** hoort in de nieuwe native app (de mobiele frontend bestond niet meer in de checkout).
- [ ] eToro API integratie en mogelijkheden uitwerken.
- [ ] Grote Kansen laat nu ook niet tradable coins zien bij eToro. Wellicht mogelijk met API de scan te filteren op enkel tradable coins
- [ ] Copy trading uitwerken, makkelijkere stappen
- [ ] Onboarding van de app
- [ ] Volledig app design maken (Kevin — UX/UI; zie pointers in `docs/native-app-techniekkeuze.md`)
- [ ] Naam van de app bedenken
- [ ] Account? Vrienden?

## 🐛 Bugs / dingen die kapot zijn

_(Werkt iets niet zoals verwacht? Schrijf het hier op, ook al weet je nog niet waarom.)_

- [ ] _(nog niks)_

## ✅ Klaar

_(Afgevinkte taken mogen hierheen verhuizen, zodat we kunnen terugzien wat we al gedaan hebben.)_

- [x] TODO-lijst aangemaakt 🎉
- [x] Techniekkeuze native app onderzocht → **React Native + Expo** ([`docs/native-app-techniekkeuze.md`](docs/native-app-techniekkeuze.md))
