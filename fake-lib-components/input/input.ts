import { css, html, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';

/** Counter used to generate unique input ids. */
let n = 0;

/**
 * Text input web component with validation feedback.
 */
export class InputComponent extends LitElement {
  /** Component styles for label, field and validation state. */
  static override styles = css`
    :host {
      display: block;
    }

    label {
      display: block;
      margin-bottom: 0.25rem;
      font-size: 0.875rem;
    }

    .input-container {
      display: flex;
      flex-direction: column;
    }

    input {
      border-radius: 4px;
      box-sizing: border-box;
      padding: var(--input-padding, 4px);
      min-height: var(--input-height, 44px);
      width: var(--input-width, 100%);
      border: var(--input-border, 1px solid #ccc);
      font-size: var(--input-font-size, 1rem);
      font-family: inherit;
    }

    input.error {
      border-color: #dc3545;
    }

    input:disabled {
      opacity: 0.6;
    }

    .error-message {
      color: #dc3545;
      font-size: 0.9rem;
      margin-top: 5px;
    }
  `;

  /** Stable id used to bind the label to the native input. */
  private readonly fieldId = `lib-input-${++n}`;

  /** Optional visible label. */
  @property({ type: String })
  accessor label = '';
  /** Disables the native input when true. */
  @property({ type: Boolean, reflect: true })
  accessor disabled = false;
  /** Placeholder text for the native input. */
  @property({ type: String })
  accessor placeholder = '';

  /** Current input value (two-way style with emitted events). */
  @property({ type: String, reflect: true })
  accessor value = '';

  /** Validation errors map received from the host app. */
  @property({ type: Object, attribute: false })
  accessor errors: Record<string, unknown> = {};

  /** Tracks whether the user already left the field at least once. */
  @state()
  private accessor touched = false;

  /** Emits `onInput` while the user types. */
  private handleInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.value = input.value;
    this.dispatchEvent(
      new CustomEvent('onInput', {
        detail: this.value,
        bubbles: true,
        composed: true,
      }),
    );
  }

  /** Emits `onChange` when the value is committed by the browser. */
  private changeInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.value = input.value;
    this.dispatchEvent(
      new CustomEvent('onChange', {
        detail: input.value,
        bubbles: true,
        composed: true,
      }),
    );
  }

  /** Marks field as touched to show validation errors. */
  private handleBlur() {
    this.touched = true;
  }

  /** Returns a user-friendly error message from the errors map. */
  private getErrorMessage(): string {
    const err = this.errors;
    if (err?.['required']) {
      return 'Este campo es obligatorio';
    }
    const keys = Object.keys(err ?? {});
    if (keys.length > 0) {
      return `Error: ${keys[0]}`;
    }
    return '';
  }

  /** Renders label, input and optional error message. */
  override render() {
    const hasError = Object.keys(this.errors ?? {}).length > 0;

    return html`
      <div class="input-container">
        ${this.label
          ? html`<label for=${this.fieldId}>${this.label}</label>`
          : null}
        <input
          id=${this.fieldId}
          type="text"
          placeholder=${this.placeholder}
          .value=${this.value}
          ?disabled=${this.disabled}
          @input=${this.handleInput}
          @change=${this.changeInput}
          @blur=${this.handleBlur}
          class=${hasError && this.touched ? 'error' : ''}
        />
        ${hasError && this.touched
          ? html`<div class="error-message">${this.getErrorMessage()}</div>`
          : null}
      </div>
    `;
  }
}
