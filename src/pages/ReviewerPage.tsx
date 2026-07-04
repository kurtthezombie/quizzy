import { useState } from "react";

import { QuestionCard } from "@/components/QuestionCard";
import { QuizHeader } from "@/components/QuizHeader";
import { ResultCard } from "@/components/ResultCard";
import type { Reviewer } from "@/types/reviewer";

type ReviewerPageProps = {
  reviewer: Reviewer;
  onBackToImport: () => void;
};

export function ReviewerPage({ reviewer, onBackToImport }: ReviewerPageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQuestion = reviewer.questions[currentIndex];
  const isFinished = currentIndex >= reviewer.questions.length;
  const isLastQuestion = currentIndex === reviewer.questions.length - 1;

  function submitAnswer() {
    if (!currentQuestion || !selectedAnswer) return;

    if (selectedAnswer === currentQuestion.answerId) {
      setScore((prev) => prev + 1);
    }

    setIsAnswered(true);
  }

  function nextQuestion() {
    setSelectedAnswer("");
    setIsAnswered(false);
    setCurrentIndex((prev) => prev + 1);
  }

  function resetQuiz() {
    setCurrentIndex(0);
    setSelectedAnswer("");
    setScore(0);
    setIsAnswered(false);
  }

  return (
    <main className="min-h-screen bg-background p-6 text-foreground">
      <div className="mx-auto max-w-3xl space-y-6">
        <section className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Mini Reviewer</h1>
            <p className="text-muted-foreground">
              Answer questions and get instant feedback.
            </p>
          </div>

          <button
            className="text-sm text-muted-foreground hover:text-foreground"
            onClick={onBackToImport}
          >
            Import another
          </button>
        </section>

        {isFinished ? (
          <ResultCard
            score={score}
            totalQuestions={reviewer.questions.length}
            onResetQuiz={resetQuiz}
          />
        ) : (
          <>
            <QuizHeader
              title={reviewer.title}
              currentIndex={currentIndex}
              totalQuestions={reviewer.questions.length}
              score={score}
            />

            <QuestionCard
              question={currentQuestion}
              selectedAnswer={selectedAnswer}
              isAnswered={isAnswered}
              isLastQuestion={isLastQuestion}
              onSelectAnswer={setSelectedAnswer}
              onSubmitAnswer={submitAnswer}
              onNextQuestion={nextQuestion}
            />
          </>
        )}
      </div>
    </main>
  );
}
