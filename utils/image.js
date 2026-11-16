import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

// A Firestore document can hold 1MB, so every photo must stay under that.
// A normal photo is kept small. A 360° photo shows the whole view around you,
// so it needs more detail and is allowed to be bigger.
const NORMAL_PHOTO = { maxWidth: 800, maxSize: 300 * 1024, quality: 0.5 };
const PHOTO_360 = { maxWidth: 2400, maxSize: 950 * 1024, quality: 0.6 };
// A logo is small, and is saved as PNG so a see-through background stays see-through
const LOGO = { maxWidth: 300, maxSize: 400 * 1024, quality: 1, png: true };

// Opens the phone's gallery. Returns the chosen photo, or null if the user cancels.
async function pickPhoto() {
  const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'] });
  if (result.canceled) {
    return null;
  }
  return result.assets[0];
}

// Shrinks the photo and returns it as text: "data:image/jpeg;base64,..."
async function compressPhoto(photo, { maxWidth, maxSize, quality, png = false }) {
  const width = photo.width > 0 && photo.width < maxWidth ? photo.width : maxWidth;

  const context = ImageManipulator.manipulate(photo.uri).resize({ width });
  const image = await context.renderAsync();
  const saved = await image.saveAsync({
    format: png ? SaveFormat.PNG : SaveFormat.JPEG,
    compress: quality,
    base64: true,
  });

  const dataUri = `data:image/${png ? 'png' : 'jpeg'};base64,${saved.base64}`;
  if (dataUri.length > maxSize) {
    throw new Error('This photo is too large. Please choose a different one.');
  }
  return dataUri;
}

// For normal photos. Returns null if the user cancels.
export async function pickAndCompressImage() {
  const photo = await pickPhoto();
  if (!photo) {
    return null;
  }
  return compressPhoto(photo, NORMAL_PHOTO);
}

// For 360° photos. Returns null if the user cancels.
export async function pickAndCompress360Image() {
  const photo = await pickPhoto();
  if (!photo) {
    return null;
  }

  // A 360° photo is always twice as wide as it is tall (for example 4000 x 2000)
  const shape = photo.width / photo.height;
  if (shape < 1.9 || shape > 2.1) {
    throw new Error(
      'This is not a 360° photo. A 360° photo is exactly twice as wide as it is tall.'
    );
  }
  return compressPhoto(photo, PHOTO_360);
}

// For the app's logo. Returns null if the user cancels.
export async function pickAndCompressLogo() {
  const photo = await pickPhoto();
  if (!photo) {
    return null;
  }
  return compressPhoto(photo, LOGO);
}
