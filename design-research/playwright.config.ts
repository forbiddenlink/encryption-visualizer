import config from '../encryption-visualizer/playwright.config';

// Use the installed browser without depending on a locally cached revision.
export default {
  ...config,
  testDir: '../encryption-visualizer/e2e',
  outputDir: './browser-results',
  webServer: { ...config.webServer, cwd: '../encryption-visualizer' },
  projects: config.projects?.map((project) => ({ ...project, use: { ...project.use, channel: 'chrome' } })),
};
