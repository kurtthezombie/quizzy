import { Progress } from "@/components/ui/progress";

type QuizHeaderProps = {
  title: string;
  currentIndex: number;
  totalQuestions: number;
  score: number;
};

export function QuizHeader({
  title,
  currentIndex,
  totalQuestions,
  score,
}: QuizHeaderProps) {
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h1 className="text-2xl font-bold">
            Question {currentIndex + 1} of {totalQuestions}
          </h1>
        </div>

        <div className="text-right">
          <p className="text-sm text-muted-foreground">Score</p>
          <p className="font-bold">
            {score} / {totalQuestions}
          </p>
        </div>
      </div>

      <Progress value={progress} />
    </div>
  );
}
