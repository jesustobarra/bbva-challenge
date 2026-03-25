import type { Preview } from '@storybook/angular';
import { defineCustomElements } from '../fake-lib-components/register-custom-elements';

defineCustomElements();


const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: { expanded: true },
  },
};

export default preview;
