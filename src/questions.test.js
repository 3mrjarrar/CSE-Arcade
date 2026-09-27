import test from 'node:test';
import assert from 'node:assert/strict';
import { questions, createRound } from './questions.js';
test('All 15 combinations provide five unique, answerable questions', () => {
  const prompts = new Set();
  for (let year = 1; year <= 5; year++) for (const level of ['beginner', 'intermediate', 'advanced']) {
    assert.equal(questions[year][level].length, 5);
    for (const q of createRound(year, level)) {
      assert.equal(q.options.length, 4);
      assert.equal(new Set(q.options).size, 4);
      assert.ok(q.options.includes(q.correct));
      assert.ok(!prompts.has(q.prompt));
      prompts.add(q.prompt);
    }
  }
  assert.equal(prompts.size, 75);
});
