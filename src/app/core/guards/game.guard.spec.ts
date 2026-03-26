import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import type { UrlTree } from '@angular/router';
import type { CanActivateFn } from '@angular/router';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { PlayerService } from '../services/player/player.service';
import { gameGuard } from './game.guard';

class PlayerServiceStub {
  hasName = vi.fn<() => boolean>();
}

class RouterStub {
  createUrlTree = vi.fn<(commands: readonly string[]) => UrlTree>();
}

describe('gameGuard', () => {
  let playerServiceStub: PlayerServiceStub;
  let routerStub: RouterStub;

  beforeAll(() => {
    try {
      TestBed.initTestEnvironment(BrowserTestingModule, platformBrowserTesting());
    } catch {
      // Test environment may already be initialized in the same Vitest session.
    }
  });

  const executeGuard = (): ReturnType<CanActivateFn> =>
    TestBed.runInInjectionContext(() => gameGuard({} as never, {} as never));

  beforeEach(() => {
    TestBed.resetTestingModule();
    playerServiceStub = new PlayerServiceStub();
    routerStub = new RouterStub();

    TestBed.configureTestingModule({
      providers: [
        { provide: PlayerService, useValue: playerServiceStub },
        { provide: Router, useValue: routerStub },
      ],
    });
  });

  it('returns true when the player has a name', () => {
    playerServiceStub.hasName.mockReturnValue(true);

    const result = executeGuard();

    expect(playerServiceStub.hasName).toHaveBeenCalled();
    expect(result).toBe(true);
    expect(routerStub.createUrlTree).not.toHaveBeenCalled();
  });

  it('returns UrlTree redirect to home when player has no name', () => {
    const redirectTree = {} as UrlTree;
    playerServiceStub.hasName.mockReturnValue(false);
    routerStub.createUrlTree.mockReturnValue(redirectTree);

    const result = executeGuard();

    expect(playerServiceStub.hasName).toHaveBeenCalled();
    expect(routerStub.createUrlTree).toHaveBeenCalledWith(['']);
    expect(result).toBe(redirectTree);
  });
});
