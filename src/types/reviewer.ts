export type ChoiceId = "a" | "b" | "c" | "d";

export type Choice = {
  id: ChoiceId;
  text: string;
};

export type Question = {
  id: string;
  question: string
  code?: string;
  choices: Choice[];
  answerId: ChoiceId;
  explanation?: string;
};

export type Reviewer = {
  title: string;
  questions: Question[];
};

