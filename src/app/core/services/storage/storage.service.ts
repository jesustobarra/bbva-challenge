import { Injectable } from '@angular/core';

/**
 * Generic JSON storage helper around browser `localStorage`.
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  /**
   * Reads and parses a JSON value, returning `fallback` on any failure.
   *
   * @param key Storage key to read.
   * @param fallback Value returned when key is missing/invalid.
   */
  getJson<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null || raw.length === 0) {
        return fallback;
      }
      const data = JSON.parse(raw) as unknown;
      if (data === null || data === undefined) {
        return fallback;
      }
      return data as T;
    } catch {
      return fallback;
    }
  }

  /**
   * Serializes and stores a JSON value.
   *
   * @param key Storage key to write.
   * @param value Value to serialize.
   */
  setJson<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      return;
    }
  }
}

