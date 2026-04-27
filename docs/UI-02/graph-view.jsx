/* global React */
// Shared graph mockup — same node positions as the user's screenshots
// Renders an SVG graph; consumers pass the algorithm state.

const NODE_POSITIONS = {
  N: [430, 60],  M: [340, 130], L: [430, 170], O: [530, 130],
  V: [635, 130], Z: [770, 110], U: [560, 200], W: [705, 210],
  G: [240, 200], K: [430, 270], P: [530, 280], T: [625, 285],
  Y: [740, 290], F: [310, 285], B: [240, 360], H: [380, 360],
  J: [475, 380], S: [625, 385], X: [745, 395],
  A: [165, 400], D: [310, 365], C: [205, 470], E: [395, 460],
  I: [495, 470], Q: [565, 460], R: [665, 460],
};

const EDGES = [
  ['N','M',null], ['M','L',3], ['M','G',1], ['L','O',null], ['O','V',null], ['V','Z',null],
  ['L','U',null], ['V','W',null], ['G','F',10], ['F','K',null], ['F','B',4], ['K','P',null],
  ['P','T',null], ['T','Y',null], ['T','S',null], ['Y','X',null], ['B','A',4], ['A','C',2],
  ['B','H',null], ['H','D',null], ['H','J',null], ['J','I',null], ['Q','R',null], ['I','Q',null],
  ['H','E',null], ['F','D',4], ['W','U',null],
];

function GraphView({ state = {}, theme = 'dark', size = 'normal' }) {
  // state: { start, goal, current, frontier:[], visited:[], path:[], discarded:[], colors:{} }
  const start = state.start || 'D';
  const goal = state.goal || 'O';
  const current = state.current;
  const frontier = state.frontier || [];
  const visited = state.visited || [];
  const path = state.path || [];

  const nodeStatus = (id) => {
    if (id === current) return 'current';
    if (path.includes(id)) return 'path';
    if (id === start) return 'start';
    if (id === goal) return 'goal';
    if (frontier.includes(id)) return 'frontier';
    if (visited.includes(id)) return 'visited';
    return 'idle';
  };

  const COLORS = {
    idle:     { fill: 'var(--node-fill)', stroke: 'var(--node-stroke)', text: 'var(--text)' },
    start:    { fill: 'var(--node-fill)', stroke: 'var(--a-start)', text: 'var(--text)', ring: true },
    goal:     { fill: 'var(--node-fill)', stroke: 'var(--a-goal)', text: 'var(--text)', ring: true },
    current:  { fill: 'var(--a-current)', stroke: 'var(--a-current)', text: '#1A1408', glow: true },
    frontier: { fill: 'color-mix(in oklch, var(--a-frontier) 20%, var(--node-fill))', stroke: 'var(--a-frontier)', text: 'var(--text)' },
    visited:  { fill: 'color-mix(in oklch, var(--a-visited) 18%, var(--node-fill))', stroke: 'var(--a-visited)', text: 'var(--text-2)' },
    path:     { fill: 'color-mix(in oklch, var(--a-path) 30%, var(--node-fill))', stroke: 'var(--a-path)', text: 'var(--text)', glow: true },
  };

  const nodeR = size === 'small' ? 16 : 22;

  return (
    <svg viewBox="50 20 800 480" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <pattern id="grid-fine" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--grid-line)" strokeWidth="1"/>
        </pattern>
        <pattern id="grid-coarse" width="100" height="100" patternUnits="userSpaceOnUse">
          <rect width="100" height="100" fill="url(#grid-fine)"/>
          <path d="M 100 0 L 0 0 0 100" fill="none" stroke="var(--grid-line-strong)" strokeWidth="1"/>
        </pattern>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--edge)"/>
        </marker>
        <marker id="arrow-path" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--a-path)"/>
        </marker>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      <rect x="0" y="0" width="900" height="520" fill="url(#grid-coarse)"/>

      {/* edges */}
      {EDGES.map(([a, b, w], i) => {
        const [x1, y1] = NODE_POSITIONS[a];
        const [x2, y2] = NODE_POSITIONS[b];
        const onPath = path.includes(a) && path.includes(b) &&
          Math.abs(path.indexOf(a) - path.indexOf(b)) === 1;
        const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy);
        const ux = dx / len, uy = dy / len;
        const sx = x1 + ux * nodeR, sy = y1 + uy * nodeR;
        const ex = x2 - ux * nodeR, ey = y2 - uy * nodeR;
        return (
          <g key={i}>
            <line x1={sx} y1={sy} x2={ex} y2={ey}
              stroke={onPath ? 'var(--a-path)' : 'var(--edge)'}
              strokeWidth={onPath ? 2.5 : 1.5}
              markerEnd={onPath ? 'url(#arrow-path)' : 'url(#arrow)'}/>
            {w != null && (
              <g>
                <rect x={(x1+x2)/2 - 9} y={(y1+y2)/2 - 9} width="18" height="14"
                  rx="3" fill="var(--surface)" stroke="var(--border)" strokeWidth="1"/>
                <text x={(x1+x2)/2} y={(y1+y2)/2 + 1} textAnchor="middle"
                  fontFamily="var(--font-mono)" fontSize="10" fill="var(--text-2)" fontWeight="600">{w}</text>
              </g>
            )}
          </g>
        );
      })}

      {/* nodes */}
      {Object.entries(NODE_POSITIONS).map(([id, [x, y]]) => {
        const s = nodeStatus(id);
        const c = COLORS[s];
        return (
          <g key={id} style={{ filter: c.glow ? 'url(#glow)' : 'none' }}>
            {c.ring && (
              <circle cx={x} cy={y} r={nodeR + 4} fill="none" stroke={c.stroke} strokeWidth="1.5" strokeDasharray={s === 'goal' ? '3 3' : '0'} opacity="0.5"/>
            )}
            <circle cx={x} cy={y} r={nodeR} fill={c.fill} stroke={c.stroke} strokeWidth="2"/>
            <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle"
              fontFamily="var(--font-mono)" fontSize="14" fontWeight="600" fill={c.text}>{id}</text>
          </g>
        );
      })}
    </svg>
  );
}

window.GraphView = GraphView;
window.NODE_POSITIONS = NODE_POSITIONS;
