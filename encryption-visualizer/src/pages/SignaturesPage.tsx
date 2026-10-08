import { LessonHeader } from '@/components/learning/LessonHeader';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useExpandedSections } from '@/hooks/useExpandedSections';
import { useAutoAdvance } from '@/hooks/useAutoAdvance';
import { SignatureInputPanel } from '@/components/visualizations/Signatures/SignatureInputPanel';
import { SignatureVisualizer } from '@/components/visualizations/Signatures/SignatureVisualizer';
import { SignVerifyPanel } from '@/components/visualizations/Signatures/SignVerifyPanel';
import { LearningResourceSchema } from '@/components/seo/JsonLd';
import { algorithmSchemas } from '@/data/structuredData';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { generateRSAKeyPairWithSteps } from '@/lib/crypto/rsa';
import { signMessageWithSteps } from '@/lib/crypto/signatures';
import { useVisualizationStore } from '@/store/visualizationStore';
import type { RSAKeyPair, SignatureStep } from '@/lib/types';
import {
  FileSignature,
  Info,
  AlertTriangle,
  CheckCircle,
  Globe,
  Code,
  FileText,
  Mail,
  XCircle,
  Lightbulb,
  ExternalLink,
  ArrowLeftRight,
} from 'lucide-react';
import { QuizSystem } from '@/components/educational/QuizSystem';
import { signaturesQuizQuestions } from '@/data/quizzes/signaturesQuiz';
import { EducationalCard } from '@/components/educational/EducationalCard';
import { signaturesEducationalContent } from '@/data/signaturesEducationalContent';

const iconMap = {
  info: Info,
  globe: Globe,
  code: Code,
  file: FileText,
  mail: Mail,
  bitcoin: Globe, // Using Globe as fallback for bitcoin icon
};

export const SignaturesPage = () => {
  const location = useLocation();
  const schemaData = algorithmSchemas.signatures;

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

  const [keyPair, setKeyPair] = useState<RSAKeyPair | null>(null);
  const { expandedSections, toggleSection } = useExpandedSections(['whatIsSignature', 'howSigningWorks']);

  const signatureSteps = steps as SignatureStep[];

  const handleSign = (message: string, keySize: 'small' | 'medium' | 'large') => {
    // Generate new key pair or reuse existing
    let currentKeyPair = keyPair;
    if (!currentKeyPair) {
      const { keyPair: newKeyPair } = generateRSAKeyPairWithSteps(keySize);
      currentKeyPair = newKeyPair;
      setKeyPair(newKeyPair);
    }

    // Generate signing steps
    const { steps: signingSteps } = signMessageWithSteps(message, currentKeyPair);
    setSteps(signingSteps);
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
    <div className="space-y-6 sm:space-y-8">
      <LessonHeader slug="signatures" title="Digital Signatures Visualizer" description="See how digital signatures prove authenticity and integrity" />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left Column: Input & Visualization */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          <SignatureInputPanel onSign={handleSign} keyPair={keyPair} />

          {/* Playback Controls */}
          {steps.length > 0 && (
            <div className="glass-card p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Progress Bar */}
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 transition-all duration-300"
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
                    <FileSignature className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
                  </button>

                  <button
                    onClick={previousStep}
                    disabled={currentStep === 0}
                    aria-label="Previous step"
                    className="p-2 sm:p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300"
                  >
                    ←
                  </button>

                  <button
                    onClick={isPlaying ? pause : play}
                    className="px-6 sm:px-8 py-3 sm:py-4 bg-amber-500 rounded-2xl text-white font-bold hover:scale-105 active:scale-95 transition-all"
                  >
                    {isPlaying ? 'Pause' : 'Play'}
                  </button>

                  <button
                    onClick={nextStep}
                    disabled={currentStep >= steps.length - 1}
                    aria-label="Next step"
                    className="p-2 sm:p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300"
                  >
                    →
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
                            ? 'bg-amber-500 text-white'
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
            <SignatureVisualizer steps={signatureSteps} currentStep={currentStep} />
          </ErrorBoundary>

          {/* Sign/Verify Panel */}
          {keyPair && signatureSteps.length > 0 && currentStep === signatureSteps.length - 1 && (
            <SignVerifyPanel keyPair={keyPair} />
          )}
        </div>

        {/* Right Column: Educational Content */}
        <div id="lesson-notes" className="lesson-notes lg:col-span-1 space-y-4" tabIndex={-1}>
          {/* What is a Digital Signature? */}
          <EducationalCard
            title={signaturesEducationalContent.whatIsSignature.title}
            isExpanded={expandedSections.has('whatIsSignature')}
            onToggle={() => toggleSection('whatIsSignature')}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-500/20 rounded-lg">
                <Info className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {signaturesEducationalContent.whatIsSignature.content}
              </p>
            </div>
          </EducationalCard>

          {/* How Signing Works */}
          <EducationalCard
            title={signaturesEducationalContent.howSigningWorks.title}
            isExpanded={expandedSections.has('howSigningWorks')}
            onToggle={() => toggleSection('howSigningWorks')}
          >
            <div className="space-y-3">
              {signaturesEducationalContent.howSigningWorks.steps.map((step, idx) => (
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

          {/* How Verification Works */}
          <EducationalCard
            title={signaturesEducationalContent.howVerificationWorks.title}
            isExpanded={expandedSections.has('howVerificationWorks')}
            onToggle={() => toggleSection('howVerificationWorks')}
          >
            <div className="space-y-3">
              {signaturesEducationalContent.howVerificationWorks.steps.map((step, idx) => (
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

          {/* Signing vs Encrypting */}
          <EducationalCard
            title={signaturesEducationalContent.signingVsEncrypting.title}
            isExpanded={expandedSections.has('signingVsEncrypting')}
            onToggle={() => toggleSection('signingVsEncrypting')}
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <ArrowLeftRight className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">COMPARISON</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="text-left py-2 pr-2 text-slate-500 dark:text-slate-400">Aspect</th>
                      <th className="text-left py-2 px-2 text-amber-600 dark:text-amber-400">Signing</th>
                      <th className="text-left py-2 pl-2 text-violet-600 dark:text-violet-400">Encrypting</th>
                    </tr>
                  </thead>
                  <tbody>
                    {signaturesEducationalContent.signingVsEncrypting.comparison.map((row, idx) => (
                      <tr key={idx} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                        <td className="py-2 pr-2 text-slate-600 dark:text-slate-400 font-medium">{row.aspect}</td>
                        <td className="py-2 px-2 text-slate-700 dark:text-slate-300">{row.signing}</td>
                        <td className="py-2 pl-2 text-slate-700 dark:text-slate-300">{row.encrypting}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </EducationalCard>

          {/* Security Properties */}
          <EducationalCard
            title={signaturesEducationalContent.securityProperties.title}
            isExpanded={expandedSections.has('security')}
            onToggle={() => toggleSection('security')}
          >
            <div className="space-y-2">
              {signaturesEducationalContent.securityProperties.notes.map((note, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  {note.type === 'strength' && (
                    <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  )}
                  {note.type === 'warning' && (
                    <AlertTriangle className="w-4 h-4 text-yellow-500 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  )}
                  {note.type === 'info' && (
                    <Info className="w-4 h-4 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  )}
                  <p className="text-xs text-slate-600 dark:text-slate-300">{note.text}</p>
                </div>
              ))}
            </div>
          </EducationalCard>

          {/* Real-World Use */}
          <EducationalCard
            title={signaturesEducationalContent.realWorldUse.title}
            isExpanded={expandedSections.has('realWorld')}
            onToggle={() => toggleSection('realWorld')}
          >
            <div className="grid grid-cols-1 gap-2">
              {signaturesEducationalContent.realWorldUse.examples.map((example, idx) => {
                const Icon = iconMap[example.icon as keyof typeof iconMap] || Globe;
                return (
                  <div
                    key={idx}
                    className="bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-white/5 p-3 rounded-xl flex items-center gap-3"
                  >
                    <div className="p-2 bg-amber-100 dark:bg-amber-500/20 rounded-lg flex-shrink-0">
                      <Icon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-0.5">{example.name}</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                        {example.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </EducationalCard>

          {/* Common Mistakes */}
          <EducationalCard
            title={signaturesEducationalContent.commonMistakes.title}
            isExpanded={expandedSections.has('commonMistakes')}
            onToggle={() => toggleSection('commonMistakes')}
          >
            <div className="space-y-3">
              {signaturesEducationalContent.commonMistakes.mistakes.map((mistake, idx) => (
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
            title={signaturesEducationalContent.furtherLearning.title}
            isExpanded={expandedSections.has('furtherLearning')}
            onToggle={() => toggleSection('furtherLearning')}
          >
            <div className="space-y-2">
              {signaturesEducationalContent.furtherLearning.resources.map((resource, idx) => (
                <a
                  key={idx}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-white/5 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-cyber-surface transition-colors group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                      {resource.type}
                    </span>
                    <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-amber-500 transition-colors" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">{resource.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{resource.description}</p>
                </a>
              ))}
            </div>
          </EducationalCard>

          {/* Interactive Quiz */}
          <QuizSystem questions={signaturesQuizQuestions} title="Signatures Knowledge Check" algorithmId="signatures" />
        </div>
      </div>
    </div>
    </>
  );
};
