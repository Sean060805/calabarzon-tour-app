# CALABARZON Virtual Tour App: Build Plan (Phase 2, the final project)

> **For Claude Code:** Read CLAUDE.md first, then all of this file. The midterm (PLAN.md) is done; do not redo it.
> The teaching rules in CLAUDE.md still apply: small pieces, short plain explanations, test on the phone, one commit per step.
> CLAUDE.md's status line says which step is next.

---

## What Phase 2 asks for

Add three things to the midterm app, so it can stand in for a real field trip:

1. **Virtual Tour:** show destination photos, historical information, and cultural significance.
2. **Educational Quiz:** multiple-choice questions for each destination. The app works out the score and shows it.
3. **Progress Tracking:** record quiz scores and which destinations are completed.

Reference from the teacher: https://nmfa.nationalmuseum.gov.ph/ (the National Museum of Fine Arts "360 Virtual Tour"). The visitor stands in one spot, drags to look all around, then moves to the next stop.

**Rubric:** the same as the midterm (Content 30, Connection 25, Organization 15, Accuracy 20, Effort 10).

---

## Decisions (confirmed by Klyde on 2026-11-16)

| # | Question | Decision |
|---|---|---|
| 1 | 360° tour like the reference, or a photo tour? | **A real 360° view.** The teacher expects it |
| 2 | Login, or just a name? | **Just a name,** typed once and remembered by the phone |
| 3 | When is a destination "completed"? | **When the quiz is passed: 60% or better (3 of 5)** |
| 4 | Can quiz questions be added inside the app? | **Yes (Step 7).** It also lets a destination added in the app have a quiz |
| 5 | Rubric | Same as the midterm |

---

## How it will work (the student's path)

```
Home ──► Destinations ──► Details ──► Virtual Tour ──► Quiz ──► Score
  │                          │                                    │
  └──► My Progress ◄─────────┴────────────────────────────────────┘
```

1. On **Details**, two new buttons: **Start Virtual Tour** and **Take the Quiz**.
2. **Virtual Tour:** a viewer at the top with **Previous** and **Next** ("Stop 2 of 3"). A 360° stop can be dragged to look around in every direction. A normal photo stop just shows the photo. Below: the caption, **History**, and **Cultural Significance**. At the bottom: **Take the Quiz**.
3. **Quiz:** one question at a time with 4 choices. After a tap, the app shows right or wrong and a one-line explanation. Then **Next**.
4. **Score:** "4 out of 5 (80%)", passed or not, with **Try Again** and **Back to Destination**. The score is saved to Firebase.
5. **My Progress** (from Home): "6 of 15 destinations completed", a progress bar, and each destination with its best score and a check mark.

The first time a student opens a quiz or My Progress, the app asks for a name.

---

## Tech decisions

- Same as the midterm: Expo SDK 58, expo-router, JavaScript, Firebase JS SDK with Cloud Firestore, Expo Go on a real phone.
- **Two new libraries,** both included in Expo Go for SDK 58 (checked in the Expo docs), installed with `npx expo install`:
  - `react-native-webview`: a small web page inside the app. The 360° viewer runs in it.
  - `@react-native-async-storage/async-storage`: remembers the student's name and ID on the phone (like a browser cookie).
- **The 360° viewer is Pannellum** (a free, open-source JavaScript viewer). The web page loads it from a CDN link (`cdn.jsdelivr.net`), the same way an HTML page loads jQuery. It needs internet, but so does the rest of the app.
  - *For Klyde:* a 360° photo is one very wide picture, exactly twice as wide as it is tall, that wraps around you like the inside of a ball. Pannellum does the wrapping.
- **No change to the Firestore rules.** The current rule covers every collection and still expires **January 31, 2027**.
- **Images:** base64 text inside Firestore, as in the midterm. Normal photos: 800px wide, under about 300KB. 360° photos need more detail: 2400px wide, under about 950KB (a Firestore document can hold 1MB). Every tour photo is **its own document.**
- **The database is open to anyone with the app's settings,** so students should type a first name or nickname only.

### Where 360° photos come from (important)

A search on 2026-11-16 found **no free-to-use 360° photos of the 15 sites themselves** (Wikimedia Commons has none; KartaView has a few street-level ones near Kawit, Calamba, and Antipolo only). Google Street View photos may not be copied into an app. So:

- The app can **add a 360° photo from the phone's gallery** (Step 3). Any 360° photo works: one taken with a phone's "Photo Sphere" or panorama-360 camera mode, a 360° camera, or a file the teacher provides.
- Details and the tour have an **Open 360° Street View** button (chosen by Klyde on 2026-11-16). It opens Google Maps already in Street View at the destination's `coordinates`, so all 15 places have a 360° view. It only opens Google's photos; it does not copy them.
- Never use a 360° photo without a license that allows it. Record every credit in `docs/tour-content.md`.

---

## Data model

In MySQL terms: three new tables, each with a foreign key to `destinations`.

**`destinations`** (existing, two new fields)

| Field | Type | Example |
|---|---|---|
| `history` | string (required) | `Built in 1845 by Emilio Aguinaldo's family...` |
| `significance` | string (required) | `The place where the Philippine flag was first...` |
| `coordinates` | string (optional): latitude, longitude | `14.445000, 120.906944` |

**`tourStops`** (new: the tour photos after the main one)

| Field | Type | Example |
|---|---|---|
| `destinationId` | string (the foreign key) | `aB3xY...` |
| `order` | number (smaller shows first) | `2` |
| `kind` | string: `photo` or `360` | `360` |
| `caption` | string | `The street in front of the shrine` |
| `image` | string (base64 data URI) | `data:image/jpeg;base64,...` |
| `credit` | string | `Photo: Juan Cruz, CC BY-SA 4.0` |

Stop 1 of every tour is the destination's own main photo, so a tour works even with no `tourStops`.

**`questions`** (new)

| Field | Type | Example |
|---|---|---|
| `destinationId` | string | `aB3xY...` |
| `order` | number | `1` |
| `question` | string | `When was Philippine independence declared?` |
| `choices` | array of 4 strings | `['June 12, 1898', 'July 4, 1946', ...]` |
| `answerIndex` | number, 0 to 3 | `0` |
| `explanation` | string | `It was declared at this house on June 12, 1898.` |

**`progress`** (new: one document per student per destination)

Document ID: `studentId_destinationId`. Saving again updates the same document instead of adding a new one (like `INSERT ... ON DUPLICATE KEY UPDATE`).

| Field | Type | Example |
|---|---|---|
| `studentId` | string (random, made on first use) | `k9f2...` |
| `studentName` | string | `Klyde` |
| `destinationId` / `destinationName` | string | `aB3xY...` / `Aguinaldo Shrine` |
| `lastScore` / `bestScore` / `total` | number | `3` / `4` / `5` |
| `attempts` | number | `2` |
| `completed` | boolean (true once the best score reaches the pass mark) | `true` |
| `updatedAt` | Firestore timestamp | `serverTimestamp()` |

---

## New files (added to the midterm structure)

```
app/
├── progress.js                  ← My Progress screen
└── destinations/
    ├── tour/[id].js             ← Virtual Tour
    ├── stops/[id].js            ← manage a destination's tour photos
    ├── quiz/[id].js             ← Quiz, then the score
    └── questions/[id].js        ← manage a destination's quiz questions
components/
├── PanoramaViewer.js            ← the 360° viewer (a WebView)
├── TourStopView.js              ← shows one stop: 360° viewer or normal photo
├── TourStopForm.js              ← add one tour photo
├── QuizQuestion.js              ← one question with its 4 choices
├── QuizResult.js                ← the score
├── QuestionForm.js              ← add or edit one question
├── NameForm.js                  ← "What's your name?"
├── ProgressBar.js
├── FadeIn.js                    ← fade-in animation
└── PressableScale.js            ← shrinks a little while pressed
services/
├── tourService.js               ← Firebase calls for tourStops
├── quizService.js               ← Firebase calls for questions
└── progressService.js           ← Firebase calls for progress
utils/
├── panoramaHtml.js              ← builds the small web page for the 360° viewer
├── score.js                     ← percent and pass/fail
├── maps.js                      ← opens Google Maps and Street View
├── haptics.js                   ← short vibrations in the quiz
└── student.js                   ← get and save the name + ID on the phone
constants/
└── quiz.js                      ← pass mark (60%)
docs/
└── tour-content.md              ← history, significance, photo credits, questions, sources
```

Changed files: `app/_layout.js` (new screen titles), `app/index.js` (My Progress button), `app/destinations/[id].js` (new buttons and sections), `components/DestinationForm.js` (two new fields), `components/DestinationCard.js` (completed tag), `services/destinationService.js` (delete also removes the linked data), `utils/image.js` (also picks 360° photos).

The new screens follow the same pattern as `destinations/edit/[id].js`.

---

## Build steps

Each step uses the same loop as the midterm: **build, run on phone, explain line by line, quick exercise, commit** (`Final Step 1: ...`).

#### Step 1: History and cultural significance
- Add `history` and `significance` to `DestinationForm` (two multiline boxes, required) and show them on Details.
- **Teach:** Firestore needs no `ALTER TABLE`; a new field just appears on the documents that have it. Old documents without it must not crash the screen.

#### Step 2: Virtual Tour screen with the 360° viewer
- `tourService.js` → `getTourStops(destinationId)`.
- `utils/panoramaHtml.js` + `PanoramaViewer`: a WebView that shows a 360° photo with Pannellum.
- `tour/[id].js`: viewer with Previous / Next, caption, History, Cultural Significance. **Start Virtual Tour** button on Details.
- **Teach:** a WebView (a web page inside the app, where Klyde's HTML and JavaScript knowledge applies directly), a second collection linked by `destinationId`, and `where()` (like `WHERE destinationId = ?`).

#### Step 3: Manage tour photos in the app
- `stops/[id].js`: list a destination's stops, add a normal or a 360° photo from the gallery with a caption and credit, delete a stop.
- `utils/image.js` → `pickAndCompress360Image()`: checks the photo is twice as wide as it is tall.
- **Teach:** reusing one helper with different settings; why the 2:1 shape matters.

#### Step 4: Quiz
- `quizService.js` → `getQuestions(destinationId)`.
- `quiz/[id].js`: one question at a time (`QuizQuestion`), feedback after each tap, then `QuizResult` with the score. Shows "No quiz yet" if there are no questions.
- The score is counted in the app: +1 for every correct answer.
- **Teach:** keeping "which question am I on" and "how many right" in state.

#### Step 5: Student name and saving scores
- `utils/student.js` → `getStudent()`, `saveStudent(name)`, `clearStudent()`.
- `NameForm` appears before the first quiz if no name is saved.
- `progressService.js` → `saveQuizResult(...)`: writes `lastScore`, keeps the higher `bestScore`, adds 1 to `attempts`, sets `completed`.
- **Teach:** AsyncStorage (like a cookie) versus Firestore (the shared database), and the "insert or update" save.

#### Step 6: My Progress screen
- `progress.js`: name, "X of 15 completed", `ProgressBar`, and every destination with best score and a check mark. **Change name** for when another student uses the phone.
- **Teach:** joining two lists in JavaScript (destinations + progress), like a `LEFT JOIN`.

#### Step 7: Manage quiz questions in the app
- `questions/[id].js` + `QuestionForm`: list a destination's questions, with add, edit, and delete.

#### Step 8: Polish
- Deleting a destination also deletes its `tourStops`, `questions`, and `progress` (like `ON DELETE CASCADE`, done by hand).
- "✓ Completed" tag on the cards in the list. **Open in Google Maps** button on Details.
- **Open 360° Street View** button on Details and in the tour, with an optional `coordinates` field in the form.
- Update `README.md` and CLAUDE.md.

#### Step 8b: Presentation polish (added 2026-11-16, at Klyde's request)
- Two more real photos in every tour (30 photos from Wikimedia Commons, credited in `docs/tour-content.md`).
- Details screen tidied: main actions at the top, the manage buttons small and in two rows.
- Quiz: progress bar, fade-in for each question and its feedback, a vibration for right and wrong (`expo-haptics`).
- Home screen shows "X of 15 destinations completed" once a student has a name.
- Cards and buttons shrink a little while pressed (`PressableScale`).

#### Step 8c: Ready to hand over (added 2026-11-17, at the teacher's request)
- The teacher wants the system to be "dynamic": a company that receives it should be able to replace the name and logo.
- **App Settings** screen (`app/settings.js`): app name, logo, opening text, and owner, saved in a new `settings` collection (one document, `app`). Home and its header read them.
- **Sources and Credits** screen (`app/credits.js`): each destination's sources and main photo credit, from two new optional fields, `sources` and `photoCredit`.
- The README explains how to hand the app to a new owner.

#### Step 9: Real content (Claude does the tedious part)
- For all 15 destinations, Claude researches and writes `history`, `significance`, and 5 quiz questions.
- **Every quiz answer must be found in the app's own text for that destination,** so the tour teaches it and the quiz checks it.
- Everything goes in `docs/tour-content.md` with sources. Unsure facts get a **Check** note and stay out of the app, as in the midterm. Don't make up facts.
- **Klyde reads the text first.** After Klyde's OK, Claude adds it to Firestore with a one-time script (not kept in the repo, as in the midterm).
- 360° photos: see "Where 360° photos come from" above.

#### Step 10: Submit
- Check the Taal Volcano alert level again before presenting.
- Run the checklist below on both phones. Final commit and push.

---

## Final test checklist

- [ ] Every one of the 15 destinations has a tour with photos, history, and cultural significance.
- [ ] A 360° stop can be dragged in every direction on Android and iPhone.
- [ ] **Open 360° Street View** shows a 360° view at or near the place, for each of the 15 destinations.
- [ ] Adding a 360° photo from the gallery works; a photo that is not 2:1 is refused with a clear message.
- [ ] Every destination has a 5-question quiz; each answer can be found in the tour text.
- [ ] The score shown matches the answers given (try 0 of 5, 3 of 5, and 5 of 5).
- [ ] The score appears in the Firebase Console right after the quiz.
- [ ] Retaking a quiz keeps the best score and counts the attempt.
- [ ] My Progress shows the right count and still shows it after closing and reopening the app.
- [ ] A destination added in the app (no stops, no quiz) opens without errors.
- [ ] Deleting a destination removes its stops, questions, and progress.
- [ ] No internet: every new screen shows a message and "Try Again", not a blank page.
- [ ] All midterm features (add, edit, delete, search, filters) still work.
- [ ] All new content is real, sourced in `docs/tour-content.md`, and photo credits are listed.
- [ ] `.env` is still not on GitHub.
