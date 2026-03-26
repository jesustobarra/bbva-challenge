import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { argsToTemplate, moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { FootprintComponent } from './footprint.component';

/**
 * Story args for the footprint component stories.
 */
interface FootprintStoryArgs { color: string }

/**
 * Storybook metadata for footprint examples.
 */
const meta: Meta<FootprintStoryArgs> = {
  title: 'Game/Footprint',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [FootprintComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }),
  ],
  argTypes: {
    color: { control: 'color', description: 'Footprint icon color' },
  },
  parameters: {
    docs: {
      description: {
        component: `
Footprint Angular component that wraps \`lib-masked-icon\`.

## Usage
\`\`\`html
<app-footprint [color]="'#0f172a'"></app-footprint>
\`\`\`
        `,
      },
    },
    layout: 'centered',
  },
  render: (args) => ({
    props: args,
    template: `<app-footprint ${argsToTemplate(args)}></app-footprint>`,
  }),
};

export default meta;
type Story = StoryObj<FootprintStoryArgs>;

export const Default: Story = {
  args: {
    color: '#0f172a',
  },
};

export const Muted: Story = {
  args: {
    color: '#94a3b8',
  },
};
