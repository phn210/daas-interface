import { MAX_LOCK_TIME, MIN_LOCK_TIME } from 'src/pages/Locker/config';
import { BN } from 'src/utils';

export function calcVotingPower(
  amount: string | number,
  timeRemaining: string | number,
  maxTime: string | number = MAX_LOCK_TIME
): string {
  return BN(amount).times(timeRemaining).div(maxTime).toFixed();
}

export function calcUnlockTime(start: number, duration: number): number {
  // Round down time to 15:00 PM Wednesday
  const t: number = start + duration;
  const thursday: number = Math.floor(t / MIN_LOCK_TIME) * MIN_LOCK_TIME;
  const dt: number = 5 * 24 * 3600 + 15 * 3600; // 5 days, 15 hrs
  if (thursday + dt < t) {
    return thursday + dt;
  } else {
    return thursday - MIN_LOCK_TIME + dt;
  }
}
