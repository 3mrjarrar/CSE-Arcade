// Three hand-shaped maps. The mobile maps turn the route downward so every gate stays tappable.
export const MAZES = [
  { source: [915, 475], finish: [85, 120], stages: [[[755, 175], [740, 455]], [[440, 150], [465, 390]]], mobile: { source: [130, 85], finish: [465, 900], stages: [[[145, 280], [450, 270]], [[145, 620], [455, 640]]] } },
  { source: [910, 105], finish: [95, 500], stages: [[[780, 170], [770, 440]], [[550, 105], [575, 360]], [[330, 185], [325, 480]]], mobile: { source: [140, 75], finish: [450, 900], stages: [[[140, 225], [450, 250]], [[155, 475], [445, 505]], [[140, 720], [460, 745]]] } },
  { source: [910, 475], finish: [90, 95], stages: [[[775, 130], [765, 425]], [[590, 205], [575, 485]], [[405, 105], [420, 395]], [[225, 175], [235, 505]]], mobile: { source: [135, 75], finish: [465, 900], stages: [[[145, 205], [450, 225]], [[155, 390], [445, 415]], [[145, 600], [450, 585]], [[150, 755], [445, 770]]] } },
];

export function mazePath(from, to, seed, vertical) {
  const offset = ((seed * 37) % 5 - 2) * 24;
  if (vertical) {
    const dy = to[1] - from[1];
    const bendX = Math.max(75, Math.min(525, (from[0] + to[0]) / 2 + offset));
    const midY = from[1] + dy * .5;
    return `M ${from[0]} ${from[1]} C ${from[0]} ${from[1] + dy * .24}, ${bendX} ${midY - dy * .18}, ${bendX} ${midY} C ${bendX} ${midY + dy * .18}, ${to[0]} ${to[1] - dy * .24}, ${to[0]} ${to[1]}`;
  }
  const dx = to[0] - from[0];
  const bendY = Math.max(65, Math.min(535, (from[1] + to[1]) / 2 + offset));
  const midX = from[0] + dx * .5;
  return `M ${from[0]} ${from[1]} C ${from[0] + dx * .24} ${from[1]}, ${midX - dx * .18} ${bendY}, ${midX} ${bendY} C ${midX + dx * .18} ${bendY}, ${to[0] - dx * .24} ${to[1]}, ${to[0]} ${to[1]}`;
}

export function mazeEdges(map, picks, vertical) {
  const edges = [];
  let fromNodes = [map.source];
  map.stages.forEach((toNodes, stage) => {
    fromNodes.forEach((from, fromIndex) => toNodes.forEach((to, option) => {
      const onRoute = picks[stage] === option && (stage === 0 || picks[stage - 1] === fromIndex);
      const available = picks.length === stage && (stage === 0 || picks[stage - 1] === fromIndex);
      edges.push({ path: mazePath(from, to, stage * 7 + fromIndex * 3 + option, vertical), state: onRoute ? 'traced' : available ? 'available' : 'muted' });
    }));
    fromNodes = toNodes;
  });
  fromNodes.forEach((from, index) => edges.push({ path: mazePath(from, map.finish, 50 + index, vertical), state: picks.length === map.stages.length && picks.at(-1) === index ? 'traced' : 'muted' }));
  return edges.sort((a, b) => ['muted', 'available', 'traced'].indexOf(a.state) - ['muted', 'available', 'traced'].indexOf(b.state));
}
