import { TestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { TrafficLightComponent } from './traffic-light.component';

describe('TrafficLightComponent', () => {
  let component: TrafficLightComponent;

  beforeAll(() => {
    try {
      TestBed.initTestEnvironment(BrowserTestingModule, platformBrowserTesting());
    } catch {
      // Test environment may already be initialized in the same Vitest session.
    }
  });

  beforeEach(() => {
    TestBed.resetTestingModule();
    component = TestBed.runInInjectionContext(() => new TrafficLightComponent());
  });

  it('exposes the static icon path', () => {
    expect((component as any).iconPath).toBe('/assets/traffic-light.svg');
  });

  it('has an optional color input with undefined default', () => {
    expect(component.color()).toBeUndefined();
  });

  it('has an optional ariaLabel input with undefined default', () => {
    expect(component.ariaLabel()).toBeUndefined();
  });
});
