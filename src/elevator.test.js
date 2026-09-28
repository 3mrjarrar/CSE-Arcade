import test from 'node:test';
import assert from 'node:assert/strict';
import { createChallenges, isCorrectAnswer, toBinary } from './elevator.js';

test('five distinct elevator challenges include both conversion directions', () => {
  const challenges = createChallenges(() => 0.4);
  assert.equal(challenges.length, 5);
  assert.equal(new Set(challenges.map(challenge => challenge.value)).size, 5);
  assert.deepEqual(new Set(challenges.map(challenge => challenge.answerType)), new Set(['binary', 'decimal']));
  for (const challenge of challenges) {
    assert.ok(challenge.value >= 0 && challenge.value <= 15);
    assert.equal(toBinary(challenge.value).length, 4);
  }
});

test('answers require the correct decimal value or exactly four binary digits', () => {
  assert.ok(isCorrectAnswer({ value: 5, answerType: 'binary' }, '0101'));
  assert.ok(!isCorrectAnswer({ value: 5, answerType: 'binary' }, '101'));
  assert.ok(!isCorrectAnswer({ value: 5, answerType: 'binary' }, '0110'));
  assert.ok(isCorrectAnswer({ value: 15, answerType: 'decimal' }, '15'));
  assert.ok(!isCorrectAnswer({ value: 15, answerType: 'decimal' }, '16'));
  assert.ok(!isCorrectAnswer({ value: 5, answerType: 'decimal' }, '0101'));
});
