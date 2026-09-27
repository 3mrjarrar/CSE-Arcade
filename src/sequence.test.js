import test from 'node:test';
import assert from 'node:assert/strict';
import { STEPS, shuffledSteps, placeStep, isCorrectSequence } from './sequence.js';

test('Only the exact complete startup order opens the portal', () => {
  assert.equal(isCorrectSequence(STEPS), true);
  assert.equal(isCorrectSequence([...STEPS].reverse()), false);
  assert.equal(isCorrectSequence(STEPS.slice(0, 6)), false);
  assert.equal(isCorrectSequence(Array(7).fill(null)), false);
  assert.equal(isCorrectSequence([...STEPS.slice(0, 6), STEPS[0]]), false);
});
test('Moving between slots swaps cards and never duplicates them', () => {
  let slots = Array(7).fill(null);
  slots = placeStep(slots, STEPS[0], 0);
  slots = placeStep(slots, STEPS[1], 1);
  slots = placeStep(slots, STEPS[0], 1);
  assert.deepEqual(slots.slice(0, 2), [STEPS[1], STEPS[0]]);
  slots = placeStep(slots, STEPS[0], 3);
  assert.equal(slots[1], null);
  assert.equal(slots[3], STEPS[0]);
  slots = placeStep(slots, STEPS[2], 3);
  assert.equal(slots.filter(Boolean).length, 2);
  assert.equal(slots.includes(STEPS[0]), false);
  assert.equal(placeStep(slots, 'invalid', 0), slots);
  assert.equal(placeStep(slots, STEPS[0], 8), slots);
});
test('The scattered bank always contains all seven cards in a non-solved order', () => {
  for (const value of [0, 0.25, 0.5, 0.999]) {
    const shuffled = shuffledSteps(() => value);
    assert.deepEqual([...shuffled].sort(), [...STEPS].sort());
    assert.equal(isCorrectSequence(shuffled), false);
  }
});
