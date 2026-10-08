import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from '@/App';
import { HomePage } from '@/pages/HomePage';
import { ROUTES } from './routes';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

const AESPage = lazy(() => import('@/pages/AESPage').then(m => ({ default: m.AESPage })));
const RSAPage = lazy(() => import('@/pages/RSAPage').then(m => ({ default: m.RSAPage })));
const ECCPage = lazy(() => import('@/pages/ECCPage').then(m => ({ default: m.ECCPage })));
const BlockModesPage = lazy(() => import('@/pages/BlockModesPage').then(m => ({ default: m.BlockModesPage })));
const DiffieHellmanPage = lazy(() => import('@/pages/DiffieHellmanPage').then(m => ({ default: m.DiffieHellmanPage })));
const HashingPage = lazy(() => import('@/pages/HashingPage').then(m => ({ default: m.HashingPage })));
const HMACPage = lazy(() => import('@/pages/HMACPage').then(m => ({ default: m.HMACPage })));
const SignaturesPage = lazy(() => import('@/pages/SignaturesPage').then(m => ({ default: m.SignaturesPage })));
const PaddingPage = lazy(() => import('@/pages/PaddingPage').then(m => ({ default: m.PaddingPage })));
const PasswordHashingPage = lazy(() => import('@/pages/PasswordHashingPage').then(m => ({ default: m.PasswordHashingPage })));
const TLSPage = lazy(() => import('@/pages/TLSPage').then(m => ({ default: m.TLSPage })));
const CryptanalysisPage = lazy(() => import('@/pages/CryptanalysisPage').then(m => ({ default: m.CryptanalysisPage })));
const ComparePage = lazy(() => import('@/pages/ComparePage').then(m => ({ default: m.ComparePage })));
const LearningPathsPage = lazy(() => import('@/pages/LearningPathsPage').then(m => ({ default: m.LearningPathsPage })));
const GlossaryPage = lazy(() => import('@/pages/GlossaryPage').then(m => ({ default: m.GlossaryPage })));
const AboutPage = lazy(() => import('@/pages/AboutPage').then(m => ({ default: m.AboutPage })));

function LazyPage({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary variant="lesson"><Suspense fallback={<div role="status" className="flex flex-col gap-4 items-center justify-center lesson-loading"><div aria-hidden="true" className="w-8 h-8 border-2 border-cyber-cyan border-t-transparent rounded-full motion-safe:animate-spin" /><p className="eyebrow">Loading your lesson…</p></div>}>
      {children}
    </Suspense></ErrorBoundary>
  );
}

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: ROUTES.AES.slice(1), element: <LazyPage><AESPage /></LazyPage> },
      { path: ROUTES.RSA.slice(1), element: <LazyPage><RSAPage /></LazyPage> },
      { path: ROUTES.ECC.slice(1), element: <LazyPage><ECCPage /></LazyPage> },
      { path: ROUTES.BLOCK_MODES.slice(1), element: <LazyPage><BlockModesPage /></LazyPage> },
      { path: ROUTES.DIFFIE_HELLMAN.slice(1), element: <LazyPage><DiffieHellmanPage /></LazyPage> },
      { path: ROUTES.HASHING.slice(1), element: <LazyPage><HashingPage /></LazyPage> },
      { path: ROUTES.HMAC.slice(1), element: <LazyPage><HMACPage /></LazyPage> },
      { path: ROUTES.SIGNATURES.slice(1), element: <LazyPage><SignaturesPage /></LazyPage> },
      { path: ROUTES.PADDING.slice(1), element: <LazyPage><PaddingPage /></LazyPage> },
      { path: ROUTES.PASSWORD_HASHING.slice(1), element: <LazyPage><PasswordHashingPage /></LazyPage> },
      { path: ROUTES.TLS.slice(1), element: <LazyPage><TLSPage /></LazyPage> },
      { path: ROUTES.CRYPTANALYSIS.slice(1), element: <LazyPage><CryptanalysisPage /></LazyPage> },
      { path: ROUTES.COMPARE.slice(1), element: <LazyPage><ComparePage /></LazyPage> },
      { path: ROUTES.LEARNING_PATHS.slice(1), element: <LazyPage><LearningPathsPage /></LazyPage> },
      { path: ROUTES.GLOSSARY.slice(1), element: <LazyPage><GlossaryPage /></LazyPage> },
      { path: ROUTES.ABOUT.slice(1), element: <LazyPage><AboutPage /></LazyPage> },
    ],
  },
]);
