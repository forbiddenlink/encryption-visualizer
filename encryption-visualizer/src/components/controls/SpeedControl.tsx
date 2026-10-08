import { useVisualizationStore } from '@/store/visualizationStore';

export const SpeedControl = () => {
  const speed = useVisualizationStore((state) => state.speed);
  const setSpeed = useVisualizationStore((state) => state.setSpeed);
  return (
    <div role="group" aria-label="Playback speed" className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-slate-600 dark:text-slate-400 mr-2">Speed</span>
      {[0.5, 1, 2, 4].map((value) => <button key={value} aria-pressed={speed === value} onClick={() => setSpeed(value)} className={`filter-button min-w-[44px] ${speed === value ? 'bg-cyber-blue text-white' : ''}`}>{value}x</button>)}
    </div>
  );
};
