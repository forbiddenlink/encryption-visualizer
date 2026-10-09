import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';
import { useVisualizationStore } from '@/store/visualizationStore';
function Controls() {
  useKeyboardShortcuts();
  return <><button>Answer</button><select aria-label="Algorithm"><option>AES</option></select><a href="#topic">Topic</a></>;
}
beforeEach(() => useVisualizationStore.setState({ currentStep: 0, totalSteps: 3, isPlaying: false }));
afterEach(cleanup);
describe('Playback keyboard scope', () => {
  it('preserves native keyboard actions on buttons, selects and links', () => {
    const view = render(<Controls />);
    for (const target of view.container.querySelectorAll('button,select,a')) {
      expect(fireEvent.keyDown(target, { code: 'Space', key: ' ' })).toBe(true);
      expect(useVisualizationStore.getState().isPlaying).toBe(false);
    }
  });
  it('plays from the background but leaves browser modifier shortcuts alone', () => {
    render(<Controls />);
    fireEvent.keyDown(document.body, { code: 'Space', key: ' ', ctrlKey: true });
    expect(useVisualizationStore.getState().isPlaying).toBe(false);
    fireEvent.keyDown(document.body, { code: 'Space', key: ' ' });
    expect(useVisualizationStore.getState().isPlaying).toBe(true);
  });
});
