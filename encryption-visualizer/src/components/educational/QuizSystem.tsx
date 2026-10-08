import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { ChevronRight, Zap } from 'lucide-react';
import { QuizQuestion } from './QuizQuestion';
import { QuizResults } from './QuizResults';
import { useProgressStore } from '@/store/progressStore';
import type { QuizQuestion as QuizQuestionType } from '@/lib/types';

interface QuizSystemProps {
    questions: QuizQuestionType[];
    title?: string;
    algorithmId?: string;
}

const QUIZ_SIZE = 10;
const DIFFICULTY_TIERS: { difficulty: QuizQuestionType['difficulty']; count: number }[] = [
    { difficulty: 'beginner', count: 3 },
    { difficulty: 'intermediate', count: 4 },
    { difficulty: 'advanced', count: 3 },
];

/** Shuffle array and take up to `count` items */
const shuffleAndSlice = (arr: QuizQuestionType[], count: number): QuizQuestionType[] => {
    return [...arr].sort(() => Math.random() - 0.5).slice(0, count);
};

/**
 * Build a quiz with difficulty progression:
 * 3 beginner, 4 intermediate, 3 advanced (randomized within each tier).
 * Falls back gracefully when there aren't enough questions in a tier.
 */
const buildQuiz = (questions: QuizQuestionType[], maxSize: number): QuizQuestionType[] => {
    const byDifficulty: Record<string, QuizQuestionType[]> = {
        beginner: [],
        intermediate: [],
        advanced: [],
    };
    for (const q of questions) {
        byDifficulty[q.difficulty]?.push(q);
    }

    const selected: QuizQuestionType[] = [];
    let remaining = maxSize;

    for (const tier of DIFFICULTY_TIERS) {
        const pool = byDifficulty[tier.difficulty] ?? [];
        const take = Math.min(tier.count, pool.length, remaining);
        selected.push(...shuffleAndSlice(pool, take));
        remaining -= take;
    }

    // If we still have room (not enough questions in tiers), fill from all remaining
    if (remaining > 0) {
        const selectedIds = new Set(selected.map((q) => q.id));
        const leftover = questions.filter((q) => !selectedIds.has(q.id));
        selected.push(...shuffleAndSlice(leftover, remaining));
    }

    return selected;
};

/** Build a quiz from only specific question IDs (for review mode) */
const buildReviewQuiz = (
    questions: QuizQuestionType[],
    questionIds: string[],
): QuizQuestionType[] => {
    const idSet = new Set(questionIds);
    const matched = questions.filter((q) => idSet.has(q.id));
    return [...matched].sort(() => Math.random() - 0.5);
};

export const QuizSystem: React.FC<QuizSystemProps> = ({
    questions,
    title = "Knowledge Check",
    algorithmId,
}) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const [quizKey, setQuizKey] = useState(0);
    const [isReviewMode, setIsReviewMode] = useState(false);
    const [answeredQuestions, setAnsweredQuestions] = useState<
        { question: QuizQuestionType; selectedOption: number; isCorrect: boolean }[]
    >([]);

    const saveQuizScore = useProgressStore((state) => state.saveQuizScore);
    const addMissedQuestion = useProgressStore((state) => state.addMissedQuestion);
    const removeMissedQuestion = useProgressStore((state) => state.removeMissedQuestion);
    const getMissedQuestions = useProgressStore((state) => state.getMissedQuestions);

    // Shuffle questions on mount or when quizKey changes (for retry)
    const shuffledQuestions = useMemo(() => {
        void quizKey;
        if (isReviewMode && algorithmId) {
            const missedIds = getMissedQuestions(algorithmId);
            if (missedIds.length > 0) {
                return buildReviewQuiz(questions, missedIds);
            }
        }
        return buildQuiz(questions, QUIZ_SIZE);
    }, [questions, quizKey, isReviewMode, algorithmId, getMissedQuestions]);

    // Save score when quiz is completed
    useEffect(() => {
        if (isCompleted && algorithmId && !isReviewMode) {
            saveQuizScore(algorithmId, score, shuffledQuestions.length);
        }
    }, [isCompleted, algorithmId, score, shuffledQuestions.length, saveQuizScore, isReviewMode]);

    const resetQuiz = useCallback(() => {
        setQuizKey((prev) => prev + 1);
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setIsSubmitted(false);
        setScore(0);
        setIsCompleted(false);
        setIsReviewMode(false);
        setAnsweredQuestions([]);
    }, []);

    const startReviewQuiz = useCallback(() => {
        setIsReviewMode(true);
        setQuizKey((prev) => prev + 1);
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setIsSubmitted(false);
        setScore(0);
        setIsCompleted(false);
        setAnsweredQuestions([]);
    }, []);

    const currentQuestion = shuffledQuestions[currentQuestionIndex];

    const handleSelectOption = (index: number) => {
        setSelectedOption(index);
        setIsSubmitted(true);

        const isCorrect = index === currentQuestion.correct;

        if (isCorrect) {
            setScore((prev) => prev + 1);
            // Remove from missed if answered correctly on retry
            if (algorithmId) {
                removeMissedQuestion(algorithmId, currentQuestion.id);
            }
        } else {
            // Track missed question
            if (algorithmId) {
                addMissedQuestion(algorithmId, currentQuestion.id);
            }
        }

        setAnsweredQuestions((prev) => [
            ...prev,
            { question: currentQuestion, selectedOption: index, isCorrect },
        ]);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < shuffledQuestions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
            setSelectedOption(null);
            setIsSubmitted(false);
        } else {
            setIsCompleted(true);
        }
    };

    if (shuffledQuestions.length === 0) {
        return null;
    }

    return (
        <div id="lesson-quiz" className="glass-card overflow-hidden" tabIndex={-1}>
            {/* Quiz Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
                    {isReviewMode ? `${title} - Review` : title}
                </h3>
                {!isCompleted && (
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                        {currentQuestionIndex + 1} / {shuffledQuestions.length}
                    </span>
                )}
            </div>

            <div className="p-4">
                <AnimatePresence mode="wait">
                    {!isCompleted ? (
                        <m.div
                            key={currentQuestion.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <QuizQuestion
                                question={currentQuestion}
                                selectedOption={selectedOption}
                                onSelectOption={handleSelectOption}
                                isSubmitted={isSubmitted}
                                currentIndex={currentQuestionIndex}
                                totalQuestions={shuffledQuestions.length}
                            />

                            {isSubmitted && (
                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={handleNextQuestion}
                                        className="btn-primary"
                                    >
                                        {currentQuestionIndex < shuffledQuestions.length - 1 ? (
                                            <>
                                                Next Question
                                                <ChevronRight className="w-4 h-4 ml-1" />
                                            </>
                                        ) : (
                                            <>
                                                See Results
                                                <Zap className="w-4 h-4 ml-1" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </m.div>
                    ) : (
                        <QuizResults
                            score={score}
                            totalQuestions={shuffledQuestions.length}
                            onRetry={resetQuiz}
                            answeredQuestions={answeredQuestions}
                            onReviewMissed={startReviewQuiz}
                            algorithmId={algorithmId}
                            isReviewMode={isReviewMode}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
