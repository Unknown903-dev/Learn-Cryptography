import { useState } from "react";
import { Link } from "react-router-dom";
import { EIGHT_BITS } from "../utils/otp";
import {
  chooseRandomBit,
  createCpaRound,
  encryptInRound,
} from "../utils/cpa";

function CandidateInput({ id, label, value, onChange, disabled }) {
  const isValid = EIGHT_BITS.test(value);

  return (
    <label htmlFor={id}>
      {label}
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        inputMode="numeric"
        autoComplete="off"
        spellCheck="false"
        disabled={disabled}
        aria-invalid={!isValid}
        aria-describedby={`${id}-hint`}
      />
      <small id={`${id}-hint`} className={isValid ? "input-hint" : "input-error"}>
        {disabled
          ? "Locked for this challenge round."
          : isValid
            ? "Exactly 8 binary digits."
            : "Enter exactly eight 0 or 1 digits."}
      </small>
    </label>
  );
}

function CpaSecurity() {
  const [messageZero, setMessageZero] = useState("10110010");
  const [messageOne, setMessageOne] = useState("01101100");
  const [oracleInput, setOracleInput] = useState("10110010");
  const [round, setRound] = useState(createCpaRound);
  const [candidateError, setCandidateError] = useState("");
  const [oracleError, setOracleError] = useState("");

  const oracleInputIsValid = EIGHT_BITS.test(oracleInput);

  const queryOracle = () => {
    if (!oracleInputIsValid) {
      setOracleError("Enter exactly eight binary digits before querying the oracle.");
      return;
    }

    if (round.queries.length >= 100) {
      setOracleError("This round has reached 100 queries. Start a new round to clear the history.");
      return;
    }

    setRound((currentRound) => {
      // Check again against the latest state when React batches rapid queries.
      if (currentRound.queries.length >= 100) return currentRound;
      return {
      ...currentRound,
      queries: [
        ...currentRound.queries,
        {
          id: currentRound.queries.length + 1,
          plaintext: oracleInput,
          ciphertext: encryptInRound(oracleInput, currentRound.pad),
        },
      ],
      };
    });
    setOracleError("");
  };

  const startChallenge = () => {
    if (!EIGHT_BITS.test(messageZero) || !EIGHT_BITS.test(messageOne)) {
      setCandidateError("Both candidates must contain exactly eight binary digits.");
      return;
    }

    if (messageZero === messageOne) {
      setCandidateError("Choose two distinct messages so there is something to distinguish.");
      return;
    }

    const selectedBit = chooseRandomBit();
    const frozenCandidates = { 0: messageZero, 1: messageOne };

    setRound((currentRound) => ({
      ...currentRound,
      frozenCandidates,
      challenge: {
        selectedBit,
        ciphertext: encryptInRound(
          frozenCandidates[selectedBit],
          currentRound.pad,
        ),
      },
      guess: null,
    }));
    setCandidateError("");
  };

  const submitGuess = (selectedGuess) => {
    if (!round.challenge || round.guess !== null) {
      return;
    }

    setRound((currentRound) => ({
      ...currentRound,
      guess: selectedGuess,
    }));
  };

  const startNewRound = () => {
    setRound(createCpaRound());
    setCandidateError("");
    setOracleError("");
  };

  const challengeComplete = round.challenge && round.guess !== null;
  const encryptedCandidateZero = round.frozenCandidates
    ? encryptInRound(round.frozenCandidates[0], round.pad)
    : null;
  const encryptedCandidateOne = round.frozenCandidates
    ? encryptInRound(round.frozenCandidates[1], round.pad)
    : null;

  return (
    <section>
      <div className="page-header">
        <p className="eyebrow">Chosen-Plaintext Attack Lab</p>
        <h1>CPA Security</h1>
        <p>
          Use an encryption oracle before and after a challenge to break a
          deterministic scheme that reuses one hidden XOR pad.
        </p>
      </div>

      <div className="demo-panel">
        <div className="formula-box">Enc(K, M) = M ⊕ K</div>
        <p className="security-note">
          Educational demo only. This intentionally insecure, client-side scheme
          uses one fixed pad per round so you can study a chosen-plaintext attack.
        </p>

        <div className="cpa-round-header">
          <div>
            <span className="comparison-label">Current round</span>
            <p>
              One random hidden pad is reused for every oracle response and the challenge.
            </p>
          </div>
          <button className="btn secondary" type="button" onClick={startNewRound}>
            New round
          </button>
        </div>

        <div className="explanation-box">
          <p className="eyebrow">Step 1</p>
          <h2>Choose challenge candidates</h2>
          <p>
            Choose two distinct messages. They will be frozen when you generate
            the challenge so they cannot be changed afterward.
          </p>

          <div className="cpa-candidate-grid">
            <CandidateInput
              id="cpa-message-zero"
              label="Candidate m₀"
              value={messageZero}
              onChange={setMessageZero}
              disabled={Boolean(round.challenge)}
            />
            <CandidateInput
              id="cpa-message-one"
              label="Candidate m₁"
              value={messageOne}
              onChange={setMessageOne}
              disabled={Boolean(round.challenge)}
            />
          </div>

          {candidateError && <p className="error-box" role="alert">{candidateError}</p>}

          {!round.challenge && (
            <button
              className="btn primary"
              type="button"
              onClick={startChallenge}
            >
              Generate challenge
            </button>
          )}
        </div>

        <div className="explanation-box">
          <p className="eyebrow">Encryption Oracle</p>
          <h2>Ask for chosen plaintexts</h2>
          <p>
            You may query at any time in the round—even after seeing the challenge.
            The oracle always uses the round&apos;s same hidden pad.
          </p>

          <div className="oracle-controls">
            <label htmlFor="oracle-message">
              8-bit message
              <input
                id="oracle-message"
                value={oracleInput}
                onChange={(event) => setOracleInput(event.target.value)}
                inputMode="numeric"
                autoComplete="off"
                spellCheck="false"
                aria-invalid={!oracleInputIsValid}
                aria-describedby="oracle-message-hint"
                onKeyDown={(event) => {
                  if (event.key === "Enter") queryOracle();
                }}
              />
              <small
                id="oracle-message-hint"
                className={oracleInputIsValid ? "input-hint" : "input-error"}
              >
                {oracleInputIsValid
                  ? "Press Enter or use the button to query."
                  : "Enter exactly eight 0 or 1 digits."}
              </small>
            </label>
            <button
              className="btn secondary"
              type="button"
              onClick={queryOracle}
            >
              Query oracle
            </button>
          </div>

          {oracleError && <p className="error-box" role="alert">{oracleError}</p>}

          <div className="query-history" aria-live="polite">
            <h3>Query history</h3>
            {round.queries.length === 0 ? (
              <p className="empty-state">No oracle queries yet.</p>
            ) : (
              <div className="outcome-table-wrap">
                <table className="outcome-table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Chosen message</th>
                      <th scope="col">Ciphertext</th>
                    </tr>
                  </thead>
                  <tbody>
                    {round.queries.map((query) => (
                      <tr key={query.id}>
                        <td>{query.id}</td>
                        <td><code>{query.plaintext}</code></td>
                        <td><code>{query.ciphertext}</code></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {round.challenge && (
          <div className="explanation-box cpa-challenge">
            <p className="eyebrow">Step 2</p>
            <h2>Challenge ciphertext</h2>
            <p>
              The challenger randomly encrypted either m₀ or m₁. You can still
              query the oracle above before making your one allowed guess.
            </p>
            <div className="challenge-ciphertext">
              C* = <code>{round.challenge.ciphertext}</code>
            </div>
            <fieldset className="guess-picker">
              <legend>Which candidate was encrypted?</legend>
              <button
                className="btn secondary"
                type="button"
                disabled={round.guess !== null}
                onClick={() => submitGuess(0)}
              >
                Guess m₀
              </button>
              <button
                className="btn secondary"
                type="button"
                disabled={round.guess !== null}
                onClick={() => submitGuess(1)}
              >
                Guess m₁
              </button>
            </fieldset>
          </div>
        )}

        {challengeComplete && (
          <div className="explanation-box cpa-reveal" aria-live="polite">
            <p className="eyebrow">Attack explained</p>
            <h2>
              {round.guess === round.challenge.selectedBit
                ? "Correct—the challenge is distinguishable."
                : "That guess missed, but the scheme is still distinguishable."}
            </h2>
            <p>
              The challenger selected <strong>m{round.challenge.selectedBit}</strong>,
              which is <code>{round.frozenCandidates[round.challenge.selectedBit]}</code>.
            </p>

            <div className="candidate-ciphertexts">
              <div>
                <span>Enc(K, m₀)</span>
                <code>{encryptedCandidateZero}</code>
              </div>
              <div>
                <span>Enc(K, m₁)</span>
                <code>{encryptedCandidateOne}</code>
              </div>
              <div className="challenge-match">
                <span>Challenge C*</span>
                <code>{round.challenge.ciphertext}</code>
              </div>
            </div>

            <p>
              Querying both candidates gives two reference ciphertexts. Because
              this deterministic oracle reuses K, the challenge exactly matches
              the encryption of the selected candidate. That gives the learner a
              winning attack for either possible challenge message.
            </p>
            <p>
              This is the same reuse failure explored in the{" "}
              <Link className="inline-link" to="/one-time-pad">
                One-Time Pad lesson
              </Link>
              : a pad must be used only once. CPA-secure encryption must also use
              fresh randomness so repeated inputs do not produce a reusable fingerprint.
            </p>
          </div>
        )}

        <div className="lesson-navigation">
          <Link className="btn secondary" to="/attack-simulator">
            ← Intro: Attack Simulator
          </Link>
          <Link className="btn primary" to="/lessons">Back to all lessons</Link>
        </div>
      </div>
    </section>
  );
}

export default CpaSecurity;
