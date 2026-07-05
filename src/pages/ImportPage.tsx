import { useState } from "react";

import type { Reviewer } from "@/types/reviewer";
import { sampleReviewer } from "@/data/sampleReviewer";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type ImportPageProps = {
  onStartReviewer: (reviewer: Reviewer) => void;
};

export function ImportPage({ onStartReviewer }: ImportPageProps) {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState("");

  const [topic, setTopic] = useState("");
  const [questionCount, setQuestionCount] = useState("15");
  const [difficulty, setDifficulty] = useState("Medium-Hard");
  const [questionStyle, setQuestionStyle] = useState("Mixed");

  const aiPrompt = `Create a reviewer JSON for the topic: ${topic}.

Question count: ${questionCount}
Difficulty: ${difficulty}
Question style: ${questionStyle}

Follow this exact JSON structure:
{
  "title": "Reviewer title here",
  "questions": [
    {
      "id": "q1",
      "question": "Question text here",
      "code": "Optional code snippet here. Omit this field if there is no code.",
      "choices": [
        { "id": "a", "text": "Choice A" },
        { "id": "b", "text": "Choice B" },
        { "id": "c", "text": "Choice C" },
        { "id": "d", "text": "Choice D" }
      ],
      "answerId": "a",
      "explanation": "Explain why the answer is correct."
    }
  ]
}

Rules:
- Return valid JSON only.
- Do not use markdown.
- Do not wrap the JSON in code fences.
- Use unique question ids like q1, q2, q3.
- Each question must have exactly 4 choices.
- Choice ids must be exactly a, b, c, d.
- answerId must match one of the choice ids.
- Include an explanation for every question.
- Generate exactly ${questionCount} questions.
- Randomize the correct answer position across a, b, c, and d.
- Do not make the correct answer always the same choice.
- Distribute correct answers as evenly as possible.
- Make the difficulty ${difficulty}.
- Use a ${questionStyle} question style.
- Make incorrect choices plausible and close enough to make users think carefully.
- Avoid joke answers, obviously wrong answers, or filler choices.
- For questions with code snippets, put the code in the optional "code" field, not inside the "question" field.
- Omit the "code" field when the question has no code snippet.
- Keep the "question" field as plain question text only.
- Avoid double quotes inside code snippets when possible. Use single quotes for character output, such as std::cout << ' ';.
- If double quotes are unavoidable inside any JSON string value, escape them properly as \\".
- Return strictly parseable JSON.
- Questions should require understanding, not just memorization.
- Keep explanations clear and concise.`;

  function validateReviewer(value: unknown): Reviewer {
    const reviewer = value as Reviewer;

    if (!reviewer.title || !Array.isArray(reviewer.questions)) {
      throw new Error("Invalid reviewer format.");
    }

    if (reviewer.questions.length === 0) {
      throw new Error("Reviewer must have at least one question.");
    }

    for (const question of reviewer.questions) {
      if (
        !question.id ||
        !question.question ||
        !Array.isArray(question.choices) ||
        !question.answerId
      ) {
        throw new Error("One or more questions are missing required fields.");
      }

      if (question.choices.length !== 4) {
        throw new Error(`Question "${question.id}" must have exactly 4 choices.`);
      }

      const hasAnswer = question.choices.some(
        (choice) => choice.id === question.answerId
      );

      if (!hasAnswer) {
        throw new Error(`Question "${question.id}" has an invalid answerId.`);
      }
    }

    return reviewer;
  }

  function handleLoadReviewer() {
    try {
      const parsed = JSON.parse(jsonInput);
      const validReviewer = validateReviewer(parsed);

      setError("");
      onStartReviewer(validReviewer);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Invalid JSON or reviewer structure."
      );
    }
  }

  function handleUseSample() {
    setJsonInput(JSON.stringify(sampleReviewer, null, 2));
    setError("");
  }

  async function handleCopyPrompt() {
    await navigator.clipboard.writeText(aiPrompt);
  }

  return (
    <main className="min-h-screen bg-background p-6 text-foreground">
      <div className="mx-auto max-w-3xl space-y-6">
        <section>
          <h1 className="text-3xl font-bold">Mini Reviewer</h1>
          <p className="text-muted-foreground">
            Paste a reviewer JSON, then start answering.
          </p>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Import Reviewer</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <Textarea
              className="min-h-[420px] font-mono text-sm"
              placeholder="Paste reviewer JSON here..."
              value={jsonInput}
              onChange={(event) => setJsonInput(event.target.value)}
            />

            <div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="font-medium text-foreground">
                  AI prompt for generating reviewer JSON
                </p>

                <Button variant="outline" size="sm" onClick={handleCopyPrompt}>
                  Copy Prompt
                </Button>
              </div>

              <div className="mb-4 grid gap-3 sm:grid-cols-2">
                <label className="space-y-1">
                  <span className="text-xs font-medium text-foreground">
                    Topic
                  </span>
                  <input
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground"
                    value={topic}
                    onChange={(event) => setTopic(event.target.value)}
                    placeholder="C++ Junior Level"
                  />
                </label>

                <label className="space-y-1">
                  <span className="text-xs font-medium text-foreground">
                    Number of questions
                  </span>
                  <input
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground"
                    type="number"
                    min="1"
                    value={questionCount}
                    onChange={(event) => setQuestionCount(event.target.value)}
                  />
                </label>

                <label className="space-y-1">
                  <span className="text-xs font-medium text-foreground">
                    Difficulty
                  </span>
                  <select
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground"
                    value={difficulty}
                    onChange={(event) => setDifficulty(event.target.value)}
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Medium-Hard</option>
                    <option>Hard</option>
                  </select>
                </label>

                <label className="space-y-1">
                  <span className="text-xs font-medium text-foreground">
                    Question style
                  </span>
                  <select
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground"
                    value={questionStyle}
                    onChange={(event) => setQuestionStyle(event.target.value)}
                  >
                    <option>Mixed</option>
                    <option>Conceptual</option>
                    <option>Code-based</option>
                    <option>Scenario-based</option>
                  </select>
                </label>
              </div>

              <pre className="whitespace-pre-wrap rounded-md bg-background p-3 text-xs">
                {aiPrompt}
              </pre>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={handleLoadReviewer} disabled={!jsonInput.trim()}>
                Start Reviewer
              </Button>

              <Button variant="outline" onClick={handleUseSample}>
                Use Sample JSON
              </Button>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTitle>Import Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
