import { describe, expect, it } from 'vitest';
import { ButtonComponent } from './button';

const TAG = 'test-lib-button';
if (!customElements.get(TAG)) {
  customElements.define(TAG, ButtonComponent);
}

function createElement(): ButtonComponent {
  return document.createElement(TAG) as ButtonComponent;
}

describe('ButtonComponent', () => {
  it('renders a native button with default values', async () => {
    const element = createElement();
    document.body.appendChild(element);
    await element.updateComplete;

    const button = element.shadowRoot?.querySelector('button');
    expect(button).toBeTruthy();
    expect(button?.getAttribute('type')).toBe('button');
    expect(button?.className).toBe('primary');
    expect(button?.hasAttribute('disabled')).toBe(false);
  });

  it('applies the selected variant class', async () => {
    const element = createElement();
    element.variant = 'secondary';
    document.body.appendChild(element);
    await element.updateComplete;

    const button = element.shadowRoot?.querySelector('button');
    expect(button?.className).toBe('secondary');
  });

  it('falls back to primary when variant is invalid', async () => {
    const element = createElement();
    element.variant = 'unknown' as never;
    document.body.appendChild(element);
    await element.updateComplete;

    const button = element.shadowRoot?.querySelector('button');
    expect(button?.className).toBe('primary');
  });

  it('reflects disabled and aria-label attributes', async () => {
    const element = createElement();
    element.disabled = true;
    element.ariaLabel = 'Save changes';
    document.body.appendChild(element);
    await element.updateComplete;

    const button = element.shadowRoot?.querySelector('button');
    expect(button?.hasAttribute('disabled')).toBe(true);
    expect(button?.getAttribute('aria-label')).toBe('Save changes');
  });
});
