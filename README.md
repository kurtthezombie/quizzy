> “Think, Mark!” — Omni-Man

# Quizzy Reviewer

A frontend-only mini reviewer app.

## Features

- Import reviewer questions using JSON
- Load sample reviewer data
- Answer multiple-choice questions one at a time
- See correct/wrong feedback
- View explanations after answering
- Track score
- See final results
- Perfect-score celebration
- Retry quiz or import another reviewer

## Reviewer JSON Format

```json
{
  "title": "Reviewer title",
  "questions": [
    {
      "id": "q1",
      "question": "Question text",
      "choices": [
        { "id": "a", "text": "Choice A" },
        { "id": "b", "text": "Choice B" },
        { "id": "c", "text": "Choice C" },
        { "id": "d", "text": "Choice D" }
      ],
      "answerId": "a",
      "explanation": "Why this answer is correct."
    }
  ]
}
