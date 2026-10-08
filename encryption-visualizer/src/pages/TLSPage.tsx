import { LessonHeader } from '@/components/learning/LessonHeader';
import { useExpandedSections } from '@/hooks/useExpandedSections';
import { useAutoAdvance } from '@/hooks/useAutoAdvance';
import { TLSVisualizer } from '@/components/visualizations/TLS/TLSVisualizer';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { simulateTLSHandshake } from '@/lib/crypto/tls';
import { useVisualizationStore } from '@/store/visualizationStore';
import type { TLSStep } from '@/lib/types/tls';
import { Info, AlertTriangle, CheckCircle, Globe, Terminal, FileText, XCircle, Lightbulb, ExternalLink, Shield, ArrowRightLeft, Link2, Lock } from 'lucide-react';
import { QuizSystem } from '@/components/educational/QuizSystem';
import { tlsQuizQuestions } from '@/data/quizzes/tlsQuiz';
import { EducationalCard } from '@/components/educational/EducationalCard';
import { tlsEducationalContent } from '@/data/tlsEducationalContent';

const iconMap = {
  info: Info,
  globe: Globe,
  terminal: Terminal,
  file: FileText,
};

export const TLSPage = () => {
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

  const { expandedSections, toggleSection } = useExpandedSections(['whatIsTLS', 'handshakeSteps']);

  const tlsSteps = steps as TLSStep[];

  const handleStart = () => {
    const session = simulateTLSHandshake();
    setSteps(session.steps);
    reset();
    play();
  };

  useAutoAdvance(steps.length);

  return (
    <div className="space-y-6 sm:space-y-8">
      <LessonHeader slug="tls" title="TLS 1.3 Handshake" description="Watch how a secure connection is established between a client and server" />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left Column: Visualization */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          {/* Start Button */}
          <div className="glass-card p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Simulate TLS Handshake</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Each run generates new random values, just like a real TLS connection.
                </p>
              </div>
              <button
                onClick={handleStart}
                className="px-6 py-3 bg-indigo-600 rounded-2xl text-white font-bold hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <Shield className="w-5 h-5" />
                Start Handshake
              </button>
            </div>
          </div>

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
                    <ArrowRightLeft className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400" />
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
            <TLSVisualizer steps={tlsSteps} currentStep={currentStep} />
          </ErrorBoundary>
        </div>

        {/* Right Column: Educational Content */}
        <div id="lesson-notes" className="lesson-notes lg:col-span-1 space-y-4" tabIndex={-1}>
          {/* What is TLS? */}
          <EducationalCard
            title={tlsEducationalContent.whatIsTLS.title}
            isExpanded={expandedSections.has('whatIsTLS')}
            onToggle={() => toggleSection('whatIsTLS')}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg">
                <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {tlsEducationalContent.whatIsTLS.content}
              </p>
            </div>
          </EducationalCard>

          {/* Handshake Steps */}
          <EducationalCard
            title={tlsEducationalContent.handshakeSteps.title}
            isExpanded={expandedSections.has('handshakeSteps')}
            onToggle={() => toggleSection('handshakeSteps')}
          >
            <div className="space-y-3">
              {tlsEducationalContent.handshakeSteps.steps.map((step, idx) => (
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

          {/* How TLS Uses Other Algorithms */}
          <EducationalCard
            title={tlsEducationalContent.algorithmsUsed.title}
            isExpanded={expandedSections.has('algorithmsUsed')}
            onToggle={() => toggleSection('algorithmsUsed')}
          >
            <div className="space-y-3">
              {tlsEducationalContent.algorithmsUsed.algorithms.map((algo, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-white/5 p-3 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{algo.name}</h4>
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase bg-indigo-100 dark:bg-indigo-500/20 px-2 py-0.5 rounded-full">
                      {algo.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">{algo.description}</p>
                  <a
                    href={algo.link}
                    className="text-xs text-indigo-500 dark:text-indigo-300 underline hover:text-indigo-700 dark:hover:text-indigo-200 transition-colors flex items-center gap-1"
                  >
                    <Link2 className="w-3 h-3" />
                    See this algorithm in action
                  </a>
                </div>
              ))}
            </div>
          </EducationalCard>

          {/* Cipher Suites */}
          <EducationalCard
            title={tlsEducationalContent.cipherSuites.title}
            isExpanded={expandedSections.has('cipherSuites')}
            onToggle={() => toggleSection('cipherSuites')}
          >
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
              {tlsEducationalContent.cipherSuites.content}
            </p>
            <div className="space-y-2">
              {tlsEducationalContent.cipherSuites.suites.map((suite, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-white/5 p-3 rounded-xl">
                  <h4 className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-xs mb-1">{suite.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{suite.description}</p>
                </div>
              ))}
            </div>
          </EducationalCard>

          {/* Certificate Verification & PKI */}
          <EducationalCard
            title={tlsEducationalContent.certificatesPKI.title}
            isExpanded={expandedSections.has('certificatesPKI')}
            onToggle={() => toggleSection('certificatesPKI')}
          >
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
              {tlsEducationalContent.certificatesPKI.content}
            </p>
            <div className="space-y-2">
              {tlsEducationalContent.certificatesPKI.chain.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 ${
                    idx === 0 ? 'bg-amber-500' : idx === 1 ? 'bg-violet-500' : 'bg-blue-500'
                  }`}>
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{item.level}</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </EducationalCard>

          {/* Forward Secrecy */}
          <EducationalCard
            title={tlsEducationalContent.forwardSecrecy.title}
            isExpanded={expandedSections.has('forwardSecrecy')}
            onToggle={() => toggleSection('forwardSecrecy')}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg">
                <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {tlsEducationalContent.forwardSecrecy.content}
              </p>
            </div>
          </EducationalCard>

          {/* TLS 1.2 vs 1.3 */}
          <EducationalCard
            title={tlsEducationalContent.tlsVersions.title}
            isExpanded={expandedSections.has('tlsVersions')}
            onToggle={() => toggleSection('tlsVersions')}
          >
            <div className="space-y-2">
              {tlsEducationalContent.tlsVersions.differences.map((diff, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-white/5 p-3 rounded-xl">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-2">{diff.aspect}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-red-500 dark:text-red-400 uppercase">TLS 1.2</span>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">{diff.tls12}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-emerald-500 dark:text-emerald-400 uppercase">TLS 1.3</span>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">{diff.tls13}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </EducationalCard>

          {/* Security Notes */}
          <EducationalCard
            title={tlsEducationalContent.securityNotes.title}
            isExpanded={expandedSections.has('security')}
            onToggle={() => toggleSection('security')}
          >
            <div className="space-y-2">
              {tlsEducationalContent.securityNotes.notes.map((note, idx) => (
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
            title={tlsEducationalContent.realWorldUse.title}
            isExpanded={expandedSections.has('realWorld')}
            onToggle={() => toggleSection('realWorld')}
          >
            <div className="grid grid-cols-1 gap-2">
              {tlsEducationalContent.realWorldUse.examples.map((example, idx) => {
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
            title={tlsEducationalContent.commonMistakes.title}
            isExpanded={expandedSections.has('commonMistakes')}
            onToggle={() => toggleSection('commonMistakes')}
          >
            <div className="space-y-3">
              {tlsEducationalContent.commonMistakes.mistakes.map((mistake, idx) => (
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
            title={tlsEducationalContent.furtherLearning.title}
            isExpanded={expandedSections.has('furtherLearning')}
            onToggle={() => toggleSection('furtherLearning')}
          >
            <div className="space-y-2">
              {tlsEducationalContent.furtherLearning.resources.map((resource, idx) => (
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
          <QuizSystem questions={tlsQuizQuestions} title="TLS Knowledge Check" algorithmId="tls" />
        </div>
      </div>
    </div>
  );
};
