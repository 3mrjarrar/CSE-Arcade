export const STEPS = [
  'Power On Server',
  'Initialize OS',
  'Connect Network',
  'Start Database',
  'Start Backend',
  'Connect Frontend',
  'Open Portal',
];

export function shuffledSteps(random = Math.random) {
  const result = [...STEPS];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  if (isCorrectSequence(result)) result.push(result.shift());
  return result;
}

export function placeStep(slots, step, target) {
  if (!STEPS.includes(step) || !Number.isInteger(target) || target < 0 || target >= STEPS.length) return slots;
  const result = [...slots];
  const source = result.indexOf(step);
  if (source === target) return slots;
  if (source !== -1) result[source] = result[target];
  result[target] = step;
  return result;
}

export function isCorrectSequence(slots) {
  return slots.length === STEPS.length && STEPS.every((step, i) => slots[i] === step);
}
