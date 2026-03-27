import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { GameService } from '../../core/services/game/game.service';
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

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.resetTestingModule();
    playerStub = new PlayerServiceStub();
    routerStub = new RouterStub();
    songStub = new SongServiceStub();
    vibrationStub = new VibrationServiceStub();

    TestBed.configureTestingModule({
      providers: [
        GameService,
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
    await component['goToMenu']();

    expect(playerStub.saveProgress).toHaveBeenCalled();
    expect(routerStub.navigate).toHaveBeenCalledWith(['/']);
  });

  it('delegates movement to GameService', () => {
    const game = component['game'] as GameService;
    const spy = vi.spyOn(game, 'moveLeft');
    component['moveLeft']();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('delegates footColor to GameService', () => {
    const game = component['game'] as GameService;
    game.trafficLight.set('red');
    expect(component['footColor']('left')).toBe(game.footColor('left'));
  });

  it('handles keyboard arrows as movement input', () => {
    const leftSpy = vi.spyOn(component['game'] as GameService, 'moveLeft');
    const rightSpy = vi.spyOn(component['game'] as GameService, 'moveRight');

    component['onKeyDown'](new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    component['onKeyDown'](new KeyboardEvent('keydown', { key: 'ArrowRight' }));

    expect(leftSpy).toHaveBeenCalled();
    expect(rightSpy).toHaveBeenCalled();
    leftSpy.mockRestore();
    rightSpy.mockRestore();
  });
});
