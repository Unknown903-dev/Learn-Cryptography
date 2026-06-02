import { useState } from "react";

function ModesVisualizer() {
  const [mode, setMode] = useState("ctr");

  return (
    <section>
      <div className="page-header">
        <p className="eyebrow">Visual Module</p>
        <h1>CBC and CTR Mode Visualizer</h1>
        <p>
          Block cipher modes explain how to encrypt messages that are larger than
          one block. CTR mode behaves like a stream cipher, while CBC mode chains
          ciphertext blocks together.
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
            className={mode === "ctr" ? "mode-button active" : "mode-button"}
            onClick={() => setMode("ctr")}
          >
            CTR Mode
          </button>

          <button
            className={mode === "cbc" ? "mode-button active" : "mode-button"}
            onClick={() => setMode("cbc")}
          >
            CBC Mode
          </button>
        </div>

        {mode === "ctr" ? <CTRMode /> : <CBCMode />}
      </div>
    </section>
  );
}

function CTRMode() {
  return (
    <div className="mode-section">
      <div className="mode-header">
        <h2>CTR Mode</h2>
        <p>
          CTR stands for Counter Mode. The important idea is that the block
          cipher is not applied directly to the message. Instead, the block
          cipher creates pseudorandom pads, and those pads are XORed with the
          message blocks.
        </p>
      </div>

      <div className="concept-grid">
        <div className="concept-card">
          <h3>1. Choose a counter</h3>
          <p>
            Pick a random starting value called ctr. This value is sent with the
            ciphertext as c0.
          </p>
        </div>

        <div className="concept-card">
          <h3>2. Generate pads</h3>
          <p>
            For each message block, compute Fk(ctr || i). These outputs act like
            a stream of pseudorandom blocks.
          </p>
        </div>

        <div className="concept-card">
          <h3>3. XOR with message</h3>
          <p>
            Each plaintext block mi is XORed with its matching pad to produce
            ciphertext block ci.
          </p>
        </div>
      </div>

      <div className="formula-box">
        c0 = ctr
      </div>

      <div className="formula-box">
        ci = mi XOR Fk(ctr || i)
      </div>

      <div className="learning-callout">
        <h2>Think of CTR like a pad generator</h2>
        <p>
          The block cipher takes counter inputs and produces pad blocks. The
          message is hidden by XORing it with those pad blocks.
        </p>
      </div>

      <div className="ctr-stage">
        <div className="stage-column">
          <h3>Counter inputs</h3>
          <div className="flow-box iv-box">ctr || 1</div>
          <div className="flow-box iv-box">ctr || 2</div>
          <div className="flow-box iv-box">ctr || 3</div>
        </div>

        <div className="stage-column">
          <h3>Block cipher</h3>
          <div className="flow-box cipher-box">Fk(ctr || 1)</div>
          <div className="flow-box cipher-box">Fk(ctr || 2)</div>
          <div className="flow-box cipher-box">Fk(ctr || 3)</div>
        </div>

        <div className="stage-column">
          <h3>Pad blocks</h3>
          <div className="flow-box pad-box">pad1</div>
          <div className="flow-box pad-box">pad2</div>
          <div className="flow-box pad-box">pad3</div>
        </div>

        <div className="stage-column">
          <h3>XOR message</h3>
          <div className="flow-box xor-box">m1 XOR pad1</div>
          <div className="flow-box xor-box">m2 XOR pad2</div>
          <div className="flow-box xor-box">m3 XOR pad3</div>
        </div>

        <div className="stage-column">
          <h3>Ciphertext</h3>
          <div className="flow-box output-box">c1</div>
          <div className="flow-box output-box">c2</div>
          <div className="flow-box output-box">c3</div>
        </div>
      </div>

      <div className="explanation-box">
        <h2>Encryption step by step</h2>

        <ol className="lesson-steps">
          <li>
            Split the message into blocks: m1, m2, ..., mt.
          </li>
          <li>
            Choose a random counter value ctr.
          </li>
          <li>
            For block 1, compute Fk(ctr || 1), then XOR it with m1.
          </li>
          <li>
            For block 2, compute Fk(ctr || 2), then XOR it with m2.
          </li>
          <li>
            Continue until every message block has been encrypted.
          </li>
          <li>
            Output c0, c1, ..., ct, where c0 is the counter value.
          </li>
        </ol>
      </div>

      <div className="explanation-box">
        <h2>Decryption</h2>

        <p>
          Decryption works the same way because XOR cancels itself out. The
          receiver uses c0 to rebuild the same counter inputs, computes the same
          pads, and XORs them with the ciphertext blocks.
        </p>

        <div className="formula-box">
          mi = ci XOR Fk(ctr || i)
        </div>

        <p>
          This is why the function F does not need to be invertible in CTR mode.
          The receiver does not decrypt Fk(ctr || i). The receiver simply
          recomputes the same pad.
        </p>
      </div>

      <div className="warning-box">
        <h2>Most important CTR warning</h2>
        <p>
          Never reuse the same counter or nonce with the same key. If the same
          pad is reused, then two ciphertexts can leak information about the two
          plaintexts.
        </p>

        <div className="formula-box">
          c1 XOR c2 = m1 XOR m2
        </div>

        <p>
          That means the attacker may not immediately get both messages, but
          they learn a relationship between them. That is a serious break.
        </p>
      </div>

      <div className="explanation-box">
        <h2>Why CTR is efficient</h2>

        <p>
          CTR only expands the ciphertext by one block because it sends the
          starting counter value once as c0. After that, each message block gets
          one ciphertext block.
        </p>

        <p>
          Another advantage is that each pad block can be computed independently.
          That makes CTR easier to parallelize than CBC.
        </p>
      </div>
    </div>
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
        c0 = IV
      </div>

      <div className="formula-box">
        ci = Fk(mi XOR ci-1)
      </div>

      <div className="flow-diagram">
        <div className="flow-row">
          <div className="flow-box iv-box">IV / c0</div>
          <div className="flow-arrow">→</div>
          <div className="flow-box xor-box">XOR with m1</div>
          <div className="flow-arrow">→</div>
          <div className="flow-box cipher-box">Block Cipher Fk</div>
          <div className="flow-arrow">→</div>
          <div className="flow-box output-box">c1</div>
        </div>

        <div className="flow-row">
          <div className="flow-box output-box">c1</div>
          <div className="flow-arrow">→</div>
          <div className="flow-box xor-box">XOR with m2</div>
          <div className="flow-arrow">→</div>
          <div className="flow-box cipher-box">Block Cipher Fk</div>
          <div className="flow-arrow">→</div>
          <div className="flow-box output-box">c2</div>
        </div>

        <div className="flow-row">
          <div className="flow-box output-box">c2</div>
          <div className="flow-arrow">→</div>
          <div className="flow-box xor-box">XOR with m3</div>
          <div className="flow-arrow">→</div>
          <div className="flow-box cipher-box">Block Cipher Fk</div>
          <div className="flow-arrow">→</div>
          <div className="flow-box output-box">c3</div>
        </div>
      </div>

      <div className="explanation-box">
        <h2>What CBC teaches</h2>

        <p>
          CBC hides repeated plaintext blocks better than directly encrypting
          each block independently because each ciphertext block depends on the
          previous ciphertext block.
        </p>

        <p>
          The first block needs an initialization vector, usually called an IV.
          The IV becomes c0.
        </p>
      </div>

      <div className="warning-box">
        <h2>Common mistake</h2>
        <p>
          CBC requires F to be invertible for decryption. CTR does not. Also,
          CBC by itself does not provide message authentication, so ciphertext
          modification attacks are still a concern unless authentication is
          added.
        </p>
      </div>
    </div>
  );
}

export default ModesVisualizer;