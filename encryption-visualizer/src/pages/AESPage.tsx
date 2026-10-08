import { LessonHeader } from '@/components/learning/LessonHeader';
import { PlaybackControls } from '@/components/controls/PlaybackControls';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useExpandedSections } from '@/hooks/useExpandedSections';
import { AESInputPanel } from '@/components/visualizations/AES/AESInputPanel';
import { LearningResourceSchema } from '@/components/seo/JsonLd';
import { algorithmSchemas } from '@/data/structuredData';
import { AESVisualizer } from '@/components/visualizations/AES/AESVisualizer';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { encryptAESWithSteps } from '@/lib/crypto/aes';
import { useVisualizationStore } from '@/store/visualizationStore';
import { useProgressStore } from '@/store/progressStore';
import { aesEducationalContent } from '@/data/aesEducationalContent';
import {
  AlertTriangle,
  CheckCircle,
  Info,
  Globe,
  FileText,
  Shield,
  Wifi,
  MessageSquare,
  Database,
  XCircle,
  Lightbulb,
  ExternalLink,
  Check,
} from 'lucide-react';
import { QuizSystem } from '@/components/educational/QuizSystem';
import { aesQuizQuestions } from '@/data/quizzes/aesQuiz';
import { EducationalCard } from '@/components/educational/EducationalCard';

const iconMap = {
  globe: Globe,
  file: FileText,
  shield: Shield,
  wifi: Wifi,
  message: MessageSquare,
  database: Database,
};

const AES_SECTIONS = [
  'whatIsAES',
  'fourOperations',
  'keySizes',
  'security',
  'realWorld',
  'commonMistakes',
  'furtherLearning',
] as const;

const ALGORITHM_ID = 'aes';

export const AESPage = () => {
  const location = useLocation();
  const setSteps = useVisualizationStore((state) => state.setSteps);
  const steps = useVisualizationStore((state) => state.steps);
  const reset = useVisualizationStore((state) => state.reset);
  const { expandedSections, toggleSection } = useExpandedSections(['whatIsAES', 'fourOperations']);
  const markSectionViewed = useProgressStore((state) => state.markSectionViewed);
  const sectionProgress = useProgressStore((state) => state.sectionProgress);

  const schemaData = algorithmSchemas.aes;

  const viewedSections = sectionProgress[ALGORITHM_ID] ?? {};
  const viewedCount = Object.values(viewedSections).filter(Boolean).length;
  const totalSections = AES_SECTIONS.length;
  const progressPct = Math.round((viewedCount / totalSections) * 100);

  // Track section views when expanded
  useEffect(() => {
    for (const sectionId of expandedSections) {
      markSectionViewed(ALGORITHM_ID, sectionId);
    }
  }, [expandedSections, markSectionViewed]);

  const handleToggleSection = (sectionId: string) => {
    toggleSection(sectionId);
    // Mark as viewed when expanding (not collapsing)
    if (!expandedSections.has(sectionId)) {
      markSectionViewed(ALGORITHM_ID, sectionId);
    }
  };

  const handleEncrypt = (plaintext: string, key: string) => {
    const steps = encryptAESWithSteps(plaintext, key);
    setSteps(steps);
    reset();
  };

  const isSectionViewed = (sectionId: string): boolean => {
    return viewedSections[sectionId] === true;
  };

  return (
    <>
    <LearningResourceSchema
      {...schemaData}
      url={`https://cryptoviz.app${location.pathname}`}
    />
    <div className="space-y-6 sm:space-y-8">
      <LessonHeader slug="aes" title="AES Encryption Visualizer" description="Explore the Advanced Encryption Standard step-by-step" />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left Column: Input & Visualization */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          <AESInputPanel onEncrypt={handleEncrypt} />
          {steps.length > 0 && <PlaybackControls />}
          <ErrorBoundary>
            <AESVisualizer />
          </ErrorBoundary>
        </div>

        {/* Right Column: Educational Content */}
        <div id="lesson-notes" className="lesson-notes lg:col-span-1 space-y-4" tabIndex={-1}>
          {/* Section Progress Header */}
          <div className="glass-card p-3 rounded-xl flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Section Progress
                </span>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  {viewedCount}/{totalSections}
                </span>
              </div>
              <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 dark:bg-purple-400 rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
            {progressPct === 100 && (
              <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0" />
            )}
          </div>

          {/* What is AES? */}
          <EducationalCard
            title={
              <span className="flex items-center gap-2">
                {isSectionViewed('whatIsAES') && <Check className="w-3.5 h-3.5 text-green-500 dark:text-green-400" />}
                {aesEducationalContent.whatIsAES.title}
              </span>
            }
            isExpanded={expandedSections.has('whatIsAES')}
            onToggle={() => handleToggleSection('whatIsAES')}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 dark:bg-cyber-blue/20 rounded-lg">
                <Info className="w-5 h-5 text-blue-600 dark:text-cyber-cyan" />
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {aesEducationalContent.whatIsAES.content}
              </p>
            </div>
          </EducationalCard>

          {/* The Four Operations */}
          <EducationalCard
            title={
              <span className="flex items-center gap-2">
                {isSectionViewed('fourOperations') && <Check className="w-3.5 h-3.5 text-green-500 dark:text-green-400" />}
                {aesEducationalContent.fourOperations.title}
              </span>
            }
            isExpanded={expandedSections.has('fourOperations')}
            onToggle={() => handleToggleSection('fourOperations')}
          >
            <div className="space-y-3">
              {aesEducationalContent.fourOperations.operations.map((op, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-white/5 p-3 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: op.color }}
                    />
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{op.name}</h4>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">{op.description}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-500">{op.detail}</p>
                </div>
              ))}
            </div>
          </EducationalCard>

          {/* Key Sizes */}
          <EducationalCard
            title={
              <span className="flex items-center gap-2">
                {isSectionViewed('keySizes') && <Check className="w-3.5 h-3.5 text-green-500 dark:text-green-400" />}
                {aesEducationalContent.keySize.title}
              </span>
            }
            isExpanded={expandedSections.has('keySizes')}
            onToggle={() => handleToggleSection('keySizes')}
          >
            <div className="space-y-3">
              {aesEducationalContent.keySize.variants.map((variant, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-white/5 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-blue-600 dark:text-cyber-cyan">{variant.bits}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{variant.rounds} rounds</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mb-1">{variant.description}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{variant.usage}</p>
                </div>
              ))}
            </div>
          </EducationalCard>

          {/* Security Notes */}
          <EducationalCard
            title={
              <span className="flex items-center gap-2">
                {isSectionViewed('security') && <Check className="w-3.5 h-3.5 text-green-500 dark:text-green-400" />}
                {aesEducationalContent.securityNotes.title}
              </span>
            }
            isExpanded={expandedSections.has('security')}
            onToggle={() => handleToggleSection('security')}
          >
            <div className="space-y-2">
              {aesEducationalContent.securityNotes.notes.map((note, idx) => (
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
            title={
              <span className="flex items-center gap-2">
                {isSectionViewed('realWorld') && <Check className="w-3.5 h-3.5 text-green-500 dark:text-green-400" />}
                {aesEducationalContent.realWorldUse.title}
              </span>
            }
            isExpanded={expandedSections.has('realWorld')}
            onToggle={() => handleToggleSection('realWorld')}
          >
            <div className="grid grid-cols-2 gap-2">
              {aesEducationalContent.realWorldUse.examples.map((example, idx) => {
                const Icon = iconMap[example.icon as keyof typeof iconMap] || Globe;
                return (
                  <div key={idx} className="bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-white/5 p-3 rounded-lg text-center">
                    <div className="flex justify-center mb-2">
                      <div className="p-2 bg-blue-100 dark:bg-cyber-blue/20 rounded-lg">
                        <Icon className="w-4 h-4 text-blue-600 dark:text-cyber-cyan" />
                      </div>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">{example.name}</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">{example.description}</p>
                  </div>
                );
              })}

            </div>
          </EducationalCard>

          {/* Common Mistakes */}
          <EducationalCard
            title={
              <span className="flex items-center gap-2">
                {isSectionViewed('commonMistakes') && <Check className="w-3.5 h-3.5 text-green-500 dark:text-green-400" />}
                {aesEducationalContent.commonMistakes.title}
              </span>
            }
            isExpanded={expandedSections.has('commonMistakes')}
            onToggle={() => handleToggleSection('commonMistakes')}
          >
            <div className="space-y-3">
              {aesEducationalContent.commonMistakes.mistakes.map((mistake, idx) => (
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
            title={
              <span className="flex items-center gap-2">
                {isSectionViewed('furtherLearning') && <Check className="w-3.5 h-3.5 text-green-500 dark:text-green-400" />}
                {aesEducationalContent.furtherLearning.title}
              </span>
            }
            isExpanded={expandedSections.has('furtherLearning')}
            onToggle={() => handleToggleSection('furtherLearning')}
          >
            <div className="space-y-2">
              {aesEducationalContent.furtherLearning.resources.map((resource, idx) => (
                <a
                  key={idx}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-white/5 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-cyber-surface transition-colors group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-semibold text-blue-600 dark:text-cyber-cyan uppercase tracking-wider">
                      {resource.type}
                    </span>
                    <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">{resource.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{resource.description}</p>
                </a>
              ))}
            </div>
          </EducationalCard>

          {/* Interactive Quiz */}
          <QuizSystem questions={aesQuizQuestions} title="AES Knowledge Check" algorithmId="aes" />
        </div>
      </div>
    </div>
    </>
  );
};
