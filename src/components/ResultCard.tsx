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
    <Card className="result-card">
      <CardHeader>
        <img className="result-mascot" src="/mascot-result.webp" alt="" width="120" height="120" />
        <CardTitle>Quiz complete.</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="result-score">
          {score} / {totalQuestions}
        </p>

        <p className="text-muted-foreground">You scored {percentage}%.</p>

        {isPerfectScore && (
          <p className="text-2xl font-bold">🎉 You nailed it.</p>
        )}

        <Button onClick={onResetQuiz}>Try again</Button>
      </CardContent>
    </Card>
  );
}
