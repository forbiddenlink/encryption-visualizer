import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { LazyMotion } from 'framer-motion'
import { registerSW } from 'virtual:pwa-register'
import { motionFeatures } from './lib/motionFeatures'
import { router } from './router'
import './index.css'

// Keep first paint ahead of the full offline precache download.
function enableOfflineCache(): void {
  window.setTimeout(() => { registerSW({ immediate: true }); }, 3000);
}
if (document.readyState === 'complete') enableOfflineCache();
else window.addEventListener('load', enableOfflineCache, { once: true });

// Initialize optional analytics after the interface is ready; local previews stay local.
async function initializeAnalytics(): Promise<void> {
  const { default: posthog } = await import('posthog-js');
  posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://us.posthog.com',
    capture_pageview: true,
    capture_pageleave: true,
  });
}
if (import.meta.env.VITE_POSTHOG_KEY && !['localhost', '127.0.0.1'].includes(location.hostname)) {
  window.setTimeout(() => { void initializeAnalytics(); }, 1500);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LazyMotion features={motionFeatures} strict>
      <RouterProvider router={router} />
    </LazyMotion>
  </StrictMode>,
)
