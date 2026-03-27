import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { argsToTemplate, moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { TableRowComponent } from './table-row';

type LibTableRowCustomArgs = TableRowComponent & { cells?: string[] };

const meta: Meta<LibTableRowCustomArgs> = {
  title: 'WebComponents/TableRow',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }),
  ],
  argTypes: {
    cells: { control: 'object', description: 'Cell values in column order' },
  },
  parameters: {
    docs: {
      description: {
        component: `
Generic row WebComponent rendered by \`<lib-table>\`.

## Usage
\`\`\`html
<lib-table-row .cells="\${['1', 'Alice', '25']}"></lib-table-row>
\`\`\`
        `,
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `<div style="max-width:28rem;"><lib-table-row ${argsToTemplate(args)}></lib-table-row></div>`,
  }),
};

export default meta;
type Story = StoryObj<LibTableRowCustomArgs>;

export const Default: Story = {
  args: {
    cells: ['1', 'Alice', '25'],
  },
};

export const LongCells: Story = {
  args: {
    cells: ['12', 'Nombre-muy-largo-para-probar-elipsis', '999'],
  },
};
