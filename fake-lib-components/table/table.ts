import { css, html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

/**
 * Table container: column headers plus one `lib-table-row` per data row.
 *
 * Custom element tag: `lib-table`.
 */
export class TableComponent extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }

    .table {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      width: 100%;
      box-sizing: border-box;
    }

    .header {
      display: grid;
      gap: 0.75rem;
      align-items: end;
      padding: 0 0.75rem 0.25rem;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #64748b;
    }

    .th {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .th--end {
      text-align: right;
    }

    .tbody {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .empty {
      margin: 0;
      padding: 0.75rem;
      text-align: center;
      color: #64748b;
      font-size: 0.875rem;
    }
  `;

  /** Column labels (header row). */
  @property({ type: Array })
  accessor columns: string[] = [];

  /**
   * Body rows: each entry is an array of string cell values in column order.
   * Length should match `columns.length`; shorter rows are padded, longer are truncated.
   */
  @property({ type: Array })
  accessor rows: string[][] = [];

  /** Shown when `rows` is empty. */
  @property({ type: String })
  accessor emptyLabel = 'Sin datos';

  override render() {
    const cols = Array.isArray(this.columns) ? this.columns : [];
    const colCount = Math.max(cols.length, 1);
    const gridStyle = `grid-template-columns: repeat(${colCount}, minmax(0, 1fr))`;

    const bodyRows = Array.isArray(this.rows) ? this.rows : [];

    return html`
      <div class="table" role="table">
        <div class="header" style=${gridStyle} role="row">
          ${cols.map(
            (label, i) =>
              html`<span class=${i === colCount - 1 ? 'th th--end' : 'th'} role="columnheader"
                >${label}</span
              >`,
          )}
        </div>
        ${bodyRows.length === 0
          ? html`<p class="empty">${this.emptyLabel}</p>`
          : html`
              <div class="tbody" role="rowgroup">
                ${bodyRows.map(
                  (row) => html`
                    <lib-table-row .cells=${this.normalizeRow(row, colCount)}></lib-table-row>
                  `,
                )}
              </div>
            `}
      </div>
    `;
  }

  private normalizeRow(row: string[], colCount: number): string[] {
    const r = Array.isArray(row) ? [...row] : [];
    while (r.length < colCount) {
      r.push('');
    }
    return r.slice(0, colCount);
  }
}
