import type { StorybookConfig } from '@storybook/nextjs-vite';

const config: StorybookConfig = {
  core: {
    disableWhatsNewNotifications: true,
    disableTelemetry: true,
  },
  stories: ['../components/**/*.(stories|story).@(js|jsx|ts|tsx)'],
  addons: ['storybook-dark-mode'],
  framework: {
    name: '@storybook/nextjs-vite',
    options: {},
  },
};
export default config;
