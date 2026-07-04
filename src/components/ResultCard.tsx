import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ResultCardProps = {
  score: number;
  totalQuestions: number;
  onResetQuiz: () => void;
};

export function ResultCard({
  score,
  totalQuestions,
  onResetQuiz,
}: ResultCardProps) {
  const percentage = Math.round((score / totalQuestions) * 100);
  const isPerfectScore = score === totalQuestions;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz Complete</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-5xl font-bold">
          {score} / {totalQuestions}
        </p>

        <p className="text-muted-foreground">You scored {percentage}%.</p>

        {isPerfectScore && (
          <p className="text-2xl font-bold">🎉 You nailed it.</p>
        )}

        <Button onClick={onResetQuiz}>Retry Quiz</Button>
      </CardContent>
    </Card>
  );
}
