import React from "react";
import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import '@testing-library/jest-dom';
import Question from "../components/Question";

jest.useFakeTimers();

test("creates an interval with setTimeout", () => {
  const question = {
    prompt: "What is 2 + 2?",
    answers: ["3", "4", "5", "6"],
    correctIndex: 1,
  };
  const handleAnswered = jest.fn();
  render(<Question question={question} onAnswered={handleAnswered} />);

  expect(screen.getByText(/10 seconds remaining/i)).toBeInTheDocument();
});

test("decrements the timer by 1 every second", () => {
  const question = {
    prompt: "Test?",
    answers: ["A", "B"],
    correctIndex: 0,
  };
  const handleAnswered = jest.fn();

  render(<Question question={question} onAnswered={handleAnswered} />);

  act(() => {
    jest.advanceTimersByTime(1000);
  });

  expect(screen.getByText(/9 seconds remaining/i)).toBeInTheDocument();
});

test("calls onAnswered after 10 seconds", () => {
  const question = {
    prompt: "Test?",
    answers: ["A", "B"],
    correctIndex: 0,
  };
  const handleAnswered = jest.fn();

  render(<Question question={question} onAnswered={handleAnswered} />);

  act(() => {
    for (let i = 0; i < 10; i++) {
      jest.advanceTimersByTime(1000);
    }
  });

  expect(handleAnswered).toHaveBeenCalledWith(false);
});

test("clears the timeout after unmount", () => {
  const question = {
    prompt: "Test?",
    answers: ["A", "B"],
    correctIndex: 0,
  };
  const handleAnswered = jest.fn();

  const { unmount } = render(
    <Question question={question} onAnswered={handleAnswered} />
  );

  unmount();

  act(() => {
    jest.advanceTimersByTime(1000);
  });

  expect(handleAnswered).not.toHaveBeenCalled();
});
