export const LOGIC_LEVELS = [
  { start: 0, paths: [[['NOT'], ['OR', 0]], [['AND', 1], ['AND', 0]]] },
  { start: 0, paths: [[['OR', 0], ['NOT']], [['AND', 1], ['NOT']], [['AND', 0], ['OR', 0]]] },
  { start: 0, paths: [[['NOT'], ['OR', 0]], [['AND', 1], ['NOT']], [['OR', 0], ['AND', 0]], [['AND', 1], ['NOT']]] },
];

export function gateOutput(input, [gate, other]) {
  if (gate === 'NOT') return 1 - input;
  if (gate === 'AND') return input & other;
  if (gate === 'OR') return input | other;
  throw new Error(`Unknown gate: ${gate}`);
}

export function signalAt(level, picks) {
  return picks.reduce((signal, option, stage) => gateOutput(signal, level.paths[stage][option]), level.start);
}
