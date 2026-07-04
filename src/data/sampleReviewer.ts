import type { Reviewer } from "@/types/reviewer";

export const sampleReviewer: Reviewer = {
  title: "JavaScript Basics",
  questions: [
    {
      id: "q1",
      question: "What does const prevent?",
      choices: [
        { id: "a", text: "Reassignment" },
        { id: "b", text: "Mutation" },
        { id: "c", text: "Execution" },
        { id: "d", text: "Rendering" },
      ],
      answerId: "a",
      explanation:
        "const prevents reassignment, but object and array contents can still be changed.",
    },
    {
      id: "q2",
      question: "Which array method returns a new array?",
      choices: [
        { id: "a", text: "forEach" },
        { id: "b", text: "map" },
        { id: "c", text: "push" },
        { id: "d", text: "pop" },
      ],
      answerId: "b",
      explanation: "map() returns a new array from the callback result.",
    },
  ],
};
