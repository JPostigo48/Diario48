/* global React, GraphView */
// Variation 2: Timeline & Inspector
// State of the algorithm shown as horizontal timeline at top + collapsible inspector at right.
// Left panel becomes a single "tools" rail (icons), opening drawers on click.

const v2State = {
  start: 'D',
  goal: 'O',
  current: 'D',
  frontier: ['B', 'H', 'F'],
  visited: ['D'],
  path: [],
  step: 12,
  totalSteps: 47,
  algorithm: 'BFS',
  message: 'Expandiendo D → encolando vecinos [B, H, F]',
};

// Mock timeline events
const TIMELINE = [
  { i: 0, t: 'init',    n: 'D', label: 'inicio' },
  { i: 1, t: 'enqueue', n: 'D', label: '+D a cola' },
  { i: 2, t: 'visit',   n: 'D', label: 'visita D' },
  { i: 3, t: 'expand',  n: 'D', label: 'expande D' },
  { i: 4, t: 'enqueue', n: 'B' },
  { i: 5, t: 'enqueue', n: 'H' },
  { i: 6, t: 'enqueue', n: 'F' },
  { i: 7, t: 'visit',   n: 'B', label: 'visita B' },
  { i: 8, t: 'expand',  n: 'B' },
  { i: 9, t: 'enqueue', n: 'A' },
  { i: 10, t: 'visit',  n: 'H' },
  { i: 11, t: 'expand', n: 'H' },
  { i: 12, t: 'visit',  n: 'F', label: 'visita F (actual)' },
  { i: 13, t: 'expand', n: 'F' },
  { i: 14, t: 'enqueue', n: 'K' },
  { i: 15, t: 'enqueue', n: 'G' },
  { i: 16, t: 'visit', n: 'A' },
  { i: 17, t: 'expand', n: 'A' },
  { i: 18, t: 'enqueue', n: 'C' },
  { i: 19, t: 'visit', n: 'K' },
];

const EVENT_STYLE = {
  init:    { color: 'var(--text-muted)', icon: '◯', name: 'init' },
  enqueue: { color: 'var(--a-frontier)', icon: '+', name: 'encolar' },
  visit:   { color: 'var(--a-current)',  icon: '●', name: 'visitar' },
  expand:  { color: 'var(--a-visited)',  icon: '↳', name: 'expandir' },
  found:   { color: 'var(--a-path)',     icon: '★', name: 'meta' },
};

function TopBar2({ theme, setTheme }) {
  const algos = [
    { key: 'BFS', kind: 'no-inf' },
    { key: 'DFS', kind: 'no-inf' },
    { key: 'A*',  kind: 'inf' },
    { key: 'Greedy', kind: 'inf' },
    { key: 'Coloreo', kind: 'color' },
  ];
  return (
    <header style={{
      height: 56, borderBottom: '1px solid var(--border)', background: 'var(--surface)',
      display: 'flex', alignItems: 'center', padding: '0 16px', gap: 14, flexShrink: 0
    }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14 }}>
        <span style={{ color: 'var(--text)', fontWeight: 700 }}>diario48</span>
        <span style={{ margin: '0 6px', color: 'var(--text-faint)' }}>›</span>
        <span style={{ color: 'var(--text-muted)' }}>visualizador de grafos</span>
      </div>

      <div style={{ width: 1, height: 24, background: 'var(--border)', marginLeft: 8 }}/>

      <div style={{ display: 'flex', gap: 4 }}>
        {algos.map(a => {
          const active = a.key === 'BFS';
          return (
            <button key={a.key} className="btn" style={{
              fontSize: 13, padding: '6px 12px',
              background: active ? 'var(--accent-soft)' : 'transparent',
              borderColor: active ? 'color-mix(in oklch, var(--accent) 40%, transparent)' : 'transparent',
              color: active ? 'var(--text)' : 'var(--text-muted)',
              fontWeight: active ? 600 : 500
            }}>
              {a.key}
              {a.kind === 'inf' && <span style={{ fontSize: 9, color: 'var(--text-faint)', marginLeft: 4 }}>h(n)</span>}
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1 }}/>

      <button className="btn" style={{ fontSize: 13 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M12 3v18"/></svg>
        cargar ejemplo
      </button>
      <button className="btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} style={{ fontSize: 13 }}>
        {theme === 'dark' ? '☾' : '☀'}
      </button>
    </header>
  );
}

function ToolsRail() {
  const tools = [
    { icon: '◇', label: 'grafo', active: false },
    { icon: '○', label: 'nodos', active: false },
    { icon: '→', label: 'aristas', active: false },
    { icon: '⚙', label: 'config', active: true },
    { icon: '⊞', label: 'matriz', active: false },
  ];
  return (
    <aside style={{
      width: 56, borderRight: '1px solid var(--border)', background: 'var(--surface)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 0', gap: 4
    }}>
      {tools.map((t, i) => (
        <button key={i} className="btn" style={{
          width: 40, height: 40, padding: 0, justifyContent: 'center',
          flexDirection: 'column', gap: 2,
          fontFamily: 'var(--font-mono)', fontSize: 16,
          background: t.active ? 'var(--accent-soft)' : 'transparent',
          borderColor: t.active ? 'color-mix(in oklch, var(--accent) 40%, transparent)' : 'transparent',
          color: t.active ? 'var(--accent)' : 'var(--text-muted)'
        }} title={t.label}>
          {t.icon}
        </button>
      ))}
      <div style={{ flex: 1 }}/>
      <button className="btn" style={{
        width: 40, height: 40, padding: 0, justifyContent: 'center',
        background: 'transparent', borderColor: 'transparent', color: 'var(--text-muted)'
      }} title="ayuda">?</button>
    </aside>
  );
}

function ConfigDrawer() {
  return (
    <aside style={{
      width: 260, borderRight: '1px solid var(--border)', background: 'var(--surface)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden'
    }}>
      <div style={{
        padding: '14px 16px', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600 }}>// configuración</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-faint)' }}>BFS</span>
      </div>

      <div style={{ padding: 16, overflow: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>

        <div>
          <div className="label" style={{ marginBottom: 8 }}>grafo activo</div>
          <div style={{
            background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, padding: 12
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600 }}>Costo Uniforme</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
              27 nodos · 27 aristas
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
              <button className="btn" style={{ flex: 1, justifyContent: 'center', fontSize: 12 }}>cargar</button>
              <button className="btn" style={{ flex: 1, justifyContent: 'center', fontSize: 12 }}>guardar</button>
            </div>
          </div>
        </div>

        <div>
          <div className="label" style={{ marginBottom: 8 }}>nodos extremos</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <SelectField label="inicio" value="D" tone="start"/>
            <SelectField label="objetivo" value="O" tone="goal"/>
          </div>
        </div>

        <div>
          <div className="label" style={{ marginBottom: 8 }}>heurística h(n)</div>
          <div style={{
            background: 'var(--surface-2)', border: '1px dashed var(--border)', borderRadius: 8,
            padding: '10px 12px', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5
          }}>
            No requerida para BFS.<br/>
            <span style={{ color: 'var(--text-faint)' }}>Disponible en A* y Greedy.</span>
          </div>
        </div>

        <div>
          <div className="label" style={{ marginBottom: 8 }}>velocidad auto-play</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input type="range" min="1" max="10" defaultValue="5" style={{ flex: 1, accentColor: 'var(--accent)' }}/>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text)', minWidth: 40, textAlign: 'right' }}>5×</span>
          </div>
        </div>

        <div style={{ borderTop: '1px dashed var(--border)' }}/>

        <button className="btn btn-primary" style={{ justifyContent: 'center' }}>
          actualizar grafo
        </button>
        <button className="btn-ghost btn" style={{ justifyContent: 'center', fontSize: 12 }}>
          limpiar pantalla
        </button>
      </div>
    </aside>
  );
}

function SelectField({ label, value, tone }) {
  const TONES = {
    start: 'var(--a-start)', goal: 'var(--a-goal)', current: 'var(--a-current)'
  };
  return (
    <label style={{ display: 'block' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-2)', marginBottom: 4 }}>
        <span>{label}</span>
        <span style={{
          fontWeight: 700, color: TONES[tone],
          background: `color-mix(in oklch, ${TONES[tone]} 15%, transparent)`,
          padding: '1px 8px', borderRadius: 4, fontSize: 11,
          border: `1px solid color-mix(in oklch, ${TONES[tone]} 40%, transparent)`
        }}>{value}</span>
      </div>
      <select className="select"><option>{value}</option></select>
    </label>
  );
}

function AlgorithmTimeline() {
  const cur = v2State.step;
  return (
    <div style={{
      borderBottom: '1px solid var(--border)', background: 'var(--surface)',
      padding: '12px 20px'
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span className="label">timeline · bfs</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text)' }}>
            paso <span style={{ fontWeight: 700, color: 'var(--accent)' }}>{cur}</span>
            <span style={{ color: 'var(--text-faint)' }}> / {v2State.totalSteps}</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {Object.entries(EVENT_STYLE).filter(([k]) => k !== 'init').map(([k, v]) => (
            <span key={k} style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <span style={{ color: v.color, fontSize: 13 }}>{v.icon}</span>{v.name}
            </span>
          ))}
        </div>
      </div>

      <div style={{ position: 'relative', height: 56, overflow: 'hidden' }}>
        {/* baseline */}
        <div style={{ position: 'absolute', top: 28, left: 0, right: 0, height: 1, background: 'var(--border)' }}/>
        {/* current marker */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0,
          left: `${(cur / (TIMELINE.length - 1)) * 100}%`,
          width: 2, background: 'var(--accent)', transform: 'translateX(-1px)', zIndex: 2
        }}/>

        {TIMELINE.map((ev, i) => {
          const left = `${(i / (TIMELINE.length - 1)) * 100}%`;
          const isPast = i < cur;
          const isCur = i === cur;
          const ev_st = EVENT_STYLE[ev.t];
          return (
            <div key={i} style={{
              position: 'absolute', top: 0, left, transform: 'translateX(-50%)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              opacity: isPast || isCur ? 1 : 0.35
            }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-faint)',
                visibility: isCur || i % 4 === 0 ? 'visible' : 'hidden'
              }}>{i}</span>
              <span style={{
                width: isCur ? 14 : 10, height: isCur ? 14 : 10, borderRadius: '50%',
                background: isPast || isCur ? ev_st.color : 'var(--surface)',
                border: `2px solid ${ev_st.color}`,
                boxShadow: isCur ? `0 0 0 4px color-mix(in oklch, ${ev_st.color} 25%, transparent)` : 'none',
                marginTop: 22 - (isCur ? 7 : 5)
              }}/>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, color: isCur ? 'var(--text)' : 'var(--text-muted)',
                fontWeight: isCur ? 600 : 400, marginTop: 4,
                visibility: isCur || ev.label ? 'visible' : 'hidden',
                whiteSpace: 'nowrap'
              }}>{ev.label || ev.n}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InspectorPanel() {
  return (
    <aside style={{
      width: 320, borderLeft: '1px solid var(--border)', background: 'var(--surface)',
      display: 'flex', flexDirection: 'column', overflow: 'auto'
    }}>
      {/* Acción actual — hero */}
      <div style={{
        padding: 18, borderBottom: '1px solid var(--border)',
        background: 'linear-gradient(180deg, color-mix(in oklch, var(--a-current) 8%, var(--surface)) 0%, var(--surface) 100%)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span className="label" style={{ color: 'var(--a-current)' }}>acción actual</span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--a-current)',
            background: 'color-mix(in oklch, var(--a-current) 15%, transparent)',
            padding: '2px 8px', borderRadius: 4, border: '1px solid color-mix(in oklch, var(--a-current) 35%, transparent)',
            textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em'
          }}>visit</span>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 700, lineHeight: 1, color: 'var(--text)' }}>
          F <span style={{ color: 'var(--text-muted)', fontSize: 14, fontWeight: 400 }}>← desbloqueado</span>
        </div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-2)', marginTop: 10, lineHeight: 1.5 }}>
          {v2State.message}
        </div>
      </div>

      {/* Cola */}
      <Section title="cola · frontera" hint={`${v2State.frontier.length} nodos`}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {v2State.frontier.map((n, i) => (
            <span key={n} style={{
              fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600,
              padding: '4px 10px', borderRadius: 6,
              background: 'color-mix(in oklch, var(--a-frontier) 18%, transparent)',
              color: 'var(--a-frontier)',
              border: '1px solid color-mix(in oklch, var(--a-frontier) 40%, transparent)',
              opacity: 1 - i * 0.1
            }}>{n}</span>
          ))}
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-faint)', alignSelf: 'center', marginLeft: 4 }}>← FIFO</span>
        </div>
      </Section>

      {/* Visitados */}
      <Section title="visitados" hint={`${v2State.visited.length}`}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {v2State.visited.map(n => (
            <span key={n} style={{
              fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 500,
              padding: '2px 8px', borderRadius: 4,
              background: 'var(--surface-2)',
              color: 'var(--text-muted)',
              border: '1px solid var(--border)'
            }}>{n}</span>
          ))}
        </div>
      </Section>

      {/* Camino */}
      <Section title="camino actual">
        <div style={{
          background: 'var(--surface-2)', border: '1px dashed var(--border)', borderRadius: 6,
          padding: 12, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', textAlign: 'center'
        }}>
          sin camino final · siga avanzando
        </div>
      </Section>

      {/* Métricas */}
      <Section title="métricas" border={false}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Metric label="profundidad" value="2"/>
          <Metric label="bif. promedio" value="2.3"/>
          <Metric label="nodos vistos" value="4"/>
          <Metric label="memoria" value="3"/>
        </div>
      </Section>
    </aside>
  );
}

function Section({ title, hint, children, border = true }) {
  return (
    <div style={{ padding: 16, borderBottom: border ? '1px solid var(--border)' : 'none' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
        <span className="label">{title}</span>
        {hint && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-faint)' }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div style={{ background: 'var(--surface-2)', borderRadius: 6, padding: '8px 10px', border: '1px solid var(--border)' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: 'var(--text)', marginTop: 2 }}>{value}</div>
    </div>
  );
}

function PlaybackBar2() {
  return (
    <div style={{
      height: 60, borderTop: '1px solid var(--border)', background: 'var(--surface)',
      display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8
    }}>
      <button className="btn btn-primary" style={{ fontSize: 14 }}>
        <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor"><path d="M2 1.5v9l8-4.5z"/></svg>
        ejecutar
      </button>
      <div style={{ width: 1, height: 24, background: 'var(--border)', margin: '0 4px' }}/>
      <button className="btn" title="anterior (←)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
      </button>
      <button className="btn" title="siguiente (→)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </button>
      <button className="btn">↻ reiniciar</button>
      <button className="btn-ghost btn">⏵⏵ auto-play · 5×</button>

      <div style={{ flex: 1, padding: '0 12px' }}>
        <div style={{ position: 'relative', height: 6, background: 'var(--border)', borderRadius: 3 }}>
          <div style={{ width: `${(v2State.step / v2State.totalSteps) * 100}%`, height: '100%', background: 'var(--accent)', borderRadius: 3 }}/>
          <div style={{
            position: 'absolute', top: -4, left: `${(v2State.step / v2State.totalSteps) * 100}%`,
            width: 14, height: 14, background: 'var(--accent)', borderRadius: '50%',
            transform: 'translateX(-50%)', boxShadow: '0 0 0 3px color-mix(in oklch, var(--accent) 25%, transparent)'
          }}/>
        </div>
      </div>

      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)' }}>
        <span style={{ color: 'var(--text)', fontWeight: 700 }}>{String(v2State.step).padStart(2, '0')}</span>
        <span style={{ color: 'var(--text-faint)' }}> / {v2State.totalSteps}</span>
      </div>

      <div style={{ width: 1, height: 24, background: 'var(--border)', margin: '0 4px' }}/>

      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        <span className="kbd">←</span><span className="kbd">→</span>
        <span className="kbd">␣</span>
      </div>
    </div>
  );
}

function GraphCanvas2() {
  return (
    <main style={{ flex: 1, position: 'relative', background: 'var(--bg)', overflow: 'hidden' }}>
      {/* Floating mini info — node tooltip on current */}
      <div style={{
        position: 'absolute', top: 14, right: 14, zIndex: 5,
        background: 'color-mix(in oklch, var(--surface) 92%, transparent)',
        backdropFilter: 'blur(10px)',
        border: '1px solid color-mix(in oklch, var(--a-current) 35%, var(--border))',
        borderRadius: 10, padding: '10px 14px',
        fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-2)',
        display: 'flex', alignItems: 'center', gap: 12,
        boxShadow: 'var(--shadow)'
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%', background: 'var(--a-current)',
          color: '#1A1408', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: 14
        }}>F</div>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>nodo actual</div>
          <div style={{ fontSize: 13, color: 'var(--text)', marginTop: 1 }}>g(n)=2 · padre: <span style={{ color: 'var(--a-visited)' }}>D</span></div>
        </div>
      </div>

      {/* Bottom-left legend */}
      <div style={{
        position: 'absolute', bottom: 14, left: 14, zIndex: 5,
        background: 'color-mix(in oklch, var(--surface) 90%, transparent)',
        backdropFilter: 'blur(8px)', border: '1px solid var(--border)', borderRadius: 8,
        padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 5,
        fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-2)'
      }}>
        <LegendDot2 color="var(--a-start)" ring>D · inicio</LegendDot2>
        <LegendDot2 color="var(--a-goal)" ring>O · objetivo</LegendDot2>
        <LegendDot2 color="var(--a-current)" filled>actual</LegendDot2>
        <LegendDot2 color="var(--a-frontier)">en cola</LegendDot2>
        <LegendDot2 color="var(--a-visited)">visitado</LegendDot2>
      </div>

      {/* Zoom controls */}
      <div style={{
        position: 'absolute', bottom: 14, right: 14, zIndex: 5,
        display: 'flex', gap: 4,
        background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: 4
      }}>
        <button className="btn-ghost btn" style={{ padding: '6px 10px' }}>+</button>
        <button className="btn-ghost btn" style={{ padding: '6px 10px' }}>−</button>
        <button className="btn-ghost btn" style={{ padding: '6px 10px' }}>⌖</button>
        <button className="btn-ghost btn" style={{ padding: '6px 10px' }}>⛶</button>
      </div>

      <GraphView state={v2State}/>
    </main>
  );
}

function LegendDot2({ color, ring, filled, children }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span style={{
        width: 9, height: 9, borderRadius: '50%',
        background: filled ? color : 'transparent',
        border: `1.5px solid ${color}`,
        boxShadow: ring ? `0 0 0 2px color-mix(in oklch, ${color} 25%, transparent)` : 'none'
      }}/>
      {children}
    </span>
  );
}

function VariationTwo({ initialTheme = 'dark' }) {
  const [theme, setTheme] = React.useState(initialTheme);
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div data-theme={theme} style={{
      width: '100%', height: '100vh', display: 'flex', flexDirection: 'column',
      background: 'var(--bg)', color: 'var(--text)'
    }}>
      <TopBar2 theme={theme} setTheme={setTheme}/>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <ToolsRail/>
        <ConfigDrawer/>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <AlgorithmTimeline/>
          <GraphCanvas2/>
          <PlaybackBar2/>
        </div>
        <InspectorPanel/>
      </div>
    </div>
  );
}

window.VariationTwo = VariationTwo;
