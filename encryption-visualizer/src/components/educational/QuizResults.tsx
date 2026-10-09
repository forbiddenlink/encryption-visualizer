import React from 'react';
import { m } from 'framer-motion';
import { Trophy, RotateCcw, Award, BookOpen, XCircle, CheckCircle } from 'lucide-react';
import { useProgressStore } from '@/store/progressStore';
import type { QuizQuestion as QuizQuestionType } from '@/lib/types';

interface AnsweredQuestion {
    question: QuizQuestionType;
    selectedOption: number;
    isCorrect: boolean;
}

interface QuizResultsProps {
    score: number;
    totalQuestions: number;
    onRetry: () => void;
    answeredQuestions?: AnsweredQuestion[];
    onReviewMissed?: () => void;
    algorithmId?: string;
    isReviewMode?: boolean;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
    score,
    totalQuestions,
    onRetry,
    answeredQuestions = [],
    onReviewMissed,
    algorithmId,
    isReviewMode = false,
}) => {
    const percentage = Math.round((score / totalQuestions) * 100);
    const getMissedQuestions = useProgressStore((state) => state.getMissedQuestions);
    const hasMissedQuestions = algorithmId
        ? getMissedQuestions(algorithmId).length > 0
        : false;

    let message: string;
    let color: string;

    if (percentage === 100) {
        message = "Flawless! You've mastered this topic completely.";
        color = "text-yellow-400";
    } else if (percentage >= 90) {
        message = "Outstanding! You're a cryptography master!";
        color = "text-yellow-400";
    } else if (percentage >= 80) {
        message = "Excellent work! You have a strong understanding.";
        color = "text-green-400";
    } else if (percentage >= 70) {
        message = "Great job! You have a solid foundation.";
        color = "text-green-400";
    } else if (percentage >= 50) {
        message = "Good effort! Review the sections you missed and try again.";
        color = "text-cyber-blue";
    } else if (percentage >= 30) {
        message = "Keep learning! Read through the educational content and give it another shot.";
        color = "text-cyber-blue";
    } else {
        message = "Don't give up! Start with the beginner sections and work your way up.";
        color = "text-cyber-blue";
    }

    if (isReviewMode) {
        message = 'Practice results do not replace your full quiz score. Retake the full quiz to update your assessment.';
    }

    // Difficulty breakdown
    const difficultyBreakdown = { beginner: { correct: 0, total: 0 }, intermediate: { correct: 0, total: 0 }, advanced: { correct: 0, total: 0 } };
    for (const aq of answeredQuestions) {
        const d = aq.question.difficulty;
        difficultyBreakdown[d].total++;
        if (aq.isCorrect) difficultyBreakdown[d].correct++;
    }

    const wrongAnswers = answeredQuestions.filter((aq) => !aq.isCorrect);

    return (
        <div className="space-y-6 py-6">
            {/* Trophy + Score */}
            <div className="text-center space-y-4">
                <m.div
                    initial={{ scale: 0, rotate: -15 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15, bounce: 0.5 }}
                    className="inline-block"
                >
                    <div className="w-24 h-24 rounded-full bg-yellow-100 dark:bg-yellow-500/20 flex items-center justify-center border-4 border-yellow-500/30 mb-4 mx-auto">
                        <Trophy className="w-12 h-12 text-yellow-500 dark:text-yellow-400" />
                    </div>
                </m.div>

                <div className="space-y-2">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">{isReviewMode ? 'Review Complete!' : 'Quiz Complete!'}</h3>
                    <p className={`text-sm ${color} font-medium`}>{message}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
                    <div className="glass-card p-3 rounded-xl bg-green-100 dark:bg-green-500/10 border-green-500/20">
                        <div className="text-2xl font-black text-green-600 dark:text-green-400">{score}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Correct</div>
                    </div>
                    <div className="glass-card p-3 rounded-xl bg-cyber-blue/10 dark:bg-cyber-blue/10 border-cyber-blue/30">
                        <div className="text-2xl font-black text-cyber-blue dark:text-cyber-cyan">{totalQuestions}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Total</div>
                    </div>
                </div>
            </div>

            {/* Difficulty Breakdown */}
            {answeredQuestions.length > 0 && (
                <div className="glass-card p-4 rounded-xl space-y-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Difficulty Breakdown</h4>
                    {(['beginner', 'intermediate', 'advanced'] as const).map((diff) => {
                        const { correct, total } = difficultyBreakdown[diff];
                        if (total === 0) return null;
                        const pct = Math.round((correct / total) * 100);
                        const colorMap = {
                            beginner: { bar: 'bg-green-500', text: 'text-green-600 dark:text-green-400' },
                            intermediate: { bar: 'bg-yellow-500', text: 'text-yellow-600 dark:text-yellow-400' },
                            advanced: { bar: 'bg-red-500', text: 'text-red-600 dark:text-red-400' },
                        };
                        return (
                            <div key={diff} className="flex items-center gap-3">
                                <span className={`text-xs font-semibold w-24 ${colorMap[diff].text} capitalize`}>
                                    {diff}
                                </span>
                                <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <m.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${pct}%` }}
                                        transition={{ duration: 0.6, delay: 0.2 }}
                                        className={`h-full rounded-full ${colorMap[diff].bar}`}
                                    />
                                </div>
                                <span className="text-xs text-slate-500 dark:text-slate-400 w-12 text-right font-mono">
                                    {correct}/{total}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Wrong Answers Review */}
            {wrongAnswers.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-500" />
                        Questions to Review ({wrongAnswers.length})
                    </h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {wrongAnswers.map((aq) => (
                            <div
                                key={aq.question.id}
                                className="glass-card p-3 rounded-xl border-red-500/10 bg-red-50 dark:bg-red-500/5 space-y-1.5"
                            >
                                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                                    {aq.question.question}
                                </p>
                                <div className="flex items-start gap-1.5">
                                    <XCircle className="w-3 h-3 text-red-500 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-red-600 dark:text-red-400 line-through">
                                        {aq.question.options[aq.selectedOption]}
                                    </p>
                                </div>
                                <div className="flex items-start gap-1.5">
                                    <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-green-600 dark:text-green-400">
                                        {aq.question.options[aq.question.correct]}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
                <button
                    onClick={onRetry}
                    className="btn-primary w-full justify-center"
                >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Try Again
                </button>

                {hasMissedQuestions && onReviewMissed && (
                    <button
                        onClick={onReviewMissed}
                        className="btn-secondary w-full justify-center"
                    >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Review Missed Questions
                    </button>
                )}
            </div>

            {!isReviewMode && algorithmId === 'hashing' && percentage === 100 && (
                <m.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25, delay: 0.4 }}
                    className="glass-card p-3 rounded-xl border-yellow-500/30 bg-yellow-100 dark:bg-yellow-500/5 mt-4 flex items-center justify-center gap-3"
                >
                    <Award className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
                    <span className="text-sm text-yellow-700 dark:text-yellow-200">Hash Master Achievement Unlocked!</span>
                </m.div>
            )}
        </div>
    );
};
