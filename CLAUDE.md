# CLAUDE.md

**Status: the midterm (PLAN.md) is DONE and pushed. Project Phase 2 (PLAN-PHASE2.md): Steps 0 to 8 are BUILT and committed, but NOT yet tested on a phone and NOT pushed. Step 9 (content) is DONE: all 15 destinations are loaded in Firestore. Next: Klyde tests on the phone, then Claude explains each step line by line, then push. Open question: how to get more 360° photos (only Aguinaldo Shrine has one).**

Update the status line above at the end of every step.

## Where Phase 2 stands (2026-11-16)

- **Built while Klyde slept, at Klyde's request,** with one commit per step (`Final Step 0` to `Final Step 9`). The app bundles without errors (`npx expo export`), but **nothing has been run on a phone yet.** Test before pushing.
- **Still owed to Klyde:** the line-by-line explanation and the tiny exercise for each step (teaching rules 1 and 6). Go through them one step at a time when Klyde is ready.
- **Test the 360° viewer first.** It was only tested in desktop Chrome, not in the phone's WebView. If a 360° stop shows black or an error on Android or iPhone, look at `utils/panoramaHtml.js` (it turns the base64 photo into a `blob:` address before giving it to Pannellum).
- **Content:** `docs/tour-content.md` has history, cultural significance, and 5 quiz questions for all 15 destinations, with sources and **Check** notes.
- **All 15 are loaded in Firestore** (75 questions), on Klyde's "OK, load it" of 2026-11-16. Only Aguinaldo Shrine has a 360° stop.
- **Two midterm descriptions were changed on Klyde's decision (2026-11-16):** Corregidor's Malinta Tunnel years are now 1932 to 1934 (following Wikipedia), and the Taal basilica is "considered the largest church building in the Philippines" (not "in Asia"). Both are noted in `docs/destinations.md`.
- **The loader is outside the repo, in the folder `C:\Projects\phase2-content`.** Its `content.js` is the one source for both the document and the database: after editing it, run `node build-doc.js` to rewrite `docs/tour-content.md`. From that folder:
  - `node --env-file=../calabarzon-tour/.env load.js --check` (reads only)
  - `node --env-file=../calabarzon-tour/.env load.js --all` (loads all 15; safe to run twice)
  - `node --env-file=../calabarzon-tour/.env load.js --undo "Aguinaldo Shrine"` (removes what was loaded; `--undo --all` for everything)
- **360° photos are the weak spot.** No free-to-use 360° photos of the 15 sites exist (searched Wikimedia Commons and KartaView). The one loaded is a KartaView street photo in front of the Aguinaldo Shrine. Ways to get more: Klyde or classmates take them (the app adds 360° photos from the gallery: Details → Tour Photos); a free Mapillary account and token would let Claude search more street-level 360° photos; or the teacher accepts the Open in Google Maps button for the rest. Never copy Google Street View images.
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
