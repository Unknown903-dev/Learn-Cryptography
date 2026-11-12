import { useState } from "react";
import { Link } from "react-router-dom";
import {
  DICE_OUTCOMES,
  summarizeDiceProbability,
} from "../utils/probability";

function ProbabilityBasics() {
  const [condition, setCondition] = useState("none");
  const [targetSum, setTargetSum] = useState(7);
  const [prediction, setPrediction] = useState(null);

  const summary = summarizeDiceProbability(condition, targetSum);
  const simplifiedFraction = `${summary.simplifiedNumerator}/${summary.simplifiedDenominator}`;
  const countedFraction = `${summary.numerator}/${summary.denominator}`;
  const fractionDisplay =
    countedFraction === simplifiedFraction
      ? countedFraction
      : `${countedFraction} = ${simplifiedFraction}`;
  const conditionLabel =
    condition === "none" ? "No condition" : "Given first die = 6";

  return (
    <section>
      <div className="page-header">
        <p className="eyebrow">Probability Foundation</p>
        <h1>Probability Basics</h1>
        <p>
          Use one pair of fair, independent six-sided dice to see how events,
          sample spaces, and conditions determine a probability.
        </p>
      </div>

      <div className="demo-panel">
        <div className="formula-box">
          P(event | condition) = matching possible outcomes / all possible outcomes
        </div>
        <p className="security-note">
          Educational demo only. Every ordered pair below is equally likely
          because both dice are fair and independent.
        </p>

        <div className="explanation-box">
          <p className="eyebrow">Worked Example</p>
          <h2>Roll two fair dice</h2>
          <p>
            There are 36 ordered outcomes: the first number is die one and the
            second is die two. Choose a condition and an event to update the grid.
          </p>

          <div className="probability-controls">
            <label htmlFor="dice-condition">
              Condition
              <select
                id="dice-condition"
                value={condition}
                onChange={(event) => setCondition(event.target.value)}
              >
                <option value="none">No condition</option>
                <option value="first-is-six">The first die rolled a 6</option>
              </select>
            </label>

            <label htmlFor="dice-event">
              Event
              <select
                id="dice-event"
                value={targetSum}
                onChange={(event) => setTargetSum(Number(event.target.value))}
              >
                <option value={7}>The sum is 7</option>
                <option value={8}>The sum is 8</option>
              </select>
            </label>
          </div>

          <div className="dice-legend" aria-label="Outcome grid legend">
            <span><i className="legend-swatch match" /> Matches event</span>
            <span><i className="legend-swatch possible" /> Possible, not a match</span>
            <span><i className="legend-swatch excluded" /> Excluded by condition</span>
          </div>

          <p className="grid-axis-note">
            Rows show the first die; columns show the second die.
          </p>
          <div className="dice-grid-wrap">
            <div className="dice-grid" role="grid" aria-label="36 ordered dice outcomes">
              {DICE_OUTCOMES.map((outcome) => {
                const isPossible =
                  condition === "none" || outcome.first === 6;
                const isMatch = isPossible && outcome.sum === targetSum;
                const state = isMatch
                  ? "match"
                  : isPossible
                    ? "possible"
                    : "excluded";

                return (
                  <div
                    className={`dice-outcome ${state}`}
                    role="gridcell"
                    aria-label={`First die ${outcome.first}, second die ${outcome.second}, sum ${outcome.sum}; ${
                      isMatch
                        ? "possible and matches the event"
                        : isPossible
                          ? "possible but does not match the event"
                          : "excluded by the condition"
                    }`}
                    key={`${outcome.first}-${outcome.second}`}
                  >
                    <strong>({outcome.first}, {outcome.second})</strong>
                    <small>sum {outcome.sum}</small>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="probability-counts" aria-live="polite">
            <article>
              <span>Denominator</span>
              <strong>{summary.denominator}</strong>
              <small>outcomes remain possible</small>
            </article>
            <article>
              <span>Numerator</span>
              <strong>{summary.numerator}</strong>
              <small>possible outcomes match</small>
            </article>
            <article className="fraction-card">
              <span>Probability</span>
              <strong>{fractionDisplay}</strong>
              <small>{conditionLabel}</small>
            </article>
          </div>

          <div className="formula-box probability-formula">
            P(sum = {targetSum}
            {condition === "first-is-six" ? " | first die = 6" : ""}) ={" "}
            {summary.numerator}/{summary.denominator}
            {countedFraction !== simplifiedFraction
              ? ` = ${simplifiedFraction}`
              : ""}
          </div>

          <p>
            Matching outcomes: {summary.matchingOutcomes
              .map((outcome) => `(${outcome.first}, ${outcome.second})`)
              .join(", ")}.
          </p>

          <div className="learning-callout">
            <h3>Compare the two events</h3>
            <p>
              Without a condition, sum 7 is 6/36 = 1/6. Given the first die is
              6, it is 1/6. Sum 8 changes from 5/36 without a condition to 1/6
              when the first die is known to be 6. Every count comes directly
              from the outcomes displayed above.
            </p>
          </div>
        </div>

        <div className="prediction-box">
          <h2>Predict the denominator</h2>
          <p>
            Before revealing the answer: if you learn that the first die rolled
            a 6, how many ordered outcomes belong in the conditional denominator?
          </p>
          <div className="answer-list">
            <button
              className="answer-button"
              type="button"
              onClick={() => setPrediction("correct")}
            >
              6 outcomes
            </button>
            <button
              className="answer-button"
              type="button"
              onClick={() => setPrediction("incorrect")}
            >
              36 outcomes
            </button>
          </div>
          {prediction && (
            <p className={`prediction-feedback ${prediction}`} role="status">
              {prediction === "correct"
                ? "Correct. Once the first die is fixed at 6, only (6, 1) through (6, 6) remain possible, so the denominator is 6."
                : "Not quite. Conditioning removes outcomes whose first die is not 6. Only six ordered pairs remain, so the denominator is 6."}
            </p>
          )}
        </div>

        <div className="explanation-box">
          <h2>From dice to ciphertext</h2>
          <p>
            A condition represents information you have observed. In a secrecy
            question, observing a ciphertext can condition the set of possible
            messages just as observing the first die conditions the dice outcomes.
            Perfect secrecy means that observation should not change the message
            probabilities.
          </p>
          <p>
            <Link className="inline-link" to="/perfect-secrecy">
              Try conditioning on ciphertext in the Perfect Secrecy lab
            </Link>
            .
          </p>
        </div>

        <div className="lesson-navigation">
          <Link className="btn secondary" to="/lessons">Back to all lessons</Link>
          <Link className="btn primary" to="/bayes-theorem">
            Next lesson: Bayes Theorem →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ProbabilityBasics;
