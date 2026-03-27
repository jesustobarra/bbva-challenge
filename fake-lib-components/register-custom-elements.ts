import { ButtonComponent } from './button/button';
import { InputComponent } from './input/input';
import { MaskedIcon } from './masked-icon/masked-icon';
import { TableRowComponent } from './row/table-row';
import { TableComponent } from './table/table';

/**
 * Registry entries pairing a custom-element tag name with its constructor.
 */
const definitions: ReadonlyArray<readonly [string, CustomElementConstructor]> = [
  ['lib-button', ButtonComponent],
  ['lib-input', InputComponent],
  ['lib-masked-icon', MaskedIcon],
  ['lib-table-row', TableRowComponent],
  ['lib-table', TableComponent],
];

/**
 * Defines all library custom elements if they are not already registered.
 */
export function defineCustomElements(): void {
  for (const [name, ctor] of definitions) {
    if (!customElements.get(name)) {
      customElements.define(name, ctor);
    }
  }
}
