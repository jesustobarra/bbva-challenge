import { Component, inject, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { PlayerService } from '../player/player.service';
import { SongService } from '../song/song.service';
import { VibrationService } from '../vibration/vibration.service';
import { GameService } from './game.service';

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

class SongServiceStub {
  load = vi.fn<(url: string) => void>();
  play = vi.fn<() => void>();
  stop = vi.fn<() => void>();
  setRate = vi.fn<(rate: number) => void>();
}

class VibrationServiceStub {
  vibrateOnScoreLoss = vi.fn<(durationMs?: number) => void>();
}

@Component({
  standalone: true,
  template: '',
  providers: [GameService],
})
class GameServiceTestHost {
  readonly game = inject(GameService);
}

describe('GameService', () => {
  let playerStub: PlayerServiceStub;
  let songStub: SongServiceStub;
  let vibrationStub: VibrationServiceStub;
  let service: GameService;

  beforeAll(() => {
    try {
      TestBed.initTestEnvironment(BrowserTestingModule, platformBrowserTesting());
    } catch {
      // Test environment may already be initialized in the same Vitest session.
    }
  });

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.resetTestingModule();
    playerStub = new PlayerServiceStub();
    songStub = new SongServiceStub();
    vibrationStub = new VibrationServiceStub();

    TestBed.configureTestingModule({
      imports: [GameServiceTestHost],
      providers: [
        { provide: PlayerService, useValue: playerStub },
        { provide: SongService, useValue: songStub },
        { provide: VibrationService, useValue: vibrationStub },
      ],
    });

    const fixture = TestBed.createComponent(GameServiceTestHost);
    service = fixture.componentInstance.game;
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('resets score when moving on red light', () => {
    service.moveLeft();

    expect(playerStub.setScore).toHaveBeenCalledWith(0);
    expect(playerStub.addScore).not.toHaveBeenCalled();
  });

  it('adds score and updates footprint colors on green light', () => {
    service.trafficLight.set('green');

    service.moveLeft();

    expect(playerStub.addScore).toHaveBeenCalledWith(1);
    expect(service.footColor('left')).toBe('#94a3b8');
    expect(service.footColor('right')).toBe('#0f172a');
  });

  it('returns muted color on red and default color on first green step', () => {
    service.trafficLight.set('red');
    expect(service.footColor('left')).toBe('#94a3b8');

    service.trafficLight.set('green');
    (service as { lastFoot: unknown }).lastFoot = null;
    expect(service.footColor('left')).toBe('#0f172a');
  });

  it('penalizes repeated same foot on green light', () => {
    service.trafficLight.set('green');

    service.moveLeft();
    service.moveLeft();

    expect(playerStub.addScore).toHaveBeenCalledWith(-1);
  });

  it('vibrates the device when losing points on red light', () => {
    playerStub.setScore(3);
    service.trafficLight.set('red');

    service.moveLeft();

    expect(playerStub.setScore).toHaveBeenCalledWith(0);
    expect(vibrationStub.vibrateOnScoreLoss).toHaveBeenCalledTimes(1);
  });

  it('vibrates the device when losing points for repeating a side on green light', () => {
    playerStub.setScore(2);
    service.trafficLight.set('green');
    (service as { lastFoot: unknown }).lastFoot = null;

    service.moveLeft();
    service.moveLeft();

    expect(playerStub.addScore).toHaveBeenCalledWith(-1);
    expect(vibrationStub.vibrateOnScoreLoss).toHaveBeenCalledTimes(1);
  });

  it('adds score when alternating feet on green light', () => {
    service.trafficLight.set('green');

    service.moveLeft();
    service.moveRight();

    expect(playerStub.addScore).toHaveBeenNthCalledWith(1, 1);
    expect(playerStub.addScore).toHaveBeenNthCalledWith(2, 1);
    expect(playerStub.addScore).not.toHaveBeenCalledWith(-1);
  });

  it('keeps random green jitter inside configured range', () => {
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);
    expect(service.randomGreenJitterMs()).toBe(-1500);

    randomSpy.mockReturnValue(0.999999);
    expect(service.randomGreenJitterMs()).toBe(1500);
    randomSpy.mockRestore();
  });

  it('computes green duration with min cap and jitter', () => {
    const jitterSpy = vi.spyOn(service, 'randomGreenJitterMs').mockReturnValue(123);

    expect(service.greenLightDurationMs(0)).toBe(10123);
    expect(service.greenLightDurationMs(999)).toBe(2123);

    jitterSpy.mockRestore();
  });

  it('toggles traffic light phase and resets last foot on green', () => {
    (service as { lastFoot: unknown }).lastFoot = 'left';

    vi.advanceTimersByTime(3000);

    expect(service.trafficLight()).toBe('green');
    expect((service as { lastFoot: unknown }).lastFoot).toBeNull();
    expect(vi.getTimerCount()).toBeGreaterThan(0);
  });

  it('plays the song and sets an initial rate when turning green', () => {
    songStub.play.mockClear();
    songStub.stop.mockClear();
    songStub.setRate.mockClear();

    vi.advanceTimersByTime(3000);

    expect(songStub.play).toHaveBeenCalled();
    expect(songStub.setRate).toHaveBeenCalledWith(0.8);
  });

  it('updates the song rate periodically while green', () => {
    songStub.setRate.mockClear();

    vi.advanceTimersByTime(3000);
    const initialCalls = songStub.setRate.mock.calls.length;

    vi.advanceTimersByTime(250);
    const laterCalls = songStub.setRate.mock.calls.length;

    expect(laterCalls).toBeGreaterThan(initialCalls);
  });

  it('stops the song when switching back to red', () => {
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5);

    vi.advanceTimersByTime(13000);

    expect(songStub.stop).toHaveBeenCalled();
    randomSpy.mockRestore();
  });
});
