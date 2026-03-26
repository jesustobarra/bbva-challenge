import { describe, expect, it, vi } from 'vitest';
import { InputComponent } from './input';

const TAG = 'test-lib-input';
if (!customElements.get(TAG)) {
  customElements.define(TAG, InputComponent);
}

function createElement(): InputComponent {
  return document.createElement(TAG) as InputComponent;
}

function getInput(element: InputComponent): HTMLInputElement {
  const input = element.shadowRoot?.querySelector('input');
  if (!input) {
    throw new Error('Input not found in shadowRoot');
  }
  return input;
}

describe('InputComponent', () => {
  it('renders label and initial value', async () => {
    const element = createElement();
    element.label = 'Player name';
    element.value = 'Alice';
    document.body.appendChild(element);
    await element.updateComplete;

    const label = element.shadowRoot?.querySelector('label');
    const input = getInput(element);
    expect(label?.textContent).toContain('Player name');
    expect(input.value).toBe('Alice');
  });

  it('emits onInput and updates value on input event', async () => {
    const element = createElement();
    const listener = vi.fn();
    element.addEventListener('onInput', listener);
    document.body.appendChild(element);
    await element.updateComplete;

    const input = getInput(element);
    input.value = 'Bob';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await element.updateComplete;

    expect(element.value).toBe('Bob');
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls[0]?.[0]).toBeInstanceOf(CustomEvent);
    expect((listener.mock.calls[0]?.[0] as CustomEvent).detail).toBe('Bob');
  });

  it('emits onChange and updates value on change event', async () => {
    const element = createElement();
    const listener = vi.fn();
    element.addEventListener('onChange', listener);
    document.body.appendChild(element);
    await element.updateComplete;

    const input = getInput(element);
    input.value = 'Charlie';
    input.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    await element.updateComplete;

    expect(element.value).toBe('Charlie');
    expect(listener).toHaveBeenCalledTimes(1);
    expect((listener.mock.calls[0]?.[0] as CustomEvent).detail).toBe('Charlie');
  });

  it('shows required error message only after blur', async () => {
    const element = createElement();
    element.errors = { required: true };
    document.body.appendChild(element);
    await element.updateComplete;

    expect(element.shadowRoot?.querySelector('.error-message')).toBeNull();

    const input = getInput(element);
    input.dispatchEvent(new Event('blur', { bubbles: true }));
    await element.updateComplete;

    const message = element.shadowRoot?.querySelector('.error-message');
    expect(message?.textContent).toContain('Este campo es obligatorio');
    expect(input.className).toBe('error');
  });

  it('respects disabled and placeholder attributes', async () => {
    const element = createElement();
    element.disabled = true;
    element.placeholder = 'Type your name';
    document.body.appendChild(element);
    await element.updateComplete;

    const input = getInput(element);
    expect(input.disabled).toBe(true);
    expect(input.getAttribute('placeholder')).toBe('Type your name');
  });
});
