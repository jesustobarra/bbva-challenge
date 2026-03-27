import { TestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { RankingService } from './ranking.service';

describe('RankingService', () => {
  let service: RankingService;
  let getItem: ReturnType<typeof vi.spyOn>;

  beforeAll(() => {
    try {
      TestBed.initTestEnvironment(BrowserTestingModule, platformBrowserTesting());
    } catch {
      // Test environment may already be initialized in the same Vitest session.
    }
  });

  beforeEach(() => {
    TestBed.resetTestingModule();
    getItem = vi.spyOn(Storage.prototype, 'getItem');
    service = TestBed.runInInjectionContext(() => new RankingService());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns empty rows when storage is empty', () => {
    getItem.mockReturnValue(null);

    const table = service.getRankingTable();

    expect(table.columns).toEqual(['#', 'Jugador', 'Récord']);
    expect(table.rows).toEqual([]);
  });

  it('sorts players by maxPoints descending and assigns rank', () => {
    getItem.mockReturnValue(
      JSON.stringify({
        alice: { maxPoints: 10, resumeScore: 0 },
        bob: { maxPoints: 25, resumeScore: 5 },
      }),
    );

    const table = service.getRankingTable();

    expect(table.rows).toEqual([
      ['1', 'bob', '25'],
      ['2', 'alice', '10'],
    ]);
  });
});
