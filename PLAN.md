# CALABARZON Virtual Tour App: Build Plan (Phase 1)

> **For Claude Code:** This is the full plan. Read all of it before you do anything.
> Part A is for Klyde to do by hand. Start your work at **Part B**.
> Before Phase 0, copy the rules in **Part B, "How to teach"** into a `CLAUDE.md` file at the project root so they stay in place for every session.

---

## About the project

A React Native (Expo) mobile app that lets users browse and manage tourist destinations and cultural heritage sites in Region IV-A (CALABARZON: **Cavite, Laguna, Batangas, Rizal, Quezon**). It's meant as an alternative to school field trips.

**Required features (Phase 1)**
1. Destination management (CRUD): add, view, edit, and delete destinations.
2. Destination info: name, description, address, category, image.
3. Search by name and filter by category.
4. Navigation: Home screen, Destination List, Destination Details.
5. Database: store and load destinations from Firebase (Cloud Firestore).

**Grading rubric:** Content 30, Connection 25, Organization 15, Accuracy 20, Effort 10.
- *Connection* means the app really talks to Firebase (live create, read, update, and delete).
- *Organization* means a clean folder structure and readable code.
- *Accuracy* means correct real-world data about each site and features that work without bugs.

**About Klyde (the developer)**
- New to React and React Native. Knows PHP, MySQL, Java, JavaScript, HTML, CSS, and C#.
- Windows PC with **4GB RAM**, so **do not use an Android emulator**. Test on a real phone with **Expo Go**. Klyde has both an Android phone and an iPhone.
- Building it alone. Target: **December 2026**.
- Node v24.19.0 is installed, and Klyde has a GitHub account.

---

## PART A: What Klyde does before opening Claude Code

Tick each box. It takes about 30 to 45 minutes.

### A1. Install software on Windows
- [ ] **Git for Windows**: https://git-scm.com/download/win (keep the default options). Claude Code on Windows needs it.
- [ ] **VS Code**: https://code.visualstudio.com
- [ ] **Claude Code extension for VS Code**: in VS Code, open Extensions (`Ctrl+Shift+X`), search **"Claude Code"** (publisher: Anthropic), click **Install**, then sign in when it asks. Guide: https://docs.claude.com/en/docs/claude-code/ide-integrations
- [ ] Check in a new terminal: `node -v`, `npm -v`, `git --version`. All three should print a version.

### A2. Set up your phones
- [ ] Install **Expo Go** from the Play Store (Android) and/or the App Store (iPhone).
- [ ] Put the phone and the PC on the **same Wi-Fi**. If school Wi-Fi blocks it, we'll use "tunnel" mode instead.
- [ ] Note for iPhone: scan the QR code with the normal **Camera** app. On Android, scan it inside **Expo Go**.

### A3. Create the Firebase project (the database)
1. [ ] Go to https://console.firebase.google.com and sign in with a Google account.
2. [ ] **Create a project** named `calabarzon-tour`. You can turn off Google Analytics.
3. [ ] In the left menu, go to **Build → Firestore Database → Create database**.
   - Location: `asia-southeast1 (Singapore)`. It's the closest to the Philippines.
   - Start in **test mode**.
4. [ ] Open the **Rules** tab and replace the rules with the block below, then click **Publish**. Test mode stops working after 30 days, and this keeps it open until the end of January 2027:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.time < timestamp.date(2027, 1, 31);
       }
     }
   }
   ```
   *(Anyone with your app's config can edit the data. That's fine for a class project, but don't put private data in it.)*
5. [ ] Click the gear icon → **Project settings** → **Your apps** → click the **Web** icon `</>` → name it `calabarzon-web` → **Register**. (Expo apps use the web version of Firebase, so this is correct.)
6. [ ] Copy the `firebaseConfig` values it shows (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId). Save them in a Notepad file for now. You'll paste them in during Phase 3.
7. [ ] **Don't** set up Firebase Storage. It now needs the paid plan. We'll save images a different way (see "Image plan" below).

### A4. Prepare the folder and GitHub
- [ ] Make a folder with **no spaces** and **not inside OneDrive**, for example `C:\Projects\`.
- [ ] On GitHub, create a **new empty repository** named `calabarzon-tour-app`. Don't add a README; Claude Code will add one.
- [ ] Put this `PLAN.md` file in `C:\Projects\`.

### A5. Start Claude Code
- [ ] In VS Code: **File → Open Folder → `C:\Projects\`**.
- [ ] Open the Claude Code panel (click the Claude icon in the sidebar or top-right of the editor).
- [ ] Type: **"Read PLAN.md and start Part B, Phase 0."**
- [ ] When Claude Code asks permission to run commands or edit files, read what it wants to do and click allow.
- [ ] To run the app, use VS Code's built-in terminal (**Terminal → New Terminal**, or `` Ctrl+` ``). That's where the QR code for Expo Go appears.
- [ ] After Phase 0 creates the `calabarzon-tour` folder, open **that** folder in VS Code (File → Open Folder) and continue there, so Claude Code works inside the project.

### Tips for a 4GB RAM PC
- Close Chrome and other heavy apps while the app is running.
- Keep only one terminal running `npx expo start`.

---

## PART B: Instructions for Claude Code

### How to teach (copy this section into `CLAUDE.md`)

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

### React for PHP developers (cheat sheet to use while teaching)

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

---

### Tech decisions (already agreed, don't change)

- **Expo** (latest SDK that Expo Go supports), created with `npx create-expo-app@latest`.
- **expo-router** for navigation (file-based routing).
- **JavaScript**, not TypeScript.
- **Firebase JS SDK** (`firebase` package) with **Cloud Firestore**. No authentication is needed for Phase 1.
- **expo-image-picker** to pick a photo from the phone's gallery.
- **expo-image-manipulator** to shrink the photo before saving it.

#### Image plan (important)
Firebase Storage needs the paid Blaze plan, so we **store the picture inside the Firestore document as a base64 string**:
- Pick the image, resize it to **about 800px wide**, compress it to **JPEG quality about 0.5**, then get base64 back.
- Save it as `image: "data:image/jpeg;base64,...."`.
- A Firestore document can hold up to 1MB, so keep each image **under about 300KB** and show an error if it's bigger.
- Show it with `<Image source={{ uri: destination.image }} />`.
- Write this as one helper function (`pickAndCompressImage`) so it's easy to replace with Firebase Storage or Cloudinary later.

### Data model

Collection: `destinations`

| Field | Type | Example |
|---|---|---|
| `name` | string (required) | `Rizal Shrine` |
| `description` | string (required) | `Birthplace of Dr. José Rizal...` |
| `address` | string (required) | `F. Mercado St., Calamba, Laguna` |
| `province` | string, one of: Cavite, Laguna, Batangas, Rizal, Quezon | `Laguna` |
| `category` | string, one of the categories below | `Historical Site` |
| `image` | string (base64 data URI) | `data:image/jpeg;base64,...` |
| `createdAt` | Firestore timestamp | `serverTimestamp()` |
| `updatedAt` | Firestore timestamp | `serverTimestamp()` |

**Categories** (keep them in one file, `constants/categories.js`):
`Historical Site`, `Church / Religious Site`, `Museum`, `Nature & Park`, `Beach & Resort`, `Festival & Cultural Event`, `Landmark`.

### Folder structure (the goal)

```
calabarzon-tour/
├── app/                      ← screens (each file = one screen/URL)
│   ├── _layout.js            ← the navigation "frame" (header, stack)
│   ├── index.js              ← Home screen
│   └── destinations/
│       ├── index.js          ← Destination List (search + filter)
│       ├── [id].js           ← Destination Details (+ Edit / Delete buttons)
│       ├── add.js            ← Add form
│       └── edit/[id].js      ← Edit form
├── components/               ← reusable pieces
│   ├── DestinationCard.js
│   ├── DestinationForm.js    ← shared by Add and Edit
│   ├── CategoryFilter.js
│   └── SearchBar.js
├── services/
│   └── destinationService.js ← ALL Firebase calls live here (like a PHP model/DAO)
├── lib/
│   └── firebase.js           ← Firebase setup
├── utils/
│   └── image.js              ← pickAndCompressImage()
├── constants/
│   ├── categories.js
│   └── colors.js
├── .env                      ← Firebase keys (NOT committed)
├── CLAUDE.md
└── README.md
```

---

### Build phases

Each phase follows the same loop: **build, run on phone, explain line by line, quick exercise, commit.**

#### Phase 0: Create the project and run "Hello"
- Create the app in `C:\Projects\`: `npx create-expo-app@latest calabarzon-tour --template blank`, then add expo-router with `npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar` and set it up the way the current Expo docs say for a manual install (`"main": "expo-router/entry"`, `scheme` in app.json). Check the Expo docs if anything differs.
- Copy `PLAN.md` into the new `calabarzon-tour` folder and create `CLAUDE.md` there (with the teaching rules + a line saying "Follow PLAN.md; current phase: X"). Update the current phase in `CLAUDE.md` at the end of every phase, so a new chat can pick up where we left off.
- Make `app/index.js` show "Hello CALABARZON".
- Run `npx expo start`. Klyde scans the QR code. If it can't connect, try `npx expo start --tunnel`.
- `git init`, add a `.gitignore` that includes `.env`, connect to the GitHub repo, first commit and push.
- **Teach:** what each project file is for, what JSX is, and how `<View>`/`<Text>` compare to HTML.

#### Phase 1: Screens and navigation (no database yet)
- `_layout.js` with a Stack navigator and header titles.
- Home screen: app title, short intro about CALABARZON, and a "Browse Destinations" button.
- List, Details, Add, and Edit screens as simple placeholders.
- Move between them with `<Link>` and `router.push()`. Pass the `id` to Details with `useLocalSearchParams()`.
- **Teach:** file-based routing (compare to PHP pages and `?id=`), and the Stack (the back button works like browser history).

#### Phase 2: Show a list using fake data
- Make a hardcoded array of 3 to 4 destinations in a temporary file.
- `DestinationCard` component (image, name, category, province). Use it in a `FlatList`.
- Tapping a card opens Details with that item's info.
- Basic styles in `constants/colors.js` and `StyleSheet`.
- **Teach:** components, props, `FlatList` (foreach), `StyleSheet` vs CSS, flexbox column default.

#### Phase 3: Connect to Firebase (READ)
- Install `firebase`. Klyde pastes the config into `.env` as `EXPO_PUBLIC_FIREBASE_API_KEY=...` etc.
- `lib/firebase.js` sets up the app and Firestore.
- `services/destinationService.js` with `getAllDestinations()` and `getDestinationById(id)`.
- List and Details screens load real data with `useEffect` + `useState`. Add **loading** (spinner) and **empty** ("No destinations yet") states.
- Klyde adds 1 or 2 test documents by hand in the Firebase Console to see them appear.
- **Teach:** Firestore vs MySQL, `async/await`, `useEffect`, why all DB code lives in one service file.

#### Phase 4: Add destinations (CREATE) + image from gallery
- `DestinationForm` component: `TextInput`s for name, description, address; choices for province and category (simple tappable chips or a picker); a "Pick Image" button with a preview.
- `utils/image.js` → `pickAndCompressImage()` (ask for gallery permission, resize, compress, return base64 data URI).
- **Validation:** all fields required. Show clear error messages.
- `addDestination(data)` in the service. Go back to the list after saving and show the new item.
- **Teach:** controlled inputs (`value` + `onChangeText`) compared to an HTML form + `$_POST`, permissions, and the base64 image idea.

#### Phase 5: Edit and delete (UPDATE, DELETE)
- Edit screen reuses `DestinationForm`, filled with the existing data. `updateDestination(id, data)`.
- Delete button on Details shows an `Alert` ("Are you sure?"), then `deleteDestination(id)`, then goes back to the list.
- Make sure the list refreshes after an add, edit, or delete. Use `useFocusEffect` so it reloads when the screen is shown again.
- **Teach:** reusing one form for two screens, confirm dialogs, refreshing data on focus.

#### Phase 6: Search and filter
- `SearchBar`: filters by name as you type (case-insensitive).
- `CategoryFilter`: horizontal row of category chips plus "All". Optional extra: a province filter.
- Load all destinations once, then filter in the app (Firestore can't do "contains text" searches, and the data set is small).
- Show "No results" when nothing matches.
- **Teach:** deriving a filtered list from state (like a `WHERE name LIKE '%x%'` but done in JS with `.filter()`).

#### Phase 7: Real content (Accuracy + Content points)
- Help Klyde enter **at least 2 or 3 real destinations per province (10 to 15 total)** through the app. Suggestions to research and **verify** (Klyde should check each address and description from official or reliable sources):
  - Cavite: Aguinaldo Shrine (Kawit), Corregidor Island, Museo de La Salle (Dasmariñas)
  - Laguna: Rizal Shrine (Calamba), Pagsanjan Falls, Nagcarlan Underground Cemetery
  - Batangas: Taal Heritage Town, Basilica of St. Martin de Tours (Taal), Taal Volcano
  - Rizal: Hinulugang Taktak (Antipolo), Antipolo Cathedral, Masungi Georeserve
  - Quezon: Kamay ni Hesus (Lucban), Pahiyas Festival (Lucban), Quezon Provincial Capitol
- Don't make up facts. If unsure, mark it for Klyde to check.

#### Phase 8: Polish and submit
- Consistent look: colors, spacing, card shadows, a nice Home screen.
- Error messages when Firebase fails (no internet).
- Clean up unused files and temporary fake data. Check the folder structure matches the plan.
- `README.md`: what the app does, features, tech used, how to run it, screenshots.
- Final test run against the checklist below. Final commit and push.

### Final test checklist (match to the rubric)
- [ ] Home → List → Details → back works on both Android and iPhone.
- [ ] Add a destination with a gallery image; it appears in the list and in the Firebase Console.
- [ ] Edit changes are saved and shown.
- [ ] Delete asks first, then removes it from the app and Firebase.
- [ ] Search finds by partial name; category filter works; "All" resets.
- [ ] Empty fields are blocked with a message.
- [ ] Data stays after closing and reopening the app (proof of the database connection).
- [ ] All sample data is real and checked.
- [ ] Code is in the planned folders; no leftover unused files.
- [ ] `.env` is **not** on GitHub.
