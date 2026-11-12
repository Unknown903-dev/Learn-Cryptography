import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  countDifferingBits,
  findEightBitCollision,
  sha256,
} from "../utils/hash";

const MAX_MESSAGE_LENGTH = 64;
const TRUSTED_MESSAGE = "Download CipherQuest v1";

function MessageInput({ id, label, value, onChange }) {
  return (
    <label htmlFor={id}>
      {label}
      <input
        id={id}
        value={value}
        maxLength={MAX_MESSAGE_LENGTH}
        onChange={(event) =>
          onChange(event.target.value.slice(0, MAX_MESSAGE_LENGTH))
        }
        autoComplete="off"
        aria-describedby={`${id}-limit`}
      />
      <small id={`${id}-limit`} className="input-hint">
        {value.length}/{MAX_MESSAGE_LENGTH} characters
      </small>
    </label>
  );
}

function Digest({ label, value }) {
  return (
    <div className="digest-display">
      <span>{label}</span>
      <code>{value}</code>
    </div>
  );
}

function HashFunctions() {
  const [firstMessage, setFirstMessage] = useState("cryptography");
  const [secondMessage, setSecondMessage] = useState("Cryptography");
  const [comparison, setComparison] = useState({
    status: "pending",
    first: null,
    second: null,
    differingBits: null,
    error: "",
  });
  const [collision, setCollision] = useState({
    status: "idle",
    result: null,
    error: "",
  });
  const [publicMessage, setPublicMessage] = useState(TRUSTED_MESSAGE);
  const [publicComparison, setPublicComparison] = useState({
    status: "pending",
    trusted: null,
    current: null,
    error: "",
  });
  const comparisonRequest = useRef(0);
  const collisionRequest = useRef(0);
  const publicHashRequest = useRef(0);

  useEffect(() => {
    const requestId = comparisonRequest.current + 1;
    comparisonRequest.current = requestId;
    let active = true;

    async function compareMessages() {
      try {
        const [first, second] = await Promise.all([
          sha256(firstMessage),
          sha256(secondMessage),
        ]);

        if (!active || comparisonRequest.current !== requestId) return;

        setComparison({
          status: "ready",
          first,
          second,
          differingBits: countDifferingBits(first.bytes, second.bytes),
          error: "",
        });
      } catch (error) {
        if (!active || comparisonRequest.current !== requestId) return;

        setComparison({
          status: "error",
          first: null,
          second: null,
          differingBits: null,
          error: error instanceof Error ? error.message : "Hashing failed.",
        });
      }
    }

    compareMessages();
    return () => {
      active = false;
    };
  }, [firstMessage, secondMessage]);

  useEffect(() => {
    const requestId = publicHashRequest.current + 1;
    publicHashRequest.current = requestId;
    let active = true;

    async function comparePublicDigest() {
      try {
        const [trusted, current] = await Promise.all([
          sha256(TRUSTED_MESSAGE),
          sha256(publicMessage),
        ]);

        if (!active || publicHashRequest.current !== requestId) return;

        setPublicComparison({ status: "ready", trusted, current, error: "" });
      } catch (error) {
        if (!active || publicHashRequest.current !== requestId) return;

        setPublicComparison({
          status: "error",
          trusted: null,
          current: null,
          error: error instanceof Error ? error.message : "Hashing failed.",
        });
      }
    }

    comparePublicDigest();
    return () => {
      active = false;
    };
  }, [publicMessage]);

  useEffect(
    () => () => {
      collisionRequest.current += 1;
    },
    [],
  );

  const searchForCollision = async () => {
    const requestId = collisionRequest.current + 1;
    collisionRequest.current = requestId;
    setCollision({ status: "searching", result: null, error: "" });

    try {
      const result = await findEightBitCollision(
        `run ${requestId}`,
        () => collisionRequest.current === requestId,
      );

      if (!result || collisionRequest.current !== requestId) return;
      setCollision({ status: "found", result, error: "" });
    } catch (error) {
      if (collisionRequest.current !== requestId) return;

      setCollision({
        status: "error",
        result: null,
        error:
          error instanceof Error ? error.message : "Collision search failed.",
      });
    }
  };

  const updateComparisonMessage = (setter, value) => {
    comparisonRequest.current += 1;
    setComparison({
      status: "pending",
      first: null,
      second: null,
      differingBits: null,
      error: "",
    });
    setter(value);
  };

  const updatePublicMessage = (value) => {
    publicHashRequest.current += 1;
    setPublicComparison({
      status: "pending",
      trusted: null,
      current: null,
      error: "",
    });
    setPublicMessage(value);
  };

  const publicDigestMatches =
    publicComparison.status === "ready" &&
    publicComparison.current.hex === publicComparison.trusted.hex;

  return (
    <section>
      <div className="page-header">
        <p className="eyebrow">Interactive Integrity Lesson</p>
        <h1>Hash Functions</h1>
        <p>
          Compare SHA-256 outputs, find a deliberately shortened collision, and
          learn when a public digest can—and cannot—protect integrity.
        </p>
      </div>

      <div className="demo-panel">
        <div className="formula-box">digest = SHA-256(message)</div>
        <p className="security-note">
          Educational demo only. All hashing runs locally with the browser Web
          Crypto API. The collision exercise truncates SHA-256 to only 8 bits.
        </p>

        <div className="explanation-box">
          <p className="eyebrow">Part 1</p>
          <h2>Compare two inputs</h2>
          <p>
            Change either short message. SHA-256 always returns 256 bits, shown
            here as 64 hexadecimal characters.
          </p>

          <div className="hash-input-grid">
            <MessageInput
              id="first-hash-message"
              label="First message"
              value={firstMessage}
              onChange={(value) =>
                updateComparisonMessage(setFirstMessage, value)
              }
            />
            <MessageInput
              id="second-hash-message"
              label="Second message"
              value={secondMessage}
              onChange={(value) =>
                updateComparisonMessage(setSecondMessage, value)
              }
            />
          </div>

          <div className="hash-results" aria-live="polite">
            {comparison.status === "pending" && <p>Computing SHA-256 digests…</p>}
            {comparison.status === "error" && (
              <p className="error-box" role="alert">Hashing failed: {comparison.error}</p>
            )}
            {comparison.status === "ready" && (
              <>
                <Digest label="First SHA-256 digest" value={comparison.first.hex} />
                <Digest label="Second SHA-256 digest" value={comparison.second.hex} />
                <div className="avalanche-result">
                  <strong>{comparison.differingBits} of 256 bits differ</strong>
                  <p>
                    This count describes this particular pair of inputs. A tiny
                    input change often changes many output bits, but the exact
                    count varies from pair to pair.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="explanation-box">
          <p className="eyebrow">Part 2</p>
          <h2>Find an 8-bit collision</h2>
          <p>
            Real SHA-256 has 256 output bits. This exercise compares only its
            first 8 bits, leaving just 256 possible prefixes and making a
            collision easy to find.
          </p>
          <button
            className="btn primary"
            type="button"
            disabled={collision.status === "searching"}
            onClick={searchForCollision}
          >
            {collision.status === "searching" ? "Searching…" : "Find an 8-bit collision"}
          </button>

          <div className="collision-status" aria-live="polite">
            {collision.status === "searching" && <p>Hashing distinct sample inputs…</p>}
            {collision.status === "error" && (
              <p className="error-box" role="alert">{collision.error}</p>
            )}
            {collision.status === "found" && (
              <div className="collision-result">
                <p>
                  Found after <strong>{collision.result.attempts}</strong> inputs.
                  Both digests begin with <code>{collision.result.prefix.toString(2).padStart(8, "0")}</code>
                  {" "}(hex <code>{collision.result.prefix.toString(16).padStart(2, "0")}</code>).
                </p>
                <Digest
                  label={`“${collision.result.first.input}”`}
                  value={collision.result.first.digest.hex}
                />
                <Digest
                  label={`“${collision.result.second.input}”`}
                  value={collision.result.second.digest.hex}
                />
                <p>
                  The 8-bit prefixes collide, but the full 256-bit digests do not.
                </p>
              </div>
            )}
          </div>

          <div className="hash-goals-grid">
            <article>
              <h3>Collision</h3>
              <p>Find any two distinct inputs with the same digest.</p>
            </article>
            <article>
              <h3>Preimage</h3>
              <p>Given a digest, find an input that hashes to it.</p>
            </article>
            <article>
              <h3>Second preimage</h3>
              <p>Given one message, find a different message with its digest.</p>
            </article>
          </div>
        </div>

        <div className="explanation-box">
          <p className="eyebrow">Part 3</p>
          <h2>Compare a hash with a MAC</h2>
          <p>
            Imagine the trusted digest below came through a separate, trusted
            source. Edit the downloaded message and recompute its public digest.
          </p>

          <MessageInput
            id="public-hash-message"
            label="Downloaded message"
            value={publicMessage}
            onChange={updatePublicMessage}
          />

          <div className="hash-results" aria-live="polite">
            {publicComparison.status === "pending" && <p>Recomputing digest…</p>}
            {publicComparison.status === "error" && (
              <p className="error-box" role="alert">Hashing failed: {publicComparison.error}</p>
            )}
            {publicComparison.status === "ready" && (
              <>
                <Digest label="Trusted reference digest" value={publicComparison.trusted.hex} />
                <Digest label="Current message digest" value={publicComparison.current.hex} />
                <p className={publicDigestMatches ? "success-callout" : "error-box"}>
                  {publicDigestMatches
                    ? "The digests match: this message matches the trusted reference."
                    : "The digests differ: the trusted reference detects that the message changed."}
                </p>
              </>
            )}
          </div>

          <p>
            A digest from a trusted source can detect a changed message. But if
            the digest travels beside the message with no authentication, the
            same attacker can replace both the message and its public digest.
            A MAC uses a shared secret key, so an attacker without that key cannot
            simply compute a valid replacement tag.
          </p>
          <p>
            <Link className="inline-link" to="/macs">
              Review the HMAC tampering experiment
            </Link>
            .
          </p>
        </div>

        <div className="lesson-navigation">
          <Link className="btn secondary" to="/macs">← Previous: MACs</Link>
          <Link className="btn primary" to="/lessons">Back to all lessons</Link>
        </div>
      </div>
    </section>
  );
}

export default HashFunctions;
