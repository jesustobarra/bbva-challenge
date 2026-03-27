import { TestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { STORAGE_KEYS } from '../../constants/storage-keys';
import { StorageService } from '../storage/storage.service';
import { RankingService } from './ranking.service';

describe('RankingService', () => {
  let service: RankingService;
  let storageStub: { getJson: ReturnType<typeof vi.fn> };

  beforeAll(() => {
    try {
      TestBed.initTestEnvironment(BrowserTestingModule, platformBrowserTesting());
    } catch {
      // Test environment may already be initialized in the same Vitest session.
    }
  });

  beforeEach(() => {
    TestBed.resetTestingModule();
    storageStub = {
      getJson: vi.fn(() => ({})),
    };
    TestBed.configureTestingModule({
      providers: [{ provide: StorageService, useValue: storageStub }],
    });
    service = TestBed.runInInjectionContext(() => new RankingService());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns empty rows when storage is empty', () => {
    storageStub.getJson.mockReturnValue({});

    const table = service.getRankingTable();

    expect(storageStub.getJson).toHaveBeenCalledWith(STORAGE_KEYS.playerSaves, {});
    expect(table.columns).toEqual(['#', 'Jugador', 'Récord']);
    expect(table.rows).toEqual([]);
  });

  it('sorts players by maxPoints descending and assigns rank', () => {
    storageStub.getJson.mockReturnValue({
      alice: { maxPoints: 10, resumeScore: 0 },
      bob: { maxPoints: 25, resumeScore: 5 },
    });

    const table = service.getRankingTable();

    expect(table.rows).toEqual([
      ['1', 'bob', '25'],
      ['2', 'alice', '10'],
    ]);
  });
});
