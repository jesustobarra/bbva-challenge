import { css, html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

/**
 * Single data row for `lib-table`. Renders one cell per entry in `cells`.
 *
 * Custom element tag: `lib-table-row`.
 */
export class TableRowComponent extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }

    .row {
      display: grid;
      gap: 0.75rem;
      align-items: center;
      padding: 0.5rem 0.75rem;
      border-radius: 0.5rem;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      box-sizing: border-box;
      font: inherit;
      color: #0f172a;
    }

    .cell {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-variant-numeric: tabular-nums;
    }

    .cell--end {
      text-align: right;
    }
  `;

  /** Cell values in column order (same length as the parent table’s columns). */
  @property({ type: Array })
  accessor cells: string[] = [];

  override render() {
    const raw = Array.isArray(this.cells) ? this.cells : [];
    const list = raw.length > 0 ? raw : [''];
    const n = list.length;
    const gridStyle = `grid-template-columns: repeat(${n}, minmax(0, 1fr))`;

    return html`
      <div
        class="row"
        style=${gridStyle}
        role="row"
        aria-label=${list.join(', ')}
      >
        ${list.map(
          (text, i) =>
            html`<span class=${i === n - 1 ? 'cell cell--end' : 'cell'} role="cell">${text}</span>`,
        )}
      </div>
    `;
  }
}
