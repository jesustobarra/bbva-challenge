import { TestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { FootprintComponent } from './footprint.component';

describe('FootprintComponent', () => {
  let component: FootprintComponent;

  beforeAll(() => {
    try {
      TestBed.initTestEnvironment(BrowserTestingModule, platformBrowserTesting());
    } catch {
      // Test environment may already be initialized in the same Vitest session.
    }
  });

  beforeEach(() => {
    TestBed.resetTestingModule();
    component = TestBed.runInInjectionContext(() => new FootprintComponent());
  });

  it('exposes the static icon path', () => {
    expect((component as any).iconPath).toBe('/assets/images/footprints.svg');
  });

  it('has an optional color input with undefined default', () => {
    expect(component.color()).toBeUndefined();
  });
});
