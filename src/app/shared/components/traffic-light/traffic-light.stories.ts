import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { argsToTemplate, moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { TrafficLightComponent } from './traffic-light.component';

/**
 * Story args for traffic light stories.
 */
interface TrafficLightStoryArgs { color: string; ariaLabel?: string }

/**
 * Storybook metadata for traffic light variants.
 */
const meta: Meta<TrafficLightStoryArgs> = {
  title: 'Game/TrafficLight',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [TrafficLightComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }),
  ],
  argTypes: {
    color: {
      control: 'select',
      options: ['red', 'green'],
      description: 'Traffic light color',
    },
    ariaLabel: { control: 'text', description: 'Accessible label text' },
  },
  parameters: {
    docs: {
      description: {
        component: `
Traffic light Angular component used by the game.

## Usage
\`\`\`html
<app-traffic-light
  [color]="'red'"
  [ariaLabel]="'Semáforo en rojo'">
</app-traffic-light>
\`\`\`
        `,
      },
    },
    layout: 'centered',
  },
  render: (args) => ({
    props: args,
    template: `<app-traffic-light ${argsToTemplate(args)}></app-traffic-light>`,
  }),
};

export default meta;
type Story = StoryObj<TrafficLightStoryArgs>;

export const Red: Story = {
  args: {
    color: 'red',
    ariaLabel: 'Semáforo en rojo',
  },
};

export const Green: Story = {
  args: {
    color: 'green',
    ariaLabel: 'Semáforo en verde',
  },
};
