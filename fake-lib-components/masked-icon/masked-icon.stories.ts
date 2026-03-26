import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { argsToTemplate, moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { MaskedIcon } from './masked-icon';

type LibMaskedIconCustomArgs = MaskedIcon;

const meta: Meta<LibMaskedIconCustomArgs> = {
  title: 'WebComponents/MaskedIcon',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }),
  ],
  argTypes: {
    src: { control: 'text', description: 'SVG path used as mask image' },
    color: { control: 'color', description: 'Silhouette fill color' },
  },
  parameters: {
    docs: {
      description: {
        component: `
Generic WebComponent that draws a colorized icon using CSS masks.

## Usage
\`\`\`html
<lib-masked-icon
  src="/assets/traffic-light.svg"
  color="#22c55e">
</lib-masked-icon>
\`\`\`
        `,
      },
    },
    layout: 'centered',
  },
  render: (args) => ({
    props: args,
    template: `<lib-masked-icon ${argsToTemplate(args)}></lib-masked-icon>`,
  }),
};

export default meta;
type Story = StoryObj<LibMaskedIconCustomArgs>;

export const TrafficLightGreen: Story = {
  args: {
    src: '/assets/traffic-light.svg',
    color: '#22c55e',
  },
};

export const FootprintDark: Story = {
  args: {
    src: '/assets/footprints.svg',
    color: '#0f172a',
  },
};
