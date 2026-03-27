import { inject, Injectable } from '@angular/core';

import { STORAGE_KEYS } from '../../constants/storage-keys';
import type { PlayerSaveData } from '../../dtos/player-save-data.dto';
import { StorageService } from '../storage/storage.service';

/** Tabular data for `lib-table`: header labels and body rows (cell strings). */
export interface RankingTableData {
  /** Column titles in order. */
  columns: string[];
  /** One array of cell values per row, aligned with `columns`. */
  rows: string[][];
}

/**
 * Builds an ordered ranking from persisted player scores (`localStorage`).
 */
@Injectable({ providedIn: 'root' })
export class RankingService {
  /** Generic persistence utility. */
  private readonly storage = inject(StorageService);
  /**
   * Returns columns and rows sorted by best score (descending).
   *
   * Player keys in storage are normalized (lowercase); they are shown as stored.
   */
  getRankingTable(): RankingTableData {
    const map = this.readMap();
    const entries = Object.entries(map).map(([key, data]) => ({
      key,
      maxPoints: Math.max(0, Math.floor(data.maxPoints)),
    }));
    entries.sort((a, b) => b.maxPoints - a.maxPoints);

    const columns = ['#', 'Jugador', 'Récord'];
    const rows = entries.map((e, i) => [String(i + 1), e.key, String(e.maxPoints)]);

    return { columns, rows };
  }

  private readMap(): Record<string, PlayerSaveData> {
    return this.storage.getJson<Record<string, PlayerSaveData>>(STORAGE_KEYS.playerSaves, {});
  }
}
