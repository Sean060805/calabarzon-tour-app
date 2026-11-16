import * as Haptics from 'expo-haptics';

// A haptic is a short vibration that the phone makes as feedback.
// .catch() ignores the error on phones that cannot vibrate, so the quiz never stops because of it.

// Two quick taps: used for a correct answer
export function vibrateSuccess() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}

// A heavier buzz: used for a wrong answer
export function vibrateError() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
}
