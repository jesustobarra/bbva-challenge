import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'rlgl-player-saves';

export interface PlayerSaveData {
  maxPoints: number;
  resumeScore: number;
}

@Injectable({ providedIn: 'root' })
export class PlayerService {
  private readonly _name = signal('');
  private readonly _score = signal(0);
  private readonly _maxPoints = signal(0);

  readonly name = this._name.asReadonly();
  readonly score = this._score.asReadonly();
  readonly maxPoints = this._maxPoints.asReadonly();

  prepareForGame(displayName: string): void {
    const name = displayName.trim();
    this._name.set(name);
    const key = this.normalizeKey(name);
    const saved = this.readMap()[key];
    if (saved) {
      this._score.set(Math.max(0, Math.floor(saved.resumeScore)));
      this._maxPoints.set(Math.max(0, Math.floor(saved.maxPoints)));
    } else {
      this._score.set(0);
      this._maxPoints.set(0);
    }
  }

  setScore(points: number): void {
    const s = Math.max(0, Math.floor(points));
    this._score.set(s);
    this._maxPoints.update((m) => Math.max(m, s));
    this.saveProgress();
  }

  addScore(delta = 1): void {
    this._score.update((s) => {
      const next = Math.max(0, s + delta);
      this._maxPoints.update((m) => Math.max(m, next));
      return next;
    });
    this.saveProgress();
  }

  hasName(): boolean {
    return this._name().trim().length > 0;
  }

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

  private normalizeKey(name: string): string {
    return name.trim().toLowerCase();
  }

  private readMap(): Record<string, PlayerSaveData> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return {};
      }
      const data = JSON.parse(raw) as Record<string, PlayerSaveData>;
      return data && typeof data === 'object' ? data : {};
    } catch {
      return {};
    }
  }

  private writeMap(map: Record<string, PlayerSaveData>): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    } catch {
    }
  }
}
