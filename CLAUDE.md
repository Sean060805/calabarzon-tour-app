# CLAUDE.md

**Status: the midterm (PLAN.md) is DONE and pushed. Project Phase 2 (PLAN-PHASE2.md): Steps 0 to 8 are BUILT and committed, but NOT yet tested on a phone and NOT pushed. Step 9 (content) is DONE: all 15 destinations are loaded in Firestore. Next: Klyde tests on the phone, then Claude explains each step line by line, then push. Every tour has 3 photo stops; only Aguinaldo Shrine also has a 360° photo inside the app, and the other places use the Open 360° Street View button. Klyde confirmed on 2026-11-17 that the 360° viewer and the full demo run work on the iPhone. Built after that and NOT phone-tested: App Settings (editable name and logo), Sources and Credits, and the "+ Add" color fix. Klyde presents on 2026-11-18.**

Update the status line above at the end of every step.

## Where Phase 2 stands (2026-11-16)

- **Built while Klyde slept, at Klyde's request,** with one commit per step (`Final Step 0` to `Final Step 9`). The app bundles without errors (`npx expo export`), but **nothing has been run on a phone yet.** Test before pushing.
- **Still owed to Klyde:** the line-by-line explanation and the tiny exercise for each step (teaching rules 1 and 6). Go through them one step at a time when Klyde is ready.
- **Test the 360° viewer first.** It was only tested in desktop Chrome, not in the phone's WebView. If a 360° stop shows black or an error on Android or iPhone, look at `utils/panoramaHtml.js` (it turns the base64 photo into a `blob:` address before giving it to Pannellum).
- **Polish pass (Step 8b, 2026-11-16, Klyde asked for all five):** 30 extra tour photos loaded (2 per destination, Wikimedia Commons, credits in `docs/tour-content.md`); Details screen regrouped; quiz progress bar, fade-in, and vibration (`expo-haptics` 58.0.8); progress card on Home; press feedback (`components/PressableScale.js`, used by `AppButton` and `DestinationCard`). Klyde asked about the "Emil Kowalski", "Impeccable", and "Taste" skills: they are not installed and are for websites, so their ideas were applied by hand.
- **Klyde only has an iPhone now** (no Android phone), so nothing from Phase 2 has been seen on Android.
- **Confirmed working on Klyde's iPhone (2026-11-17):** the 360° viewer, and the whole demo run (tour, quiz, score, My Progress, add and delete a destination). Everything built after that message is NOT phone-tested yet: the "+ Add" color fix, App Settings, Sources and Credits, and the sources / photo credit fields.
- **Klyde presents on 2026-11-18, on the iPhone, using a groupmate's phone hotspot.** Klyde does not want the line-by-line explanations.
- **Developer name for the README: Sean Looc** (the name Klyde gave on 2026-11-17). It is also the default `ownerName` in App Settings.
- **The teacher wants the system to be "dynamic", so it could be given or sold to a company:** the name and logo must be replaceable without code. Built as App Settings (`app/settings.js`, `services/settingsService.js`, collection `settings`, document `app`; defaults in `constants/defaultSettings.js`). Home reads it on every focus and sets the header title with `<Stack.Screen options>`; a copy is kept in AsyncStorage so the name shows at once. The README has a "Giving the app to a new owner" table. Not done on purpose: changing colors in the app (colors are imported in every file), and the phone's home-screen icon (needs a rebuild).
- **Sources and Credits screen (`app/credits.js`)** reads `sources` (one per line) and `photoCredit` from each destination; both are optional fields in the form. The 15 are loaded with `load.js --credits` (built by `credits-data.js` from `docs/destinations.md` and `content.js`).
- **iOS 26 header buttons:** the system puts them in a light glass circle, so white text can't be read. `app/_layout.js` makes the "+ Add" text green on iOS 26 and later, white elsewhere. Use the same `onGlass` check for any new header button.
- The blue gear button floating on the screen in Klyde's screenshots is Expo Go's own tools button, not part of the app.
- **Content:** `docs/tour-content.md` has history, cultural significance, and 5 quiz questions for all 15 destinations, with sources and **Check** notes.
- **All 15 are loaded in Firestore** (75 questions), on Klyde's "OK, load it" of 2026-11-16. Only Aguinaldo Shrine has a 360° stop.
- **Two midterm descriptions were changed on Klyde's decision (2026-11-16):** Corregidor's Malinta Tunnel years are now 1932 to 1934 (following Wikipedia), and the Taal basilica is "considered the largest church building in the Philippines" (not "in Asia"). Both are noted in `docs/destinations.md`.
- **The loader is outside the repo, in the folder `C:\Projects\phase2-content`.** Its `content.js` is the one source for both the document and the database: after editing it, run `node build-doc.js` to rewrite `docs/tour-content.md`. From that folder:
  - `node --env-file=../calabarzon-tour/.env load.js --check` (reads only)
  - `node --env-file=../calabarzon-tour/.env load.js --all` (loads all 15; safe to run twice)
  - `node --env-file=../calabarzon-tour/.env load.js --photos` (only the 30 extra tour photos; `photos.js` holds the picks and captions, `photo-process.js` downloads them)
  - `node --env-file=../calabarzon-tour/.env load.js --undo "Aguinaldo Shrine"` (removes what was loaded; `--undo --all` for everything)
- **Open 360° Street View button (Klyde chose this on 2026-11-16).** It is on Details and in the tour, for destinations that have a `coordinates` field ("latitude, longitude"; optional in the form). It opens `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=...`, which shows the Street View photo nearest to that point. All 15 have coordinates (sources in `docs/tour-content.md`). **Not yet checked on a phone:** if a place opens as a plain map or a far-away view, there is no Street View photo near its point; fix the coordinates with the app's Edit button and in `C:\Projects\phase2-content\coordinates.js`. Most at risk: Taal Volcano, Pagsanjan Falls, Masungi Georeserve, Corregidor Island.
- **360° photos inside the app are the weak spot.** No free-to-use 360° photos of the 15 sites exist (searched Wikimedia Commons and KartaView). The one loaded is a KartaView street photo in front of the Aguinaldo Shrine. Ways to get more: Klyde or classmates take them (the app adds 360° photos from the gallery: Details → Tour Photos); a free Mapillary account and token would let Claude search more street-level 360° photos; or the teacher accepts the Open in Google Maps button for the rest. Never copy Google Street View images.
- Checked and ruled out for 360°: the DOT/TPB "360° VR tours" site (tpb.pcitech.com.ph) is offline, and no official NHCP 360° tours were found for the Aguinaldo or Rizal museums.
- Files beyond PLAN-PHASE2.md's first list, on purpose: `components/TourStopForm.js` and `utils/score.js`.

## Where the midterm ended (2026-11-16)

- All CRUD, search, filters, and photo features in PLAN.md work on Klyde's Android phone and iPhone (Expo Go).
- **Firestore has 15 real destinations, 3 per province, all with photos.** Claude added them with a one-time script at Klyde's request (the script is not in the repo); the text and sources are in `docs/destinations.md`, with Wikimedia Commons photo credits at the end. Museo De La Salle was swapped for the Bonifacio Trial House, because Commons has no free photos of the museum.
- PLAN.md's README screenshots were skipped on purpose: the project is presented face to face. The README has no developer name yet; add it if Klyde gives one.
- Before presenting: check the Taal Volcano alert level at phivolcs.dost.gov.ph and update that destination if it changed from Alert Level 1.
- **The Firestore rules expire on January 31, 2027** (test-mode rules from PLAN.md Part A). If Phase 2 runs past that date, or adds login, the rules must be updated in the Firebase Console.
- Files added beyond PLAN.md's folder structure, on purpose: `components/AppButton.js`, `components/Chip.js`, `components/StatusView.js`, `constants/provinces.js`, and `docs/destinations.md`. `CategoryFilter` is used for both the category and province filters.

## What Klyde prefers (learned during the midterm)

- Short, plain explanations to read, with no hard words ("just teach me and I will read it").
- Klyde may ask for several phases at once. When asked, build them back to back with one commit per phase, then have Klyde test everything before pushing.
- Klyde would rather have Claude do tedious work (like entering data) than spend an hour on it by hand.

## How to teach

Klyde wants to **learn React Native while building**, not just get finished code.

1. **Build a small piece first, then explain it line by line.** Keep each piece small: one screen, one feature, or one function at a time.
2. **Keep explanations short and simple.** Use everyday words. No long lectures or jargon. If you have to use a technical word, explain it in one sentence.
3. **Compare to what Klyde already knows** (PHP, MySQL, HTML, CSS, JavaScript). Use the "React for PHP developers" table below.
4. After each phase, **stop and ask Klyde to test it on the phone** with Expo Go, and wait for a "works" before you continue.
5. After each phase works, **commit to git** with a clear message, for example `Phase 2: show destination list`, and push.
6. At the end of each phase, give **one tiny exercise** (2 to 5 minutes) for Klyde to try alone, like changing a color or adding a field. Check it if Klyde asks.
7. Write code in **JavaScript (.js)**, not TypeScript. Keep it beginner-readable: clear names, small components, short comments only where something isn't obvious.
8. **Never use an Android emulator or iOS simulator.** Testing is on a real phone through Expo Go only.
9. If a library is needed, install it with `npx expo install <package>` (not plain `npm install`) so its version matches Expo.
10. Don't rush ahead. Don't do several phases in one go, unless Klyde asks for it.

## React for PHP developers (cheat sheet to use while teaching)

| React Native idea | What it's like in what Klyde knows |
|---|---|
| Component (`function HomeScreen()`) | A PHP function or `include` file that returns a piece of HTML |
| JSX (`<View><Text>Hi</Text></View>`) | Writing HTML inside JavaScript. `<View>` ≈ `<div>`, `<Text>` ≈ `<p>`/`<span>` |
| Props | Function parameters passed into a component |
| State (`useState`) | A variable that **redraws the screen** when it changes (no page reload needed) |
| `useEffect` | Code that runs when the screen opens, like the PHP code at the top of a page that queries the DB |
| `FlatList` | A `foreach` loop that prints one row for each item |
| `StyleSheet` | CSS, but written as JS objects with camelCase names (`backgroundColor`). Flexbox is the default, and the direction is **column** |
| expo-router file `app/destinations/[id].js` | A PHP page like `details.php?id=5`. The file name is the URL |
| Firestore **collection** / **document** / **field** | MySQL **table** / **row** / **column** |
| `addDoc` / `getDocs` / `updateDoc` / `deleteDoc` | `INSERT` / `SELECT` / `UPDATE` / `DELETE` |
| `async` / `await` | Waiting for the database to answer before continuing (like `mysqli_query` returning a result) |
| `.env` file with `EXPO_PUBLIC_` variables | Like a `config.php` holding DB credentials |

## Expo notes for this project

- The project uses **Expo SDK 58** (see `expo` in `package.json`). Expo changes between SDK versions, so check the docs for this version before using an Expo or React Native API: https://docs.expo.dev/versions/v58.0.0/ (index of all docs: https://docs.expo.dev/llms.txt).
- Screens live in **`app/` at the project root** (not `src/app/`), as in PLAN.md's folder structure.
- Expo Go only contains its built-in native modules. Only use libraries that work in Expo Go; never anything that needs a development build.
- `npx expo-doctor` checks for version and config problems.
- `npx expo login` crashes on Windows when it opens the browser (the `&` in the login URL breaks `cmd.exe start`). Workaround: `set BROWSER=none` (cmd) or `$env:BROWSER="none"` (PowerShell), then `npx expo login` and open the printed link by hand. Klyde must be logged in on both the CLI and the Expo Go app.
- iOS 26 makes stack headers see-through by default when no header color is set, so content slides under them. `app/_layout.js` sets `headerTransparent: false` to prevent this.
- `react-dom` is pinned to Expo's version (19.3.0, same as `react`). Without that, npm pulled in a newer `react-dom` and `npx expo install` failed with an ERESOLVE peer dependency error. If that error comes back, check that `react-dom` still matches `react`.
- The Firestore reads in `services/destinationService.js` use `getDocsFromServer`/`getDocFromServer`, so that being offline shows an error instead of an empty list.
- Phase 2 added `react-native-webview` (14.0.1) and `@react-native-async-storage/async-storage` (2.2.0). Both are in Expo Go for SDK 58.
- The 360° viewer loads Pannellum 2.5.6 from `cdn.jsdelivr.net` inside the WebView, so it needs internet. If school Wi-Fi blocks that address, the viewer shows "Could not load the 360° viewer".
- The tour screen keeps the viewer outside the ScrollView and uses Previous / Next buttons instead of swiping, so dragging the 360° photo does not fight with scrolling.
