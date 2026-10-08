import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { InstallPrompt } from './InstallPrompt';
import { ErrorBoundary } from './ErrorBoundary';
import { ThemeToggle } from './ThemeToggle';
import { Header } from '../layout/Header';
import { ScrollToTop } from '../layout/ScrollToTop';
import { useThemeStore } from '@/store/themeStore';
import { useVisualizationStore, type VisualizationSteps } from '@/store/visualizationStore';

afterEach(() => { cleanup(); vi.restoreAllMocks(); });
beforeEach(() => { localStorage.clear(); useVisualizationStore.getState().setSteps([]); });

describe('integration recovery', () => {
  it('offers honest reload and home recovery for a rejected lazy lesson', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const UnavailableLesson = lazy(async () => { throw new Error('Lesson download failed'); });
    render(<><nav aria-label="Available navigation">Navigate</nav><ErrorBoundary variant="lesson"><Suspense fallback="Loading"><UnavailableLesson /></Suspense></ErrorBoundary></>);
    expect(await screen.findByRole('heading', { name: 'This lesson could not load' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Available navigation' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reload lesson' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Return home' })).toHaveAttribute('href', '/');
    expect(screen.queryByRole('button', { name: 'Try Again' })).not.toBeInTheDocument();
  });

  it('removes the install action after dismissing the native prompt', async () => {
    render(<InstallPrompt />);
    const prompt = vi.fn().mockResolvedValue(undefined);
    const event = Object.assign(new Event('beforeinstallprompt', { cancelable: true }), {
      prompt, userChoice: Promise.resolve({ outcome: 'dismissed' }),
    });
    fireEvent(window, event);
    fireEvent.click(screen.getByRole('button', { name: 'Install' }));
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Install' })).not.toBeInTheDocument());
    expect(prompt).toHaveBeenCalledOnce();
  });

  it('clears failed temporary frames through Try Again and allows a fresh run', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    function Frame(): React.ReactNode {
      const steps = useVisualizationStore((state) => state.steps);
      if (steps.length) throw new Error('Malformed frame');
      return <p>Ready to generate a new run</p>;
    }
    useVisualizationStore.setState({ steps: [{ state: null, type: 'initial' }] as unknown as VisualizationSteps, currentStep: 2, isPlaying: true });
    render(<ErrorBoundary><Frame /></ErrorBoundary>);
    fireEvent.click(screen.getByRole('button', { name: 'Try Again' }));
    expect(screen.getByText('Ready to generate a new run')).toBeInTheDocument();
    expect(useVisualizationStore.getState()).toMatchObject({ steps: [], currentStep: 0, totalSteps: 0, isPlaying: false });
  });

  it('supports radio arrow navigation, wrapping and one tab stop', () => {
    useThemeStore.getState().setTheme('dark');
    render(<ThemeToggle />);
    const dark = screen.getByRole('radio', { name: 'Dark mode' });
    const system = screen.getByRole('radio', { name: 'System theme' });
    const light = screen.getByRole('radio', { name: 'Light mode' });
    expect(dark).toHaveAttribute('tabindex', '0');
    expect(light).toHaveAttribute('tabindex', '-1');
    dark.focus();
    fireEvent.keyDown(dark, { key: 'ArrowRight' });
    expect(system).toHaveFocus();
    expect(system).toHaveAttribute('aria-checked', 'true');
    fireEvent.keyDown(system, { key: 'ArrowDown' });
    expect(light).toHaveFocus();
    expect(light).toHaveAttribute('aria-checked', 'true');
    fireEvent.keyDown(light, { key: 'ArrowLeft' });
    expect(system).toHaveFocus();
  });

  it('closes mobile navigation when selecting the current lesson', () => {
    const { container } = render(<MemoryRouter initialEntries={['/aes']}><Header /></MemoryRouter>);
    const menu = container.querySelector('details.mobile-menu')!;
    menu.setAttribute('open', '');
    const nav = screen.getByRole('navigation', { name: 'Mobile navigation' });
    fireEvent.click(nav.querySelector('a[href="/aes"]')!);
    expect(menu).not.toHaveAttribute('open');
  });

  it('lands on a hash target without animation when reduced motion is requested', async () => {
    vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({ matches: query.includes('prefers-reduced-motion'), addEventListener: vi.fn(), removeEventListener: vi.fn() }) as unknown as MediaQueryList);
    const scroll = vi.fn();
    vi.spyOn(window, 'scrollTo').mockImplementation(scroll);
    render(<MemoryRouter initialEntries={['/#topics']}><ScrollToTop /><section id="topics">Catalog</section></MemoryRouter>);
    await waitFor(() => expect(scroll).toHaveBeenCalledWith({ behavior: 'instant', top: 0 }));
  });
});
