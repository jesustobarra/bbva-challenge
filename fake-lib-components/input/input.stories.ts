import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Game/LibInput',
  decorators: [
    moduleMetadata({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }),
  ],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    value: { control: 'text' },
    disabled: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj;

export const Playground: Story = {
  render: (args) => ({
    props: args,
    template: `
      <lib-input
        [attr.label]="label"
        [attr.placeholder]="placeholder"
        [attr.value]="value"
        [attr.disabled]="disabled ? '' : null"
      ></lib-input>
    `,
  }),
  args: {
    label: 'Nombre',
    placeholder: 'Tu nombre',
    value: '',
    disabled: false,
  },
};
