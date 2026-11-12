import { useState } from "react";
import { Link } from "react-router-dom";
import {
  REUSED_PAD_CIPHERTEXTS,
  bytesToHex,
  clampOffset,
  deriveOtherMessageBytes,
  describeCandidateByte,
  getMaximumOffset,
  hexToBytes,
  normalizeCodeWord,
  xorCiphertexts,
} from "../utils/reusedPad";

const PUZZLE_LENGTH = hexToBytes(REUSED_PAD_CIPHERTEXTS.first).length;
const XOR_BYTES = xorCiphertexts(
  REUSED_PAD_CIPHERTEXTS.first,
  REUSED_PAD_CIPHERTEXTS.second,
);
const HINTS = [
  "Because the same XOR pad encrypted both messages, compute C₁ ⊕ C₂. The repeated pad cancels, leaving M₁ ⊕ M₂.",
  "Dispatch one is routine logistics. Analysts expect it to begin with the phrase “SUPPLY DROP AT NORTH GATE”.",
  "Choose message 1, enter “SUPPLY DROP AT NORTH GATE”, and place it at byte offset 0. Read the candidate text that appears for message 2.",
];

function sanitizeBinaryInput(value) {
  return value.replace(/[^01]/g, "").slice(0, 32);
}

function WarmupExercise() {
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
        "Correct. This scheme is insecure because the ciphertext directly reveals the message.",
      );
    } else {
      setFeedback(
        "Incorrect guess, but the scheme is still broken because the ciphertext reveals the message.",
      );
    }
  }

  return (
    <div className="explanation-box attack-warmup">
      <p className="eyebrow">Warm-up</p>
      <h2>Break identity encryption</h2>
      <div className="formula-box">Enc(k, m) = m</div>
      <p>
        Start with the original exercise: this broken scheme returns the message
        itself, so its challenge ciphertext is immediately recognizable.
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

      {error && <div className="error-box" role="alert">{error}</div>}
      <button className="btn primary" type="button" onClick={startChallenge}>
        Generate warm-up challenge
      </button>

      {ciphertext !== null && (
        <div className="result-box">
          <p>Ciphertext: <strong>{ciphertext}</strong></p>
          <p>Which message was encrypted?</p>
          <div className="hero-buttons">
            <button className="btn secondary" type="button" onClick={() => submitGuess("0")}>
              Guess m0
            </button>
            <button className="btn secondary" type="button" onClick={() => submitGuess("1")}>
              Guess m1
            </button>
          </div>
        </div>
      )}

      {guess && (
        <div className="learning-callout">
          <h3>Warm-up result</h3>
          <p>{feedback}</p>
        </div>
      )}
    </div>
  );
}

function ReusedPadChallenge() {
  const [xorRevealed, setXorRevealed] = useState(false);
  const [guessTarget, setGuessTarget] = useState("first");
  const [crib, setCrib] = useState("");
  const [offset, setOffset] = useState(0);
  const [revealedHints, setRevealedHints] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submission, setSubmission] = useState("idle");

  const cribByteLength = new TextEncoder().encode(crib).length;
  const cribIsUsable = cribByteLength > 0 && cribByteLength <= PUZZLE_LENGTH;
  const maximumOffset = getMaximumOffset(PUZZLE_LENGTH, crib);
  const candidateBytes =
    xorRevealed && cribIsUsable
      ? deriveOtherMessageBytes(XOR_BYTES, crib, offset)
      : new Uint8Array();
  const candidateDescription = Array.from(candidateBytes, describeCandidateByte);
  const otherMessageLabel = guessTarget === "first" ? "message 2" : "message 1";

  const updateCrib = (value) => {
    const nextCrib = value.slice(0, 32);
    setCrib(nextCrib);
    setOffset((currentOffset) =>
      clampOffset(currentOffset, PUZZLE_LENGTH, nextCrib),
    );
  };

  const updateOffset = (value) => {
    setOffset(clampOffset(Number(value), PUZZLE_LENGTH, crib));
  };

  const submitCodeWord = (event) => {
    event.preventDefault();
    setSubmission(
      normalizeCodeWord(answer) === "nightfall" ? "correct" : "incorrect",
    );
  };

  return (
    <div className="explanation-box reused-pad-challenge">
      <p className="eyebrow">Playable Challenge</p>
      <h2>Reused Pad</h2>

      <div className="mission-brief">
        <h3>Mission</h3>
        <p>
          You intercepted two equal-length field dispatches. One is a routine
          supply instruction; the other names a secret code word. Both short
          ASCII messages were encrypted with the same XOR pad. Recover the code
          word from the second message.
        </p>
      </div>

      <div className="intercept-grid">
        <article>
          <span>Intercept C₁ · {PUZZLE_LENGTH} bytes</span>
          <code>{REUSED_PAD_CIPHERTEXTS.first}</code>
        </article>
        <article>
          <span>Intercept C₂ · {PUZZLE_LENGTH} bytes</span>
          <code>{REUSED_PAD_CIPHERTEXTS.second}</code>
        </article>
      </div>

      <div className="attack-workbench">
        <div className="workbench-heading">
          <div>
            <p className="eyebrow">Workbench</p>
            <h3>Drag a likely phrase across the messages</h3>
          </div>
          <button
            className="btn secondary"
            type="button"
            onClick={() => setXorRevealed(true)}
          >
            Compute C₁ ⊕ C₂
          </button>
        </div>

        {xorRevealed ? (
          <div className="xor-output" aria-live="polite">
            <span>C₁ ⊕ C₂</span>
            <code>{bytesToHex(XOR_BYTES)}</code>
          </div>
        ) : (
          <p className="empty-state">Compute the ciphertext XOR to activate the crib workbench.</p>
        )}

        <div className="workbench-controls">
          <label htmlFor="guess-target">
            Apply your guess to
            <select
              id="guess-target"
              value={guessTarget}
              onChange={(event) => setGuessTarget(event.target.value)}
            >
              <option value="first">Message 1</option>
              <option value="second">Message 2</option>
            </select>
          </label>

          <label htmlFor="crib-input">
            Likely word or phrase
            <input
              id="crib-input"
              value={crib}
              maxLength={32}
              onChange={(event) => updateCrib(event.target.value)}
              placeholder="Try a dispatch phrase"
              autoComplete="off"
            />
            <small className={cribByteLength > PUZZLE_LENGTH ? "input-error" : "input-hint"}>
              {cribByteLength}/{PUZZLE_LENGTH} bytes
            </small>
          </label>
        </div>

        <fieldset className="offset-controls" disabled={!cribIsUsable}>
          <legend>Byte offset: {offset}</legend>
          <button
            className="offset-button"
            type="button"
            aria-label="Move guess one byte left"
            disabled={!cribIsUsable || offset === 0}
            onClick={() => updateOffset(offset - 1)}
          >
            −
          </button>
          <input
            type="range"
            min="0"
            max={maximumOffset}
            value={offset}
            aria-label="Guess byte offset"
            onChange={(event) => updateOffset(event.target.value)}
          />
          <button
            className="offset-button"
            type="button"
            aria-label="Move guess one byte right"
            disabled={!cribIsUsable || offset === maximumOffset}
            onClick={() => updateOffset(offset + 1)}
          >
            +
          </button>
          <input
            className="offset-number"
            type="number"
            min="0"
            max={maximumOffset}
            value={offset}
            aria-label="Enter guess byte offset"
            onChange={(event) => updateOffset(event.target.valueAsNumber)}
          />
        </fieldset>

        <div className="candidate-output" aria-live="polite">
          <span>Candidate text in {otherMessageLabel} at offset {offset}</span>
          {candidateDescription.length > 0 ? (
            <>
              <code className="candidate-text">
                {candidateDescription.map((item) =>
                  item.printable ? item.text : `⟦${item.text}⟧`,
                )}
              </code>
              <div className="candidate-byte-grid">
                {candidateDescription.map((item, index) => (
                  <span
                    className={item.printable ? "" : "nonprintable"}
                    title={item.printable ? `Printable byte ${item.byte}` : `Nonprintable ${item.text}`}
                    key={`${offset}-${index}`}
                  >
                    <small>{offset + index}</small>
                    <strong>{item.printable ? (item.text === " " ? "␠" : item.text) : item.text}</strong>
                  </span>
                ))}
              </div>
              <p className="candidate-key">
                ␠ marks a printable space. Values shown as 0xNN are nonprintable bytes.
              </p>
            </>
          ) : (
            <p>Compute the XOR and enter a phrase to see candidate bytes.</p>
          )}
        </div>
      </div>

      <div className="hint-panel">
        <h3>Hints</h3>
        {revealedHints === 0 && <p>No hints revealed yet.</p>}
        <ol>
          {HINTS.slice(0, revealedHints).map((hint) => <li key={hint}>{hint}</li>)}
        </ol>
        {revealedHints < HINTS.length && (
          <button
            className="btn secondary"
            type="button"
            onClick={() => setRevealedHints((count) => Math.min(count + 1, HINTS.length))}
          >
            Reveal hint {revealedHints + 1}
          </button>
        )}
      </div>

      <form className="codeword-submission" onSubmit={submitCodeWord}>
        <label htmlFor="code-word">
          Hidden code word from message 2
          <input
            id="code-word"
            value={answer}
            maxLength={24}
            onChange={(event) => {
              setAnswer(event.target.value);
              setSubmission("idle");
            }}
            autoComplete="off"
          />
        </label>
        <button className="btn primary" type="submit">Submit code word</button>
      </form>

      {submission === "incorrect" && (
        <p className="error-box" role="status">
          That is not the dispatch code word. Try the workbench hints, and look
          for the words that follow “CODE WORD IS” in the second message.
        </p>
      )}

      {submission === "correct" && (
        <div className="worked-solution" aria-live="polite">
          <p className="eyebrow">Mission Complete</p>
          <h3>Code word: NIGHTFALL</h3>
          <p>
            Both ciphertexts used the same pad K, so C₁ ⊕ C₂ = (M₁ ⊕ K) ⊕
            (M₂ ⊕ K) = M₁ ⊕ M₂. The two copies of K cancel.
          </p>
          <div className="formula-box">C₁ ⊕ C₂ ⊕ “SUPPLY DROP AT NORTH GATE” = “CODE WORD IS NIGHTFALL AT”</div>
          <p><strong>Message 1:</strong> SUPPLY DROP AT NORTH GATE 2100!!</p>
          <p><strong>Message 2:</strong> CODE WORD IS NIGHTFALL AT DAWN!!</p>
          <p>
            Reusing a one-time pad exposes relationships between plaintexts and
            lets a plausible phrase unlock the other message. Review the full{" "}
            <Link className="inline-link" to="/one-time-pad">One-Time Pad lesson</Link>.
          </p>
        </div>
      )}
    </div>
  );
}

function AttackSimulator() {
  return (
    <section>
      <div className="page-header">
        <p className="eyebrow">Attack Simulator</p>
        <h1>Break Bad Encryption Schemes</h1>
        <p>
          Begin with an obvious leak, then use crib dragging to exploit a reused
          XOR pad in a realistic intercepted-dispatch puzzle.
        </p>
      </div>

      <div className="demo-panel">
        <p className="security-note">
          Educational demo only. These intentionally broken schemes should not
          be used for real encryption.
        </p>
        <WarmupExercise />
        <ReusedPadChallenge />

        <div className="lesson-navigation">
          <Link className="btn primary" to="/cpa-security">
            Continue to the CPA Security lab →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default AttackSimulator;
