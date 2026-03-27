import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { PlayerService } from '../player/player.service';
import { SongService } from '../song/song.service';
import { VibrationService } from '../vibration/vibration.service';

/** Duration of the red light phase in milliseconds. */
const RED_LIGHT_MS = 3000;
/** Base duration of the green light phase in milliseconds. */
const GREEN_LIGHT_BASE_MS = 10000;
/** Green light reduction per score point in milliseconds. */
const GREEN_LIGHT_SCORE_STEP_MS = 100;
/** Lower bound for the green light duration in milliseconds. */
const GREEN_LIGHT_MIN_MS = 2000;
/** Absolute random jitter range for green light duration in milliseconds. */
const GREEN_LIGHT_JITTER_RANGE_MS = 1500;
/** Number of possible integer jitter values in range [-R, +R]. */
const GREEN_LIGHT_JITTER_SPAN_MS = GREEN_LIGHT_JITTER_RANGE_MS * 2 + 1;
/** Score value applied when the player moves on red light. */
const SCORE_RESET = 0;
/** Score delta for a valid move. */
const SCORE_STEP_UP = 1;
/** Score delta for repeating the same foot consecutively. */
const SCORE_STEP_DOWN = -1;
/** Color token used when traffic light is red. */
const TRAFFIC_LIGHT_RED = 'red';
/** Color token used when traffic light is green. */
const TRAFFIC_LIGHT_GREEN = 'green';
/** Active footprint color. */
const FOOTPRINT_DEFAULT = '#0f172a';
/** Muted footprint color for invalid/non-active side. */
const FOOTPRINT_MUTED = '#94a3b8';

/** Song URL served from `public/` as `/assets/...`. */
const SONG_URL = '/assets/audio/tictac.mp3';
/** Minimum playback rate at the start of green phase. */
const SONG_RATE_MIN = 0.8;
/** Maximum playback rate at the end of green phase. */
const SONG_RATE_MAX = 2.5;
/** How often we update song rate while green (ms). */
const SONG_RATE_RAMP_TICK_MS = 100;

/** Supported foot sides for movement and highlighting logic. */
export type FootSide = 'left' | 'right';

/**
 * Core game rules: traffic light phases, scoring on movement, audio ramp during green.
 *
 * Provided at {@link GameComponent} level so each game session has isolated state.
 */
@Injectable()
export class GameService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly player = inject(PlayerService);
  private readonly song = inject(SongService);
  private readonly vibration = inject(VibrationService);

  private timeoutId: ReturnType<typeof setTimeout> | undefined;
  private greenPhaseDurationMs: number | undefined;
  private greenRateDurationMs = 0;
  private greenStartedAtMs = 0;
  private greenRateIntervalId: ReturnType<typeof setInterval> | null = null;
  private lastFoot: FootSide | null = null;

  /** Reactive current traffic light color token. */
  readonly trafficLight = signal<string>(TRAFFIC_LIGHT_RED);

  constructor() {
    this.song.load(SONG_URL);

    this.destroyRef.onDestroy(() => {
      if (this.timeoutId !== undefined) {
        clearTimeout(this.timeoutId);
      }
      this.stopGreenRateRamp();
      this.song.stop();
      this.player.saveProgress();
    });
    this.scheduleNextPhase();
  }

  /** Handles left movement. */
  moveLeft(): void {
    this.onFoot('left');
  }

  /** Handles right movement. */
  moveRight(): void {
    this.onFoot('right');
  }

  /**
   * Computes footprint color for the given side (visual hint during green).
   *
   * @param side Foot side being rendered.
   */
  footColor(side: FootSide): string {
    if (this.trafficLight() === TRAFFIC_LIGHT_RED) {
      return FOOTPRINT_MUTED;
    }
    if (this.lastFoot === null) {
      return FOOTPRINT_DEFAULT;
    }
    const nextFoot: FootSide = this.lastFoot === 'left' ? 'right' : 'left';
    return side === nextFoot ? FOOTPRINT_DEFAULT : FOOTPRINT_MUTED;
  }

  private scheduleNextPhase(): void {
    const isRed = this.trafficLight() === TRAFFIC_LIGHT_RED;
    const delayMs = isRed
      ? RED_LIGHT_MS
      : (this.greenPhaseDurationMs ?? this.greenLightDurationMs(this.player.score()));
    this.timeoutId = setTimeout(() => {
      this.trafficLight.update((c) => {
        const next = c === TRAFFIC_LIGHT_RED ? TRAFFIC_LIGHT_GREEN : TRAFFIC_LIGHT_RED;
        if (next === TRAFFIC_LIGHT_GREEN) {
          const durationMs = this.greenLightDurationMs(this.player.score());
          this.greenPhaseDurationMs = durationMs;
          this.lastFoot = null;
          this.song.play();
          this.startGreenRateRamp(durationMs);
          return next;
        }

        this.greenPhaseDurationMs = undefined;
        this.stopGreenRateRamp();
        this.song.stop();

        return next;
      });
      this.scheduleNextPhase();
    }, delayMs);
  }

  private startGreenRateRamp(durationMs: number): void {
    if (durationMs <= 0) {
      return;
    }

    this.stopGreenRateRamp();

    this.greenRateDurationMs = durationMs;
    this.greenStartedAtMs = this.nowMs();

    this.setSongRateAtProgress(0);

    this.greenRateIntervalId = setInterval(this.tickGreenRate, SONG_RATE_RAMP_TICK_MS);
  }

  private stopGreenRateRamp(): void {
    if (this.greenRateIntervalId === null) {
      return;
    }

    clearInterval(this.greenRateIntervalId);
    this.greenRateIntervalId = null;
  }

  private tickGreenRate = (): void => {
    if (this.greenRateDurationMs <= 0) {
      this.stopGreenRateRamp();
      return;
    }

    const elapsed = this.nowMs() - this.greenStartedAtMs;
    const progress = this.clamp(elapsed / this.greenRateDurationMs, 0, 1);
    this.setSongRateAtProgress(progress);

    if (progress >= 1) {
      this.stopGreenRateRamp();
      return;
    }
  };

  private setSongRateAtProgress(progress: number): void {
    const t = progress * progress * (3 - 2 * progress);
    const rate = SONG_RATE_MIN + (SONG_RATE_MAX - SONG_RATE_MIN) * t;
    this.song.setRate(rate);
  }

  private nowMs(): number {
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
      return performance.now();
    }
    return Date.now();
  }

  private clamp(v: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, v));
  }

  private onFoot(side: FootSide): void {
    if (this.trafficLight() === TRAFFIC_LIGHT_RED) {
      this.player.setScore(SCORE_RESET);
      this.vibration.vibrateOnScoreLoss();
      return;
    }
    if (this.lastFoot === null) {
      this.player.addScore(SCORE_STEP_UP);
      this.lastFoot = side;
      return;
    }
    if (this.lastFoot === side) {
      this.player.addScore(SCORE_STEP_DOWN);
      this.vibration.vibrateOnScoreLoss();
    } else {
      this.player.addScore(SCORE_STEP_UP);
    }
    this.lastFoot = side;
  }

  /** Exposed for unit tests (jitter range). */
  randomGreenJitterMs(): number {
    return Math.floor(Math.random() * GREEN_LIGHT_JITTER_SPAN_MS) - GREEN_LIGHT_JITTER_RANGE_MS;
  }

  /** Exposed for unit tests (duration formula). */
  greenLightDurationMs(score: number): number {
    const base = Math.max(
      GREEN_LIGHT_BASE_MS - score * GREEN_LIGHT_SCORE_STEP_MS,
      GREEN_LIGHT_MIN_MS,
    );
    return base + this.randomGreenJitterMs();
  }
}
