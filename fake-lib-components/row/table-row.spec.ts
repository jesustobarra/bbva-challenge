import { describe, expect, it } from 'vitest';
import { TableRowComponent } from './table-row';

const TAG = 'test-lib-table-row';
if (!customElements.get(TAG)) {
  customElements.define(TAG, TableRowComponent);
}

function createElement(): TableRowComponent {
  return document.createElement(TAG) as TableRowComponent;
}

describe('TableRowComponent', () => {
  it('renders cells in order', async () => {
    const element = createElement();
    element.cells = ['1', 'Ada', '42'];
    document.body.appendChild(element);
    await element.updateComplete;

    const cells = element.shadowRoot?.querySelectorAll('[role="cell"]');
    expect(cells?.length).toBe(3);
    expect(cells?.[0]?.textContent).toBe('1');
    expect(cells?.[1]?.textContent).toBe('Ada');
    expect(cells?.[2]?.textContent).toBe('42');
  });

  it('applies row class', async () => {
    const element = createElement();
    element.cells = ['a', 'b'];
    document.body.appendChild(element);
    await element.updateComplete;

    const row = element.shadowRoot?.querySelector('.row');
    expect(row?.className).toContain('row');
  });
});
