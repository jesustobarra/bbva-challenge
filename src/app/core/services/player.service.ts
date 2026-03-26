import { Injectable, signal } from '@angular/core';
import type { PlayerSaveData } from '../dtos/player-save-data.dto';

/** LocalStorage key used to persist player progress entries. */
const STORAGE_KEY = 'rlgl-player-saves';
/** Lowest allowed score value. */
const MIN_SCORE = 0;
/** Default score change applied by `addScore()` when no delta is provided. */
const DEFAULT_SCORE_DELTA = 1;

/**
 * Manages player state (name and score) and local persistence.
 */
@Injectable({ providedIn: 'root' })
export class PlayerService {
  /** Internal signal with the current player name. */
  private readonly _name = signal('');
  /** Internal signal with the current game score. */
  private readonly _score = signal(MIN_SCORE);
  /** Internal signal with the player's best score. */
  private readonly _maxPoints = signal(MIN_SCORE);

  /** Read-only player name for UI consumers. */
  readonly name = this._name.asReadonly();
  /** Read-only current score for UI consumers. */
  readonly score = this._score.asReadonly();
  /** Read-only best score for UI consumers. */
  readonly maxPoints = this._maxPoints.asReadonly();

  /**
   * Initializes the player session and restores saved progress when available.
   *
   * @param displayName Name entered by the user.
   */
  prepareForGame(displayName: string): void {
    const name = displayName.trim();
    this._name.set(name);
    const key = this.normalizeKey(name);
    const saved = this.readMap()[key];
    if (saved !== undefined) {
      this._score.set(Math.max(MIN_SCORE, Math.floor(saved.resumeScore)));
      this._maxPoints.set(Math.max(MIN_SCORE, Math.floor(saved.maxPoints)));
    } else {
      this._score.set(MIN_SCORE);
      this._maxPoints.set(MIN_SCORE);
    }
  }

  /**
   * Sets an absolute score value, normalized to a non-negative integer.
   * Also updates best score and persists progress.
   *
   * @param points Target score value.
   */
  setScore(points: number): void {
    const s = Math.max(MIN_SCORE, Math.floor(points));
    this._score.set(s);
    this._maxPoints.update((m) => Math.max(m, s));
    this.saveProgress();
  }

  /**
   * Applies an increment/decrement to the current score.
   * The result never drops below zero and is persisted automatically.
   *
   * @param delta Difference added to the current score.
   */
  addScore(delta = DEFAULT_SCORE_DELTA): void {
    this._score.update((s) => {
      const next = Math.max(MIN_SCORE, s + delta);
      this._maxPoints.update((m) => Math.max(m, next));
      return next;
    });
    this.saveProgress();
  }

  /**
   * Indicates whether a valid player name exists.
   *
   * @returns `true` when a non-empty name is present; otherwise `false`.
   */
  hasName(): boolean {
    return this._name().trim().length > 0;
  }

  /**
   * Saves the current player state in `localStorage`.
   * If there is no name, nothing is written.
   */
  saveProgress(): void {
    const name = this._name().trim();
    if (!name) {
      return;
    }
    const key = this.normalizeKey(name);
    const map = this.readMap();
    map[key] = {
      maxPoints: this._maxPoints(),
      resumeScore: this._score(),
    };
    this.writeMap(map);
  }

  /**
   * Normalizes the name to use it as a storage key.
   *
   * @param name Raw player name.
   * @returns Lowercased key without surrounding spaces.
   */
  private normalizeKey(name: string): string {
    return name.trim().toLowerCase();
  }

  /**
   * Reads and validates the saved players map from `localStorage`.
   *
   * @returns Progress map by player key, or an empty object on read failure.
   */
  private readMap(): Record<string, PlayerSaveData> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === null || raw.length === 0) {
        return {};
      }
      const data = JSON.parse(raw) as Record<string, PlayerSaveData>;
      return data !== null && typeof data === 'object' ? data : {};
    } catch {
      return {};
    }
  }

  /**
   * Writes the progress map to `localStorage`.
   *
   * @param map Progress map keyed by player.
   */
  private writeMap(map: Record<string, PlayerSaveData>): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    } catch {
      return;
    }
  }
}
