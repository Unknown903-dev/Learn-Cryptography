import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { generateRandomBits, xorBits } from "../utils/otp";
import {
  createHmacTag,
  generateHmacKey,
  tagToHex,
  verifyHmacTag,
} from "../utils/mac";

const ORIGINAL_PLAINTEXT = "10110010";

function BitDisplay({ label, bits, highlightIndex = -1 }) {
  return (
    <div className="mac-bit-row">
      <span>{label}</span>
      <div className="mac-bit-cells" aria-label={`${label}: ${bits}`}>
        {bits.split("").map((bit, index) => (
          <span
            className={`mac-bit ${index === highlightIndex ? "changed" : ""}`}
            key={`${label}-${index}`}
          >
            {bit}
          </span>
        ))}
      </div>
    </div>
  );
}

function Macs() {
  const [experiment] = useState(() => {
    const pad = generateRandomBits();
    return {
      plaintext: ORIGINAL_PLAINTEXT,
      pad,
      ciphertext: xorBits(ORIGINAL_PLAINTEXT, pad),
    };
  });
  const [receivedCiphertext, setReceivedCiphertext] = useState(
    experiment.ciphertext,
  );
  const [hmac, setHmac] = useState({
    status: "pending",
    key: null,
    tag: null,
    error: "",
  });
  const [verification, setVerification] = useState({
    status: "idle",
    error: "",
  });
  const [prediction, setPrediction] = useState(null);
  const verificationRequest = useRef(0);

  const changedIndex = receivedCiphertext
    .split("")
    .findIndex((bit, index) => bit !== experiment.ciphertext[index]);
  const receivedPlaintext = xorBits(receivedCiphertext, experiment.pad);

  useEffect(() => {
    let active = true;

    async function prepareHmac() {
      setHmac({ status: "pending", key: null, tag: null, error: "" });

      try {
        const key = await generateHmacKey();
        const tag = await createHmacTag(key, experiment.ciphertext);

        if (active) {
          setHmac({ status: "ready", key, tag, error: "" });
        }
      } catch (error) {
        if (active) {
          setHmac({
            status: "error",
            key: null,
            tag: null,
            error:
              error instanceof Error
                ? error.message
                : "The browser could not prepare HMAC.",
          });
        }
      }
    }

    prepareHmac();

    return () => {
      active = false;
    };
  }, [experiment.ciphertext]);

  const updateReceivedCiphertext = (nextCiphertext) => {
    verificationRequest.current += 1;
    setReceivedCiphertext(nextCiphertext);
    setVerification({ status: "idle", error: "" });
  };

  const flipBit = (index) => {
    if (changedIndex === index) {
      updateReceivedCiphertext(experiment.ciphertext);
      return;
    }

    const modifiedBits = experiment.ciphertext.split("");
    modifiedBits[index] = modifiedBits[index] === "0" ? "1" : "0";
    updateReceivedCiphertext(modifiedBits.join(""));
  };

  const verifyReceivedCiphertext = async () => {
    if (hmac.status !== "ready") {
      return;
    }

    const requestId = verificationRequest.current + 1;
    verificationRequest.current = requestId;
    const ciphertextSnapshot = receivedCiphertext;
    setVerification({ status: "pending", error: "" });

    try {
      const isValid = await verifyHmacTag(
        hmac.key,
        hmac.tag,
        ciphertextSnapshot,
      );

      if (verificationRequest.current !== requestId) {
        return;
      }

      setVerification({ status: isValid ? "valid" : "invalid", error: "" });
    } catch (error) {
      if (verificationRequest.current !== requestId) {
        return;
      }

      setVerification({
        status: "error",
        error:
          error instanceof Error
            ? error.message
            : "The browser could not verify the tag.",
      });
    }
  };

  return (
    <section>
      <div className="page-header">
        <p className="eyebrow">Integrity and Authenticity Lab</p>
        <h1>Message Authentication Codes</h1>
        <p>
          See how an attacker can alter XOR-based ciphertext, then use HMAC to
          make the receiver detect the change before decrypting.
        </p>
      </div>

      <div className="demo-panel">
        <div className="formula-box">ciphertext + authentication tag</div>
        <p className="security-note">
          Educational demo only. The 8-bit CTR-style XOR is simplified for
          learning. HMAC operations run locally with the browser Web Crypto API.
        </p>

        <div className="explanation-box">
          <p className="eyebrow">Part 1: Encryption only</p>
          <h2>Flip one ciphertext bit</h2>
          <p>
            This is a simplified demonstration of CTR&apos;s XOR step. Click a
            ciphertext bit to flip it in transit; click the highlighted bit again
            to restore the original ciphertext.
          </p>

          <div className="mac-bit-demo">
            <BitDisplay label="Plaintext M" bits={experiment.plaintext} />
            <BitDisplay label="CTR-style pad" bits={experiment.pad} />
            <BitDisplay label="Original C" bits={experiment.ciphertext} />

            <div className="mac-bit-row interactive-row">
              <span>Received C</span>
              <div className="mac-bit-cells">
                {receivedCiphertext.split("").map((bit, index) => (
                  <button
                    className={`mac-bit bit-button ${index === changedIndex ? "changed" : ""}`}
                    type="button"
                    aria-label={`Flip ciphertext bit ${index + 1}, currently ${bit}`}
                    aria-pressed={index === changedIndex}
                    onClick={() => flipBit(index)}
                    key={index}
                  >
                    {bit}
                  </button>
                ))}
              </div>
            </div>

            <BitDisplay
              label="Decrypted M′"
              bits={receivedPlaintext}
              highlightIndex={changedIndex}
            />
          </div>

          <div className={changedIndex === -1 ? "learning-callout" : "warning-box"}>
            <h3>{changedIndex === -1 ? "Ciphertext is untouched" : `Bit ${changedIndex + 1} changed`}</h3>
            <p>
              {changedIndex === -1
                ? "The receiver decrypts the original plaintext. Choose a ciphertext bit to test tampering."
                : `Flipping ciphertext bit ${changedIndex + 1} flips plaintext bit ${changedIndex + 1} after XOR decryption. Encryption alone does not detect the modification.`}
            </p>
          </div>
        </div>

        <div className="explanation-box">
          <p className="eyebrow">Part 2: Encrypt and authenticate</p>
          <h2>Verify before decrypting</h2>
          <p>
            The sender computes HMAC-SHA-256 over the original ciphertext with a
            separate shared secret key. The key is non-exportable. If a bit changes
            in transit, the original tag stays attached and no longer matches.
          </p>

          <div className="authenticated-packet">
            <div>
              <span>Received ciphertext</span>
              <code>{receivedCiphertext}</code>
            </div>
            <div>
              <span>Attached original HMAC tag</span>
              {hmac.status === "pending" && <em>Generating securely…</em>}
              {hmac.status === "error" && <em>Unavailable</em>}
              {hmac.tag && <code className="mac-tag">{tagToHex(hmac.tag)}</code>}
            </div>
          </div>

          {hmac.status === "error" && (
            <p className="error-box" role="alert">
              Web Crypto setup failed: {hmac.error}
            </p>
          )}

          <button
            className="btn primary"
            type="button"
            disabled={hmac.status !== "ready" || verification.status === "pending"}
            onClick={verifyReceivedCiphertext}
          >
            {verification.status === "pending" ? "Verifying…" : "Verify tag before decryption"}
          </button>

          <div className="verification-result" aria-live="polite">
            {verification.status === "idle" && (
              <p>The receiver has not verified this ciphertext yet. Plaintext remains hidden.</p>
            )}
            {verification.status === "pending" && <p>Checking the received bytes and tag…</p>}
            {verification.status === "invalid" && (
              <div className="error-box">
                <strong>Verification failed.</strong> The receiver rejects the
                modified ciphertext and does not decrypt or reveal plaintext.
              </div>
            )}
            {verification.status === "valid" && (
              <div className="success-callout">
                <strong>Verification succeeded.</strong> The receiver may now decrypt:
                <BitDisplay label="Plaintext M" bits={receivedPlaintext} />
              </div>
            )}
            {verification.status === "error" && (
              <p className="error-box" role="alert">
                Verification could not finish: {verification.error}
              </p>
            )}
          </div>
        </div>

        <div className="explanation-box">
          <h2>Confidentiality is not integrity</h2>
          <p>
            Encryption provides <strong>confidentiality</strong>: an observer should
            not learn the plaintext. A MAC lets a receiver who shares the secret
            key check <strong>integrity</strong> and <strong>authenticity</strong>:
            whether the protected bytes changed and whether someone with the key
            created their tag.
          </p>
        </div>

        <div className="prediction-box">
          <h2>Prediction check</h2>
          <p>
            An attacker flips one authenticated ciphertext bit but cannot create a
            new valid tag. What should the receiver do?
          </p>
          <div className="answer-list">
            <button className="answer-button" type="button" onClick={() => setPrediction("correct")}>
              Reject it before decryption
            </button>
            <button className="answer-button" type="button" onClick={() => setPrediction("incorrect")}>
              Decrypt it and accept the changed plaintext
            </button>
          </div>
          {prediction && (
            <p className={`prediction-feedback ${prediction}`} role="status">
              {prediction === "correct"
                ? "Correct. The original tag does not authenticate the modified ciphertext, so the receiver rejects it without revealing plaintext."
                : "Not quite. Decrypting unauthenticated bytes would expose the receiver to deliberate modifications. Verify first, then decrypt only on success."}
            </p>
          )}
        </div>

        <div className="lesson-navigation">
          <Link className="btn secondary" to="/modes">← Review CTR mode</Link>
          <Link className="btn primary" to="/hash-functions">
            Next lesson: Hash Functions →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Macs;
