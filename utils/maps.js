import { Alert, Linking } from 'react-native';

// Linking.openURL hands a web address to the phone, which opens it in the right app.
// A Google Maps address opens the Google Maps app (or the browser if the app is not installed).
function open(url) {
  Linking.openURL(url).catch(() => {
    Alert.alert('Could not open Google Maps', 'Please try again.');
  });
}

// Opens Google Maps and searches for the place by its name and address
export function openInGoogleMaps(destination) {
  const search = encodeURIComponent(`${destination.name}, ${destination.address}`);
  open(`https://www.google.com/maps/search/?api=1&query=${search}`);
}

// Opens Google Maps in Street View: a 360° view from the photo nearest to the coordinates.
// coordinates is text such as "14.445000, 120.906944" (latitude, then longitude).
export function openStreetView(coordinates) {
  const viewpoint = encodeURIComponent(coordinates.replace(/\s/g, ''));
  open(`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${viewpoint}`);
}

// True for text like "14.445000, 120.906944": two numbers with a comma between them
export function isValidCoordinates(text) {
  return /^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/.test(text.trim());
}
