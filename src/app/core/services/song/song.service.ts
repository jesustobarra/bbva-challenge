import { Injectable } from '@angular/core';

/**
 * Minimal service to control background audio during the traffic light `green` phase.
 *
 * Responsibilities:
 * - `load(url)`: load a track URL (served from `public/`, usually as `/assets/...`).
 * - `play()`: start playback from the beginning (if the browser allows it).
 * - `stop()`: pause audio playback.
 * - `setRate(rate)`: update `audio.playbackRate` instantly.
 *
 * Note:
 * In unit tests (jsdom), `play()`/`pause()` are not always implemented.
 * We intentionally swallow runtime errors so game logic and tests keep working.
 */
@Injectable({ providedIn: 'root' })
export class SongService {
  private audio: HTMLAudioElement | null = null;

  /**
   * Load an audio track in memory.
   * @param url A URL like `'/assets/my-song.mp3'`.
   */
  load(url: string): void {
    if (typeof Audio === 'undefined') {
      this.audio = null;
      return;
    }
    this.audio = new Audio(url);
    this.audio.preload = 'auto';
  }

  /**
   * Start playback from the beginning.
   * Autoplay restrictions may block playback; errors are ignored.
   */
  play(): void {
    if (this.audio === null) {
      return;
    }
    try {
      this.audio.currentTime = 0;
      const result = this.audio.play() as unknown;
      if (
        result !== null &&
        result !== undefined &&
        typeof (result as Promise<void>).catch === 'function'
      ) {
        (result as Promise<void>).catch(() => undefined);
      }
    } catch {
      // Ignore playback errors (autoplay restrictions, unsupported, etc).
    }
  }

  /**
   * Pause playback.
   */
  stop(): void {
    if (this.audio === null) {
      return;
    }
    try {
      this.audio.pause();
    } catch {
      // Ignore pause errors.
    }
  }

  /**
   * Update playback speed instantly.
   */
  setRate(rate: number): void {
    if (this.audio === null) {
      return;
    }
    try {
      this.audio.playbackRate = rate;
    } catch {
      // Ignore playbackRate errors.
    }
  }
}

