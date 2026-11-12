export const initialQuizState = {
  currentIndex: 0,
  answers: [],
  phase: "quiz",
};

export function quizReducer(state, action) {
  switch (action.type) {
    case "submit": {
      if (
        state.phase !== "quiz" ||
        state.answers.some(
          (answer) => answer.questionId === action.questionId,
        )
      ) {
        return state;
      }

      return {
        ...state,
        answers: [
          ...state.answers,
          {
            questionId: action.questionId,
            selectedAnswer: action.selectedAnswer,
            isCorrect: action.selectedAnswer === action.correctAnswer,
          },
        ],
      };
    }

    case "next": {
      if (state.phase !== "quiz") return state;

      const currentQuestion = action.questions[state.currentIndex];
      const hasSubmittedCurrentQuestion = state.answers.some(
        (answer) => answer.questionId === currentQuestion?.id,
      );

      if (!hasSubmittedCurrentQuestion) return state;

      if (state.currentIndex === action.questions.length - 1) {
        return { ...state, phase: "results" };
      }

      return { ...state, currentIndex: state.currentIndex + 1 };
    }

    case "restart":
      return { ...initialQuizState };

    default:
      return state;
  }
}

export function filterPracticeQuestions(questions, topic) {
  return topic === "mixed"
    ? questions
    : questions.filter((question) => question.topic === topic);
}

export function calculateQuizScore(answers) {
  return answers.filter((answer) => answer.isCorrect).length;
}

export function getMissedQuestions(questions, answers) {
  return questions.filter((question) => {
    const submission = answers.find(
      (answer) => answer.questionId === question.id,
    );
    return submission && !submission.isCorrect;
  });
}
