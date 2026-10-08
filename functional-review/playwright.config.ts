import config from '../encryption-visualizer/playwright.config';

export default {
  ...config,
  testDir: '../encryption-visualizer/e2e',
  outputDir: './evidence/browser-results',
  webServer: { ...config.webServer, command: 'node ./node_modules/vite/bin/vite.js --host 127.0.0.1 --port 3002', cwd: '../encryption-visualizer' },
  projects: config.projects?.map((project) => ({ ...project, use: { ...project.use, channel: 'chrome' } })),
};
