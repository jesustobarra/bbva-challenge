import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Game/LibButton',
  decorators: [
    moduleMetadata({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }),
  ],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    text: { control: 'text' },
    type: { control: 'select', options: ['button', 'submit', 'reset'] },
    variant: { control: 'select', options: ['primary', 'secondary', 'danger'] },
    disabled: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj;

export const Playground: Story = {
  render: (args) => ({
    props: args,
    template: `
      <lib-button
        [attr.type]="type"
        [attr.variant]="variant"
        [attr.disabled]="disabled ? '' : null"
      >
        {{ text }}
      </lib-button>
    `,
  }),
  args: {
    text: 'Jugar',
    type: 'button',
    variant: 'primary',
    disabled: false,
  },
};
