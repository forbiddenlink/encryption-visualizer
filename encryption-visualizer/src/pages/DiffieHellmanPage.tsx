import { LessonHeader } from '@/components/learning/LessonHeader';
import { useExpandedSections } from '@/hooks/useExpandedSections';
import { useAutoAdvance } from '@/hooks/useAutoAdvance';
import { DHInputPanel } from '@/components/visualizations/DiffieHellman/DHInputPanel';
import { DHVisualizer } from '@/components/visualizations/DiffieHellman/DHVisualizer';
import { DHPlayground } from '@/components/visualizations/DiffieHellman/DHPlayground';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { generateDHKeyExchangeWithSteps } from '@/lib/crypto/diffie-hellman';
import { useVisualizationStore } from '@/store/visualizationStore';
import type { DHStep } from '@/lib/types';
import { Users, Info, AlertTriangle, CheckCircle, Globe, Terminal, FileText, XCircle, Lightbulb, ExternalLink } from 'lucide-react';
import { QuizSystem } from '@/components/educational/QuizSystem';
import { diffieHellmanQuizQuestions } from '@/data/quizzes/diffieHellmanQuiz';
import { EducationalCard } from '@/components/educational/EducationalCard';
import { diffieHellmanEducationalContent } from '@/data/diffieHellmanEducationalContent';

const iconMap = {
  info: Info,
  globe: Globe,
  terminal: Terminal,
  file: FileText,
};

export const DiffieHellmanPage = () => {
  // Use global visualization store for playback state
  const {
    steps,
    currentStep,
    isPlaying,
    speed,
    setSteps,
    play,
    pause,
    reset,
    nextStep,
    previousStep,
    setSpeed,
  } = useVisualizationStore();

  // DH-specific state
  const { expandedSections, toggleSection } = useExpandedSections(['whatIsDH', 'keyExchangeSteps']);

  // Cast steps to DHStep[] for type safety in this component
  const dhSteps = steps as DHStep[];

  const handleGenerate = (keySize: 'small' | 'medium' | 'large') => {
    const { steps: newSteps } = generateDHKeyExchangeWithSteps(keySize);
    setSteps(newSteps);
    reset();
    play();
  };

  // Auto-advance steps when playing
  useAutoAdvance(steps.length);

  return (
    <div className="space-y-6 sm:space-y-8">
      <LessonHeader slug="diffie-hellman" title="Diffie-Hellman Key Exchange" description="Watch how two parties establish a shared secret over an insecure channel" />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left Column: Input & Visualization */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          <DHInputPanel onGenerate={handleGenerate} />

          {/* Playback Controls */}
          {steps.length > 0 && (
            <div className="glass-card p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Progress Bar */}
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center sm:justify-start">
                  <button
                    onClick={reset}
                      aria-label="Reset visualization"
                    className="p-2 sm:p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95"
                  >
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400" />
                  </button>

                  <button
                    onClick={previousStep}
                    disabled={currentStep === 0}
                    aria-label="Previous step"
                    className="p-2 sm:p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300"
                  >
                    &larr;
                  </button>

                  <button
                    onClick={isPlaying ? pause : play}
                    className="px-6 sm:px-8 py-3 sm:py-4 bg-indigo-600 rounded-2xl text-white font-bold hover:scale-105 active:scale-95 transition-all"
                  >
                    {isPlaying ? 'Pause' : 'Play'}
                  </button>

                  <button
                    onClick={nextStep}
                    disabled={currentStep >= steps.length - 1}
                    aria-label="Next step"
                    className="p-2 sm:p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300"
                  >
                    &rarr;
                  </button>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 glass-card px-3 sm:px-4 py-2 sm:py-3">
                  <span className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">Speed</span>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {[0.5, 1, 2, 4].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSpeed(s)}
                        className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold transition-all ${
                          speed === s
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-center text-sm font-mono text-slate-500 dark:text-slate-400">
                Step {currentStep + 1} / {steps.length}
              </div>
            </div>
          )}

          {/* Visualizer */}
          <ErrorBoundary>
            <DHVisualizer steps={dhSteps} currentStep={currentStep} />
          </ErrorBoundary>

          {/* DH Playground */}
          <DHPlayground />
        </div>

        {/* Right Column: Educational Content */}
        <div id="lesson-notes" className="lesson-notes lg:col-span-1 space-y-4" tabIndex={-1}>
          {/* What is Diffie-Hellman? */}
          <EducationalCard
            title={diffieHellmanEducationalContent.whatIsDH.title}
            isExpanded={expandedSections.has('whatIsDH')}
            onToggle={() => toggleSection('whatIsDH')}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg">
                <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {diffieHellmanEducationalContent.whatIsDH.content}
              </p>
            </div>
          </EducationalCard>

          {/* Key Exchange Steps */}
          <EducationalCard
            title={diffieHellmanEducationalContent.keyExchangeSteps.title}
            isExpanded={expandedSections.has('keyExchangeSteps')}
            onToggle={() => toggleSection('keyExchangeSteps')}
          >
            <div className="space-y-3">
              {diffieHellmanEducationalContent.keyExchangeSteps.steps.map((step, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-white/5 p-3 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: step.color }}
                    />
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{step.name}</h4>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">{step.description}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 font-mono">{step.detail}</p>
                </div>
              ))}
            </div>
          </EducationalCard>

          {/* Security Notes */}
          <EducationalCard
            title={diffieHellmanEducationalContent.securityInfo.title}
            isExpanded={expandedSections.has('security')}
            onToggle={() => toggleSection('security')}
          >
            <div className="space-y-2">
              {diffieHellmanEducationalContent.securityInfo.notes.map((note, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  {note.type === 'strength' && <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />}
                  {note.type === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-500 dark:text-yellow-400 flex-shrink-0 mt-0.5" />}
                  {note.type === 'info' && <Info className="w-4 h-4 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5" />}
                  <p className="text-xs text-slate-600 dark:text-slate-300">{note.text}</p>
                </div>
              ))}
            </div>
          </EducationalCard>

          {/* Real-World Use */}
          <EducationalCard
            title={diffieHellmanEducationalContent.realWorldUse.title}
            isExpanded={expandedSections.has('realWorld')}
            onToggle={() => toggleSection('realWorld')}
          >
            <div className="grid grid-cols-1 gap-2">
              {diffieHellmanEducationalContent.realWorldUse.examples.map((example, idx) => {
                const Icon = iconMap[example.icon as keyof typeof iconMap] || Globe;
                return (
                  <div key={idx} className="bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-white/5 p-3 rounded-xl flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg flex-shrink-0">
                      <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-0.5">{example.name}</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">{example.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </EducationalCard>

          {/* Common Mistakes */}
          <EducationalCard
            title={diffieHellmanEducationalContent.commonMistakes.title}
            isExpanded={expandedSections.has('commonMistakes')}
            onToggle={() => toggleSection('commonMistakes')}
          >
            <div className="space-y-3">
              {diffieHellmanEducationalContent.commonMistakes.mistakes.map((mistake, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-white/5 p-3 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="w-4 h-4 text-red-500 dark:text-red-400 flex-shrink-0" />
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{mistake.mistake}</h4>
                  </div>
                  <p className="text-xs text-red-600 dark:text-red-400 mb-1">{mistake.why}</p>
                  <div className="flex items-start gap-1.5 mt-2">
                    <Lightbulb className="w-3 h-3 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-green-600 dark:text-green-400">{mistake.solution}</p>
                  </div>
                </div>
              ))}
            </div>
          </EducationalCard>

          {/* Further Learning */}
          <EducationalCard
            title={diffieHellmanEducationalContent.furtherLearning.title}
            isExpanded={expandedSections.has('furtherLearning')}
            onToggle={() => toggleSection('furtherLearning')}
          >
            <div className="space-y-2">
              {diffieHellmanEducationalContent.furtherLearning.resources.map((resource, idx) => (
                <a
                  key={idx}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-white/5 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-cyber-surface transition-colors group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      {resource.type}
                    </span>
                    <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">{resource.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{resource.description}</p>
                </a>
              ))}
            </div>
          </EducationalCard>

          {/* Interactive Quiz */}
          <QuizSystem questions={diffieHellmanQuizQuestions} title="Diffie-Hellman Knowledge Check" algorithmId="diffie-hellman" />
        </div>
      </div>
    </div>
  );
};
