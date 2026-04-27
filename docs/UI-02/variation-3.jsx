/* global React, GraphView */
// Variation 3 (merged): V1 left panel (compact, full info) + V2 timeline + V2 inspector

const v3State = {
  start: 'D', goal: 'O', current: 'F',
  frontier: ['B', 'H', 'F', 'A'],
  visited: ['D', 'B', 'H'],
  path: [],
  step: 12, totalSteps: 47,
  algorithm: 'BFS',
  message: 'Expandiendo F → encolando vecinos no visitados [K]',
};

const TIMELINE_V3 = [
  { i: 0, t: 'init', n: 'D', label: 'inicio' },
  { i: 1, t: 'enqueue', n: 'D' },
  { i: 2, t: 'visit', n: 'D' },
  { i: 3, t: 'expand', n: 'D', label: 'expande D' },
  { i: 4, t: 'enqueue', n: 'B' },
  { i: 5, t: 'enqueue', n: 'H' },
  { i: 6, t: 'enqueue', n: 'F' },
  { i: 7, t: 'visit', n: 'B' },
  { i: 8, t: 'expand', n: 'B' },
  { i: 9, t: 'enqueue', n: 'A' },
  { i: 10, t: 'visit', n: 'H' },
  { i: 11, t: 'expand', n: 'H' },
  { i: 12, t: 'visit', n: 'F', label: 'visita F' },
  { i: 13, t: 'expand', n: 'F' },
  { i: 14, t: 'enqueue', n: 'K' },
  { i: 15, t: 'visit', n: 'A' },
  { i: 16, t: 'expand', n: 'A' },
  { i: 17, t: 'enqueue', n: 'C' },
  { i: 18, t: 'visit', n: 'K' },
  { i: 19, t: 'expand', n: 'K' },
];

const EVENT_STYLE_V3 = {
  init:    { color: 'var(--text-muted)', icon: '◯', name: 'init' },
  enqueue: { color: 'var(--a-frontier)', icon: '+', name: 'encolar' },
  visit:   { color: 'var(--a-current)',  icon: '●', name: 'visitar' },
  expand:  { color: 'var(--a-visited)',  icon: '↳', name: 'expandir' },
  found:   { color: 'var(--a-path)',     icon: '★', name: 'meta' },
};

function v3Pill({ tone, children }) {
  const T = {
    start:  ['var(--a-start)',  18, 40],
    goal:   ['var(--a-goal)',   18, 40],
    current:['var(--a-current)',22, 50],
    frontier:['var(--a-frontier)',20,45],
  }[tone] || ['var(--text-muted)', 0, 30];
  return (
    <span style={{
      fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
      padding: '1px 8px', borderRadius: 4,
      background: `color-mix(in oklch, ${T[0]} ${T[1]}%, transparent)`,
      color: T[0],
      border: `1px solid color-mix(in oklch, ${T[0]} ${T[2]}%, transparent)`
    }}>{children}</span>
  );
}

function V3Label({ children, hint }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 7 }}>
      <span className="label">{children}</span>
      {hint && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-faint)' }}>{hint}</span>}
    </div>
  );
}

// ===== TOP BAR =====
function V3TopBar({ theme, setTheme }) {
  const algos = [
    { key: 'BFS', kind: 'no-inf' }, { key: 'DFS', kind: 'no-inf' },
    { key: 'A*', kind: 'inf' }, { key: 'Greedy', kind: 'inf' },
    { key: 'Coloreo', kind: 'color' },
  ];
  return (
    <header style={{
      height: 52, borderBottom: '1px solid var(--border)', background: 'var(--surface)',
      display: 'flex', alignItems: 'center', padding: '0 16px', gap: 14, flexShrink: 0
    }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14 }}>
        <span style={{ color: 'var(--text)', fontWeight: 700 }}>diario48</span>
        <span style={{ margin: '0 6px', color: 'var(--text-faint)' }}>›</span>
        <span style={{ color: 'var(--text-muted)' }}>visualizador de grafos</span>
      </div>
      <div style={{ width: 1, height: 22, background: 'var(--border)', marginLeft: 6 }}/>
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
      <button className="btn" style={{ fontSize: 13 }}>cargar ejemplo</button>
      <button className="btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} style={{ fontSize: 13 }}>
        {theme === 'dark' ? '☾ dark' : '☀ light'}
      </button>
    </header>
  );
}

// ===== LEFT PANEL (from V1) =====
function V3LeftPanel() {
  return (
    <aside style={{
      width: 270, borderRight: '1px solid var(--border)', background: 'var(--surface)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0
    }}>
      <div style={{ padding: '14px 14px', display: 'flex', flexDirection: 'column', gap: 14, overflow: 'auto', flex: 1 }}>

        <div>
          <V3Label hint="cargado">grafo</V3Label>
          <div style={{
            background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8,
            padding: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8
          }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600 }}>Costo Uniforme</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>27 nodos · 27 aristas</div>
            </div>
            <button className="btn-ghost btn" style={{ padding: 5 }} aria-label="editar">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </button>
          </div>
        </div>

        <div>
          <V3Label hint="agregar">nodos</V3Label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            <input className="input" placeholder="ID"/>
            <input className="input" placeholder="etiqueta"/>
            <input className="input" placeholder="heurística h(n)" style={{ gridColumn: '1 / -1' }}/>
          </div>
          <button className="btn" style={{ width: '100%', marginTop: 7, justifyContent: 'center' }}>+ agregar nodo</button>
        </div>

        <div>
          <V3Label hint="agregar">aristas</V3Label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
            <input className="input" placeholder="src"/>
            <input className="input" placeholder="dst"/>
            <input className="input" placeholder="peso"/>
          </div>
          <button className="btn" style={{ width: '100%', marginTop: 7, justifyContent: 'center' }}>+ agregar arista</button>
        </div>

        <div style={{ borderTop: '1px dashed var(--border)' }}/>

        <div>
          <V3Label>configuración</V3Label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-2)', marginBottom: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>inicio</span>
                {v3Pill({ tone: 'start', children: 'D' })}
              </div>
              <select className="select"><option>D</option></select>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-2)', marginBottom: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>objetivo</span>
                {v3Pill({ tone: 'goal', children: 'O' })}
              </div>
              <select className="select"><option>O</option></select>
            </div>
            <div style={{
              background: 'var(--surface-2)', border: '1px dashed var(--border)', borderRadius: 6,
              padding: '8px 10px', fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--text-muted)', lineHeight: 1.45
            }}>
              <span style={{ color: 'var(--text-2)' }}>h(n)</span> · no requerida para BFS.<br/>
              <span style={{ color: 'var(--text-faint)' }}>Se usa en A* y Greedy.</span>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-2)', marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
                <span>velocidad</span>
                <span style={{ color: 'var(--text)', fontWeight: 600 }}>5×</span>
              </div>
              <input type="range" min="1" max="10" defaultValue="5" style={{ width: '100%', accentColor: 'var(--accent)' }}/>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: 10, borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 6, background: 'var(--surface-2)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          <button className="btn" style={{ justifyContent: 'center', fontSize: 12 }}>cargar</button>
          <button className="btn" style={{ justifyContent: 'center', fontSize: 12 }}>guardar</button>
        </div>
        <button className="btn btn-primary" style={{ justifyContent: 'center' }}>actualizar grafo</button>
        <button className="btn-ghost btn" style={{ justifyContent: 'center', fontSize: 12 }}>limpiar pantalla</button>
      </div>
    </aside>
  );
}

// ===== TIMELINE (from V2) =====
function V3Timeline() {
  const cur = v3State.step;
  return (
    <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)', padding: '12px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span className="label">timeline · bfs</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text)' }}>
            paso <span style={{ fontWeight: 700, color: 'var(--accent)' }}>{cur}</span>
            <span style={{ color: 'var(--text-faint)' }}> / {v3State.totalSteps}</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {Object.entries(EVENT_STYLE_V3).filter(([k]) => k !== 'init').map(([k, v]) => (
            <span key={k} style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <span style={{ color: v.color, fontSize: 13 }}>{v.icon}</span>{v.name}
            </span>
          ))}
        </div>
      </div>
      <div style={{ position: 'relative', height: 52, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 26, left: 0, right: 0, height: 1, background: 'var(--border)' }}/>
        <div style={{
          position: 'absolute', top: 0, bottom: 0,
          left: `${(cur / (TIMELINE_V3.length - 1)) * 100}%`,
          width: 2, background: 'var(--accent)', transform: 'translateX(-1px)', zIndex: 2
        }}/>
        {TIMELINE_V3.map((ev, i) => {
          const left = `${(i / (TIMELINE_V3.length - 1)) * 100}%`;
          const isPast = i < cur, isCur = i === cur;
          const ev_st = EVENT_STYLE_V3[ev.t];
          return (
            <div key={i} style={{
              position: 'absolute', top: 0, left, transform: 'translateX(-50%)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              opacity: isPast || isCur ? 1 : 0.32
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
                marginTop: 20 - (isCur ? 7 : 5)
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

// ===== CANVAS =====
function V3Canvas() {
  return (
    <main style={{ flex: 1, position: 'relative', background: 'var(--bg)', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: 14, right: 14, zIndex: 5,
        background: 'color-mix(in oklch, var(--surface) 92%, transparent)',
        backdropFilter: 'blur(10px)',
        border: '1px solid color-mix(in oklch, var(--a-current) 35%, var(--border))',
        borderRadius: 10, padding: '10px 14px',
        display: 'flex', alignItems: 'center', gap: 12,
        boxShadow: 'var(--shadow)'
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%', background: 'var(--a-current)',
          color: '#1A1408', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-mono)'
        }}>F</div>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>nodo actual</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--text)', marginTop: 1 }}>g(n)=2 · padre: <span style={{ color: 'var(--a-visited)' }}>D</span></div>
        </div>
      </div>

      <div style={{
        position: 'absolute', bottom: 14, left: 14, zIndex: 5,
        background: 'color-mix(in oklch, var(--surface) 90%, transparent)',
        backdropFilter: 'blur(8px)', border: '1px solid var(--border)', borderRadius: 8,
        padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 5,
        fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-2)'
      }}>
        <V3LegendDot color="var(--a-start)" ring>D · inicio</V3LegendDot>
        <V3LegendDot color="var(--a-goal)" ring>O · objetivo</V3LegendDot>
        <V3LegendDot color="var(--a-current)" filled>actual</V3LegendDot>
        <V3LegendDot color="var(--a-frontier)">en cola</V3LegendDot>
        <V3LegendDot color="var(--a-visited)">visitado</V3LegendDot>
      </div>

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

      <GraphView state={v3State}/>
    </main>
  );
}

function V3LegendDot({ color, ring, filled, children }) {
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

// ===== INSPECTOR (from V2) =====
function V3Inspector() {
  return (
    <aside style={{
      width: 320, borderLeft: '1px solid var(--border)', background: 'var(--surface)',
      display: 'flex', flexDirection: 'column', overflow: 'auto', flexShrink: 0
    }}>
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
          {v3State.message}
        </div>
      </div>

      <V3Section title="cola · frontera" hint={`${v3State.frontier.length} nodos · FIFO`}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {v3State.frontier.map((n, i) => (
            <span key={n} style={{
              fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600,
              padding: '4px 10px', borderRadius: 6,
              background: 'color-mix(in oklch, var(--a-frontier) 18%, transparent)',
              color: 'var(--a-frontier)',
              border: '1px solid color-mix(in oklch, var(--a-frontier) 40%, transparent)',
              opacity: 1 - i * 0.08
            }}>{n}</span>
          ))}
        </div>
      </V3Section>

      <V3Section title="visitados" hint={`${v3State.visited.length}`}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {v3State.visited.map(n => (
            <span key={n} style={{
              fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 500,
              padding: '2px 8px', borderRadius: 4,
              background: 'var(--surface-2)', color: 'var(--text-muted)', border: '1px solid var(--border)'
            }}>{n}</span>
          ))}
        </div>
      </V3Section>

      <V3Section title="camino actual">
        <div style={{
          background: 'var(--surface-2)', border: '1px dashed var(--border)', borderRadius: 6,
          padding: 12, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', textAlign: 'center'
        }}>
          sin camino final · siga avanzando
        </div>
      </V3Section>

      <V3Section title="métricas" border={false}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <V3Metric label="profundidad" value="2"/>
          <V3Metric label="bif. promedio" value="2.3"/>
          <V3Metric label="nodos vistos" value="4"/>
          <V3Metric label="memoria" value="3"/>
        </div>
      </V3Section>
    </aside>
  );
}

function V3Section({ title, hint, children, border = true }) {
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

function V3Metric({ label, value }) {
  return (
    <div style={{ background: 'var(--surface-2)', borderRadius: 6, padding: '8px 10px', border: '1px solid var(--border)' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: 'var(--text)', marginTop: 2 }}>{value}</div>
    </div>
  );
}

// ===== PLAYBACK =====
function V3Playback() {
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
      <button className="btn-ghost btn">⏵⏵ auto · 5×</button>

      <div style={{ flex: 1, padding: '0 12px' }}>
        <div style={{ position: 'relative', height: 6, background: 'var(--border)', borderRadius: 3 }}>
          <div style={{ width: `${(v3State.step / v3State.totalSteps) * 100}%`, height: '100%', background: 'var(--accent)', borderRadius: 3 }}/>
          <div style={{
            position: 'absolute', top: -4, left: `${(v3State.step / v3State.totalSteps) * 100}%`,
            width: 14, height: 14, background: 'var(--accent)', borderRadius: '50%',
            transform: 'translateX(-50%)', boxShadow: '0 0 0 3px color-mix(in oklch, var(--accent) 25%, transparent)'
          }}/>
        </div>
      </div>

      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)' }}>
        <span style={{ color: 'var(--text)', fontWeight: 700 }}>{String(v3State.step).padStart(2, '0')}</span>
        <span style={{ color: 'var(--text-faint)' }}> / {v3State.totalSteps}</span>
      </div>

      <div style={{ width: 1, height: 24, background: 'var(--border)', margin: '0 4px' }}/>

      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        <span className="kbd">←</span><span className="kbd">→</span><span className="kbd">␣</span>
      </div>
    </div>
  );
}

// ===== ROOT =====
function VariationThree({ initialTheme = 'dark' }) {
  const [theme, setTheme] = React.useState(initialTheme);
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div data-theme={theme} style={{
      width: '100%', height: '100vh', display: 'flex', flexDirection: 'column',
      background: 'var(--bg)', color: 'var(--text)'
    }}>
      <V3TopBar theme={theme} setTheme={setTheme}/>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <V3LeftPanel/>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <V3Timeline/>
          <V3Canvas/>
          <V3Playback/>
        </div>
        <V3Inspector/>
      </div>
    </div>
  );
}

window.VariationThree = VariationThree;
