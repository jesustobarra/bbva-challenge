import { ButtonComponent } from './button/button';
import { InputComponent } from './input/input';
import { MaskedIcon } from './masked-icon/masked-icon';

/**
 * Registry entries pairing a custom-element tag name with its constructor.
 */
const definitions: ReadonlyArray<readonly [string, CustomElementConstructor]> = [
  ['lib-button', ButtonComponent],
  ['lib-input', InputComponent],
  ['lib-masked-icon', MaskedIcon],
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
