import { ButtonComponent } from './button/button';
import { InputComponent } from './input/input';
import { MaskedIcon } from './masked-icon/masked-icon';

const definitions: ReadonlyArray<readonly [string, CustomElementConstructor]> = [
  ['lib-button', ButtonComponent],
  ['lib-input', InputComponent],
  ['lib-masked-icon', MaskedIcon],
];

export function defineCustomElements(): void {
  for (const [name, ctor] of definitions) {
    if (!customElements.get(name)) {
      customElements.define(name, ctor);
    }
  }
}
