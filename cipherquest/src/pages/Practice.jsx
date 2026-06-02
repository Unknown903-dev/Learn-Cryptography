import { useState } from "react";

const questions = [
  {
    question: "What does perfect secrecy mean?",
    options: [
      "The ciphertext reveals no information about the message.",
      "The key is stored securely.",
      "The encryption algorithm is secret.",
      "The message is deleted after encryption.",
    ],
    answer: 0,
    explanation:
      "Perfect secrecy means that learning the ciphertext does not change the attacker's probability distribution over the message.",
  },
  {
    question: "Which scheme is obviously insecure?",
    options: [
      "Enc(k, m) = m XOR k with random one-time key",
      "Enc(k, m) = m",
      "Enc(k, m) = m + k mod n with uniform k",
      "One-time pad",
    ],
    answer: 1,
    explanation:
      "Enc(k, m) = m is insecure because the ciphertext is exactly the original message.",
  },
  {
    question: "What is dangerous in CTR mode?",
    options: [
      "Using a counter",
      "Using XOR",
      "Reusing the same nonce with the same key",
      "Encrypting more than one block",
    ],
    answer: 2,
    explanation:
      "CTR mode becomes insecure if the same nonce is reused with the same key because it can reuse the same keystream.",
  },
];

function Practice() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const currentQuestion = questions[currentIndex];
  const isCorrect = selectedAnswer === currentQuestion.answer;

  function nextQuestion() {
    setSelectedAnswer(null);
    setCurrentIndex((currentIndex + 1) % questions.length);
  }

  return (
    <section>
      <div className="page-header">
        <p className="eyebrow">Practice Mode</p>
        <h1>Crypto Exam Practice</h1>
        <p>
          Test your understanding with short questions based on common
          cryptography concepts.
        </p>
      </div>

      <div className="demo-panel">
        <h2>{currentQuestion.question}</h2>

        <div className="answer-list">
          {currentQuestion.options.map((option, index) => (
            <button
              key={option}
              className="answer-button"
              onClick={() => setSelectedAnswer(index)}
            >
              {option}
            </button>
          ))}
        </div>

        {selectedAnswer !== null && (
          <div className="explanation-box">
            <h2>{isCorrect ? "Correct" : "Not quite"}</h2>
            <p>{currentQuestion.explanation}</p>

            <button className="btn primary" onClick={nextQuestion}>
              Next Question
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default Practice;