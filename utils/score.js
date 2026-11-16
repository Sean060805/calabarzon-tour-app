import { PASS_PERCENT } from '../constants/quiz';

// 3 correct out of 5 gives 60
export function toPercent(score, total) {
  if (!total) {
    return 0;
  }
  return Math.round((score / total) * 100);
}

export function hasPassed(score, total) {
  return total > 0 && toPercent(score, total) >= PASS_PERCENT;
}
