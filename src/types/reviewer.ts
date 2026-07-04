export type Choice = {
  id: string;
  text: string;
};

export type Question = {
  id: string,
  question: string,
  choices: Choice[],
  answerId: string;
  explanation?: string;
};

export type Reviewer = {
  title: string;
  questions: Question[];
};

