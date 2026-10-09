import { LessonHeader } from '@/components/learning/LessonHeader';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useExpandedSections } from '@/hooks/useExpandedSections';
import { useAutoAdvance } from '@/hooks/useAutoAdvance';
import { LearningResourceSchema } from '@/components/seo/JsonLd';
import { ECCVisualizer } from '@/components/visualizations/ECC/ECCVisualizer';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { generateECCWithSteps } from '@/lib/crypto/ecc';
import { useVisualizationStore } from '@/store/visualizationStore';
import type { ECCStep } from '@/lib/types/ecc';
import { Info, AlertTriangle, CheckCircle, Globe, Terminal, FileText, XCircle, Lightbulb, ExternalLink, Fingerprint } from 'lucide-react';
import { QuizSystem } from '@/components/educational/QuizSystem';
import { eccQuizQuestions } from '@/data/quizzes/eccQuiz';
import { EducationalCard } from '@/components/educational/EducationalCard';
import { eccEducationalContent } from '@/data/eccEducationalContent';

const iconMap = {
  info: Info,
  globe: Globe,
  terminal: Terminal,
  file: FileText,
};

export const ECCPage = () => {
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

  const [curveSize, setCurveSize] = useState<'tiny' | 'small' | 'medium'>('tiny');
  const { expandedSections, toggleSection } = useExpandedSections(['whatIsECC', 'pointAddition']);

  const eccSteps = steps as ECCStep[];

  const handleGenerate = (size: 'tiny' | 'small' | 'medium') => {
    setCurveSize(size);
    const { steps: newSteps } = generateECCWithSteps(size);
    setSteps(newSteps);
    reset();
    play();
  };

  useAutoAdvance(steps.length);

  return (
    <>
      <LearningResourceSchema
        name="ECC Visualizer - Learn Elliptic Curve Cryptography"
        description="Interactive visualization of elliptic curve cryptography. Watch point addition, scalar multiplication, ECDH key exchange, and ECDSA signing step-by-step."
        url={`https://cryptoviz.app${location.pathname}`}
        learningResourceType="Interactive simulation"
        keywords={['ECC', 'elliptic curve cryptography', 'ECDH', 'ECDSA', 'point addition', 'scalar multiplication', 'secp256k1']}
      />
      <div className="space-y-6 sm:space-y-8">
        <LessonHeader slug="ecc" title="Elliptic Curve Cryptography" description="Explore ECC key generation, ECDH key exchange, and ECDSA signatures" />

      {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column: Input & Visualization */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Curve Selection */}
            <div className="glass-card p-4 sm:p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Select Curve Size</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Smaller curves are easier to visualize. Real-world ECC uses 256+ bit primes.
              </p>
              <div className="flex flex-wrap gap-3">
                {([
                  { size: 'tiny' as const, label: 'Tiny (p=23)', desc: 'y² = x³ + x + 1' },
                  { size: 'small' as const, label: 'Small (p=97)', desc: 'y² = x³ + 2x + 3' },
                  { size: 'medium' as const, label: 'Medium (p=263)', desc: 'y² = x³ + 2x + 3' },
                ]).map(({ size, label, desc }) => (
                  <button
                    key={size}
                    onClick={() => handleGenerate(size)}
                    className={`px-4 py-3 rounded-xl border-2 transition-all hover:scale-105 active:scale-95 ${
                      curveSize === size && steps.length > 0
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10'
                        : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700'
                    }`}
                  >
                    <div className="text-sm font-bold text-slate-900 dark:text-white">{label}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">{desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Playback Controls */}
            {steps.length > 0 && (
              <div className="glass-card p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Progress Bar */}
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 transition-all duration-300"
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
                      <Fingerprint className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />
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
                      className="px-6 sm:px-8 py-3 sm:py-4 bg-emerald-600 rounded-2xl text-white font-bold hover:scale-105 active:scale-95 transition-all"
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
                              ? 'bg-emerald-600 text-white'
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
              <ECCVisualizer steps={eccSteps} currentStep={currentStep} />
            </ErrorBoundary>
          </div>

          {/* Right Column: Educational Content */}
          <div id="lesson-notes" className="lesson-notes lg:col-span-1 space-y-4" tabIndex={-1}>
            {/* What is ECC? */}
            <EducationalCard
              title={eccEducationalContent.whatIsECC.title}
              isExpanded={expandedSections.has('whatIsECC')}
              onToggle={() => toggleSection('whatIsECC')}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg">
                  <Info className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {eccEducationalContent.whatIsECC.content}
                </p>
              </div>
            </EducationalCard>

            {/* Point Addition */}
            <EducationalCard
              title={eccEducationalContent.pointAddition.title}
              isExpanded={expandedSections.has('pointAddition')}
              onToggle={() => toggleSection('pointAddition')}
            >
              <div className="space-y-3">
                {eccEducationalContent.pointAddition.steps.map((step, idx) => (
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

            {/* ECDH Exchange */}
            <EducationalCard
              title={eccEducationalContent.ecdhExchange.title}
              isExpanded={expandedSections.has('ecdhExchange')}
              onToggle={() => toggleSection('ecdhExchange')}
            >
              <div className="space-y-3">
                {eccEducationalContent.ecdhExchange.steps.map((step, idx) => (
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

            {/* ECDSA Signatures */}
            <EducationalCard
              title={eccEducationalContent.ecdsaSignatures.title}
              isExpanded={expandedSections.has('ecdsaSignatures')}
              onToggle={() => toggleSection('ecdsaSignatures')}
            >
              <div className="space-y-3">
                {eccEducationalContent.ecdsaSignatures.steps.map((step, idx) => (
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

            {/* ECC vs RSA */}
            <EducationalCard
              title={eccEducationalContent.eccVsRSA.title}
              isExpanded={expandedSections.has('eccVsRSA')}
              onToggle={() => toggleSection('eccVsRSA')}
            >
              <div className="space-y-2">
                {eccEducationalContent.eccVsRSA.notes.map((note, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    {note.type === 'strength' && <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />}
                    {note.type === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-500 dark:text-yellow-400 flex-shrink-0 mt-0.5" />}
                    {note.type === 'info' && <Info className="w-4 h-4 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5" />}
                    <p className="text-xs text-slate-600 dark:text-slate-300">{note.text}</p>
                  </div>
                ))}
              </div>
            </EducationalCard>

            {/* Security Notes */}
            <EducationalCard
              title={eccEducationalContent.securityNotes.title}
              isExpanded={expandedSections.has('security')}
              onToggle={() => toggleSection('security')}
            >
              <div className="space-y-2">
                {eccEducationalContent.securityNotes.notes.map((note, idx) => (
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
              title={eccEducationalContent.realWorldUse.title}
              isExpanded={expandedSections.has('realWorld')}
              onToggle={() => toggleSection('realWorld')}
            >
              <div className="grid grid-cols-1 gap-2">
                {eccEducationalContent.realWorldUse.examples.map((example, idx) => {
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
              title={eccEducationalContent.commonMistakes.title}
              isExpanded={expandedSections.has('commonMistakes')}
              onToggle={() => toggleSection('commonMistakes')}
            >
              <div className="space-y-3">
                {eccEducationalContent.commonMistakes.mistakes.map((mistake, idx) => (
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
              title={eccEducationalContent.furtherLearning.title}
              isExpanded={expandedSections.has('furtherLearning')}
              onToggle={() => toggleSection('furtherLearning')}
            >
              <div className="space-y-2">
                {eccEducationalContent.furtherLearning.resources.map((resource, idx) => (
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
            <QuizSystem questions={eccQuizQuestions} title="ECC Knowledge Check" algorithmId="ecc" />
          </div>
        </div>
      </div>
    </>
  );
};
