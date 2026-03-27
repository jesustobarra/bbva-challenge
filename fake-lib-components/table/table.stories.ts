import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { argsToTemplate, moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { TableComponent } from './table';

type LibTableCustomArgs = TableComponent;

const meta: Meta<LibTableCustomArgs> = {
  title: 'WebComponents/Table',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }),
  ],
  argTypes: {
    columns: { control: 'object', description: 'Column labels in order' },
    rows: { control: 'object', description: 'Rows (cell strings) aligned with columns' },
    emptyLabel: { control: 'text', description: 'Text displayed when there are no rows' },
  },
  parameters: {
    docs: {
      description: {
        component: `
Generic table WebComponent that renders a header plus body rows.

## Usage
\`\`\`html
<lib-table
  .columns="\${['#', 'Jugador', 'Récord']}"
  .rows="\${[
    ['1', 'alice', '10'],
    ['2', 'bob', '5'],
  ]}">
</lib-table>
\`\`\`
        `,
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `<div style="max-width:28rem;"><lib-table ${argsToTemplate(args)}></lib-table></div>`,
  }),
};

export default meta;
type Story = StoryObj<LibTableCustomArgs>;

export const Default: Story = {
  args: {
    columns: ['#', 'Jugador', 'Récord'],
    rows: [
      ['1', 'bob', '25'],
      ['2', 'alice', '10'],
      ['3', 'nora', '3'],
    ],
    emptyLabel: 'Sin datos',
  },
};

export const Empty: Story = {
  args: {
    columns: ['#', 'Jugador', 'Récord'],
    rows: [],
    emptyLabel: 'Aún no hay partidas guardadas',
  },
};

export const ManyRows: Story = {
  args: {
    columns: ['#', 'Jugador', 'Récord'],
    rows: Array.from({ length: 12 }, (_, i) => [String(i + 1), `player-${i + 1}`, String(50 - i)]),
    emptyLabel: 'Sin datos',
  },
};

