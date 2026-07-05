import type { Question } from "@/types/reviewer";

import { ChoiceList } from "@/components/ChoiceList";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type QuestionCardProps = {
  question: Question;
  selectedAnswer: string;
  isAnswered: boolean;
  isLastQuestion: boolean;
  onSelectAnswer: (value: string) => void;
  onSubmitAnswer: () => void;
  onNextQuestion: () => void;
};

export function QuestionCard({
  question,
  selectedAnswer,
  isAnswered,
  isLastQuestion,
  onSelectAnswer,
  onSubmitAnswer,
  onNextQuestion,
}: QuestionCardProps) {
  const isCorrect = selectedAnswer === question.answerId;

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <h2 className="text-xl font-semibold whitespace-pre-wrap">{question.question}</h2>
        {question.code && (
          <pre className="mt-4 overflow-x-auto rounded-md bg-muted p-4 text-sm">
            <code>{question.code}</code>
          </pre>
        )}

        <ChoiceList
          choices={question.choices}
          answerId={question.answerId}
          selectedAnswer={selectedAnswer}
          isAnswered={isAnswered}
          onSelectAnswer={onSelectAnswer}
        />

        {isAnswered && (
          <Alert variant={isCorrect ? "default" : "destructive"}>
            <AlertTitle>{isCorrect ? "Correct" : "Wrong"}</AlertTitle>
            <AlertDescription>
              {question.explanation ?? "No explanation provided."}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end">
          {!isAnswered ? (
            <Button onClick={onSubmitAnswer} disabled={!selectedAnswer}>
              Submit Answer
            </Button>
          ) : (
            <Button onClick={onNextQuestion}>
              {isLastQuestion ? "Finish" : "Next Question"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
