import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { argsToTemplate, moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ButtonComponent } from './button';

type LibButtonCustomArgs = ButtonComponent & { text?: string };

const meta: Meta<LibButtonCustomArgs> = {
  title: 'WebComponents/Button',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }),
  ],
  argTypes: {
    text: { control: 'text', description: 'Button content text' },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger'],
      description: 'Visual variant',
    },
    disabled: { control: 'boolean', description: 'Disables the button' },
    ariaLabel: { control: 'text', description: 'Accessible label' },
  },
  parameters: {
    docs: {
      description: {
        component: `
Reusable button WebComponent with primary/secondary/danger variants.

## Usage
\`\`\`html
<lib-button
  variant="primary"
  ?disabled="\${false}"
  aria-label="Play game">
  Play
</lib-button>
\`\`\`

### Events

| Event      | Payload     | Description                            |
|------------|-------------|----------------------------------------|
| **click**  | MouseEvent  | Fired when the user clicks the button  |
        `,
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `<lib-button ${argsToTemplate(args)}>{{ text }}</lib-button>`,
  }),
};

export default meta;
type Story = StoryObj<LibButtonCustomArgs>;

export const Primary: Story = {
  args: {
    text: 'Play',
    variant: 'primary',
    disabled: false,
    ariaLabel: 'Play game',
  },
};

export const Secondary: Story = {
  args: {
    text: 'Back',
    variant: 'secondary',
    disabled: false,
    ariaLabel: 'Back',
  },
};

export const DangerDisabled: Story = {
  args: {
    text: 'Delete',
    variant: 'danger',
    disabled: true,
    ariaLabel: 'Delete',
  },
};

export const ClickEventsDemo: Story = {
  args: {
    text: 'Click me',
    variant: 'primary',
    disabled: false,
    ariaLabel: 'Click me',
  },
  render: (args) => ({
    props: {
      ...args,
      clickCount: 0,
      lastClickType: '',
      onClick(event: MouseEvent) {
        this['clickCount'] = (this['clickCount'] as number) + 1;
        this['lastClickType'] = event.type;
      },
    },
    template: `
      <div style="display:grid; gap:0.75rem; min-width:16rem;">
        <lib-button
          ${argsToTemplate(args)}
          (click)="onClick($event)">
          {{ text }}
        </lib-button>
        <div style="font-family:monospace; font-size:0.85rem;">
          <div><strong>click count:</strong> {{ clickCount }}</div>
          <div><strong>last event:</strong> {{ lastClickType || '—' }}</div>
        </div>
      </div>
    `,
  }),
};
