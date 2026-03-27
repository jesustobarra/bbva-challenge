import { Injectable } from '@angular/core';

/**
 * Emits haptic feedback (vibration) when supported by the current device/browser.
 *
 * Responsibilities:
 * - `vibrateOnScoreLoss()`: short vibration when the player loses points.
 *
 * Note:
 * - The Web Vibration API (`navigator.vibrate`) is not available on all platforms.
 * - This service intentionally fails silently to avoid breaking gameplay.
 */
@Injectable({ providedIn: 'root' })
export class VibrationService {
  /**
   * Vibrates the device when the user loses points.
   *
   * @param durationMs Vibration duration in milliseconds.
   */
  vibrateOnScoreLoss(durationMs = 100): void {
    try {
      if (typeof navigator.vibrate === 'function') {
        navigator.vibrate(durationMs);
      }
    } catch {
      // Ignore vibration errors (permissions, unsupported devices, etc.).
    }
  }
}

