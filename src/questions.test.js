import test from 'node:test';
import assert from 'node:assert/strict';
import { questions, createRound } from './questions.js';
test('All 90 supplied questions are available and each round has five answerable questions', () => {
  const bankPrompts = new Set();
  for (let year = 1; year <= 5; year++) for (const level of ['beginner', 'intermediate', 'advanced']) {
    assert.equal(questions[year][level].length, 6);
    for (const [prompt, correct, ...wrong] of questions[year][level]) {
      assert.ok(!bankPrompts.has(prompt));
      assert.equal(new Set([correct, ...wrong]).size, 4);
      bankPrompts.add(prompt);
    }
    const round = createRound(year, level);
    assert.equal(round.length, 5);
    for (const q of round) {
      assert.equal(q.options.length, 4);
      assert.equal(new Set(q.options).size, 4);
      assert.ok(q.options.includes(q.correct));
      assert.ok(bankPrompts.has(q.prompt));
      assert.match(q.prompt, /[\u0600-\u06FF]/);
    }
  }
  assert.equal(bankPrompts.size, 90);
});
