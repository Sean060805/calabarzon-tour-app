import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

// Makes its children fade in and slide up a little when they first appear
export default function FadeIn({ children, style }) {
  // 0 means just appeared (invisible), 1 means fully shown
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [progress]);

  // While progress goes from 0 to 1, the content moves from 8 points lower up to its place
  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [8, 0] });

  return (
    <Animated.View style={[style, { opacity: progress, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
}
