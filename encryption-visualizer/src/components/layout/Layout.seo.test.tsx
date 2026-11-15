import { afterEach, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Layout } from './Layout';

afterEach(cleanup);

function renderAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Layout>
        <p>content</p>
      </Layout>
    </MemoryRouter>,
  );
}

const canonical = () => document.head.querySelector('link[rel="canonical"]')?.getAttribute('href');
const description = () => document.head.querySelector('meta[name="description"]')?.getAttribute('content');

it('sets a route specific title, description and canonical', () => {
  renderAt('/aes');
  expect(document.title).toBe('AES Encryption | CryptoViz');
  expect(canonical()).toBe('https://encryption-visualizer-zeta.vercel.app/aes');
  expect(description()).toMatch(/AES/);
});

it('differs between routes', () => {
  renderAt('/rsa');
  expect(document.title).toBe('RSA Encryption | CryptoViz');
  expect(canonical()).toBe('https://encryption-visualizer-zeta.vercel.app/rsa');
});

it('drops the canonical on unknown routes', () => {
  renderAt('/definitely-not-a-page');
  expect(document.title).toBe('Page not found | CryptoViz');
  expect(canonical()).toBeUndefined();
});
