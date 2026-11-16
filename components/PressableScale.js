import { useRef } from 'react';
import { Animated, Easing, Pressable } from 'react-native';

// A Pressable that shrinks a little while a finger is on it, so the app feels like it answers the touch.
// Use it like a Pressable: the style goes on the part that shrinks.
export default function PressableScale({ style, children, onPress, disabled }) {
  // An Animated.Value is a number that can change smoothly over time. 1 means normal size.
  const scale = useRef(new Animated.Value(1)).current;

  function animateTo(size) {
    Animated.timing(scale, {
      toValue: size,
      duration: 120, // milliseconds: short, so it never feels slow
      easing: Easing.out(Easing.quad), // starts fast, then slows down
      useNativeDriver: true,
    }).start();
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => animateTo(0.97)}
      onPressOut={() => animateTo(1)}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}
