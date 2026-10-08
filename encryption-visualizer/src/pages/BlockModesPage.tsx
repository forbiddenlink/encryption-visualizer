import { LessonHeader } from '@/components/learning/LessonHeader';
import { useState } from 'react';
import { useExpandedSections } from '@/hooks/useExpandedSections';
import { useAutoAdvance } from '@/hooks/useAutoAdvance';
import { BlockModesVisualizer } from '@/components/visualizations/BlockModes/BlockModesVisualizer';
import { ECBDiagram } from '@/components/visualizations/BlockModes/ECBDiagram';
import { CBCDiagram } from '@/components/visualizations/BlockModes/CBCDiagram';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import {
  encryptECBWithSteps,
  encryptCBCWithSteps,
  encryptGCMWithSteps,
  demonstrateECBPatternProblem,
  validateBlockModeInput,
  MAX_VISUALIZATION_BYTES,
} from '@/lib/crypto/block-modes';
import { useVisualizationStore } from '@/store/visualizationStore';
import type { BlockModeStep } from '@/lib/types';
import {
  Layers,
  Info,
  AlertTriangle,
  CheckCircle,
  Globe,
  XCircle,
  Lightbulb,
  ExternalLink,
  Shield,
  FileText,
  Database,
} from 'lucide-react';
import { QuizSystem } from '@/components/educational/QuizSystem';
import { blockModesQuizQuestions } from '@/data/quizzes/blockModesQuiz';
import { EducationalCard } from '@/components/educational/EducationalCard';
import { blockModesEducationalContent } from '@/data/blockModesEducationalContent';

type BlockMode = 'ecb' | 'cbc' | 'gcm';

const iconMap = {
  globe: Globe,
  file: FileText,
  shield: Shield,
  database: Database,
};

export const BlockModesPage = () => {
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

  const [activeMode, setActiveMode] = useState<BlockMode>('ecb');
  const [plaintext, setPlaintext] = useState('Hello World! This is a test message for block cipher modes.');
  const [key, setKey] = useState('mysecretkey12345');
  const [inputError, setInputError] = useState('');
  const { expandedSections, toggleSection } = useExpandedSections(['whatAreBlockModes', 'ecbPenguin']);

  // Pattern demo state
  const [patternDemo, setPatternDemo] = useState<{
    ecbCiphertext: string[];
    cbcCiphertext: string[];
    patternVisible: boolean;
  } | null>(null);

  const blockModeSteps = steps as BlockModeStep[];

  const handleEncrypt = () => {
    try {
      validateBlockModeInput(plaintext, key);
    } catch (error) {
      setInputError(error instanceof Error ? error.message : 'Invalid message or key');
      return;
    }
    setInputError('');
    let newSteps: BlockModeStep[];

    switch (activeMode) {
      case 'ecb':
        newSteps = encryptECBWithSteps(plaintext, key);
        break;
      case 'cbc':
        newSteps = encryptCBCWithSteps(plaintext, key);
        break;
      case 'gcm':
        newSteps = encryptGCMWithSteps(plaintext, key);
        break;
    }

    setSteps(newSteps);
    reset();
    play();
  };

  const handleDemoPattern = () => {
    try {
      validateBlockModeInput('', key);
    } catch (error) {
      setInputError(error instanceof Error ? error.message : 'Invalid key');
      return;
    }
    setInputError('');
    const result = demonstrateECBPatternProblem('AAAAAAAAAAAAAAAA', 4, key);
    setPatternDemo(result);
  };

  // Auto-advance steps when playing
  useAutoAdvance(steps.length);

  // Get blocks for diagrams
  const outputStep = blockModeSteps.find((s) => s.type === 'output');
  const splitStep = blockModeSteps.find((s) => s.type === 'split-blocks');

  return (
    <div className="space-y-6 sm:space-y-8">
      <LessonHeader slug="block-modes" title="Block Cipher Modes" description="Compare ECB, CBC, and GCM encryption modes" />

      <p className="text-sm text-slate-600 dark:text-slate-400">Lab scope: XOR-only blocks, a fixed demonstration IV, and a keyed FNV-1a tag illustrate mode structure. This is not AES or secure AES-GCM; the CBC simulation can repeat blocks and the toy tag can collide.</p>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left Column: Input & Visualization */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          {/* Mode Tabs */}
          <div className="glass-card p-4 sm:p-6">
            <div className="flex flex-wrap gap-2 mb-6">
              {(['ecb', 'cbc', 'gcm'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => { setActiveMode(mode); reset(); setSteps([]); }}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                    activeMode === mode
                      ? mode === 'ecb'
                        ? 'bg-red-600 text-white'
                        : mode === 'cbc'
                          ? 'bg-blue-600 text-white'
                          : 'bg-green-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {mode.toUpperCase()}
                  {mode === 'ecb' && (
                    <AlertTriangle className="w-3 h-3 ml-1 inline" />
                  )}
                  {mode === 'gcm' && <Shield className="w-3 h-3 ml-1 inline" />}
                </button>
              ))}
            </div>

            {/* Input Fields */}
            <div className="space-y-4">
              <div>
                <label htmlFor="plaintext-input" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Plaintext Message
                </label>
                <textarea
                  id="plaintext-input"
                  value={plaintext}
                  onChange={(e) => { setPlaintext(e.target.value); setInputError(''); }}
                  maxLength={MAX_VISUALIZATION_BYTES}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Enter message to encrypt..."
                />
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400">{new TextEncoder().encode(plaintext).length} / {MAX_VISUALIZATION_BYTES} UTF-8 bytes. Longer messages exceed the visualization limit.</p>

              <div>
                <label htmlFor="key-input" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Encryption Key (1–16 UTF-8 bytes)
                </label>
                <input
                  id="key-input"
                  type="text"
                  value={key}
                  onChange={(e) => { setKey(e.target.value); setInputError(''); setPatternDemo(null); }}
                  maxLength={16}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Shorter keys are zero-padded..."
                />
              </div>

              {inputError && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{inputError}</p>}

              <div className="flex gap-3">
                <button
                  onClick={handleEncrypt}
                  className={`flex-1 py-3 rounded-xl font-bold text-white transition-all hover:scale-105 active:scale-95 ${
                    activeMode === 'ecb'
                      ? 'bg-red-600 hover:bg-red-700'
                      : activeMode === 'cbc'
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  Encrypt with {activeMode.toUpperCase()}
                </button>
                <button
                  onClick={handleDemoPattern}
                  className="px-4 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
                  title="Demonstrate ECB pattern problem"
                  aria-label="Demonstrate ECB pattern problem"
                >
                  <AlertTriangle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Playback Controls */}
          {steps.length > 0 && (
            <div className="glass-card p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Progress Bar */}
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    activeMode === 'ecb'
                      ? 'bg-red-600'
                      : activeMode === 'cbc'
                        ? 'bg-blue-600'
                        : 'bg-green-600'
                  }`}
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
                    <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
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
                    className={`px-6 sm:px-8 py-3 sm:py-4 rounded-2xl text-white font-bold hover:scale-105 active:scale-95 transition-all ${
                      activeMode === 'ecb'
                        ? 'bg-red-600'
                        : activeMode === 'cbc'
                          ? 'bg-blue-600'
                          : 'bg-green-600'
                    }`}
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
                  <span className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
                    Speed
                  </span>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {[0.5, 1, 2, 4].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSpeed(s)}
                        className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold transition-all ${
                          speed === s
                            ? activeMode === 'ecb'
                              ? 'bg-red-600 text-white'
                              : activeMode === 'cbc'
                                ? 'bg-blue-600 text-white'
                                : 'bg-green-600 text-white'
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
            <BlockModesVisualizer steps={blockModeSteps} currentStep={currentStep} />
          </ErrorBoundary>

          {/* Mode-specific Diagrams */}
          {outputStep && splitStep?.blocks && (
            <>
              {activeMode === 'ecb' && (
                <ECBDiagram
                  plaintextBlocks={splitStep.blocks}
                  ciphertextBlocks={outputStep.blocks || []}
                  currentBlock={blockModeSteps[currentStep]?.currentBlock}
                />
              )}
              {activeMode === 'cbc' && (
                <CBCDiagram
                  plaintextBlocks={splitStep.blocks}
                  ciphertextBlocks={outputStep.blocks || []}
                  iv={outputStep.iv || ''}
                  currentBlock={blockModeSteps[currentStep]?.currentBlock}
                />
              )}
            </>
          )}

          {/* Pattern Demo Results */}
          {patternDemo && (
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                ECB Pattern Problem Demonstration
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Four identical data blocks and one PKCS#7 padding block. ECB repeats the data ciphertext. This XOR-only CBC simulation also repeats blocks; it illustrates chaining, not secure pattern hiding.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-red-50 dark:bg-red-500/10 rounded-xl border border-red-200 dark:border-red-500/30">
                  <div className="text-sm font-bold text-red-600 dark:text-red-400 mb-2">
                    ECB (Patterns Visible!)
                  </div>
                  {patternDemo.ecbCiphertext.map((block, idx) => (
                    <div
                      key={idx}
                      className="text-xs font-mono text-red-700 dark:text-red-300 truncate"
                    >
                      Block {idx + 1}: {block.slice(0, 20)}...
                    </div>
                  ))}
                  <div className="mt-2 text-xs text-red-600 dark:text-red-400 font-bold">
                    The four data blocks match; the final padding block differs.
                  </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-xl border border-blue-200 dark:border-blue-500/30">
                  <div className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-2">
                    CBC (Toy XOR Chaining)
                  </div>
                  {patternDemo.cbcCiphertext.map((block, idx) => (
                    <div
                      key={idx}
                      className="text-xs font-mono text-blue-700 dark:text-blue-300 truncate"
                    >
                      Block {idx + 1}: {block.slice(0, 20)}...
                    </div>
                  ))}
                  <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 font-bold">
                    Distinct ciphertext blocks: {new Set(patternDemo.cbcCiphertext).size} of {patternDemo.cbcCiphertext.length}.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Educational Content */}
        <div id="lesson-notes" className="lesson-notes lg:col-span-1 space-y-4" tabIndex={-1}>
          {/* What are Block Modes */}
          <EducationalCard
            title={blockModesEducationalContent.whatAreBlockModes.title}
            isExpanded={expandedSections.has('whatAreBlockModes')}
            onToggle={() => toggleSection('whatAreBlockModes')}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {blockModesEducationalContent.whatAreBlockModes.content}
              </p>
            </div>
          </EducationalCard>

          {/* ECB Penguin Problem */}
          <EducationalCard
            title={blockModesEducationalContent.ecbPenguinProblem.title}
            isExpanded={expandedSections.has('ecbPenguin')}
            onToggle={() => toggleSection('ecbPenguin')}
          >
            <div className="space-y-3">
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {blockModesEducationalContent.ecbPenguinProblem.explanation}
              </p>
              <div className="space-y-2">
                {blockModesEducationalContent.ecbPenguinProblem.lessons.map(
                  (lesson, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-600 dark:text-slate-400">{lesson}</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </EducationalCard>

          {/* Mode Comparison */}
          <EducationalCard
            title={blockModesEducationalContent.modeComparison.title}
            isExpanded={expandedSections.has('modeComparison')}
            onToggle={() => toggleSection('modeComparison')}
          >
            <div className="space-y-3">
              {blockModesEducationalContent.modeComparison.modes.map((mode, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-white/5 p-3 rounded-xl"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      {mode.name}
                    </h4>
                    {mode.authenticated && (
                      <Shield className="w-3 h-3 text-green-500" />
                    )}
                    {!mode.patternSafe && (
                      <AlertTriangle className="w-3 h-3 text-red-500" />
                    )}
                  </div>
                  <div className="flex gap-2 mb-2">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded ${mode.parallel ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}
                    >
                      {mode.parallel ? 'Parallel' : 'Sequential'}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded ${mode.authenticated ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}
                    >
                      {mode.authenticated ? 'Authenticated' : 'No Auth'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {mode.useCase}
                  </p>
                </div>
              ))}
            </div>
          </EducationalCard>

          {/* Security Notes */}
          <EducationalCard
            title={blockModesEducationalContent.securityNotes.title}
            isExpanded={expandedSections.has('security')}
            onToggle={() => toggleSection('security')}
          >
            <div className="space-y-2">
              {blockModesEducationalContent.securityNotes.notes.map((note, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  {note.type === 'strength' && (
                    <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  )}
                  {note.type === 'warning' && (
                    <AlertTriangle className="w-4 h-4 text-yellow-500 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  )}
                  {note.type === 'danger' && (
                    <XCircle className="w-4 h-4 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
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
            title={blockModesEducationalContent.realWorldUse.title}
            isExpanded={expandedSections.has('realWorld')}
            onToggle={() => toggleSection('realWorld')}
          >
            <div className="grid grid-cols-1 gap-2">
              {blockModesEducationalContent.realWorldUse.examples.map((example, idx) => {
                const Icon = iconMap[example.icon as keyof typeof iconMap] || Globe;
                return (
                  <div
                    key={idx}
                    className="bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-white/5 p-3 rounded-xl flex items-center gap-3"
                  >
                    <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg flex-shrink-0">
                      <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-0.5">
                        {example.name}{' '}
                        <span className="text-[10px] text-slate-500">({example.mode})</span>
                      </h4>
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
            title={blockModesEducationalContent.commonMistakes.title}
            isExpanded={expandedSections.has('commonMistakes')}
            onToggle={() => toggleSection('commonMistakes')}
          >
            <div className="space-y-3">
              {blockModesEducationalContent.commonMistakes.mistakes.map((mistake, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-white/5 p-3 rounded-xl"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="w-4 h-4 text-red-500 dark:text-red-400 flex-shrink-0" />
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      {mistake.mistake}
                    </h4>
                  </div>
                  <p className="text-xs text-red-600 dark:text-red-400 mb-1">{mistake.why}</p>
                  <div className="flex items-start gap-1.5 mt-2">
                    <Lightbulb className="w-3 h-3 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-green-600 dark:text-green-400">
                      {mistake.solution}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </EducationalCard>

          {/* Further Learning */}
          <EducationalCard
            title={blockModesEducationalContent.furtherLearning.title}
            isExpanded={expandedSections.has('furtherLearning')}
            onToggle={() => toggleSection('furtherLearning')}
          >
            <div className="space-y-2">
              {blockModesEducationalContent.furtherLearning.resources.map((resource, idx) => (
                <a
                  key={idx}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-white/5 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-cyber-surface transition-colors group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      {resource.type}
                    </span>
                    <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">
                    {resource.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {resource.description}
                  </p>
                </a>
              ))}
            </div>
          </EducationalCard>

          {/* Interactive Quiz */}
          <QuizSystem
            questions={blockModesQuizQuestions}
            title="Block Modes Knowledge Check"
            algorithmId="block-modes"
          />
        </div>
      </div>
    </div>
  );
};
