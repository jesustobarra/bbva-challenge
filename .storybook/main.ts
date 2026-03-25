import type { StorybookConfig } from '@storybook/web-components-vite';

const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../fake-lib-components/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: ['@storybook/addon-docs', '@chromatic-com/storybook'],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
  previewHead: (head) => `
    ${head}
        <script src="https://kit.fontawesome.com/4089712744.js" crossorigin="anonymous"></script>
`,
};

export default config;
