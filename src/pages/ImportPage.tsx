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
              <p className="mb-2 font-medium text-foreground">
                AI prompt for generating reviewer JSON
              </p>

              <pre className="whitespace-pre-wrap rounded-md bg-background p-3 text-xs">
              {`Create a reviewer JSON for the topic: [TOPIC].

              Follow this exact JSON structure:
              {
              "title": "Reviewer title here",
              "questions": [
                {
                  "id": "q1",
                  "question": "Question text here",
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
              - choice ids must be a, b, c, d.
              - answerId must match one of the choice ids.
              - Include an explanation for every question.
              - Generate [NUMBER] questions.`}
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
