/* global React, GraphView */
// Variation 1: Cards Panel — refines the existing left/right layout
// Improves density, type sizes, hierarchy, contrast.

const v1State = {
  start: 'D',
  goal: 'O',
  current: 'D',
  frontier: ['B', 'H', 'F'],
  visited: ['D'],
  path: [],
  step: 1,
  totalSteps: 47,
  algorithm: 'BFS',
  queue: ['D'],
  message: 'Inicializando BFS desde D. Cola inicial: [D]',
};

function StatePill({ tone = 'idle', children, mono = true }) {
  const TONES = {
    idle:     { bg: 'var(--surface-2)', fg: 'var(--text-muted)', bd: 'var(--border)' },
    start:    { bg: 'color-mix(in oklch, var(--a-start) 18%, transparent)', fg: 'var(--a-start)', bd: 'color-mix(in oklch, var(--a-start) 40%, transparent)' },
    goal:     { bg: 'color-mix(in oklch, var(--a-goal) 18%, transparent)', fg: 'var(--a-goal)', bd: 'color-mix(in oklch, var(--a-goal) 40%, transparent)' },
    current:  { bg: 'color-mix(in oklch, var(--a-current) 22%, transparent)', fg: 'var(--a-current)', bd: 'color-mix(in oklch, var(--a-current) 50%, transparent)' },
    frontier: { bg: 'color-mix(in oklch, var(--a-frontier) 20%, transparent)', fg: 'var(--a-frontier)', bd: 'color-mix(in oklch, var(--a-frontier) 45%, transparent)' },
    visited:  { bg: 'color-mix(in oklch, var(--a-visited) 18%, transparent)', fg: 'var(--a-visited)', bd: 'color-mix(in oklch, var(--a-visited) 40%, transparent)' },
    path:     { bg: 'color-mix(in oklch, var(--a-path) 22%, transparent)', fg: 'var(--a-path)', bd: 'color-mix(in oklch, var(--a-path) 50%, transparent)' },
  };
  const t = TONES[tone];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 8px', borderRadius: 6, fontSize: 12,
      fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
      fontWeight: 600, background: t.bg, color: t.fg, border: `1px solid ${t.bd}`
    }}>{children}</span>
  );
}

function SectionLabel({ children, hint }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
      <span className="label">{children}</span>
      {hint && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-faint)' }}>{hint}</span>}
    </div>
  );
}

function LeftPanel() {
  return (
    <aside style={{
      width: 280, borderRight: '1px solid var(--border)', background: 'var(--surface)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden'
    }}>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 14, overflow: 'auto', flex: 1 }}>

        {/* Graph card */}
        <div>
          <SectionLabel hint="cargado">grafo</SectionLabel>
          <div style={{
            background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8,
            padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8
          }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Costo Uniforme</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>27 nodos · 27 aristas · ponderado</div>
            </div>
            <button className="btn-ghost btn" style={{ padding: 6 }} aria-label="editar">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </button>
          </div>
        </div>

        {/* Nodos */}
        <div>
          <SectionLabel hint="agregar">nodos</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            <input className="input" placeholder="ID"/>
            <input className="input" placeholder="etiqueta"/>
            <input className="input" placeholder="heurística" style={{ gridColumn: '1 / -1' }}/>
          </div>
          <button className="btn" style={{ width: '100%', marginTop: 8, justifyContent: 'center' }}>+ agregar nodo</button>
        </div>

        {/* Aristas */}
        <div>
          <SectionLabel hint="agregar">aristas</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
            <input className="input" placeholder="src"/>
            <input className="input" placeholder="dst"/>
            <input className="input" placeholder="peso"/>
          </div>
          <button className="btn" style={{ width: '100%', marginTop: 8, justifyContent: 'center' }}>+ agregar arista</button>
        </div>

        <div style={{ borderTop: '1px dashed var(--border)' }}/>

        {/* Configuración */}
        <div>
          <SectionLabel>configuración</SectionLabel>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-2)', marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
                <span>nodo inicial</span>
                <StatePill tone="start">D</StatePill>
              </div>
              <select className="select"><option>D</option></select>
            </div>

            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-2)', marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
                <span>nodo objetivo</span>
                <StatePill tone="goal">O</StatePill>
              </div>
              <select className="select"><option>O</option></select>
            </div>

            <div style={{
              background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 6,
              padding: '8px 10px', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)'
            }}>
              <span style={{ color: 'var(--text-2)' }}>heurística h(n)</span> <span style={{ color: 'var(--text-faint)' }}>=</span> <span style={{ color: 'var(--text-faint)' }}>—</span>
              <div style={{ fontSize: 11, marginTop: 4, color: 'var(--text-faint)', lineHeight: 1.4 }}>
                Se edita por nodo desde el formulario superior.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div style={{ padding: 12, borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 6, background: 'var(--surface-2)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          <button className="btn" style={{ justifyContent: 'center' }}>cargar</button>
          <button className="btn" style={{ justifyContent: 'center' }}>guardar</button>
        </div>
        <button className="btn btn-primary" style={{ justifyContent: 'center' }}>actualizar grafo</button>
        <button className="btn-ghost btn" style={{ justifyContent: 'center', fontSize: 12 }}>limpiar pantalla</button>
      </div>
    </aside>
  );
}

function RightPanel() {
  return (
    <aside style={{
      width: 320, borderLeft: '1px solid var(--border)', background: 'var(--surface)',
      display: 'flex', flexDirection: 'column', overflow: 'auto'
    }}>
      {/* Hero: paso actual */}
      <div style={{
        padding: 16, borderBottom: '1px solid var(--border)',
        background: 'linear-gradient(180deg, var(--surface) 0%, var(--surface-2) 100%)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span className="label">paso actual</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
            <span style={{ color: 'var(--text)' }}>{v1State.step}</span> / {v1State.totalSteps}
          </span>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.01em' }}>
          inicio · <span style={{ color: 'var(--accent)' }}>{v1State.algorithm.toLowerCase()}</span>
        </div>
        <div style={{
          marginTop: 10, height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden'
        }}>
          <div style={{ width: `${(v1State.step / v1State.totalSteps) * 100}%`, height: '100%', background: 'var(--accent)' }}/>
        </div>
      </div>

      {/* Stat grid */}
      <div style={{ padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, borderBottom: '1px solid var(--border)' }}>
        <StatCard label="procesando" tone="current" value={v1State.current || '—'}/>
        <StatCard label="objetivo" tone="goal" value={v1State.goal}/>
        <StatCard label="cola / frontera" tone="frontier" value={v1State.frontier.length} sub={`[${v1State.frontier.join(', ')}]`}/>
        <StatCard label="visitados" tone="visited" value={v1State.visited.length} sub={`{${v1State.visited.join(',')}}`}/>
      </div>

      {/* Camino */}
      <div style={{ padding: 16, borderBottom: '1px solid var(--border)' }}>
        <SectionLabel>camino actual</SectionLabel>
        <div style={{
          background: 'var(--surface-2)', border: '1px dashed var(--border)', borderRadius: 6,
          padding: 12, fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)', textAlign: 'center'
        }}>
          sin camino final aún
        </div>
      </div>

      {/* Acción */}
      <div style={{ padding: 16, borderBottom: '1px solid var(--border)' }}>
        <SectionLabel>acción actual</SectionLabel>
        <div style={{
          background: 'var(--bg-deep)', border: '1px solid var(--border)', borderRadius: 6,
          padding: '12px 14px', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text)', lineHeight: 1.5
        }}>
          <span style={{ color: 'var(--accent)' }}>›</span> {v1State.message}
        </div>
      </div>

      {/* Tabla de costos */}
      <div style={{ padding: 16, flex: 1 }}>
        <SectionLabel hint="g(n) · h(n) · f(n)">tabla de costos</SectionLabel>
        <div style={{
          background: 'var(--surface-2)', border: '1px dashed var(--border)', borderRadius: 6,
          padding: '14px 12px', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5
        }}>
          Disponible cuando se<br/>implemente A* o Greedy
        </div>
      </div>
    </aside>
  );
}

function StatCard({ label, value, sub, tone }) {
  const TONES = {
    current: 'var(--a-current)',
    goal: 'var(--a-goal)',
    frontier: 'var(--a-frontier)',
    visited: 'var(--a-visited)',
  };
  return (
    <div style={{
      background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px'
    }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>
        <span style={{ color: TONES[tone], marginRight: 4 }}>●</span>{label}
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 600, color: 'var(--text)', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-faint)', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub}</div>}
    </div>
  );
}

function TopBar({ theme, setTheme }) {
  const algos = ['BFS', 'DFS', 'A*', 'Greedy', 'Coloreo'];
  return (
    <header style={{
      height: 52, borderBottom: '1px solid var(--border)', background: 'var(--surface)',
      display: 'flex', alignItems: 'center', padding: '0 16px', gap: 16, flexShrink: 0
    }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--text-muted)' }}>
        <span style={{ color: 'var(--text)', fontWeight: 600 }}>diario48</span>
        <span style={{ margin: '0 8px', color: 'var(--text-faint)' }}>/</span>
        <span>visualizador de grafos</span>
      </div>

      <div style={{ display: 'flex', gap: 2, marginLeft: 8, padding: 3, background: 'var(--surface-2)', borderRadius: 8, border: '1px solid var(--border)' }}>
        {algos.map(a => (
          <button key={a} className="btn btn-tab" data-active={a === 'BFS'} style={{ fontSize: 13, padding: '5px 12px' }}>{a}</button>
        ))}
      </div>

      <div style={{ flex: 1 }}/>

      <button className="btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} style={{ fontSize: 13 }}>
        {theme === 'dark' ? '☾' : '☀'} {theme === 'dark' ? 'dark mode' : 'light mode'}
      </button>
      <button className="btn" style={{ fontSize: 13 }}>cargar ejemplo</button>
    </header>
  );
}

function PlaybackBar() {
  return (
    <div style={{
      height: 64, borderTop: '1px solid var(--border)', background: 'var(--surface)',
      display: 'flex', alignItems: 'center', padding: '0 16px', gap: 10
    }}>
      <button className="btn btn-primary" style={{ fontSize: 14 }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M2 1.5v9l8-4.5z"/></svg>
        ejecutar
      </button>
      <div style={{ width: 1, height: 28, background: 'var(--border)' }}/>
      <button className="btn"><span>←</span> anterior</button>
      <button className="btn">siguiente <span>→</span></button>
      <button className="btn">↻ reiniciar</button>
      <button className="btn-ghost btn">⏵⏵ auto-play</button>

      <div style={{ flex: 1 }}/>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className="kbd">←</span><span className="kbd">→</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>navegar pasos</span>
      </div>

      <div style={{ width: 1, height: 28, background: 'var(--border)' }}/>

      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)' }}>
        paso <span style={{ color: 'var(--text)', fontWeight: 600 }}>{v1State.step}</span> / {v1State.totalSteps}
      </div>
    </div>
  );
}

function GraphCanvas() {
  return (
    <main style={{ flex: 1, position: 'relative', background: 'var(--bg)', overflow: 'hidden' }}>
      {/* Floating legend */}
      <div style={{
        position: 'absolute', top: 14, left: 14, zIndex: 5,
        background: 'color-mix(in oklch, var(--surface) 90%, transparent)',
        backdropFilter: 'blur(8px)', border: '1px solid var(--border)', borderRadius: 8,
        padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 12,
        fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-2)'
      }}>
        <LegendDot color="var(--a-start)" ring>inicio</LegendDot>
        <LegendDot color="var(--a-goal)" ring>objetivo</LegendDot>
        <LegendDot color="var(--a-current)" filled>actual</LegendDot>
        <LegendDot color="var(--a-frontier)">frontera</LegendDot>
        <LegendDot color="var(--a-visited)">visitado</LegendDot>
      </div>

      {/* Zoom controls */}
      <div style={{
        position: 'absolute', bottom: 14, right: 14, zIndex: 5,
        display: 'flex', flexDirection: 'column', gap: 4,
        background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: 4
      }}>
        <button className="btn-ghost btn" style={{ padding: 6, justifyContent: 'center' }}>+</button>
        <div style={{ height: 1, background: 'var(--border)' }}/>
        <button className="btn-ghost btn" style={{ padding: 6, justifyContent: 'center' }}>−</button>
        <div style={{ height: 1, background: 'var(--border)' }}/>
        <button className="btn-ghost btn" style={{ padding: 6, justifyContent: 'center', fontSize: 11 }}>⌖</button>
      </div>

      <GraphView state={v1State}/>
    </main>
  );
}

function LegendDot({ color, ring, filled, children }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <span style={{
        width: 10, height: 10, borderRadius: '50%',
        background: filled ? color : 'transparent',
        border: `1.5px solid ${color}`,
        boxShadow: ring ? `0 0 0 2px color-mix(in oklch, ${color} 25%, transparent)` : 'none'
      }}/>
      {children}
    </span>
  );
}

function VariationOne({ initialTheme = 'dark' }) {
  const [theme, setTheme] = React.useState(initialTheme);
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div data-theme={theme} style={{
      width: '100%', height: '100vh', display: 'flex', flexDirection: 'column',
      background: 'var(--bg)', color: 'var(--text)'
    }}>
      <TopBar theme={theme} setTheme={setTheme}/>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <LeftPanel/>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <GraphCanvas/>
          <PlaybackBar/>
        </div>
        <RightPanel/>
      </div>
    </div>
  );
}

window.VariationOne = VariationOne;
