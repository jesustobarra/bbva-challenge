import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { PlayerService } from '../../core/services/player/player.service';
import { SongService } from '../../core/services/song/song.service';
import { VibrationService } from '../../core/services/vibration/vibration.service';
import { GameComponent } from './game.component';

class PlayerServiceStub {
  nameSig = signal('Alice');
  scoreSig = signal(0);
  maxPointsSig = signal(0);

  name = this.nameSig.asReadonly();
  score = this.scoreSig.asReadonly();
  maxPoints = this.maxPointsSig.asReadonly();

  saveProgress = vi.fn<() => void>();
  setScore = vi.fn<(points: number) => void>((points) => {
    this.scoreSig.set(points);
  });
  addScore = vi.fn<(delta?: number) => void>((delta = 1) => {
    const next = Math.max(0, this.scoreSig() + delta);
    this.scoreSig.set(next);
    this.maxPointsSig.update((m) => Math.max(m, next));
  });
}

class RouterStub {
  navigate = vi.fn<(commands: readonly string[]) => Promise<boolean>>(
    async () => true,
  );
}

class SongServiceStub {
  load = vi.fn<(url: string) => void>();
  play = vi.fn<() => void>();
  stop = vi.fn<() => void>();
  setRate = vi.fn<(rate: number) => void>();
}

class VibrationServiceStub {
  vibrateOnScoreLoss = vi.fn<(durationMs?: number) => void>();
}

describe('GameComponent', () => {
  let playerStub: PlayerServiceStub;
  let routerStub: RouterStub;
  let songStub: SongServiceStub;
  let vibrationStub: VibrationServiceStub;
  let component: GameComponent;

  beforeAll(() => {
    try {
      TestBed.initTestEnvironment(BrowserTestingModule, platformBrowserTesting());
    } catch {
      // Test environment may already be initialized in the same Vitest session.
    }
  });

  beforeEach(async () => {
    vi.useFakeTimers();
    TestBed.resetTestingModule();
    playerStub = new PlayerServiceStub();
    routerStub = new RouterStub();
    songStub = new SongServiceStub();
    vibrationStub = new VibrationServiceStub();

    TestBed.configureTestingModule({
      providers: [
        { provide: PlayerService, useValue: playerStub },
        { provide: Router, useValue: routerStub },
        { provide: SongService, useValue: songStub },
        { provide: VibrationService, useValue: vibrationStub },
      ],
    });
    component = TestBed.runInInjectionContext(() => new GameComponent());
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('navigates to menu and persists progress', async () => {
    await (component as any).goToMenu();

    expect(playerStub.saveProgress).toHaveBeenCalled();
    expect(routerStub.navigate).toHaveBeenCalledWith(['/']);
  });

  it('resets score when moving on red light', () => {
    (component as any).moveLeft();

    expect(playerStub.setScore).toHaveBeenCalledWith(0);
    expect(playerStub.addScore).not.toHaveBeenCalled();
  });

  it('adds score and updates footprint colors on green light', () => {
    (component as any).trafficLight.set('green');

    (component as any).moveLeft();

    expect(playerStub.addScore).toHaveBeenCalledWith(1);
    expect((component as any).footColor('left')).toBe('#94a3b8');
    expect((component as any).footColor('right')).toBe('#0f172a');
  });

  it('returns muted color on red and default color on first green step', () => {
    (component as any).trafficLight.set('red');
    expect((component as any).footColor('left')).toBe('#94a3b8');

    (component as any).trafficLight.set('green');
    (component as any).lastFoot = null;
    expect((component as any).footColor('left')).toBe('#0f172a');
  });

  it('penalizes repeated same foot on green light', () => {
    (component as any).trafficLight.set('green');

    (component as any).moveLeft();
    (component as any).moveLeft();

    expect(playerStub.addScore).toHaveBeenCalledWith(-1);
  });

  it('vibrates the device when losing points on red light', () => {
    playerStub.setScore(3);
    (component as any).trafficLight.set('red');

    (component as any).moveLeft();

    expect(playerStub.setScore).toHaveBeenCalledWith(0);
    expect(vibrationStub.vibrateOnScoreLoss).toHaveBeenCalledTimes(1);
  });

  it('vibrates the device when losing points for repeating a side on green light', () => {
    playerStub.setScore(2);
    (component as any).trafficLight.set('green');
    (component as any).lastFoot = null;

    // First step on green increases score; the second same-side step decreases it.
    (component as any).moveLeft();
    (component as any).moveLeft();

    expect(playerStub.addScore).toHaveBeenCalledWith(-1);
    expect(vibrationStub.vibrateOnScoreLoss).toHaveBeenCalledTimes(1);
  });

  it('adds score when alternating feet on green light', () => {
    (component as any).trafficLight.set('green');

    (component as any).moveLeft();
    (component as any).moveRight();

    expect(playerStub.addScore).toHaveBeenNthCalledWith(1, 1);
    expect(playerStub.addScore).toHaveBeenNthCalledWith(2, 1);
    expect(playerStub.addScore).not.toHaveBeenCalledWith(-1);
  });

  it('keeps random green jitter inside configured range', () => {
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);
    expect((component as any).randomGreenJitterMs()).toBe(-1500);

    randomSpy.mockReturnValue(0.999999);
    expect((component as any).randomGreenJitterMs()).toBe(1500);
    randomSpy.mockRestore();
  });

  it('computes green duration with min cap and jitter', () => {
    const jitterSpy = vi.spyOn(component as any, 'randomGreenJitterMs').mockReturnValue(123);

    expect((component as any).greenLightDurationMs(0)).toBe(10123);
    expect((component as any).greenLightDurationMs(999)).toBe(2123);

    jitterSpy.mockRestore();
  });

  it('handles keyboard arrows as movement input', () => {
    const leftSpy = vi.spyOn(component as any, 'moveLeft');
    const rightSpy = vi.spyOn(component as any, 'moveRight');

    (component as any).onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    (component as any).onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

    expect(leftSpy).toHaveBeenCalled();
    expect(rightSpy).toHaveBeenCalled();
  });

  it('toggles traffic light phase and resets last foot on green', () => {
    (component as any).lastFoot = 'left';

    vi.advanceTimersByTime(3000);

    expect((component as any).trafficLight()).toBe('green');
    expect((component as any).lastFoot).toBeNull();
    // The traffic loop schedules timers; the exact count can vary depending on
    // the audio rate ramp implementation (intervals vs. single timeouts).
    expect(vi.getTimerCount()).toBeGreaterThan(0);
  });

  it('plays the song and sets an initial rate when turning green', () => {
    songStub.play.mockClear();
    songStub.stop.mockClear();
    songStub.setRate.mockClear();

    // Red->Green happens at 3000ms.
    vi.advanceTimersByTime(3000);

    expect(songStub.play).toHaveBeenCalled();
    expect(songStub.setRate).toHaveBeenCalledWith(0.8);
  });

  it('updates the song rate periodically while green', () => {
    songStub.setRate.mockClear();

    vi.advanceTimersByTime(3000);
    const initialCalls = songStub.setRate.mock.calls.length;

    // The ramp tick runs every 100ms.
    vi.advanceTimersByTime(250);
    const laterCalls = songStub.setRate.mock.calls.length;

    expect(laterCalls).toBeGreaterThan(initialCalls);
  });

  it('stops the song when switching back to red', () => {
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5);

    // With jitter=0 and score=0:
    // green duration = 10000ms, so red happens at 3000ms + 10000ms = 13000ms.
    vi.advanceTimersByTime(13000);

    expect(songStub.stop).toHaveBeenCalled();
    randomSpy.mockRestore();
  });
});
