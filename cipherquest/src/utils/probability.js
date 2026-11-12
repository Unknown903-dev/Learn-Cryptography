export const DICE_OUTCOMES = Array.from({ length: 6 }, (_, firstIndex) =>
  Array.from({ length: 6 }, (_, secondIndex) => ({
    first: firstIndex + 1,
    second: secondIndex + 1,
    sum: firstIndex + secondIndex + 2,
  })),
).flat();

function greatestCommonDivisor(left, right) {
  let a = left;
  let b = right;

  while (b !== 0) {
    [a, b] = [b, a % b];
  }

  return a;
}

export function summarizeDiceProbability(condition, targetSum) {
  const possibleOutcomes = DICE_OUTCOMES.filter(
    (outcome) => condition === "none" || outcome.first === 6,
  );
  const matchingOutcomes = possibleOutcomes.filter(
    (outcome) => outcome.sum === targetSum,
  );
  const numerator = matchingOutcomes.length;
  const denominator = possibleOutcomes.length;
  const divisor = greatestCommonDivisor(numerator, denominator);

  return {
    possibleOutcomes,
    matchingOutcomes,
    numerator,
    denominator,
    simplifiedNumerator: numerator / divisor,
    simplifiedDenominator: denominator / divisor,
  };
}
