import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import QuestionCard from "../QuestionCard";
import type { Question } from "@/data/questions";

const makeQuestion = (text: string): Question => ({
  id: text,
  text,
  category: "history",
  difficulty: "easy",
  era: "modern",
  correctId: "a",
  answers: [
    { id: "a", text: "Correct" },
    { id: "b", text: "Wrong" },
  ],
} as unknown as Question);

describe("QuestionCard layout guard", () => {
  it("wrapper retains h-full so card height is governed by parent, not content", () => {
    const { getByTestId, rerender } = render(
      <QuestionCard question={makeQuestion("Short?")} animKey={0} answered={false} />
    );
    const card = getByTestId("question-card");
    expect(card.className).toContain("h-full");

    rerender(
      <QuestionCard
        question={makeQuestion("A much longer question that wraps across multiple lines to verify height stays driven by the parent container?")}
        animKey={1}
        answered={false}
      />
    );
    expect(getByTestId("question-card").className).toContain("h-full");
  });
});
