import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineCustomElements } from './register-custom-elements';

describe('defineCustomElements', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('registers all library custom elements when none exist', () => {
    const getSpy = vi.spyOn(customElements, 'get').mockReturnValue(undefined);
    const defineSpy = vi.spyOn(customElements, 'define').mockImplementation(() => {});

    defineCustomElements();

    expect(getSpy).toHaveBeenCalledWith('lib-button');
    expect(getSpy).toHaveBeenCalledWith('lib-input');
    expect(getSpy).toHaveBeenCalledWith('lib-masked-icon');
    expect(defineSpy).toHaveBeenCalledTimes(3);
    expect(defineSpy.mock.calls.map(([name]) => name)).toEqual([
      'lib-button',
      'lib-input',
      'lib-masked-icon',
    ]);
  });

  it('skips registration for already-defined custom elements', () => {
    const existingCtor = class extends HTMLElement {};
    vi.spyOn(customElements, 'get').mockImplementation((name) => {
      if (name === 'lib-input') {
        return existingCtor;
      }
      return undefined;
    });
    const defineSpy = vi.spyOn(customElements, 'define').mockImplementation(() => {});

    defineCustomElements();

    expect(defineSpy).toHaveBeenCalledTimes(2);
    expect(defineSpy.mock.calls.map(([name]) => name)).toEqual([
      'lib-button',
      'lib-masked-icon',
    ]);
  });
});
