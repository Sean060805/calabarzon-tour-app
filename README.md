# CALABARZON Virtual Tour

A mobile app for browsing and managing tourist destinations and cultural heritage sites in **Region IV-A (CALABARZON): Cavite, Laguna, Batangas, Rizal, and Quezon**. It is meant as a virtual alternative to school field trips.

Built with React Native (Expo) and Firebase Cloud Firestore.

## Features

- **Browse destinations:** a scrollable list of cards with a photo, name, category, and province.
- **Destination details:** name, category, province, address, description, and photo.
- **Add, edit, and delete (CRUD):** all changes are saved to Cloud Firestore and stay after the app is closed.
  - The add and edit forms check that every field is filled in, and show a message for each missing one.
  - Deleting asks "Are you sure?" first.
- **Photos from the gallery:** each photo is resized to 800px wide and compressed before saving (see [Image storage](#image-storage)).
- **Search and filter:** search by name (as you type, not case-sensitive), filter by category and by province, with an "All" option to reset. Tapping a province on the Home screen opens the list filtered to that province.
- **Loading, empty, and error states:** a spinner while loading, "No destinations yet" or "No results" when the list is empty, and a "Try Again" button when there is no internet. Pull down on the list to refresh it.

## Tech used

| Part | Tool |
|---|---|
| App framework | [Expo](https://expo.dev) SDK 58 (React Native 0.88), JavaScript |
| Navigation | [expo-router](https://docs.expo.dev/router/introduction/) (file-based routing, Stack navigator) |
| Database | [Firebase](https://firebase.google.com) JS SDK, Cloud Firestore |
| Photos | expo-image-picker (gallery) and expo-image-manipulator (resize and compress) |
| Testing | Real Android and iPhone devices through the Expo Go app |

## Folder structure

```
app/                         Screens (each file is one screen)
  _layout.js                 Navigation frame: header style and screen titles
  index.js                   Home screen
  destinations/
    index.js                 Destination list with search and filters
    [id].js                  Destination details, with Edit and Delete
    add.js                   Add form
    edit/[id].js             Edit form
components/                  Reusable pieces
  AppButton.js               Button used across the app
  CategoryFilter.js          Row of filter chips ("All" plus options)
  Chip.js                    Small selectable rounded button
  DestinationCard.js         One destination in the list
  DestinationForm.js         Form shared by the Add and Edit screens
  SearchBar.js               Search box
  StatusView.js              Loading spinner, messages, and "Try Again"
services/
  destinationService.js      All Firestore calls (get, add, update, delete)
lib/
  firebase.js                Firebase setup (reads keys from .env)
utils/
  image.js                   pickAndCompressImage()
constants/                   Categories, provinces, and colors
docs/
  destinations.md            Researched content and sources for the destinations
```

## Data model

Firestore collection: `destinations`

| Field | Type | Notes |
|---|---|---|
| `name` | string | Required |
| `description` | string | Required |
| `address` | string | Required |
| `province` | string | Cavite, Laguna, Batangas, Rizal, or Quezon |
| `category` | string | Historical Site, Church / Religious Site, Museum, Nature & Park, Beach & Resort, Festival & Cultural Event, or Landmark |
| `image` | string | JPEG photo as a base64 data URI |
| `createdAt` | timestamp | Set by the server when added |
| `updatedAt` | timestamp | Set by the server when added or edited |

### Image storage

Firebase Storage requires the paid Blaze plan, so photos are stored **inside the Firestore document** as base64 text (`data:image/jpeg;base64,...`). To fit Firestore's 1 MB document limit, each photo is resized to 800px wide, compressed to JPEG quality 0.5, and rejected if it is still over about 300 KB. All of this is in one function, `pickAndCompressImage()` in `utils/image.js`, so it can be swapped for Firebase Storage or another service later.

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

**Note on security:** this class project has no login. Its Firestore rules allow anyone with the app's settings to read and write until January 31, 2027, so it should not hold private data.

## Destination content

The destinations in the app are real places, three per province. Their descriptions, addresses, sources, and photo credits (Wikimedia Commons) are in [docs/destinations.md](docs/destinations.md).
