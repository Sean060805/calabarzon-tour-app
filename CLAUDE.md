# CLAUDE.md

Follow PLAN.md. **Current phase: Phase 3 (connect to Firebase, READ), not started yet. Phases 0 to 2 are done.**

Update the current phase line above at the end of every phase.

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
10. Don't rush ahead. Don't do several phases in one go.

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
