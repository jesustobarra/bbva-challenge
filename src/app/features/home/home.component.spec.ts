import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { PlayerService } from '../../core/services/player/player.service';
import { RankingService } from '../../core/services/ranking/ranking.service';
import { HomeComponent } from './home.component';

class PlayerServiceStub {
  private readonly nameSig = signal('');
  name = this.nameSig.asReadonly();
  prepareForGame = vi.fn<(name: string) => void>();
}

class RouterStub {
  navigate = vi.fn<(commands: readonly string[]) => Promise<boolean>>(async () => true);
}

class RankingServiceStub {
  getRankingTable = vi.fn(() => ({
    columns: ['#', 'Jugador', 'Récord'],
    rows: [] as string[][],
  }));
}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let playerStub: PlayerServiceStub;
  let routerStub: RouterStub;
  let rankingStub: RankingServiceStub;

  beforeAll(() => {
    try {
      TestBed.initTestEnvironment(BrowserTestingModule, platformBrowserTesting());
    } catch {
      // Test environment may already be initialized in the same Vitest session.
    }
  });

  beforeEach(() => {
    TestBed.resetTestingModule();
    playerStub = new PlayerServiceStub();
    routerStub = new RouterStub();
    rankingStub = new RankingServiceStub();

    TestBed.configureTestingModule({
      providers: [
        { provide: PlayerService, useValue: playerStub },
        { provide: Router, useValue: routerStub },
        { provide: RankingService, useValue: rankingStub },
      ],
    });

    component = TestBed.runInInjectionContext(() => new HomeComponent());
  });

  it('updates name from onInput custom event', () => {
    (component as any).onInput(new CustomEvent('onInput', { detail: 'Alice' }));

    expect((component as any).name()).toBe('Alice');
  });

  it('sets empty name when input payload is not a string', () => {
    (component as any).onInput(new CustomEvent('onInput', { detail: 123 }));

    expect((component as any).name()).toBe('');
  });

  it('does not navigate when name is blank', async () => {
    (component as any).name.set('   ');

    await (component as any).enterGame();

    expect(playerStub.prepareForGame).not.toHaveBeenCalled();
    expect(routerStub.navigate).not.toHaveBeenCalled();
  });

  it('prepares game and navigates when name is valid', async () => {
    (component as any).name.set('Nora');

    await (component as any).enterGame();

    expect(playerStub.prepareForGame).toHaveBeenCalledWith('Nora');
    expect(routerStub.navigate).toHaveBeenCalledWith(['/game']);
  });

  it('returns validation errors only for invalid names', () => {
    (component as any).name.set('   ');
    expect((component as any).errors()).toEqual({ required: true });

    (component as any).name.set('Leo');
    expect((component as any).errors()).toBeNull();
  });

  it('loads ranking data from RankingService', () => {
    expect(rankingStub.getRankingTable).toHaveBeenCalled();
    expect((component as any).rankingTable().columns).toEqual(['#', 'Jugador', 'Récord']);
    expect((component as any).rankingTable().rows).toEqual([]);
  });
});
