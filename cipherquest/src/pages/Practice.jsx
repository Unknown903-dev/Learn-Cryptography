import { useReducer, useState } from "react";
import { Link } from "react-router-dom";
import {
  practiceQuestions,
  practiceTopics,
} from "../data/practiceQuestions";
import {
  calculateQuizScore,
  filterPracticeQuestions,
  getMissedQuestions,
  initialQuizState,
  quizReducer,
} from "../utils/practice";

function Practice() {
  const [topic, setTopic] = useState("mixed");
  const [{ currentIndex, answers, phase }, dispatch] = useReducer(
    quizReducer,
    initialQuizState,
  );

  const activeQuestions = filterPracticeQuestions(practiceQuestions, topic);
  const currentQuestion = activeQuestions[currentIndex];
  const currentSubmission = currentQuestion
    ? answers.find((answer) => answer.questionId === currentQuestion.id)
    : null;
  const score = calculateQuizScore(answers);
  const missedQuestions = getMissedQuestions(activeQuestions, answers);

  const resetQuiz = (nextTopic = topic) => {
    setTopic(nextTopic);
    dispatch({ type: "restart" });
  };

  const submitAnswer = (selectedAnswer) => {
    if (!currentQuestion) return;

    dispatch({
      type: "submit",
      questionId: currentQuestion.id,
      selectedAnswer,
      correctAnswer: currentQuestion.answer,
    });
  };

  const nextQuestion = () => {
    dispatch({ type: "next", questions: activeQuestions });
  };

  return (
    <section>
      <div className="page-header">
        <p className="eyebrow">Practice Mode</p>
        <h1>Crypto Review Quiz</h1>
        <p>
          Review concepts from across CipherQuest with immediate explanations
          and direct links back to each lesson.
        </p>
      </div>

      <div className="demo-panel">
        <div className="practice-toolbar">
          <label htmlFor="practice-topic">
            Quiz topic
            <select
              id="practice-topic"
              value={topic}
              onChange={(event) => resetQuiz(event.target.value)}
            >
              <option value="mixed">Mixed review ({practiceQuestions.length} questions)</option>
              {practiceTopics.map((topicName) => {
                const count = practiceQuestions.filter(
                  (question) => question.topic === topicName,
                ).length;
                return (
                  <option value={topicName} key={topicName}>
                    {topicName} ({count})
                  </option>
                );
              })}
            </select>
          </label>

          <div className="practice-score" aria-live="polite">
            <span>Current score</span>
            <strong>{score} / {answers.length} answered</strong>
          </div>
        </div>

        {phase === "quiz" && currentQuestion && (
          <div className="quiz-card">
            <div className="quiz-progress-row">
              <div>
                <span className="badge">{currentQuestion.topic}</span>
                <p>Question {currentIndex + 1} of {activeQuestions.length}</p>
              </div>
              <progress
                value={currentIndex + 1}
                max={activeQuestions.length}
                aria-label={`Question ${currentIndex + 1} of ${activeQuestions.length}`}
              />
            </div>

            <h2>{currentQuestion.question}</h2>

            <div className="answer-list quiz-options">
              {currentQuestion.options.map((option, index) => {
                let answerState = "";

                if (currentSubmission) {
                  if (index === currentQuestion.answer) {
                    answerState = "correct-answer";
                  } else if (index === currentSubmission.selectedAnswer) {
                    answerState = "incorrect-answer";
                  }
                }

                return (
                  <button
                    className={`answer-button ${answerState}`}
                    type="button"
                    disabled={Boolean(currentSubmission)}
                    aria-pressed={currentSubmission?.selectedAnswer === index}
                    onClick={() => submitAnswer(index)}
                    key={option}
                  >
                    <span>{option}</span>
                    {answerState === "correct-answer" && <strong>Correct</strong>}
                    {answerState === "incorrect-answer" && <strong>Your answer</strong>}
                  </button>
                );
              })}
            </div>

            {currentSubmission && (
              <div className="explanation-box quiz-explanation" aria-live="polite">
                <h2>{currentSubmission.isCorrect ? "Correct" : "Not quite"}</h2>
                <p>{currentQuestion.explanation}</p>
                <p>
                  <Link className="inline-link" to={currentQuestion.lesson.path}>
                    Review: {currentQuestion.lesson.label}
                  </Link>
                </p>
                <button className="btn primary" type="button" onClick={nextQuestion}>
                  {currentIndex === activeQuestions.length - 1
                    ? "See results"
                    : "Next question"}
                </button>
              </div>
            )}
          </div>
        )}

        {phase === "results" && (
          <div className="quiz-results" aria-live="polite">
            <p className="eyebrow">Quiz Complete</p>
            <h2>Your score: {score} / {activeQuestions.length}</h2>
            <p>
              {score === activeQuestions.length
                ? "Perfect score—every concept in this quiz is looking strong."
                : "Use the review links below to revisit anything you missed."}
            </p>

            {missedQuestions.length === 0 ? (
              <div className="success-callout">No missed questions.</div>
            ) : (
              <div className="missed-question-list">
                <h3>Questions to review</h3>
                {missedQuestions.map((question) => {
                  const submission = answers.find(
                    (answer) => answer.questionId === question.id,
                  );
                  return (
                    <article key={question.id}>
                      <span className="badge">{question.topic}</span>
                      <h4>{question.question}</h4>
                      <p>
                        Your answer: {question.options[submission.selectedAnswer]}
                      </p>
                      <p>
                        Correct answer: {question.options[question.answer]}
                      </p>
                      <Link className="inline-link" to={question.lesson.path}>
                        Review: {question.lesson.label}
                      </Link>
                    </article>
                  );
                })}
              </div>
            )}

            <button
              className="btn primary"
              type="button"
              onClick={() => resetQuiz()}
            >
              Restart quiz
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default Practice;
