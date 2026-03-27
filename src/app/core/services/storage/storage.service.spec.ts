import { beforeEach, describe, expect, it } from 'vitest';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    localStorage.clear();
    service = new StorageService();
  });

  it('returns fallback when key is missing', () => {
    expect(service.getJson('missing', { a: 1 })).toEqual({ a: 1 });
  });

  it('reads parsed JSON when key exists', () => {
    localStorage.setItem('k', JSON.stringify({ x: 2 }));
    expect(service.getJson<{ x: number }>('k', { x: 0 })).toEqual({ x: 2 });
  });

  it('returns fallback when JSON is malformed', () => {
    localStorage.setItem('k', '{');
    expect(service.getJson('k', ['fallback'])).toEqual(['fallback']);
  });

  it('writes serialized JSON values', () => {
    service.setJson('k', { p: 7 });
    expect(localStorage.getItem('k')).toBe(JSON.stringify({ p: 7 }));
  });
});

