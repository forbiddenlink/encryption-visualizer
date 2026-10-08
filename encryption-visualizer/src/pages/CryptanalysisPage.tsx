import { LessonHeader } from '@/components/learning/LessonHeader';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useExpandedSections } from '@/hooks/useExpandedSections';
import { useAutoAdvance } from '@/hooks/useAutoAdvance';
import { LearningResourceSchema } from '@/components/seo/JsonLd';
import { CryptanalysisVisualizer } from '@/components/visualizations/Cryptanalysis/CryptanalysisVisualizer';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import {
  caesarEncrypt,
  frequencyAnalysisAttack,
  bruteForceAttack,
  paddingOracleAttack,
  timingAttack,
} from '@/lib/crypto/cryptanalysis';
import { useVisualizationStore } from '@/store/visualizationStore';
import type { CryptanalysisStep, AttackType } from '@/lib/types/cryptanalysis';
import { Info, AlertTriangle, CheckCircle, XCircle, ExternalLink, Search, Shield, Clock, Key } from 'lucide-react';
import { QuizSystem } from '@/components/educational/QuizSystem';
import { cryptanalysisQuizQuestions } from '@/data/quizzes/cryptanalysisQuiz';
import { EducationalCard } from '@/components/educational/EducationalCard';
import { cryptanalysisEducationalContent } from '@/data/cryptanalysisEducationalContent';

const DEFAULT_PLAINTEXT = 'The quick brown fox jumps over the lazy dog. Cryptography is the practice of secure communication.';

export const CryptanalysisPage = () => {
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

  const [plaintext, setPlaintext] = useState(DEFAULT_PLAINTEXT);
  const [activeAttack, setActiveAttack] = useState<AttackType>('frequency-analysis');
  const { expandedSections, toggleSection } = useExpandedSections(['whatIsCryptanalysis', 'frequencyAnalysis']);

  const cryptSteps = steps as unknown as CryptanalysisStep[];

  const handleLaunchAttack = (attack: AttackType) => {
    setActiveAttack(attack);
    let newSteps: CryptanalysisStep[];

    switch (attack) {
      case 'frequency-analysis': {
        const shift = Math.floor(Math.random() * 25) + 1;
        const ciphertext = caesarEncrypt(plaintext, shift);
        newSteps = frequencyAnalysisAttack(ciphertext);
        break;
      }
      case 'brute-force': {
        const shift = Math.floor(Math.random() * 25) + 1;
        const ciphertext = caesarEncrypt(plaintext, shift);
        newSteps = bruteForceAttack(ciphertext, plaintext);
        break;
      }
      case 'padding-oracle':
        newSteps = paddingOracleAttack();
        break;
      case 'timing-attack':
        newSteps = timingAttack();
        break;
    }

    setSteps(newSteps as any);
    reset();
    play();
  };

  useAutoAdvance(steps.length);

  const attackButtons: { type: AttackType; label: string; icon: React.ReactNode; color: string }[] = [
    { type: 'frequency-analysis', label: 'Frequency Analysis', icon: <Search className="w-4 h-4" />, color: 'bg-amber-600' },
    { type: 'brute-force', label: 'Brute Force', icon: <Key className="w-4 h-4" />, color: 'bg-red-600' },
    { type: 'padding-oracle', label: 'Padding Oracle', icon: <Shield className="w-4 h-4" />, color: 'bg-purple-600' },
    { type: 'timing-attack', label: 'Timing Attack', icon: <Clock className="w-4 h-4" />, color: 'bg-cyan-600' },
  ];

  return (
    <>
      <LearningResourceSchema
        name="Cryptanalysis Visualizer - Learn How Ciphers Are Broken"
        description="Interactive visualization of cryptanalysis techniques. Watch frequency analysis, brute force, padding oracle, and timing attacks break ciphers step-by-step."
        url={`https://cryptoviz.app${location.pathname}`}
        learningResourceType="Interactive simulation"
        keywords={['cryptanalysis', 'frequency analysis', 'brute force', 'padding oracle', 'timing attack', 'cipher breaking']}
      />
      <div className="space-y-6 sm:space-y-8">
        <LessonHeader slug="cryptanalysis" title="Cryptanalysis Visualizer" description="Watch how attackers break weak ciphers and exploit implementation flaws" />

      {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column: Input & Visualization */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Input Panel */}
            <div className="glass-card p-4 sm:p-6 space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Plaintext Input</h3>
              <textarea aria-label="Plaintext to encrypt and attack"
                value={plaintext}
                onChange={(e) => setPlaintext(e.target.value)}
                className="w-full h-24 bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm font-mono text-slate-800 dark:text-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Enter plaintext to encrypt and attack..."
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                For frequency analysis and brute force, the text will be Caesar-encrypted with a random shift before the attack begins.
              </p>
            </div>

            {/* Attack Type Selector */}
            <div className="glass-card p-4 sm:p-6 space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Choose Attack</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {attackButtons.map(({ type, label, icon, color }) => (
                  <button
                    key={type}
                    onClick={() => handleLaunchAttack(type)}
                    className={`p-3 rounded-xl border-2 transition-all hover:scale-105 active:scale-95 flex flex-col items-center gap-2 ${
                      activeAttack === type && steps.length > 0
                        ? `border-amber-500 bg-amber-50 dark:bg-amber-500/10`
                        : 'border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-700'
                    }`}
                  >
                    <div className={`p-2 ${color} rounded-lg text-white`}>
                      {icon}
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white text-center">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Playback Controls */}
            {steps.length > 0 && (
              <div className="glass-card p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-600 transition-all duration-300"
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
                      <Search className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
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
                      className="px-6 sm:px-8 py-3 sm:py-4 bg-amber-600 rounded-2xl text-white font-bold hover:scale-105 active:scale-95 transition-all"
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
                              ? 'bg-amber-600 text-white'
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
              <CryptanalysisVisualizer
                steps={cryptSteps}
                currentStep={currentStep}
                activeAttack={activeAttack}
              />
            </ErrorBoundary>
          </div>

          {/* Right Column: Educational Content */}
          <div id="lesson-notes" className="lesson-notes lg:col-span-1 space-y-4" tabIndex={-1}>
            {/* What is Cryptanalysis? */}
            <EducationalCard
              title={cryptanalysisEducationalContent.whatIsCryptanalysis.title}
              isExpanded={expandedSections.has('whatIsCryptanalysis')}
              onToggle={() => toggleSection('whatIsCryptanalysis')}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-500/20 rounded-lg">
                  <Info className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {cryptanalysisEducationalContent.whatIsCryptanalysis.content}
                </p>
              </div>
            </EducationalCard>

            {/* Frequency Analysis */}
            <EducationalCard
              title={cryptanalysisEducationalContent.frequencyAnalysis.title}
              isExpanded={expandedSections.has('frequencyAnalysis')}
              onToggle={() => toggleSection('frequencyAnalysis')}
            >
              <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
                {cryptanalysisEducationalContent.frequencyAnalysis.explanation}
              </p>
              <div className="space-y-1">
                {cryptanalysisEducationalContent.frequencyAnalysis.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center text-[10px] font-bold text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{step}</p>
                  </div>
                ))}
              </div>
            </EducationalCard>

            {/* Classical Ciphers */}
            <EducationalCard
              title={cryptanalysisEducationalContent.classicalCiphers.title}
              isExpanded={expandedSections.has('classicalCiphers')}
              onToggle={() => toggleSection('classicalCiphers')}
            >
              <div className="space-y-2">
                {cryptanalysisEducationalContent.classicalCiphers.ciphers.map((cipher, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-white/5 p-3 rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{cipher.name}</h4>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        cipher.strength === 'weak'
                          ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400'
                          : 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
                      }`}>
                        {cipher.strength}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">{cipher.description}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-500 font-mono">Key space: {cipher.keySpace}</p>
                  </div>
                ))}
              </div>
            </EducationalCard>

            {/* Side-Channel Attacks */}
            <EducationalCard
              title={cryptanalysisEducationalContent.sideChannelAttacks.title}
              isExpanded={expandedSections.has('sideChannelAttacks')}
              onToggle={() => toggleSection('sideChannelAttacks')}
            >
              <div className="space-y-2">
                {cryptanalysisEducationalContent.sideChannelAttacks.attacks.map((attack, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-white/5 p-3 rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs">{attack.name}</h4>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        attack.severity === 'critical'
                          ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400'
                          : 'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400'
                      }`}>
                        {attack.severity}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 mb-1">{attack.description}</p>
                    <p className="text-[10px] text-green-600 dark:text-green-400">Defense: {attack.defense}</p>
                  </div>
                ))}
              </div>
            </EducationalCard>

            {/* Why Modern Ciphers Are Secure */}
            <EducationalCard
              title={cryptanalysisEducationalContent.whyModernCiphersAreSecure.title}
              isExpanded={expandedSections.has('whyModernSecure')}
              onToggle={() => toggleSection('whyModernSecure')}
            >
              <div className="space-y-2">
                {cryptanalysisEducationalContent.whyModernCiphersAreSecure.points.map((point, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-white/5 p-3 rounded-xl">
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-1">{point.title}</h4>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400">{point.detail}</p>
                  </div>
                ))}
              </div>
            </EducationalCard>

            {/* Security Notes */}
            <EducationalCard
              title={cryptanalysisEducationalContent.securityNotes.title}
              isExpanded={expandedSections.has('security')}
              onToggle={() => toggleSection('security')}
            >
              <div className="space-y-2">
                {cryptanalysisEducationalContent.securityNotes.notes.map((note, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    {note.type === 'strength' && <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />}
                    {note.type === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-500 dark:text-yellow-400 flex-shrink-0 mt-0.5" />}
                    {note.type === 'info' && <Info className="w-4 h-4 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5" />}
                    {note.type === 'danger' && <XCircle className="w-4 h-4 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />}
                    <p className="text-xs text-slate-600 dark:text-slate-300">{note.text}</p>
                  </div>
                ))}
              </div>
            </EducationalCard>

            {/* Real-World Attacks */}
            <EducationalCard
              title={cryptanalysisEducationalContent.realWorldAttacks.title}
              isExpanded={expandedSections.has('realWorldAttacks')}
              onToggle={() => toggleSection('realWorldAttacks')}
            >
              <div className="space-y-2">
                {cryptanalysisEducationalContent.realWorldAttacks.attacks.map((attack, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-white/5 p-3 rounded-xl">
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-1">{attack.name}</h4>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 mb-1">{attack.description}</p>
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">{attack.impact}</p>
                  </div>
                ))}
              </div>
            </EducationalCard>

            {/* Further Learning */}
            <EducationalCard
              title={cryptanalysisEducationalContent.furtherLearning.title}
              isExpanded={expandedSections.has('furtherLearning')}
              onToggle={() => toggleSection('furtherLearning')}
            >
              <div className="space-y-2">
                {cryptanalysisEducationalContent.furtherLearning.resources.map((resource, idx) => (
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
            <QuizSystem questions={cryptanalysisQuizQuestions} title="Cryptanalysis Knowledge Check" algorithmId="cryptanalysis" />
          </div>
        </div>
      </div>
    </>
  );
};
