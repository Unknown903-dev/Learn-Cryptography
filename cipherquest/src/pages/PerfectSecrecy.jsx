import { useState } from "react";

function PerfectSecrecy() {
  const [message, setMessage] = useState(0);
  const [keyValue, setKeyValue] = useState(0);

  const ciphertext = message ^ keyValue;

  return (
    <section>
      <div className="page-header">
        <p className="eyebrow">Interactive Proof</p>
        <h1>Perfect Secrecy Demo</h1>
        <p>
          This demo uses XOR encryption to show why the one-time pad can hide
          information about the message.
        </p>
      </div>

      <div className="demo-panel">
        <div className="formula-box">c = m XOR k</div>

        <p className="security-note">
          Educational demo only. This simplified XOR example is used to explain
          perfect secrecy and should not be used as real-world encryption code.
        </p>

        <div className="controls">
          <label>
            Message m
            <select
              value={message}
              onChange={(event) => setMessage(Number(event.target.value))}
            >
              <option value={0}>0</option>
              <option value={1}>1</option>
            </select>
          </label>

          <label>
            Key k
            <select
              value={keyValue}
              onChange={(event) => setKeyValue(Number(event.target.value))}
            >
              <option value={0}>0</option>
              <option value={1}>1</option>
            </select>
          </label>
        </div>

        <div className="result-box">
          <p>
            m = <strong>{message}</strong>
          </p>

          <p>
            k = <strong>{keyValue}</strong>
          </p>

          <p>
            c = <strong>{ciphertext}</strong>
          </p>
        </div>

        <div className="explanation-box">
          <h2>Why this matters</h2>

          <p>
            In perfect secrecy, seeing the ciphertext should not change what an
            attacker believes about the message.
          </p>

          <div className="formula-box">
            Pr[M = m | C = c] = Pr[M = m]
          </div>

          <p>
            With a uniformly random one-bit key, both messages can produce both
            ciphertexts. That means the ciphertext alone does not reveal which
            message was encrypted.
          </p>
        </div>

        <div className="explanation-box">
          <h2>Truth Table</h2>

          <p>
            This table shows every possible message and key combination for
            one-bit XOR encryption.
          </p>

          <div className="truth-table">
            <div className="truth-row truth-header">
              <span>m</span>
              <span>k</span>
              <span>c = m XOR k</span>
            </div>

            <div className="truth-row">
              <span>0</span>
              <span>0</span>
              <span>0</span>
            </div>

            <div className="truth-row">
              <span>0</span>
              <span>1</span>
              <span>1</span>
            </div>

            <div className="truth-row">
              <span>1</span>
              <span>0</span>
              <span>1</span>
            </div>

            <div className="truth-row">
              <span>1</span>
              <span>1</span>
              <span>0</span>
            </div>
          </div>

          <p>
            Notice that ciphertext 0 can come from message 0 or message 1.
            Ciphertext 1 can also come from message 0 or message 1. Because the
            key is random, the attacker cannot tell which message was used.
          </p>
        </div>
      </div>
    </section>
  );
}

export default PerfectSecrecy;