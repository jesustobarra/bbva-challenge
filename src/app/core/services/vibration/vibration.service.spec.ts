import { describe, expect, it, vi } from 'vitest';
import { VibrationService } from './vibration.service';

type VibrateFn = (pattern: number | number[]) => boolean;

describe('VibrationService', () => {
  it('calls navigator.vibrate when supported (default 100ms)', () => {
    const service = new VibrationService();
    const nav = navigator as unknown as { vibrate?: VibrateFn };
    const previousVibrate = nav.vibrate;

    const vibrateSpy = vi.fn<VibrateFn>(() => true);
    nav.vibrate = vibrateSpy;

    try {
      service.vibrateOnScoreLoss();
      expect(vibrateSpy).toHaveBeenCalledTimes(1);
      expect(vibrateSpy).toHaveBeenCalledWith(100);
    } finally {
      nav.vibrate = previousVibrate;
    }
  });

  it('does nothing when navigator.vibrate is not available', () => {
    const service = new VibrationService();
    const nav = navigator as unknown as { vibrate?: VibrateFn };
    const previousVibrate = nav.vibrate;
    nav.vibrate = undefined;

    try {
      expect(() => service.vibrateOnScoreLoss()).not.toThrow();
    } finally {
      nav.vibrate = previousVibrate;
    }
  });

  it('swallows errors thrown by navigator.vibrate', () => {
    const service = new VibrationService();
    const nav = navigator as unknown as { vibrate?: VibrateFn };
    const previousVibrate = nav.vibrate;

    const vibrateSpy = vi.fn<VibrateFn>(() => {
      throw new Error('vibrate failed');
    });
    nav.vibrate = vibrateSpy;

    try {
      expect(() => service.vibrateOnScoreLoss(100)).not.toThrow();
      expect(vibrateSpy).toHaveBeenCalledTimes(1);
    } finally {
      nav.vibrate = previousVibrate;
    }
  });
});

