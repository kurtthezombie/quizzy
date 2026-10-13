import type { Choice } from "@/types/reviewer";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type ChoiceListProps = {
  choices: Choice[];
  answerId: string;
  selectedAnswer: string;
  isAnswered: boolean;
  onSelectAnswer: (value: string) => void;
};

export function ChoiceList({
  choices,
  answerId,
  selectedAnswer,
  isAnswered,
  onSelectAnswer,
}: ChoiceListProps) {
  return (
    <RadioGroup
      value={selectedAnswer}
      onValueChange={onSelectAnswer}
      disabled={isAnswered}
    >
      {choices.map((choice) => {
        const isSelected = selectedAnswer === choice.id;
        const isAnswer = answerId === choice.id;

        return (
          <Label
            key={choice.id}
            className={[
              "choice-row flex cursor-pointer items-center gap-3 rounded-lg border p-4",
              isSelected && !isAnswered ? "choice-selected" : "",
              isAnswered && isAnswer ? "border-green-500 bg-green-500/10" : "",
              isAnswered && isSelected && !isAnswer
                ? "border-red-500 bg-red-500/10"
                : "",
            ].join(" ")}
          >
            <RadioGroupItem value={choice.id} />
            <span className="choice-letter" aria-hidden="true">{choice.id.toUpperCase()}</span><span>{choice.text}</span>{isAnswered && isAnswer && <span className="sr-only">Correct answer</span>}
          </Label>
        );
      })}
    </RadioGroup>
  );
}
