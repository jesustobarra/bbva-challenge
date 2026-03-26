import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { SongService } from './song.service';

describe('SongService', () => {
  let service: SongService;

  let lastUrl: string | undefined;
  let lastInstance: any;
  let playMock: ReturnType<typeof vi.fn>;
  let pauseMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    lastUrl = undefined;
    lastInstance = undefined;

    playMock = vi.fn().mockResolvedValue(undefined);
    pauseMock = vi.fn();

    class AudioMock {
      currentTime = 0;
      playbackRate = 1;
      preload = '';
      play = playMock;
      pause = pauseMock;

      constructor(url: string) {
        lastUrl = url;
        lastInstance = this;
      }
    }

    (globalThis as any).Audio = AudioMock as any;

    service = new SongService();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('loads a track and preloads it', () => {
    service.load('/assets/my-song.mp3');

    expect(lastUrl).toBe('/assets/my-song.mp3');
    expect(lastInstance.preload).toBe('auto');
  });

  it('play() sets currentTime to 0 and calls audio.play()', () => {
    service.load('/assets/my-song.mp3');
    service.play();

    expect(lastInstance.currentTime).toBe(0);
    expect(playMock).toHaveBeenCalled();
  });

  it('stop() calls audio.pause()', () => {
    service.load('/assets/my-song.mp3');
    service.stop();

    expect(pauseMock).toHaveBeenCalled();
  });

  it('setRate() updates playbackRate instantly', () => {
    service.load('/assets/my-song.mp3');

    service.setRate(1.25);

    expect(lastInstance.playbackRate).toBe(1.25);
  });

  it('swallows errors thrown by audio.play()', () => {
    playMock.mockImplementation(() => {
      throw new Error('play failed');
    });

    service.load('/assets/my-song.mp3');

    expect(() => service.play()).not.toThrow();
  });

  it('play() is a no-op when no track was loaded', () => {
    // No `load()` call => internal audio stays null.
    expect(() => service.play()).not.toThrow();
    expect(lastInstance).toBeUndefined();
    expect(playMock).not.toHaveBeenCalled();
  });

  it('stop() is a no-op when no track was loaded', () => {
    // No `load()` call => internal audio stays null.
    expect(() => service.stop()).not.toThrow();
    expect(lastInstance).toBeUndefined();
    expect(pauseMock).not.toHaveBeenCalled();
  });

  it('setRate() is a no-op when no track was loaded', () => {
    // No `load()` call => internal audio stays null.
    expect(() => service.setRate(1.5)).not.toThrow();
    expect(lastInstance).toBeUndefined();
  });

  it('load() is a no-op when Audio is undefined', () => {
    const originalAudio = (globalThis as any).Audio;
    try {
      // Force the `typeof Audio === 'undefined'` guard.
      delete (globalThis as any).Audio;
      service.load('/assets/my-song.mp3');

      // Ensure follow-up calls also follow the `audio === null` path.
      expect(() => service.play()).not.toThrow();
      expect(() => service.stop()).not.toThrow();
      expect(() => service.setRate(1.25)).not.toThrow();
    } finally {
      (globalThis as any).Audio = originalAudio;
    }
  });
});

