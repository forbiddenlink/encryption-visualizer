import { fileURLToPath } from 'node:url';
const app = fileURLToPath(new URL('../encryption-visualizer/', import.meta.url));
export default {
  root: app,
  resolve: { alias: { '@': `${app}src` } },
  test: { globals: true, environment: 'happy-dom', setupFiles: `${app}src/test/setup.ts`, exclude: ['**/node_modules/**', '**/dist/**', '**/.pnpm-store/**', '**/e2e/**'], pool: 'threads', maxWorkers: 1 },
};
