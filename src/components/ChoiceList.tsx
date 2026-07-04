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
              "flex cursor-pointer items-center gap-3 rounded-lg border p-4",
              isAnswered && isAnswer ? "border-green-500 bg-green-500/10" : "",
              isAnswered && isSelected && !isAnswer
                ? "border-red-500 bg-red-500/10"
                : "",
            ].join(" ")}
          >
            <RadioGroupItem value={choice.id} />
            <span>{choice.text}</span>
          </Label>
        );
      })}
    </RadioGroup>
  );
}
