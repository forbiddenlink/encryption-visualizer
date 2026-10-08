import { LessonHeader } from '@/components/learning/LessonHeader';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useExpandedSections } from '@/hooks/useExpandedSections';
import { useAutoAdvance } from '@/hooks/useAutoAdvance';
import { LearningResourceSchema } from '@/components/seo/JsonLd';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { padWithSteps } from '@/lib/crypto/padding';
import { useVisualizationStore } from '@/store/visualizationStore';
import type { PaddingStep, PaddingScheme } from '@/lib/types/padding';
import { Info, XCircle, Lightbulb, ExternalLink, Layers, Grid3X3 } from 'lucide-react';
import { QuizSystem } from '@/components/educational/QuizSystem';
import { paddingQuizQuestions } from '@/data/quizzes/paddingQuiz';
import { EducationalCard } from '@/components/educational/EducationalCard';
import { paddingEducationalContent } from '@/data/paddingEducationalContent';
import { m } from 'framer-motion';

// Inline Padding Visualizer
const PaddingVisualizer: React.FC<{ steps: PaddingStep[]; currentStep: number }> = ({ steps, currentStep }) => {
  if (steps.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="inline-block p-4 bg-violet-100 dark:bg-violet-500/20 rounded-2xl mb-4">
          <Layers className="w-12 h-12 text-violet-600 dark:text-violet-400" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Ready to Pad</h3>
        <p className="text-slate-600 dark:text-slate-400">
          Enter text above, select a padding scheme, and click "Apply Padding" to visualize the process
        </p>
      </div>
    );
  }

  const step = steps[currentStep];

  const getStepColor = (type: PaddingStep['type']) => {
    switch (type) {
      case 'input': return { bg: 'from-blue-600 to-indigo-500', text: 'text-blue-400', border: 'border-blue-500/30' };
      case 'measure': return { bg: 'from-violet-600 to-purple-500', text: 'text-violet-400', border: 'border-violet-500/30' };
      case 'calculate-padding': return { bg: 'from-amber-600 to-orange-500', text: 'text-amber-400', border: 'border-amber-500/30' };
      case 'apply-padding': return { bg: 'from-green-600 to-emerald-500', text: 'text-green-400', border: 'border-green-500/30' };
      case 'show-blocks': return { bg: 'from-cyan-600 to-teal-500', text: 'text-cyan-400', border: 'border-cyan-500/30' };
      case 'verify': return { bg: 'from-indigo-600 to-blue-500', text: 'text-indigo-400', border: 'border-indigo-500/30' };
      default: return { bg: 'from-gray-600 to-gray-500', text: 'text-gray-400', border: 'border-gray-500/30' };
    }
  };

  const stepColor = getStepColor(step.type);

  return (
    <div className="space-y-6">
      <m.div
        key={currentStep}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 40 }}
        className="glass-card p-6 space-y-4"
      >
        <div className="flex items-center gap-4">
          <div className={`p-4 bg-gradient-to-br ${stepColor.bg} rounded-2xl shadow-lg`}>
            {step.type === 'show-blocks' ? (
              <Grid3X3 className="w-7 h-7 text-white" strokeWidth={2.5} />
            ) : (
              <Layers className="w-7 h-7 text-white" strokeWidth={2.5} />
            )}
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{step.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">
              Step {step.stepNumber + 1} of {steps.length}
            </p>
          </div>
        </div>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{step.description}</p>
      </m.div>

      {/* Block visualization */}
      {step.blocks && step.blocks.length > 0 && (
        <div className="glass-card p-4 sm:p-6">
          <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wider">
            Block Layout
          </h4>
          <div className="space-y-3">
            {step.blocks.map((block, idx) => {
              const bytes = block.split(' ');
              return (
                <div key={idx} className="space-y-1">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Block {idx + 1}</div>
                  <div className="flex flex-wrap gap-1">
                    {bytes.map((byte, bIdx) => {
                      const isPadding = step.paddingBytes && bIdx >= bytes.length - step.paddingBytes.length &&
                        step.paddingBytes[bIdx - (bytes.length - step.paddingBytes.length)] !== undefined;
                      return (
                        <m.div
                          key={bIdx}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: bIdx * 0.02 }}
                          className={`w-10 h-10 flex items-center justify-center rounded-lg text-xs font-mono font-bold border-2 ${
                            isPadding
                              ? 'bg-violet-100 dark:bg-violet-500/20 border-violet-400 dark:border-violet-500/50 text-violet-700 dark:text-violet-300'
                              : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {byte}
                        </m.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded" />
              <span className="text-slate-500 dark:text-slate-400">Data</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-violet-100 dark:bg-violet-500/20 border-2 border-violet-400 dark:border-violet-500/50 rounded" />
              <span className="text-slate-500 dark:text-slate-400">Padding</span>
            </div>
          </div>
        </div>
      )}

      {/* Padding bytes highlight */}
      {step.paddingBytes && step.type === 'calculate-padding' && (
        <div className="glass-card p-4 sm:p-6">
          <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">
            Padding Bytes
          </h4>
          <div className="flex flex-wrap gap-1">
            {step.paddingBytes.map((byte, idx) => (
              <m.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="w-12 h-12 flex items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-500/20 border-2 border-violet-400 dark:border-violet-500/50 text-sm font-mono font-bold text-violet-700 dark:text-violet-300"
              >
                {byte.toString(16).padStart(2, '0')}
              </m.div>
            ))}
          </div>
        </div>
      )}

      {/* Values Display */}
      {step.values && Object.keys(step.values).length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(step.values).map(([key, value]) => (
            <m.div
              key={key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="glass-card p-4"
            >
              <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase mb-2">{key}</div>
              <div className={`text-sm font-mono font-bold ${stepColor.text} break-all`}>
                {typeof value === 'string' && value.length > 60 ? `${value.slice(0, 60)}...` : String(value)}
              </div>
            </m.div>
          ))}
        </div>
      )}
    </div>
  );
};

export const PaddingPage = () => {
  const location = useLocation();

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

  const [input, setInput] = useState('Hello, World!');
  const [blockSize, setBlockSize] = useState(16);
  const [scheme, setScheme] = useState<PaddingScheme>('pkcs7');
  const { expandedSections, toggleSection } = useExpandedSections(['whyPaddingMatters', 'pkcs7']);

  const paddingSteps = steps as unknown as PaddingStep[];

  const handleApply = () => {
    const newSteps = padWithSteps(input, blockSize, scheme);
    setSteps(newSteps as any);
    reset();
    play();
  };

  useAutoAdvance(steps.length);

  return (
    <>
      <LearningResourceSchema
        name="Padding Schemes Visualizer - Learn PKCS#7, Zero, ANSI X.923"
        description="Interactive visualization of block cipher padding schemes. See how PKCS#7, Zero Padding, and ANSI X.923 fill data blocks for encryption."
        url={`https://cryptoviz.app${location.pathname}`}
        learningResourceType="Interactive simulation"
        keywords={['padding', 'PKCS#7', 'zero padding', 'ANSI X.923', 'block cipher', 'padding oracle']}
      />
      <div className="space-y-6 sm:space-y-8">
        <LessonHeader slug="padding" title="Padding Schemes Visualizer" description="See how padding aligns data to block boundaries for encryption" />

      {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Input Panel */}
            <div className="glass-card p-4 sm:p-6 space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Padding Input</h3>
              <div className="space-y-3">
                <div>
                  <label htmlFor="padding-field-1" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Input Text</label>
                  <input id="padding-field-1"
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="Enter text to pad..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p id="padding-block-size" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Block Size</p>
                    <div className="flex gap-2" role="group" aria-labelledby="padding-block-size">
                      {[8, 16].map((size) => (
                        <button
                          key={size}
                          onClick={() => setBlockSize(size)}
                          aria-pressed={blockSize === size}
                          className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                            blockSize === size
                              ? 'bg-violet-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {size} bytes
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="padding-field-2" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Scheme</label>
                    <select id="padding-field-2"
                      value={scheme}
                      onChange={(e) => setScheme(e.target.value as PaddingScheme)}
                      className="w-full bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                      <option value="pkcs7">PKCS#7</option>
                      <option value="zero">Zero Padding</option>
                      <option value="ansi-x923">ANSI X.923</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleApply}
                  disabled={!input}
                  className="px-6 py-3 bg-violet-600 rounded-2xl text-white font-bold hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Layers className="w-5 h-5" />
                  Apply Padding
                </button>
              </div>
            </div>

            {/* Playback Controls */}
            {steps.length > 0 && (
              <div className="glass-card p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-violet-600 transition-all duration-300"
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
                      <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-violet-600 dark:text-violet-400" />
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
                      className="px-6 sm:px-8 py-3 sm:py-4 bg-violet-600 rounded-2xl text-white font-bold hover:scale-105 active:scale-95 transition-all"
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
                              ? 'bg-violet-600 text-white'
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
              <PaddingVisualizer steps={paddingSteps} currentStep={currentStep} />
            </ErrorBoundary>
          </div>

          {/* Right Column: Educational Content */}
          <div id="lesson-notes" className="lesson-notes lg:col-span-1 space-y-4" tabIndex={-1}>
            {/* Why Padding Matters */}
            <EducationalCard
              title={paddingEducationalContent.whyPaddingMatters.title}
              isExpanded={expandedSections.has('whyPaddingMatters')}
              onToggle={() => toggleSection('whyPaddingMatters')}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-violet-100 dark:bg-violet-500/20 rounded-lg">
                  <Info className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {paddingEducationalContent.whyPaddingMatters.content}
                </p>
              </div>
            </EducationalCard>

            {/* PKCS#7 */}
            <EducationalCard
              title={paddingEducationalContent.pkcs7.title}
              isExpanded={expandedSections.has('pkcs7')}
              onToggle={() => toggleSection('pkcs7')}
            >
              <div className="space-y-3">
                {paddingEducationalContent.pkcs7.items.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-white/5 p-3 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{item.name}</h4>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{item.description}</p>
                  </div>
                ))}
              </div>
            </EducationalCard>

            {/* Zero Padding */}
            <EducationalCard
              title={paddingEducationalContent.zeroPadding.title}
              isExpanded={expandedSections.has('zeroPadding')}
              onToggle={() => toggleSection('zeroPadding')}
            >
              <div className="space-y-3">
                {paddingEducationalContent.zeroPadding.items.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-white/5 p-3 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{item.name}</h4>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{item.description}</p>
                  </div>
                ))}
              </div>
            </EducationalCard>

            {/* ANSI X.923 */}
            <EducationalCard
              title={paddingEducationalContent.ansiX923.title}
              isExpanded={expandedSections.has('ansiX923')}
              onToggle={() => toggleSection('ansiX923')}
            >
              <div className="space-y-3">
                {paddingEducationalContent.ansiX923.items.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-white/5 p-3 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{item.name}</h4>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{item.description}</p>
                  </div>
                ))}
              </div>
            </EducationalCard>

            {/* Padding Oracle */}
            <EducationalCard
              title={paddingEducationalContent.paddingOracle.title}
              isExpanded={expandedSections.has('paddingOracle')}
              onToggle={() => toggleSection('paddingOracle')}
            >
              <div className="space-y-3">
                {paddingEducationalContent.paddingOracle.items.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-white/5 p-3 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{item.name}</h4>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{item.description}</p>
                  </div>
                ))}
              </div>
            </EducationalCard>

            {/* When NOT to Pad */}
            <EducationalCard
              title={paddingEducationalContent.whenNotToPad.title}
              isExpanded={expandedSections.has('whenNotToPad')}
              onToggle={() => toggleSection('whenNotToPad')}
            >
              <div className="space-y-2">
                {paddingEducationalContent.whenNotToPad.list.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-white/5 p-3 rounded-xl">
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-1">{item.name}</h4>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400">{item.detail}</p>
                  </div>
                ))}
              </div>
            </EducationalCard>

            {/* Common Mistakes */}
            <EducationalCard
              title={paddingEducationalContent.commonMistakes.title}
              isExpanded={expandedSections.has('commonMistakes')}
              onToggle={() => toggleSection('commonMistakes')}
            >
              <div className="space-y-3">
                {paddingEducationalContent.commonMistakes.mistakes.map((mistake, idx) => (
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
              title={paddingEducationalContent.furtherLearning.title}
              isExpanded={expandedSections.has('furtherLearning')}
              onToggle={() => toggleSection('furtherLearning')}
            >
              <div className="space-y-2">
                {paddingEducationalContent.furtherLearning.resources.map((resource, idx) => (
                  <a
                    key={idx}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-white/5 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-cyber-surface transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                        {resource.type}
                      </span>
                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-violet-500 transition-colors" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">{resource.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{resource.description}</p>
                  </a>
                ))}
              </div>
            </EducationalCard>

            {/* Interactive Quiz */}
            <QuizSystem questions={paddingQuizQuestions} title="Padding Knowledge Check" algorithmId="padding" />
          </div>
        </div>
      </div>
    </>
  );
};
