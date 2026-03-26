import { describe, expect, it } from 'vitest';
import { MaskedIcon } from './masked-icon';

const TAG = 'test-lib-masked-icon';
if (!customElements.get(TAG)) {
  customElements.define(TAG, MaskedIcon);
}

function createElement(): MaskedIcon {
  return document.createElement(TAG) as MaskedIcon;
}

function getSilhouette(element: MaskedIcon): HTMLSpanElement {
  const span = element.shadowRoot?.querySelector('.silhouette');
  if (!(span instanceof HTMLSpanElement)) {
    throw new Error('Silhouette element not found');
  }
  return span;
}

describe('MaskedIcon', () => {
  it('renders the silhouette element', async () => {
    const element = createElement();
    document.body.appendChild(element);
    await element.updateComplete;

    const silhouette = getSilhouette(element);
    expect(silhouette).toBeTruthy();
    expect(silhouette.getAttribute('aria-hidden')).toBe('true');
  });

  it('applies src and color styles', async () => {
    const element = createElement();
    element.src = '/assets/traffic-light.svg';
    element.color = '#22c55e';
    document.body.appendChild(element);
    await element.updateComplete;

    const style = getSilhouette(element).getAttribute('style') ?? '';
    expect(style).toContain('background-color:#22c55e');
    expect(style).toContain("mask-image:url('/assets/traffic-light.svg')");
  });

  it('reflects src and color as host attributes', async () => {
    const element = createElement();
    element.src = '/assets/footprints.svg';
    element.color = '#0f172a';
    document.body.appendChild(element);
    await element.updateComplete;

    expect(element.getAttribute('src')).toBe('/assets/footprints.svg');
    expect(element.getAttribute('color')).toBe('#0f172a');
  });

  it('keeps mask-image style valid when src is empty', async () => {
    const element = createElement();
    element.src = '';
    element.color = '#22c55e';
    document.body.appendChild(element);
    await element.updateComplete;

    const style = getSilhouette(element).getAttribute('style') ?? '';
    expect(style).toContain("mask-image:url('')");
    expect(style).toContain('background-color:#22c55e');
  });

  it('keeps background-color style empty when color is empty', async () => {
    const element = createElement();
    element.src = '/assets/traffic-light.svg';
    element.color = '';
    document.body.appendChild(element);
    await element.updateComplete;

    const style = getSilhouette(element).getAttribute('style') ?? '';
    expect(style).toContain("mask-image:url('/assets/traffic-light.svg')");
    expect(style).toContain('background-color:');
  });
});
