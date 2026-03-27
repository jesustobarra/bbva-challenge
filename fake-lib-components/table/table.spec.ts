import { describe, expect, it } from 'vitest';
import { TableRowComponent } from '../row/table-row';
import { TableComponent } from './table';

if (!customElements.get('lib-table-row')) {
  customElements.define('lib-table-row', TableRowComponent);
}

const TAG = 'test-lib-table';
if (!customElements.get(TAG)) {
  customElements.define(TAG, TableComponent);
}

function createElement(): TableComponent {
  return document.createElement(TAG) as TableComponent;
}

describe('TableComponent', () => {
  it('renders column headers and body rows', async () => {
    const element = createElement();
    element.columns = ['A', 'B'];
    element.rows = [
      ['1', 'x'],
      ['2', 'y'],
    ];
    document.body.appendChild(element);
    await element.updateComplete;

    const headers = element.shadowRoot?.querySelectorAll('[role="columnheader"]');
    expect(headers?.[0]?.textContent).toBe('A');
    expect(headers?.[1]?.textContent).toBe('B');

    const rows = element.shadowRoot?.querySelectorAll('lib-table-row');
    expect(rows?.length).toBe(2);
  });

  it('shows empty label when there are no rows', async () => {
    const element = createElement();
    element.columns = ['A'];
    element.rows = [];
    element.emptyLabel = 'Vacío';
    document.body.appendChild(element);
    await element.updateComplete;

    expect(element.shadowRoot?.textContent).toContain('Vacío');
  });

  it('pads short rows to match column count', async () => {
    const element = createElement();
    element.columns = ['A', 'B', 'C'];
    element.rows = [['only']];
    document.body.appendChild(element);
    await element.updateComplete;

    const row = element.shadowRoot?.querySelector('lib-table-row') as TableRowComponent | null;
    await row?.updateComplete;

    const cells = row?.shadowRoot?.querySelectorAll('[role="cell"]');
    expect(cells?.length).toBe(3);
    expect(cells?.[0]?.textContent).toBe('only');
    expect(cells?.[1]?.textContent).toBe('');
    expect(cells?.[2]?.textContent).toBe('');
  });
});
