import { css, html, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';

let n = 0;

export class InputComponent extends LitElement {
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

  private readonly fieldId = `lib-input-${++n}`;

  @property({ type: String }) accessor label = '';
  @property({ type: Boolean, reflect: true }) accessor disabled = false;
  @property({ type: String }) accessor placeholder = '';

  @property({ type: String, reflect: true }) accessor value = '';

  @property({ type: Object, attribute: false })
  accessor errors: Record<string, unknown> = {};

  @state() private accessor touched = false;

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

  private handleBlur() {
    this.touched = true;
  }


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
