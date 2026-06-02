import { useState } from "react";

function ModesVisualizer() {
  const [mode, setMode] = useState("cbc");

  return (
    <section>
      <div className="page-header">
        <p className="eyebrow">Visual Module</p>
        <h1>CBC and CTR Mode Visualizer</h1>
        <p>
          Block cipher modes explain how we encrypt messages that are larger than
          one block. CBC and CTR both use a block cipher, but they chain and
          combine data in very different ways.
        </p>
      </div>

      <div className="demo-panel">
        <p className="security-note">
          Educational demo only. These diagrams simplify real encryption modes
          and should not be used as implementation guidance for production
          cryptography.
        </p>

        <div className="mode-toggle">
          <button
            className={mode === "cbc" ? "mode-button active" : "mode-button"}
            onClick={() => setMode("cbc")}
          >
            CBC Mode
          </button>

          <button
            className={mode === "ctr" ? "mode-button active" : "mode-button"}
            onClick={() => setMode("ctr")}
          >
            CTR Mode
          </button>
        </div>

        {mode === "cbc" ? <CBCMode /> : <CTRMode />}
      </div>
    </section>
  );
}

function CBCMode() {
  return (
    <div className="mode-section">
      <div className="mode-header">
        <h2>CBC Mode</h2>
        <p>
          CBC stands for Cipher Block Chaining. Each plaintext block is XORed
          with the previous ciphertext block before encryption.
        </p>
      </div>

      <div className="formula-box">
        Cᵢ = Encₖ(Mᵢ XOR Cᵢ₋₁)
      </div>

      <div className="flow-diagram">
        <div className="flow-row">
          <div className="flow-box iv-box">IV</div>
          <div className="flow-arrow">→</div>
          <div className="flow-box xor-box">XOR with M₁</div>
          <div className="flow-arrow">→</div>
          <div className="flow-box cipher-box">Block Cipher Encₖ</div>
          <div className="flow-arrow">→</div>
          <div className="flow-box output-box">C₁</div>
        </div>

        <div className="flow-row">
          <div className="flow-box output-box">C₁</div>
          <div className="flow-arrow">→</div>
          <div className="flow-box xor-box">XOR with M₂</div>
          <div className="flow-arrow">→</div>
          <div className="flow-box cipher-box">Block Cipher Encₖ</div>
          <div className="flow-arrow">→</div>
          <div className="flow-box output-box">C₂</div>
        </div>

        <div className="flow-row">
          <div className="flow-box output-box">C₂</div>
          <div className="flow-arrow">→</div>
          <div className="flow-box xor-box">XOR with M₃</div>
          <div className="flow-arrow">→</div>
          <div className="flow-box cipher-box">Block Cipher Encₖ</div>
          <div className="flow-arrow">→</div>
          <div className="flow-box output-box">C₃</div>
        </div>
      </div>

      <div className="explanation-box">
        <h2>What CBC teaches</h2>

        <p>
          CBC hides repeated plaintext blocks better than directly encrypting
          each block independently. The previous ciphertext block affects the
          next encryption step.
        </p>

        <p>
          The first block needs an initialization vector, usually called an IV.
          For CBC security, the IV should be unpredictable and should not repeat
          in a way that helps the attacker.
        </p>
      </div>

      <div className="warning-box">
        <h2>Common mistake</h2>
        <p>
          Reusing predictable IVs can weaken CBC security. Also, CBC by itself
          does not automatically protect integrity. Attackers may still modify
          ciphertext unless authentication is added.
        </p>
      </div>
    </div>
  );
}

function CTRMode() {
  return (
    <div className="mode-section">
      <div className="mode-header">
        <h2>CTR Mode</h2>
        <p>
          CTR stands for Counter Mode. It turns a block cipher into a stream of
          pseudorandom blocks that are XORed with the message.
        </p>
      </div>

      <div className="formula-box">
        Cᵢ = Mᵢ XOR Encₖ(Nonce || Counterᵢ)
      </div>

      <div className="flow-diagram">
        <div className="flow-row">
          <div className="flow-box iv-box">Nonce || 1</div>
          <div className="flow-arrow">→</div>
          <div className="flow-box cipher-box">Block Cipher Encₖ</div>
          <div className="flow-arrow">→</div>
          <div className="flow-box pad-box">Pad₁</div>
          <div className="flow-arrow">→</div>
          <div className="flow-box xor-box">XOR with M₁</div>
          <div className="flow-arrow">→</div>
          <div className="flow-box output-box">C₁</div>
        </div>

        <div className="flow-row">
          <div className="flow-box iv-box">Nonce || 2</div>
          <div className="flow-arrow">→</div>
          <div className="flow-box cipher-box">Block Cipher Encₖ</div>
          <div className="flow-arrow">→</div>
          <div className="flow-box pad-box">Pad₂</div>
          <div className="flow-arrow">→</div>
          <div className="flow-box xor-box">XOR with M₂</div>
          <div className="flow-arrow">→</div>
          <div className="flow-box output-box">C₂</div>
        </div>

        <div className="flow-row">
          <div className="flow-box iv-box">Nonce || 3</div>
          <div className="flow-arrow">→</div>
          <div className="flow-box cipher-box">Block Cipher Encₖ</div>
          <div className="flow-arrow">→</div>
          <div className="flow-box pad-box">Pad₃</div>
          <div className="flow-arrow">→</div>
          <div className="flow-box xor-box">XOR with M₃</div>
          <div className="flow-arrow">→</div>
          <div className="flow-box output-box">C₃</div>
        </div>
      </div>

      <div className="explanation-box">
        <h2>What CTR teaches</h2>

        <p>
          CTR mode does not encrypt the message directly with the block cipher.
          Instead, it encrypts nonce-counter values to create a pad, then XORs
          that pad with the plaintext.
        </p>

        <p>
          Because each counter block can be computed independently, CTR can be
          parallelized more easily than CBC.
        </p>
      </div>

      <div className="warning-box">
        <h2>Common mistake</h2>
        <p>
          Never reuse the same nonce with the same key in CTR mode. Reusing the
          nonce can reuse the same pad, which can reveal relationships between
          plaintext messages.
        </p>
      </div>
    </div>
  );
}

export default ModesVisualizer;