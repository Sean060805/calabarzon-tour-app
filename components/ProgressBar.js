import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import colors from '../constants/colors';

// A bar that fills from left to right. percent is a number from 0 to 100.
// When percent changes, the bar slides to the new width instead of jumping.
export default function ProgressBar({ percent }) {
  const shown = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(shown, {
      toValue: percent,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false, // width cannot be animated by the native driver
    }).start();
  }, [percent, shown]);

  // Turns the number 0 to 100 into the text '0%' to '100%' that the width style needs
  const width = shown.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });

  return (
    <View style={styles.track}>
      <Animated.View style={[styles.fill, { width }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 7,
    backgroundColor: colors.primary,
  },
});
