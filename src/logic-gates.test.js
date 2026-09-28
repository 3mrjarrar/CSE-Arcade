import test from 'node:test';
import assert from 'node:assert/strict';
import { gateOutput, LOGIC_LEVELS, signalAt } from './logic-gates.js';

test('AND, OR, and NOT transform one-bit signals correctly', () => {
  assert.equal(gateOutput(0, ['NOT']), 1);
  assert.equal(gateOutput(1, ['NOT']), 0);
  assert.equal(gateOutput(1, ['AND', 0]), 0);
  assert.equal(gateOutput(1, ['AND', 1]), 1);
  assert.equal(gateOutput(0, ['OR', 1]), 1);
  assert.equal(gateOutput(0, ['OR', 0]), 0);
});

test('every level has a route that lights the logo and a route that leaves it dark', () => {
  for (const level of LOGIC_LEVELS) {
    const endings = new Set();
    const visit = (picks = []) => {
      if (picks.length === level.paths.length) return endings.add(signalAt(level, picks));
      level.paths[picks.length].forEach((_, option) => visit([...picks, option]));
    };
    visit();
    assert.deepEqual(endings, new Set([0, 1]));
  }
});
