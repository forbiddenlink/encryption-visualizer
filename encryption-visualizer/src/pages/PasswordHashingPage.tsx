import { LessonHeader } from '@/components/learning/LessonHeader';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useExpandedSections } from '@/hooks/useExpandedSections';
import { useAutoAdvance } from '@/hooks/useAutoAdvance';
import { LearningResourceSchema } from '@/components/seo/JsonLd';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { passwordHashWithSteps } from '@/lib/crypto/password-hashing';
import { useVisualizationStore } from '@/store/visualizationStore';
import type { PasswordHashStep } from '@/lib/types/password-hashing';
import { KeyStretchDemo } from '@/components/visualizations/KeyDerivation/KeyStretchDemo';
import { Info, CheckCircle, Globe, FileText, XCircle, Lightbulb, ExternalLink, Lock, Hash, Repeat, Timer } from 'lucide-react';
import { QuizSystem } from '@/components/educational/QuizSystem';
import { passwordHashingQuizQuestions } from '@/data/quizzes/passwordHashingQuiz';
import { EducationalCard } from '@/components/educational/EducationalCard';
import { passwordHashingEducationalContent } from '@/data/passwordHashingEducationalContent';
import { m } from 'framer-motion';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  lock: Lock,
  file: FileText,
  link: Globe,
};

// Inline Password Hash Visualizer
const PasswordHashVisualizer: React.FC<{ steps: PasswordHashStep[]; currentStep: number }> = ({ steps, currentStep }) => {
  if (steps.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="inline-block p-4 bg-rose-100 dark:bg-rose-500/20 rounded-2xl mb-4">
          <Lock className="w-12 h-12 text-rose-600 dark:text-rose-400" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Ready to Hash</h3>
        <p className="text-slate-600 dark:text-slate-400">
          Enter a password and select a cost factor, then click "Hash Password" to see key stretching in action
        </p>
      </div>
    );
  }

  const step = steps[currentStep];

  const getStepColor = (type: PasswordHashStep['type']) => {
    switch (type) {
      case 'input': return { bg: 'from-blue-600 to-indigo-500', text: 'text-blue-400', border: 'border-blue-500/30' };
      case 'generate-salt': return { bg: 'from-amber-600 to-orange-500', text: 'text-amber-400', border: 'border-amber-500/30' };
      case 'combine': return { bg: 'from-violet-600 to-purple-500', text: 'text-violet-400', border: 'border-violet-500/30' };
      case 'iterate': return { bg: 'from-red-600 to-pink-500', text: 'text-red-400', border: 'border-red-500/30' };
      case 'stretch': return { bg: 'from-rose-600 to-red-500', text: 'text-rose-400', border: 'border-rose-500/30' };
      case 'output': return { bg: 'from-green-600 to-emerald-500', text: 'text-green-400', border: 'border-green-500/30' };
      case 'verify': return { bg: 'from-indigo-600 to-blue-500', text: 'text-indigo-400', border: 'border-indigo-500/30' };
      default: return { bg: 'from-gray-600 to-gray-500', text: 'text-gray-400', border: 'border-gray-500/30' };
    }
  };

  const getStepIcon = (type: PasswordHashStep['type']) => {
    switch (type) {
      case 'input': return <Lock className="w-7 h-7 text-white" strokeWidth={2.5} />;
      case 'generate-salt': return <Hash className="w-7 h-7 text-white" strokeWidth={2.5} />;
      case 'combine': return <Hash className="w-7 h-7 text-white" strokeWidth={2.5} />;
      case 'iterate': return <Timer className="w-7 h-7 text-white" strokeWidth={2.5} />;
      case 'stretch': return <Repeat className="w-7 h-7 text-white" strokeWidth={2.5} />;
      case 'output': return <CheckCircle className="w-7 h-7 text-white" strokeWidth={2.5} />;
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

      {/* Iteration progress bar for stretch steps */}
      {(step.type === 'stretch' || step.type === 'iterate') && step.iteration !== undefined && step.totalIterations !== undefined && (
        <div className="glass-card p-4 sm:p-6">
          <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">
            Key Stretching Progress
          </h4>
          <div className="space-y-2">
            <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <m.div
                className="h-full bg-gradient-to-r from-rose-600 to-red-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((step.iteration / step.totalIterations) * 100, 100)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
              <span>Iteration {step.iteration.toLocaleString()}</span>
              <span>{step.totalIterations.toLocaleString()} total</span>
            </div>
          </div>

          {/* Time comparison */}
          {step.type === 'iterate' && (
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-3 rounded-xl border-2 border-red-500/30 bg-red-50 dark:bg-red-500/10">
                <div className="text-[10px] font-bold text-red-600 dark:text-red-400 mb-1">FAST HASH (SHA-256)</div>
                <div className="text-sm font-mono font-bold text-red-500">~1 nanosecond</div>
                <div className="text-[10px] text-red-500/70">10 billion/sec on GPU</div>
              </div>
              <div className="p-3 rounded-xl border-2 border-green-500/30 bg-green-50 dark:bg-green-500/10">
                <div className="text-[10px] font-bold text-green-600 dark:text-green-400 mb-1">SLOW HASH (bcrypt)</div>
                <div className="text-sm font-mono font-bold text-green-500">~100 milliseconds</div>
                <div className="text-[10px] text-green-500/70">~10/sec on GPU</div>
              </div>
            </div>
          )}
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

export const PasswordHashingPage = () => {
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

  const [password, setPassword] = useState('correcthorsebatterystaple');
  const [costFactor, setCostFactor] = useState(4);
  const { expandedSections, toggleSection } = useExpandedSections(['whyNotSha256', 'saltPurpose']);

  const hashSteps = steps as unknown as PasswordHashStep[];

  const handleHash = () => {
    const newSteps = passwordHashWithSteps(password, costFactor);
    setSteps(newSteps);
    reset();
    play();
  };

  useAutoAdvance(steps.length);

  return (
    <>
      <LearningResourceSchema
        name="Password Hashing Visualizer - Learn bcrypt, Argon2, and Key Stretching"
        description="Interactive visualization of password hashing. See how salting, iteration, and key stretching protect passwords against brute-force attacks."
        url={`https://cryptoviz.app${location.pathname}`}
        learningResourceType="Interactive simulation"
        keywords={['password hashing', 'bcrypt', 'Argon2', 'salt', 'key stretching', 'rainbow table', 'brute force']}
      />
      <div className="space-y-6 sm:space-y-8">
        <LessonHeader slug="password-hashing" title="Password Hashing Visualizer" description="Understand why password hashing must be intentionally slow" />

      {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Input Panel */}
            <div className="glass-card p-4 sm:p-6 space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Password Input</h3>
              <div className="space-y-3">
                <div>
                  <label htmlFor="passwordhashing-field-1" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Password</label>
                  <input id="passwordhashing-field-1"
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="Enter a password..."
                  />
                </div>

                <div>
                  <label htmlFor="passwordhashing-field-2" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Cost Factor: {costFactor} (2^{costFactor} = {Math.pow(2, costFactor).toLocaleString()} iterations)
                  </label>
                  <input id="passwordhashing-field-2"
                    type="range"
                    min={1}
                    max={8}
                    value={costFactor}
                    onChange={(e) => setCostFactor(Number(e.target.value))}
                    className="w-full accent-rose-600"
                  />
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span>1 (fast, weak)</span>
                    <span>8 (slow, strong)</span>
                  </div>
                </div>

                <button
                  onClick={handleHash}
                  disabled={!password}
                  className="px-6 py-3 bg-rose-600 rounded-2xl text-white font-bold hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Lock className="w-5 h-5" />
                  Hash Password
                </button>
              </div>
            </div>

            {/* Playback Controls */}
            {steps.length > 0 && (
              <div className="glass-card p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-600 transition-all duration-300"
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
                      <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600 dark:text-rose-400" />
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
                      className="px-6 sm:px-8 py-3 sm:py-4 bg-rose-600 rounded-2xl text-white font-bold hover:scale-105 active:scale-95 transition-all"
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
                              ? 'bg-rose-600 text-white'
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
              <PasswordHashVisualizer steps={hashSteps} currentStep={currentStep} />
            </ErrorBoundary>

            {/* Key Stretching Demo */}
            <KeyStretchDemo />
          </div>

          {/* Right Column: Educational Content */}
          <div id="lesson-notes" className="lesson-notes lg:col-span-1 space-y-4" tabIndex={-1}>
            {/* Why Not SHA-256? */}
            <EducationalCard
              title={passwordHashingEducationalContent.whyNotSha256.title}
              isExpanded={expandedSections.has('whyNotSha256')}
              onToggle={() => toggleSection('whyNotSha256')}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-rose-100 dark:bg-rose-500/20 rounded-lg">
                  <Info className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {passwordHashingEducationalContent.whyNotSha256.content}
                </p>
              </div>
            </EducationalCard>

            {/* Salt Purpose */}
            <EducationalCard
              title={passwordHashingEducationalContent.saltPurpose.title}
              isExpanded={expandedSections.has('saltPurpose')}
              onToggle={() => toggleSection('saltPurpose')}
            >
              <div className="space-y-3">
                {passwordHashingEducationalContent.saltPurpose.items.map((item, idx) => (
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

            {/* Work Factor */}
            <EducationalCard
              title={passwordHashingEducationalContent.workFactor.title}
              isExpanded={expandedSections.has('workFactor')}
              onToggle={() => toggleSection('workFactor')}
            >
              <div className="space-y-3">
                {passwordHashingEducationalContent.workFactor.items.map((item, idx) => (
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

            {/* Algorithms */}
            <EducationalCard
              title={passwordHashingEducationalContent.algorithms.title}
              isExpanded={expandedSections.has('algorithms')}
              onToggle={() => toggleSection('algorithms')}
            >
              <div className="space-y-2">
                {passwordHashingEducationalContent.algorithms.list.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-white/5 p-3 rounded-xl">
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-1">{item.name}</h4>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400">{item.detail}</p>
                  </div>
                ))}
              </div>
            </EducationalCard>

            {/* Rainbow Tables */}
            <EducationalCard
              title={passwordHashingEducationalContent.rainbowTables.title}
              isExpanded={expandedSections.has('rainbowTables')}
              onToggle={() => toggleSection('rainbowTables')}
            >
              <div className="space-y-3">
                {passwordHashingEducationalContent.rainbowTables.items.map((item, idx) => (
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

            {/* Real-World Use */}
            <EducationalCard
              title={passwordHashingEducationalContent.realWorldUse.title}
              isExpanded={expandedSections.has('realWorld')}
              onToggle={() => toggleSection('realWorld')}
            >
              <div className="grid grid-cols-1 gap-2">
                {passwordHashingEducationalContent.realWorldUse.examples.map((example, idx) => {
                  const Icon = iconMap[example.icon] || Globe;
                  return (
                    <div key={idx} className="bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-white/5 p-3 rounded-xl flex items-center gap-3">
                      <div className="p-2 bg-rose-100 dark:bg-rose-500/20 rounded-lg flex-shrink-0">
                        <Icon className="w-4 h-4 text-rose-600 dark:text-rose-400" />
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
              title={passwordHashingEducationalContent.commonMistakes.title}
              isExpanded={expandedSections.has('commonMistakes')}
              onToggle={() => toggleSection('commonMistakes')}
            >
              <div className="space-y-3">
                {passwordHashingEducationalContent.commonMistakes.mistakes.map((mistake, idx) => (
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
              title={passwordHashingEducationalContent.furtherLearning.title}
              isExpanded={expandedSections.has('furtherLearning')}
              onToggle={() => toggleSection('furtherLearning')}
            >
              <div className="space-y-2">
                {passwordHashingEducationalContent.furtherLearning.resources.map((resource, idx) => (
                  <a
                    key={idx}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-white/5 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-cyber-surface transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                        {resource.type}
                      </span>
                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-rose-500 transition-colors" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">{resource.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{resource.description}</p>
                  </a>
                ))}
              </div>
            </EducationalCard>

            {/* Interactive Quiz */}
            <QuizSystem questions={passwordHashingQuizQuestions} title="Password Hashing Knowledge Check" algorithmId="password-hashing" />
          </div>
        </div>
      </div>
    </>
  );
};
