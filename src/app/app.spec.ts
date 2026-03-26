import '@angular/compiler';
import { describe, expect, it } from 'vitest';
import { App } from './app';

describe('App', () => {
  it('creates the app component', () => {
    const app = new App();
    expect(app).toBeTruthy();
  });

  it('creates independent instances', () => {
    const appA = new App();
    const appB = new App();
    expect(appA).not.toBe(appB);
  });
});
