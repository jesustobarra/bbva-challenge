import { css, html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

export type LibButtonVariant = 'primary' | 'secondary' | 'danger';

export class ButtonComponent extends LitElement {
  static override styles = css`
    :host {
      display: inline-block;
      align-self: flex-start;
      max-width: 100%;
    }

    button {
      min-height: 44px;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      border: 1px solid transparent;
      font: inherit;
      font-weight: 600;
      cursor: pointer;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .primary {
      background: #166534;
      color: #fff;
    }

    .secondary {
      background: #86c3ff;
      color: #0f172a;
      border-color: #0f172a;
    }

    .danger {
      background: #b91c1c;
      color: #fff;
    }
  `;

  @property({ type: String })
  accessor type: 'button' | 'submit' | 'reset' = 'button';

  @property({ type: String, reflect: true })
  accessor variant: LibButtonVariant = 'primary';

  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  @property({ type: String, attribute: 'aria-label' })
  override accessor ariaLabel = '';

  override render() {
    const v =
      this.variant === 'secondary'
        ? 'secondary'
        : this.variant === 'danger'
          ? 'danger'
          : 'primary';

    return html`
      <button
        class=${v}
        type=${this.type}
        ?disabled=${this.disabled}
        aria-label=${this.ariaLabel || undefined}
      >
        <slot></slot>
      </button>
    `;
  }
}
