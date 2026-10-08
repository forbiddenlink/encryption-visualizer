import { LessonHeader } from '@/components/learning/LessonHeader';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useExpandedSections } from '@/hooks/useExpandedSections';
import { useAutoAdvance } from '@/hooks/useAutoAdvance';
import { LearningResourceSchema } from '@/components/seo/JsonLd';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { hmacWithSteps } from '@/lib/crypto/hmac';
import { useVisualizationStore } from '@/store/visualizationStore';
import type { HMACStep } from '@/lib/types/hmac';
import { Info, CheckCircle, Globe, Terminal, FileText, XCircle, Lightbulb, ExternalLink, Shield, Hash, ArrowRight, Lock } from 'lucide-react';
import { QuizSystem } from '@/components/educational/QuizSystem';
import { hmacQuizQuestions } from '@/data/quizzes/hmacQuiz';
import { EducationalCard } from '@/components/educational/EducationalCard';
import { hmacEducationalContent } from '@/data/hmacEducationalContent';
import { m } from 'framer-motion';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  lock: Lock,
  file: FileText,
  link: Globe,
  globe: Globe,
  terminal: Terminal,
};

// Inline HMAC visualizer
const HMACVisualizer: React.FC<{ steps: HMACStep[]; currentStep: number }> = ({ steps, currentStep }) => {
  if (steps.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="inline-block p-4 bg-teal-100 dark:bg-teal-500/20 rounded-2xl mb-4">
          <Shield className="w-12 h-12 text-teal-600 dark:text-teal-400" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Ready to Compute HMAC</h3>
        <p className="text-slate-600 dark:text-slate-400">
          Enter a key and message above, then click "Compute HMAC" to see the two-pass hash construction
        </p>
      </div>
    );
  }

  const step = steps[currentStep];

  const getStepColor = (type: HMACStep['type']) => {
    switch (type) {
      case 'input': return { bg: 'from-blue-600 to-indigo-500', text: 'text-blue-400', border: 'border-blue-500/30' };
      case 'key-padding': return { bg: 'from-violet-600 to-purple-500', text: 'text-violet-400', border: 'border-violet-500/30' };
      case 'inner-hash': return { bg: 'from-teal-600 to-emerald-500', text: 'text-teal-400', border: 'border-teal-500/30' };
      case 'outer-hash': return { bg: 'from-amber-600 to-orange-500', text: 'text-amber-400', border: 'border-amber-500/30' };
      case 'output': return { bg: 'from-green-600 to-emerald-500', text: 'text-green-400', border: 'border-green-500/30' };
      case 'verify': return { bg: 'from-indigo-600 to-blue-500', text: 'text-indigo-400', border: 'border-indigo-500/30' };
      default: return { bg: 'from-gray-600 to-gray-500', text: 'text-gray-400', border: 'border-gray-500/30' };
    }
  };

  const getStepIcon = (type: HMACStep['type']) => {
    switch (type) {
      case 'input': return <FileText className="w-7 h-7 text-white" strokeWidth={2.5} />;
      case 'key-padding': return <Hash className="w-7 h-7 text-white" strokeWidth={2.5} />;
      case 'inner-hash': return <ArrowRight className="w-7 h-7 text-white" strokeWidth={2.5} />;
      case 'outer-hash': return <ArrowRight className="w-7 h-7 text-white" strokeWidth={2.5} />;
      case 'output': return <Shield className="w-7 h-7 text-white" strokeWidth={2.5} />;
      case 'verify': return <CheckCircle className="w-7 h-7 text-white" strokeWidth={2.5} />;
      default: return <Hash className="w-7 h-7 text-white" strokeWidth={2.5} />;
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
            {getStepIcon(step.type)}
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

      {/* Two-pass diagram for inner/outer hash steps */}
      {(step.type === 'inner-hash' || step.type === 'outer-hash' || step.type === 'output') && (
        <div className="glass-card p-4 sm:p-6">
          <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wider">
            HMAC Construction
          </h4>
          <div className="flex flex-col gap-3">
            <div className={`p-3 rounded-xl border-2 ${step.type === 'inner-hash' ? 'border-teal-500/50 bg-teal-50 dark:bg-teal-500/10' : 'border-slate-200 dark:border-slate-700'}`}>
              <div className="text-xs font-bold text-teal-600 dark:text-teal-400 mb-1">PASS 1: Inner Hash</div>
              <p className="text-xs font-mono text-slate-600 dark:text-slate-400">H( (Key XOR ipad) || message )</p>
            </div>
            <div className="flex justify-center">
              <ArrowRight className="w-4 h-4 text-slate-400 rotate-90" />
            </div>
            <div className={`p-3 rounded-xl border-2 ${step.type === 'outer-hash' ? 'border-amber-500/50 bg-amber-50 dark:bg-amber-500/10' : 'border-slate-200 dark:border-slate-700'}`}>
              <div className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-1">PASS 2: Outer Hash</div>
              <p className="text-xs font-mono text-slate-600 dark:text-slate-400">H( (Key XOR opad) || inner_hash )</p>
            </div>
            <div className="flex justify-center">
              <ArrowRight className="w-4 h-4 text-slate-400 rotate-90" />
            </div>
            <div className={`p-3 rounded-xl border-2 ${step.type === 'output' ? 'border-green-500/50 bg-green-50 dark:bg-green-500/10' : 'border-slate-200 dark:border-slate-700'}`}>
              <div className="text-xs font-bold text-green-600 dark:text-green-400 mb-1">HMAC Output</div>
              <p className="text-xs font-mono text-slate-600 dark:text-slate-400">Final authentication tag</p>
            </div>
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

export const HMACPage = () => {
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

  const [key, setKey] = useState('my-secret-key');
  const [message, setMessage] = useState('Hello, World!');
  const { expandedSections, toggleSection } = useExpandedSections(['whatIsHmac', 'whyNotJustHash']);

  const hmacSteps = steps as unknown as HMACStep[];

  const handleCompute = () => {
    const newSteps = hmacWithSteps(key, message);
    setSteps(newSteps);
    reset();
    play();
  };

  useAutoAdvance(steps.length);

  return (
    <>
      <LearningResourceSchema
        name="HMAC Visualizer - Learn Hash-based Message Authentication"
        description="Interactive visualization of HMAC construction. Watch the two-pass hash process that creates unforgeable message authentication codes."
        url={`https://cryptoviz.app${location.pathname}`}
        learningResourceType="Interactive simulation"
        keywords={['HMAC', 'message authentication code', 'hash', 'ipad', 'opad', 'integrity', 'authentication']}
      />
      <div className="space-y-6 sm:space-y-8">
        <LessonHeader slug="hmac" title="HMAC Visualizer" description="See how HMAC creates unforgeable message authentication codes" />

      {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Input Panel */}
            <div className="glass-card p-4 sm:p-6 space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">HMAC Inputs</h3>
              <div className="space-y-3">
                <div>
                  <label htmlFor="hmac-field-1" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Secret Key</label>
                  <input id="hmac-field-1"
                    type="text"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter secret key..."
                  />
                </div>
                <div>
                  <label htmlFor="hmac-field-2" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Message</label>
                  <textarea id="hmac-field-2"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full h-20 bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm font-mono text-slate-800 dark:text-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter message to authenticate..."
                  />
                </div>
                <button
                  onClick={handleCompute}
                  disabled={!key || !message}
                  className="px-6 py-3 bg-teal-600 rounded-2xl text-white font-bold hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Shield className="w-5 h-5" />
                  Compute HMAC
                </button>
              </div>
            </div>

            {/* Playback Controls */}
            {steps.length > 0 && (
              <div className="glass-card p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-600 transition-all duration-300"
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
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 dark:text-teal-400" />
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
                      className="px-6 sm:px-8 py-3 sm:py-4 bg-teal-600 rounded-2xl text-white font-bold hover:scale-105 active:scale-95 transition-all"
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
                              ? 'bg-teal-600 text-white'
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
              <HMACVisualizer steps={hmacSteps} currentStep={currentStep} />
            </ErrorBoundary>
          </div>

          {/* Right Column: Educational Content */}
          <div id="lesson-notes" className="lesson-notes lg:col-span-1 space-y-4" tabIndex={-1}>
            {/* What is HMAC? */}
            <EducationalCard
              title={hmacEducationalContent.whatIsHmac.title}
              isExpanded={expandedSections.has('whatIsHmac')}
              onToggle={() => toggleSection('whatIsHmac')}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-teal-100 dark:bg-teal-500/20 rounded-lg">
                  <Info className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {hmacEducationalContent.whatIsHmac.content}
                </p>
              </div>
            </EducationalCard>

            {/* Why Not Just Hash? */}
            <EducationalCard
              title={hmacEducationalContent.whyNotJustHash.title}
              isExpanded={expandedSections.has('whyNotJustHash')}
              onToggle={() => toggleSection('whyNotJustHash')}
            >
              <div className="space-y-3">
                {hmacEducationalContent.whyNotJustHash.items.map((item, idx) => (
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

            {/* Inner and Outer Hash */}
            <EducationalCard
              title={hmacEducationalContent.innerOuterHash.title}
              isExpanded={expandedSections.has('innerOuterHash')}
              onToggle={() => toggleSection('innerOuterHash')}
            >
              <div className="space-y-3">
                {hmacEducationalContent.innerOuterHash.items.map((item, idx) => (
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

            {/* HMAC vs Signatures */}
            <EducationalCard
              title={hmacEducationalContent.hmacVsSignatures.title}
              isExpanded={expandedSections.has('hmacVsSignatures')}
              onToggle={() => toggleSection('hmacVsSignatures')}
            >
              <div className="space-y-2">
                {hmacEducationalContent.hmacVsSignatures.list.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-white/5 p-3 rounded-xl">
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-1">{item.name}</h4>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400">{item.detail}</p>
                  </div>
                ))}
              </div>
            </EducationalCard>

            {/* Real-World Use */}
            <EducationalCard
              title={hmacEducationalContent.realWorldUse.title}
              isExpanded={expandedSections.has('realWorld')}
              onToggle={() => toggleSection('realWorld')}
            >
              <div className="grid grid-cols-1 gap-2">
                {hmacEducationalContent.realWorldUse.examples.map((example, idx) => {
                  const Icon = iconMap[example.icon] || Globe;
                  return (
                    <div key={idx} className="bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-white/5 p-3 rounded-xl flex items-center gap-3">
                      <div className="p-2 bg-teal-100 dark:bg-teal-500/20 rounded-lg flex-shrink-0">
                        <Icon className="w-4 h-4 text-teal-600 dark:text-teal-400" />
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
              title={hmacEducationalContent.commonMistakes.title}
              isExpanded={expandedSections.has('commonMistakes')}
              onToggle={() => toggleSection('commonMistakes')}
            >
              <div className="space-y-3">
                {hmacEducationalContent.commonMistakes.mistakes.map((mistake, idx) => (
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
              title={hmacEducationalContent.furtherLearning.title}
              isExpanded={expandedSections.has('furtherLearning')}
              onToggle={() => toggleSection('furtherLearning')}
            >
              <div className="space-y-2">
                {hmacEducationalContent.furtherLearning.resources.map((resource, idx) => (
                  <a
                    key={idx}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-white/5 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-cyber-surface transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                        {resource.type}
                      </span>
                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-teal-500 transition-colors" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">{resource.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{resource.description}</p>
                  </a>
                ))}
              </div>
            </EducationalCard>

            {/* Interactive Quiz */}
            <QuizSystem questions={hmacQuizQuestions} title="HMAC Knowledge Check" algorithmId="hmac" />
          </div>
        </div>
      </div>
    </>
  );
};
