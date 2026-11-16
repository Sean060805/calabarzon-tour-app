import { Image, StyleSheet, Text, View } from 'react-native';
import colors from '../constants/colors';
import PanoramaViewer from './PanoramaViewer';

// Shows one stop of the tour: a 360° viewer, or a normal photo
export default function TourStopView({ stop }) {
  if (stop.kind === '360') {
    return (
      <View style={styles.box}>
        <PanoramaViewer image={stop.image} />
        {/* pointerEvents="none" lets touches pass through the label to the viewer */}
        <View style={styles.hint} pointerEvents="none">
          <Text style={styles.hintText}>360° · Drag to look around</Text>
        </View>
      </View>
    );
  }

  if (!stop.image) {
    return (
      <View style={[styles.box, styles.noImage]}>
        <Text style={styles.noImageText}>No photo yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.box}>
      <Image source={{ uri: stop.image }} style={styles.photo} resizeMode="cover" />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    backgroundColor: '#000000',
  },
  photo: {
    flex: 1,
  },
  hint: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 10,
    alignItems: 'center',
  },
  hintText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  noImage: {
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noImageText: {
    color: colors.textLight,
  },
});
