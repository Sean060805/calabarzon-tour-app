# CALABARZON Virtual Tour

A mobile app for exploring tourist destinations and cultural heritage sites in **Region IV-A (CALABARZON): Cavite, Laguna, Batangas, Rizal, and Quezon**. It is meant as a virtual alternative to school field trips: take the tour of a place, then pass its quiz.

Built with React Native (Expo) and Firebase Cloud Firestore.

**Developed by Sean Looc.**

## Features

### Virtual tour
- **360° view:** a tour stop can be a 360° photo. Drag to look around in every direction, as if standing there.
- **Photos, history, and cultural significance:** each tour has at least three photo stops with captions and credits. It moves from stop to stop with Previous and Next, and shows the place's history and why it matters.
- **Open 360° Street View:** one tap opens Google Maps already in Street View at the destination's coordinates, so every place can be looked around in 360°. The app only opens Google's photos; it does not copy them.
- **Open in Google Maps:** finds the place on the map by its name and address.

### Educational quiz
- **Multiple-choice quiz for each destination,** one question at a time, with "Correct!" or "Not quite." and a short explanation after each answer.
- **Automatic score:** the app counts the correct answers and shows the score and the percent. 60% or better passes.
- **Feedback you can feel:** a progress bar fills as questions are answered, the answer fades in, and the phone gives a short vibration for a right or wrong answer.

### Progress tracking
- **Scores are saved to Cloud Firestore** under the student's name: last score, best score, and number of attempts.
- **My Progress screen:** how many destinations are completed, a progress bar, and the best score for each one. The Home screen shows the same count once a student has typed a name.
- **"✓ Completed" tag** on the destination cards.
- No login: the student types a name once, and the phone remembers it.

### Made to be handed over
- **App Settings:** the app's name, logo, opening text, and owner can be changed inside the app, with no code changes. They are saved in Firestore, so every phone shows the new ones. See [Giving the app to a new owner](#giving-the-app-to-a-new-owner).
- **Sources and Credits screen:** lists where each destination's facts and main photo come from, and what the app is built with.
- **All content is data:** destinations, tour photos, quiz questions, sources, and photo credits are all added and edited inside the app.

### Destination management (from the midterm)
- **Browse destinations:** a scrollable list of cards with a photo, name, category, and province.
- **Add, edit, and delete (CRUD):** all changes are saved to Cloud Firestore. The forms check that every field is filled in. Deleting asks "Are you sure?" first, and also removes the destination's tour photos, quiz questions, and saved scores.
- **Manage tour photos and quiz questions** for each destination, inside the app.
- **Photos from the gallery:** each photo is resized and compressed before saving (see [Image storage](#image-storage)).
- **Search and filter:** search by name, filter by category and by province. Tapping a province on the Home screen opens the list filtered to that province.
- **Loading, empty, and error states:** a spinner while loading, a message when a list is empty, and a "Try Again" button when there is no internet.

## Tech used

| Part | Tool |
|---|---|
| App framework | [Expo](https://expo.dev) SDK 58 (React Native 0.88), JavaScript |
| Navigation | [expo-router](https://docs.expo.dev/router/introduction/) (file-based routing, Stack navigator) |
| Database | [Firebase](https://firebase.google.com) JS SDK, Cloud Firestore |
| 360° viewer | [Pannellum](https://pannellum.org) (open source), shown inside react-native-webview |
| Saved on the phone | @react-native-async-storage/async-storage (the student's name and ID) |
| Vibration | expo-haptics |
| Animation | React Native's built-in Animated (no extra library) |
| Photos | expo-image-picker (gallery) and expo-image-manipulator (resize and compress) |
| Testing | Real Android and iPhone devices through the Expo Go app |

## Folder structure

```
app/                         Screens (each file is one screen)
  _layout.js                 Navigation frame: header style and screen titles
  index.js                   Home screen
  progress.js                My Progress
  credits.js                 Sources and Credits
  settings.js                App Settings (name, logo, opening text)
  destinations/
    index.js                 Destination list with search and filters
    [id].js                  Destination details
    add.js                   Add form
    edit/[id].js             Edit form
    tour/[id].js             Virtual tour
    stops/[id].js            Manage a destination's tour photos
    quiz/[id].js             Quiz and score
    questions/[id].js        Manage a destination's quiz questions
components/                  Reusable pieces
  AppButton.js               Button used across the app
  CategoryFilter.js          Row of filter chips ("All" plus options)
  Chip.js                    Small selectable rounded button
  DestinationCard.js         One destination in the list
  DestinationForm.js         Form shared by the Add and Edit screens
  FadeIn.js                  Makes its content fade in and slide up when it appears
  NameForm.js                "What's your name?"
  PanoramaViewer.js          The 360° viewer (a WebView)
  PressableScale.js          A pressable area that shrinks a little while pressed
  ProgressBar.js             Bar that slides to its new width
  QuestionForm.js            Form for adding or editing one quiz question
  QuizQuestion.js            One question with its four choices
  QuizResult.js              The score at the end of a quiz
  SearchBar.js               Search box
  StatusView.js              Loading spinner, messages, and "Try Again"
  TourStopForm.js            Form for adding one tour photo
  TourStopView.js            One tour stop: 360° viewer or normal photo
services/                    All Firestore calls, one file per collection
  destinationService.js      destinations
  tourService.js             tourStops
  quizService.js             questions
  progressService.js         progress
  settingsService.js         settings
lib/
  firebase.js                Firebase setup (reads keys from .env)
utils/
  haptics.js                 Short vibrations for right and wrong answers
  image.js                   Pick and compress a normal or a 360° photo
  maps.js                    Opens Google Maps and Street View
  panoramaHtml.js            Builds the small web page for the 360° viewer
  score.js                   Percent and pass/fail
  student.js                 Saves the student's name and ID on the phone
constants/                   Categories, provinces, colors, the quiz pass mark, and the default app settings
docs/
  destinations.md            Midterm content and sources for the destinations
  tour-content.md            History, cultural significance, quiz questions, and sources
```

## Data model

Five Firestore collections. `tourStops`, `questions`, and `progress` each point to a destination with a `destinationId` field (like a foreign key). `settings` holds one document.

**`destinations`**

| Field | Type | Notes |
|---|---|---|
| `name` | string | Required |
| `description` | string | Required |
| `history` | string | Required |
| `significance` | string | Cultural significance. Required |
| `address` | string | Required |
| `coordinates` | string | Optional. Latitude and longitude, such as `14.445000, 120.906944`. Used by Open 360° Street View |
| `province` | string | Cavite, Laguna, Batangas, Rizal, or Quezon |
| `category` | string | Historical Site, Church / Religious Site, Museum, Nature & Park, Beach & Resort, Festival & Cultural Event, or Landmark |
| `image` | string | Main photo: JPEG as a base64 data URI |
| `photoCredit` | string | Optional. Who took the main photo, and its license |
| `sources` | string | Optional. Where the facts come from, one source on each line |
| `createdAt` / `updatedAt` | timestamp | Set by the server |

**`tourStops`** (the tour photos after the main photo)

| Field | Type | Notes |
|---|---|---|
| `destinationId` | string | The destination this stop belongs to |
| `order` | number | Smaller numbers show first |
| `kind` | string | `photo` or `360` |
| `caption` | string | Required |
| `credit` | string | Photo credit, optional |
| `image` | string | JPEG as a base64 data URI |

**`questions`**

| Field | Type | Notes |
|---|---|---|
| `destinationId` | string | The destination this question belongs to |
| `order` | number | Smaller numbers show first |
| `question` | string | Required |
| `choices` | array of 4 strings | Required |
| `answerIndex` | number | 0 to 3: which choice is correct |
| `explanation` | string | Shown after answering, optional |

**`progress`** (one document per student per destination; its ID is `studentId_destinationId`)

| Field | Type | Notes |
|---|---|---|
| `studentId` / `studentName` | string | The ID is random and made on the phone the first time |
| `destinationId` / `destinationName` | string | |
| `lastScore` / `bestScore` / `total` | number | |
| `attempts` | number | How many times the quiz was finished |
| `completed` | boolean | True once the best score is 60% or more |
| `updatedAt` | timestamp | Set by the server |

**`settings`** (one document, with the ID `app`)

| Field | Type | Notes |
|---|---|---|
| `appName` | string | The name shown on the Home screen and in its header |
| `label` | string | Small text above the name, such as `REGION IV-A`. Optional |
| `intro` | string | The opening text on the Home screen |
| `ownerName` | string | Shown as "Developed by" on the Sources and Credits screen. Optional |
| `logo` | string | PNG as a base64 data URI, or empty for no logo |
| `updatedAt` | timestamp | Set by the server |

### Image storage

Firebase Storage requires the paid Blaze plan, so photos are stored **inside Firestore documents** as base64 text (`data:image/jpeg;base64,...`). A Firestore document can hold 1 MB, so:

- A normal photo is resized to 800px wide, compressed to JPEG quality 0.5, and rejected if it is still over about 300 KB.
- A 360° photo needs more detail: it is resized to 2400px wide, compressed to quality 0.6, and rejected if it is over about 950 KB. It must be twice as wide as it is tall.
- Every tour photo is its own document in `tourStops`.

All of this is in `utils/image.js`, so it can be swapped for Firebase Storage or another service later.

### 360° viewer

A 360° photo is one wide picture that wraps around the viewer like the inside of a ball. `utils/panoramaHtml.js` builds a small web page that loads the open-source Pannellum viewer from a CDN, and `components/PanoramaViewer.js` shows that page in a WebView. It needs an internet connection, like the rest of the app.

## Giving the app to a new owner

The app is built so a school, a tourism office, or a company can take it over without rewriting it.

| What to change | Where | Needs code? |
|---|---|---|
| App name, logo, opening text, owner name | In the app: Home → **App Settings** | No |
| Destinations, photos, 360° photos, history, quiz questions, sources | In the app: each destination's **Edit**, **Tour Photos**, and **Quiz Questions** | No |
| The database the app uses | The `.env` file: put in the new owner's Firebase settings | No, only that file |
| The icon and name shown on the phone's home screen | `assets/icon.png` and `name` in `app.json`, then build the app again | A rebuild |
| Colors | `constants/colors.js` | One file |
| Categories and provinces | `constants/categories.js` and `constants/provinces.js` | One file each |

The settings are saved in Firestore, so a change made on one phone shows on every phone the next time its Home screen opens.

## How to run

**You need:** [Node.js](https://nodejs.org) (LTS), a Firebase project with Cloud Firestore enabled, and the **Expo Go** app on an Android phone or iPhone.

1. Clone the repository and install the packages:
   ```
   git clone https://github.com/Sean060805/calabarzon-tour-app.git
   cd calabarzon-tour-app
   npm install
   ```
2. Create a file named `.env` in the project folder with your Firebase web app's settings (Firebase Console → Project settings → Your apps):
   ```
   EXPO_PUBLIC_FIREBASE_API_KEY=...
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   EXPO_PUBLIC_FIREBASE_APP_ID=...
   ```
   The `.env` file is not in the repository on purpose.
3. Start the app:
   ```
   npx expo start
   ```
4. Scan the QR code. On Android, use the Expo Go app; on iPhone, use the Camera app. The phone and computer must be on the same Wi-Fi. If they can't connect, use `npx expo start --tunnel`.

**Note on security:** this class project has no login, so anyone using the app can open App Settings and the edit screens. A real owner would add a login before release. Its Firestore rules allow anyone with the app's settings to read and write until January 31, 2027, so it should not hold private data. Students should type a first name or nickname only.

## Destination content

The destinations in the app are real places, three per province.

- [docs/destinations.md](docs/destinations.md): descriptions, addresses, sources, and photo credits (Wikimedia Commons).
- [docs/tour-content.md](docs/tour-content.md): history, cultural significance, quiz questions, sources, tour photo credits, and map coordinates.
