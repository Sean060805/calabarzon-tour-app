import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { buildPanoramaHtml } from '../utils/panoramaHtml';

// Shows a 360° photo that can be dragged to look around.
// A WebView is a small web page inside the app; the page is built in utils/panoramaHtml.js.
export default function PanoramaViewer({ image }) {
  // useMemo: only rebuild the page when the photo changes, so the viewer does not reload by itself
  const source = useMemo(() => ({ html: buildPanoramaHtml(image) }), [image]);

  return (
    <WebView
      style={styles.viewer}
      source={source}
      originWhitelist={['*']}
      scrollEnabled={false}
      overScrollMode="never"
    />
  );
}

const styles = StyleSheet.create({
  viewer: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
