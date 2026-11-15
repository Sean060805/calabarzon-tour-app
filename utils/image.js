import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

const MAX_WIDTH = 800;
// A Firestore document can hold 1MB, so keep the photo well under that
const MAX_SIZE = 300 * 1024;

// Opens the phone's gallery, shrinks the chosen photo, and returns it as text:
// "data:image/jpeg;base64,...". Returns null if the user cancels.
export async function pickAndCompressImage() {
  const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'] });
  if (result.canceled) {
    return null;
  }

  const photo = result.assets[0];
  const width = photo.width > 0 && photo.width < MAX_WIDTH ? photo.width : MAX_WIDTH;

  const context = ImageManipulator.manipulate(photo.uri).resize({ width });
  const image = await context.renderAsync();
  const saved = await image.saveAsync({ format: SaveFormat.JPEG, compress: 0.5, base64: true });

  const dataUri = `data:image/jpeg;base64,${saved.base64}`;
  if (dataUri.length > MAX_SIZE) {
    throw new Error('This photo is too large. Please choose a different one.');
  }
  return dataUri;
}
