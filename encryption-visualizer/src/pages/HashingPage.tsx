import { LessonHeader } from '@/components/learning/LessonHeader';
import { SpeedControl } from '@/components/controls/SpeedControl';
import { useLocation } from 'react-router-dom';
import { useExpandedSections } from '@/hooks/useExpandedSections';
import { useAutoAdvance } from '@/hooks/useAutoAdvance';
import { HashInputPanel } from '@/components/visualizations/Hash/HashInputPanel';
import { LearningResourceSchema } from '@/components/seo/JsonLd';
import { algorithmSchemas } from '@/data/structuredData';
import { HashVisualizer } from '@/components/visualizations/Hash/HashVisualizer';
import { AvalancheEffectDemo } from '@/components/visualizations/Hash/AvalancheEffectDemo';
import { HashPlayground } from '@/components/visualizations/Hash/HashPlayground';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { useVisualizationStore } from '@/store/visualizationStore';
import { sha256WithSteps, MAX_SHA256_TRACE_BYTES } from '@/lib/crypto/sha256';
import type { HashStep } from '@/lib/types';
import { } from 'lucide-react';
import { QuizSystem } from '@/components/educational/QuizSystem';
import { hashingQuizQuestions } from '@/data/quizzes/hashingQuiz';
import { EducationalCard } from '@/components/educational/EducationalCard';
import { hashingEducationalContent } from '@/data/hashingEducationalContent';
import { Info, Link, Lock, FileText, Globe, XCircle, Lightbulb, ExternalLink } from 'lucide-react';

const iconMap = {
  info: Info,
  lock: Lock,
  file: FileText,
  link: Link,
};

export const HashingPage = () => {
  const location = useLocation();
  const schemaData = algorithmSchemas.hashing;

  // Use global visualization store for playback state
  const {
    steps,
    currentStep,
    isPlaying,
    setSteps,
    setCurrentStep,
    play,
    pause,
    reset,
  } = useVisualizationStore();

  // Cast steps to HashStep[] for type safety in this component
  const hashSteps = steps as HashStep[];

  const { expandedSections, toggleSection } = useExpandedSections(['whatIsHashing', 'properties']);

  const handleHash = (input: string) => {
    if (new TextEncoder().encode(input).length > MAX_SHA256_TRACE_BYTES) return;
    const newSteps = sha256WithSteps(input);
    setSteps(newSteps);
    reset();
    play();
  };

  // Auto-advance steps when playing
  useAutoAdvance(steps.length);

  return (
    <>
    <LearningResourceSchema
      {...schemaData}
      url={`https://cryptoviz.app${location.pathname}`}
    />
    <div className="space-y-8">
      <LessonHeader slug="hashing" title="Hash Functions Visualizer" description="Explore one-way functions and the avalanche effect" />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
         {/* Left Column: Input & Visualization */}
         <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          {/* Input Panel */}
          <HashInputPanel onHash={handleHash} />

      {/* Playback Controls */}
      {hashSteps.length > 0 && (
        <div className="glass-card p-6 space-y-4">
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 transition-all duration-300"
              style={{ width: `${((currentStep + 1) / hashSteps.length) * 100}%` }}
            />
          </div>

          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={reset}
                aria-label="Go to first step"
                className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all"
              >
                ⏮️
              </button>
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                aria-label="Previous step"
                className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all disabled:opacity-30"
              >
                ◀️
              </button>
              <button
                onClick={() => (isPlaying ? pause() : play())}
                aria-label={isPlaying ? 'Pause visualization' : 'Play visualization'}
                className="px-8 py-3 bg-emerald-600 rounded-2xl text-white font-bold hover:scale-105 transition-all"
              >
                {isPlaying ? '⏸️ Pause' : '▶️ Play'}
              </button>
              <button
                onClick={() => setCurrentStep(Math.min(hashSteps.length - 1, currentStep + 1))}
                disabled={currentStep >= hashSteps.length - 1}
                aria-label="Next step"
                className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all disabled:opacity-30"
              >
                ▶️
              </button>
            </div>

            <div className="text-sm font-mono text-slate-500 dark:text-slate-400">
              Step {currentStep + 1} / {hashSteps.length}
            </div>
          </div>
          <label htmlFor="hash-step" className="text-sm font-semibold text-slate-600 dark:text-slate-400 block">
            Jump to step
          </label>
          <select
            id="hash-step"
            value={currentStep}
            onChange={(event) => {
              pause();
              setCurrentStep(Number(event.target.value));
            }}
            className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
          >
            {hashSteps.map((step, index) => (
              <option key={index} value={index}>{index + 1}. {step.title}</option>
            ))}
          </select>
          <SpeedControl />
        </div>
      )}

      {/* Visualizer */}
      <ErrorBoundary>
        <HashVisualizer steps={hashSteps} currentStep={currentStep} />
      </ErrorBoundary>

          {/* Avalanche Effect Demo */}
          <AvalancheEffectDemo />

          {/* Playground */}
          <HashPlayground />
        </div>

        {/* Right Column: Educational Content */}
        <div id="lesson-notes" className="lesson-notes lg:col-span-1 space-y-4" tabIndex={-1}>
          {/* What is Hashing? */}
          <EducationalCard
            title={hashingEducationalContent.whatIsHashing.title}
            isExpanded={expandedSections.has('whatIsHashing')}
            onToggle={() => toggleSection('whatIsHashing')}
          >
             <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg">
                <Info className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {hashingEducationalContent.whatIsHashing.content}
              </p>
            </div>
          </EducationalCard>

          {/* Properties */}
          <EducationalCard
             title={hashingEducationalContent.properties.title}
             isExpanded={expandedSections.has('properties')}
             onToggle={() => toggleSection('properties')}
          >
            <div className="space-y-3">
              {hashingEducationalContent.properties.items.map((item, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-white/5 p-3 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                     <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{item.name}</h4>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">{item.description}</p>
                </div>
              ))}
            </div>
          </EducationalCard>

          {/* Algorithms */}
          <EducationalCard
             title={hashingEducationalContent.algorithms.title}
             isExpanded={expandedSections.has('algorithms')}
             onToggle={() => toggleSection('algorithms')}
          >
              <div className="space-y-3">
              {hashingEducationalContent.algorithms.list.map((item, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-white/5 p-3 rounded-xl">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{item.name}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{item.detail}</p>
                </div>
              ))}
            </div>
          </EducationalCard>

          {/* Real World Use */}
           <EducationalCard
            title={hashingEducationalContent.realWorldUse.title}
            isExpanded={expandedSections.has('realWorld')}
            onToggle={() => toggleSection('realWorld')}
          >
            <div className="grid grid-cols-1 gap-2">
              {hashingEducationalContent.realWorldUse.examples.map((example, idx) => {
                const Icon = iconMap[example.icon as keyof typeof iconMap] || Globe;
                return (
                  <div key={idx} className="bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-white/5 p-3 rounded-xl flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg flex-shrink-0">
                        <Icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
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
            title={hashingEducationalContent.commonMistakes.title}
            isExpanded={expandedSections.has('commonMistakes')}
            onToggle={() => toggleSection('commonMistakes')}
          >
            <div className="space-y-3">
              {hashingEducationalContent.commonMistakes.mistakes.map((mistake, idx) => (
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
            title={hashingEducationalContent.furtherLearning.title}
            isExpanded={expandedSections.has('furtherLearning')}
            onToggle={() => toggleSection('furtherLearning')}
          >
            <div className="space-y-2">
              {hashingEducationalContent.furtherLearning.resources.map((resource, idx) => (
                <a
                  key={idx}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-white/5 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-cyber-surface transition-colors group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      {resource.type}
                    </span>
                    <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">{resource.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{resource.description}</p>
                </a>
              ))}
            </div>
          </EducationalCard>

          {/* Interactive Quiz */}
          <QuizSystem questions={hashingQuizQuestions} title="Hashing Knowledge Check" algorithmId="hashing" />
        </div>
      </div>
    </div>
  </>
  );
};
