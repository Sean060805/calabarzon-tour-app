import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDocFromServer, serverTimestamp, setDoc } from 'firebase/firestore';
import DEFAULT_SETTINGS from '../constants/defaultSettings';
import { db } from '../lib/firebase';

// The settings are ONE document: collection "settings", document ID "app".
// Like a MySQL table that only ever has one row.
const COLLECTION = 'settings';
const DOCUMENT_ID = 'app';

// A copy is also kept on the phone, so the right name and logo show at once when the app opens
const SAVED_KEY = 'appSettings';

// Returns the copy saved on this phone, or the defaults if there is none. Needs no internet.
export async function getSavedAppSettings() {
  const text = await AsyncStorage.getItem(SAVED_KEY);
  return text ? { ...DEFAULT_SETTINGS, ...JSON.parse(text) } : DEFAULT_SETTINGS;
}

// SELECT * FROM settings WHERE id = 'app'
// Any field that was never saved keeps its default value.
export async function getAppSettings() {
  const snapshot = await getDocFromServer(doc(db, COLLECTION, DOCUMENT_ID));
  const saved = snapshot.exists() ? snapshot.data() : {};
  const settings = {
    appName: saved.appName || DEFAULT_SETTINGS.appName,
    label: saved.label === undefined ? DEFAULT_SETTINGS.label : saved.label,
    intro: saved.intro || DEFAULT_SETTINGS.intro,
    ownerName: saved.ownerName === undefined ? DEFAULT_SETTINGS.ownerName : saved.ownerName,
    logo: saved.logo || '',
  };
  await AsyncStorage.setItem(SAVED_KEY, JSON.stringify(settings));
  return settings;
}

// UPDATE settings SET ... WHERE id = 'app' (creates the document the first time)
// settings has: appName, label, intro, ownerName, logo
export async function saveAppSettings(settings) {
  await setDoc(doc(db, COLLECTION, DOCUMENT_ID), { ...settings, updatedAt: serverTimestamp() });
  await AsyncStorage.setItem(SAVED_KEY, JSON.stringify(settings));
}
