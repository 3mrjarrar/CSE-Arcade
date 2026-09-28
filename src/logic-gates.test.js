import test from 'node:test';
import assert from 'node:assert/strict';
import { gateOutput, LOGIC_LEVELS, signalAt } from './logic-gates.js';
import { MAZES, mazeEdges } from './logic-maze.js';

test('AND, OR, and NOT transform one-bit signals correctly', () => {
  assert.equal(gateOutput(0, ['NOT']), 1);
  assert.equal(gateOutput(1, ['NOT']), 0);
  assert.equal(gateOutput(1, ['AND', 0]), 0);
  assert.equal(gateOutput(1, ['AND', 1]), 1);
  assert.equal(gateOutput(0, ['OR', 1]), 1);
  assert.equal(gateOutput(0, ['OR', 0]), 0);
});

test('every level has a route that lights the logo and a route that leaves it dark', () => {
  assert.equal(LOGIC_LEVELS.length, 3);
  assert.deepEqual(LOGIC_LEVELS.map(level => level.paths.length), [2, 3, 4]);
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

test('each level has its own winding map and the chosen route is traced to the logo', () => {
  assert.equal(MAZES.length, LOGIC_LEVELS.length);
  assert.equal(new Set(MAZES.map(map => map.source.join(','))).size, MAZES.length);
  assert.equal(new Set(MAZES.map(map => map.finish.join(','))).size, MAZES.length);
  MAZES.forEach((map, index) => {
    assert.equal(map.stages.length, LOGIC_LEVELS[index].paths.length);
    assert.equal(map.mobile.stages.length, map.stages.length);
    assert.equal(mazeEdges(map, [], false).filter(edge => edge.state === 'available').length, 2);
    const route = Array(map.stages.length).fill(0);
    assert.equal(mazeEdges(map, route, false).filter(edge => edge.state === 'traced').length, route.length + 1);
  });
});
