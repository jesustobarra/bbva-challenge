import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { argsToTemplate, moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { InputComponent } from './input';

type LibInputCustomArgs = InputComponent & { errors?: Record<string, unknown> };

const meta: Meta<LibInputCustomArgs> = {
  title: 'WebComponents/Input',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }),
  ],
  argTypes: {
    label: { control: 'text', description: 'Input label' },
    placeholder: { control: 'text', description: 'Placeholder text' },
    value: { control: 'text', description: 'Current value' },
    disabled: { control: 'boolean', description: 'Disables input field' },
    errors: { control: 'object', description: 'Validation errors object' },
  },
  parameters: {
    docs: {
      description: {
        component: `
Reusable input WebComponent with validation styles.

## Usage
\`\`\`html
<lib-input
  label="Name"
  placeholder="Enter your name"
  .value="\${'John'}"
  ?disabled="\${false}"
  .errors="\${{ required: true }}"
  @onInput="onInput($event)"
  @onChange="onChange($event)">
</lib-input>
\`\`\`

### Events

| Event        | Payload | Description                        |
|--------------|---------|------------------------------------|
| **onInput**  | string  | Fired when user types in the input |
| **onChange** | string  | Fired when input value changes     |
        `,
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `<lib-input ${argsToTemplate(args)}></lib-input>`,
  }),
};

export default meta;
type Story = StoryObj<LibInputCustomArgs>;

export const Default: Story = {
  args: {
    label: 'Nombre',
    placeholder: 'Escribe tu nombre',
    value: '',
    disabled: false,
    errors: {},
  },
};

export const ErrorState: Story = {
  args: {
    label: 'Nombre',
    placeholder: 'Escribe tu nombre',
    value: '',
    errors: { required: true },
  },
};

export const Disabled: Story = {
  args: {
    label: 'Nombre',
    placeholder: 'Campo deshabilitado',
    value: 'Jugador 1',
    disabled: true,
    errors: {},
  },
};

export const EventsDemo: Story = {
  args: {
    label: 'Nombre',
    placeholder: 'Escribe para ver eventos',
    value: '',
    disabled: false,
    errors: {},
  },
  render: (args) => ({
    props: {
      ...args,
      lastOnInput: '',
      lastOnChange: '',
      onInput(event: CustomEvent<string>) {
        this['lastOnInput'] = event.detail ?? '';
      },
      onChange(event: CustomEvent<string>) {
        this['lastOnChange'] = event.detail ?? '';
      },
    },
    template: `
      <div style="display:grid; gap:0.75rem; min-width:20rem;">
        <lib-input
          ${argsToTemplate(args)}
          (onInput)="onInput($event)"
          (onChange)="onChange($event)"
        ></lib-input>
        <div style="font-family:monospace; font-size:0.85rem;">
          <div><strong>onInput:</strong> {{ lastOnInput || '—' }}</div>
          <div><strong>onChange:</strong> {{ lastOnChange || '—' }}</div>
        </div>
      </div>
    `,
  }),
};
