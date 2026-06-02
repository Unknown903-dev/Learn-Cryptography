import { useState } from "react";

function sanitizeBinaryInput(value) {
  return value.replace(/[^01]/g, "").slice(0, 32);
}

function AttackSimulator() {
  const [messageZero, setMessageZero] = useState("0");
  const [messageOne, setMessageOne] = useState("1");
  const [challengeBit, setChallengeBit] = useState(null);
  const [ciphertext, setCiphertext] = useState(null);
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  function startChallenge() {
    if (!messageZero || !messageOne) {
      setError("Both messages must contain at least one binary digit.");
      setCiphertext(null);
      setFeedback("");
      return;
    }

    if (messageZero === messageOne) {
      setError("Choose two different messages so the attack is meaningful.");
      setCiphertext(null);
      setFeedback("");
      return;
    }

    const randomBit = Math.floor(Math.random() * 2);
    const chosenMessage = randomBit === 0 ? messageZero : messageOne;

    // Broken educational scheme: ciphertext is just the message.
    setChallengeBit(randomBit);
    setCiphertext(chosenMessage);
    setGuess("");
    setFeedback("");
    setError("");
  }

  function submitGuess(selectedGuess) {
    setGuess(selectedGuess);

    if (Number(selectedGuess) === challengeBit) {
      setFeedback(
        "Correct. This scheme is insecure because the ciphertext directly reveals the message."
      );
    } else {
      setFeedback(
        "Incorrect guess, but the scheme is still broken because the ciphertext reveals the message."
      );
    }
  }

  return (
    <section>
      <div className="page-header">
        <p className="eyebrow">Attack Simulator</p>
        <h1>Break a Bad Encryption Scheme</h1>
        <p>
          This demo shows why encryption cannot simply return the original
          message as the ciphertext.
        </p>
      </div>

      <div className="demo-panel">
        <div className="formula-box">Enc(k, m) = m</div>

        <p className="security-note">
          Educational demo only. These examples are simplified and should not be
          used for real encryption.
        </p>

        <div className="controls">
          <label>
            Message m0
            <input
              value={messageZero}
              maxLength={32}
              inputMode="numeric"
              onChange={(event) =>
                setMessageZero(sanitizeBinaryInput(event.target.value))
              }
              placeholder="Example: 0"
            />
          </label>

          <label>
            Message m1
            <input
              value={messageOne}
              maxLength={32}
              inputMode="numeric"
              onChange={(event) =>
                setMessageOne(sanitizeBinaryInput(event.target.value))
              }
              placeholder="Example: 1"
            />
          </label>
        </div>

        {error && <div className="error-box">{error}</div>}

        <button className="btn primary" onClick={startChallenge}>
          Generate Challenge
        </button>

        {ciphertext !== null && (
          <div className="result-box">
            <p>
              Ciphertext: <strong>{ciphertext}</strong>
            </p>

            <p>Which message was encrypted?</p>

            <div className="hero-buttons">
              <button className="btn secondary" onClick={() => submitGuess("0")}>
                Guess m0
              </button>

              <button className="btn secondary" onClick={() => submitGuess("1")}>
                Guess m1
              </button>
            </div>
          </div>
        )}

        {guess && (
          <div className="explanation-box">
            <h2>Result</h2>
            <p>{feedback}</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default AttackSimulator;