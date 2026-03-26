import { beforeEach, describe, expect, it } from 'vitest';
import { PlayerService } from './player.service';

const STORAGE_KEY = 'rlgl-player-saves';

function readStorage(): Record<string, { maxPoints: number; resumeScore: number }> {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === null) {
    return {};
  }
  return JSON.parse(raw) as Record<string, { maxPoints: number; resumeScore: number }>;
}

describe('PlayerService', () => {
  let service: PlayerService;

  beforeEach(() => {
    localStorage.clear();
    service = new PlayerService();
  });

  it('initializes empty state when there is no saved progress', () => {
    service.prepareForGame('  Alice  ');

    expect(service.name()).toBe('Alice');
    expect(service.score()).toBe(0);
    expect(service.maxPoints()).toBe(0);
  });

  it('restores saved progress using normalized player key', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        alice: { resumeScore: 7.9, maxPoints: 10.4 },
      }),
    );

    service.prepareForGame('  ALICE ');

    expect(service.name()).toBe('ALICE');
    expect(service.score()).toBe(7);
    expect(service.maxPoints()).toBe(10);
  });

  it('normalizes invalid saved values to non-negative integers', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        bob: { resumeScore: -3.2, maxPoints: -9.7 },
      }),
    );

    service.prepareForGame('Bob');

    expect(service.score()).toBe(0);
    expect(service.maxPoints()).toBe(0);
  });

  it('setScore floors value, updates max and persists progress', () => {
    service.prepareForGame('Nora');
    service.setScore(5.9);

    expect(service.score()).toBe(5);
    expect(service.maxPoints()).toBe(5);
    expect(readStorage()['nora']).toEqual({ resumeScore: 5, maxPoints: 5 });
  });

  it('addScore uses default delta and does not go below zero', () => {
    service.prepareForGame('Leo');
    service.addScore();
    service.addScore(-9);

    expect(service.score()).toBe(0);
    expect(service.maxPoints()).toBe(1);
    expect(readStorage()['leo']).toEqual({ resumeScore: 0, maxPoints: 1 });
  });

  it('hasName returns false for blank names', () => {
    service.prepareForGame('   ');

    expect(service.hasName()).toBe(false);
  });

  it('saveProgress does not write to storage when name is empty', () => {
    service.saveProgress();

    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('handles malformed storage content gracefully', () => {
    localStorage.setItem(STORAGE_KEY, 'not-json');

    service.prepareForGame('Mia');
    service.setScore(3);

    expect(readStorage()['mia']).toEqual({ resumeScore: 3, maxPoints: 3 });
  });
});
