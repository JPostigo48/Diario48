Propuesta visual
Estética: Utilitarian Technical Dark — fondo casi negro #090a0d, tipografía dual JetBrains Mono (datos/labels) + Sora (UI/textos), acentos eléctricos en azul #4f8ef7, con semáforos verde/amarillo/rojo para los estados del grafo. Sin gradientes, sin decoración vacía. Toda la información ocupa espacio útil.

Estructura de carpetas
diario48/
├── app/
│   ├── layout.tsx              ← fuentes + globals
│   ├── page.tsx                ← Landing page
│   └── tools/
│       └── graph/
│           └── page.tsx        ← Vista herramienta grafos
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── ToolHeader.tsx
│   ├── landing/
│   │   ├── Hero.tsx
│   │   ├── FeatureCards.tsx
│   │   └── GraphPreview.tsx
│   └── graph-tool/
│       ├── GraphCanvas.tsx     ← Cytoscape.js aquí
│       ├── LeftPanel.tsx
│       ├── RightPanel.tsx
│       └── SimulationControls.tsx
├── lib/
│   ├── mock-graph.ts           ← datos mock
│   ├── bfs.ts                  ← algoritmo BFS
│   └── types.ts                ← tipos compartidos
└── styles/
    └── globals.css

Código completo
lib/types.ts
typescriptexport type NodeState = 
  | 'unvisited' 
  | 'current' 
  | 'visited' 
  | 'frontier' 
  | 'path' 
  | 'start' 
  | 'goal';

export type AlgorithmType = 'BFS' | 'DFS' | 'A*' | 'Greedy' | 'Coloring';

export interface GraphNode {
  id: string;
  label?: string;
  x?: number;
  y?: number;
  heuristic?: number; // h(n) para A*
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  weight?: number;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface AlgorithmStep {
  stepIndex: number;
  label: string;
  currentNode: string | null;
  visited: string[];
  frontier: string[];
  description: string;
  nodeStates: Record<string, NodeState>;
  path?: string[];
  // Para A* — placeholder para cuando conectes backend
  costs?: Record<string, { g: number; h: number; f: number }>;
}
lib/mock-graph.ts
typescriptimport { GraphData } from './types';

// MOCK — grafo de ejemplo para demostración
export const EXAMPLE_GRAPH: GraphData = {
  nodes: [
    { id: 'A', label: 'A', x: 150, y: 100, heuristic: 7 },
    { id: 'B', label: 'B', x: 320, y: 80,  heuristic: 5 },
    { id: 'C', label: 'C', x: 490, y: 100, heuristic: 4 },
    { id: 'D', label: 'D', x: 150, y: 250, heuristic: 6 },
    { id: 'E', label: 'E', x: 320, y: 240, heuristic: 3 },
    { id: 'F', label: 'F', x: 490, y: 250, heuristic: 2 },
    { id: 'G', label: 'G', x: 230, y: 370, heuristic: 4 },
    { id: 'H', label: 'H', x: 560, y: 370, heuristic: 0 }, // objetivo
  ],
  edges: [
    { id: 'AB', source: 'A', target: 'B', weight: 4 },
    { id: 'AD', source: 'A', target: 'D', weight: 2 },
    { id: 'BC', source: 'B', target: 'C', weight: 3 },
    { id: 'BE', source: 'B', target: 'E', weight: 5 },
    { id: 'CF', source: 'C', target: 'F', weight: 1 },
    { id: 'DE', source: 'D', target: 'E', weight: 3 },
    { id: 'DG', source: 'D', target: 'G', weight: 6 },
    { id: 'EF', source: 'E', target: 'F', weight: 2 },
    { id: 'EG', source: 'E', target: 'G', weight: 4 },
    { id: 'FH', source: 'F', target: 'H', weight: 3 },
    { id: 'GH', source: 'G', target: 'H', weight: 5 },
  ],
};
lib/bfs.ts
typescriptimport { GraphData, AlgorithmStep, NodeState } from './types';

export function runBFS(
  graph: GraphData,
  startId: string,
  goalId: string
): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const visited = new Set<string>();
  const queue: string[] = [startId];
  const parent: Record<string, string | null> = { [startId]: null };
  const nodeStates: Record<string, NodeState> = {};

  // Estado inicial — todos sin visitar
  graph.nodes.forEach(n => { nodeStates[n.id] = 'unvisited'; });
  nodeStates[startId] = 'frontier';
  nodeStates[goalId] = 'goal'; // marcar objetivo visualmente

  steps.push({
    stepIndex: 0,
    label: 'Inicio · BFS',
    currentNode: null,
    visited: [],
    frontier: [startId],
    description: `Inicializando BFS desde nodo "${startId}". Objetivo: "${goalId}". Cola inicial: [${startId}]`,
    nodeStates: { ...nodeStates },
  });

  const getNeighbors = (nodeId: string): string[] =>
    graph.edges
      .filter(e => e.source === nodeId || e.target === nodeId)
      .map(e => e.source === nodeId ? e.target : e.source)
      .filter(n => !visited.has(n));

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;

    visited.add(current);
    nodeStates[current] = current === goalId ? 'goal' : 'current';

    steps.push({
      stepIndex: steps.length,
      label: `Procesando · ${current}`,
      currentNode: current,
      visited: [...visited],
      frontier: [...queue],
      description: `Desencolando "${current}". Marcando como visitado. Explorando vecinos no visitados.`,
      nodeStates: { ...nodeStates },
    });

    if (current === goalId) {
      // Reconstruir camino
      const path: string[] = [];
      let cur: string | null = goalId;
      while (cur !== null) { path.unshift(cur); cur = parent[cur]; }

      const pathStates = { ...nodeStates };
      path.forEach(n => { pathStates[n] = 'path'; });

      steps.push({
        stepIndex: steps.length,
        label: `¡Objetivo encontrado! · ${goalId}`,
        currentNode: goalId,
        visited: [...visited],
        frontier: [],
        description: `Camino óptimo BFS: ${path.join(' → ')}. Longitud: ${path.length - 1} aristas.`,
        nodeStates: pathStates,
        path,
      });
      break;
    }

    const neighbors = getNeighbors(current);
    neighbors.forEach(nb => {
      if (!queue.includes(nb)) {
        queue.push(nb);
        parent[nb] = current;
        nodeStates[nb] = 'frontier';
      }
    });

    if (neighbors.length > 0) {
      steps.push({
        stepIndex: steps.length,
        label: `Expandiendo vecinos de ${current}`,
        currentNode: current,
        visited: [...visited],
        frontier: [...queue],
        description: `Vecinos sin visitar: [${neighbors.join(', ')}]. Añadidos a la cola. Cola actual: [${queue.join(', ')}]`,
        nodeStates: { ...nodeStates },
      });
    } else {
      nodeStates[current] = 'visited';
    }
  }

  return steps;
}
app/layout.tsx
typescriptimport type { Metadata } from 'next';
import { JetBrains_Mono, Sora } from 'next/font/google';
import './globals.css';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '700'],
});

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  weight: ['300', '400', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Diario48',
  description: 'Plataforma personal de herramientas, proyectos y experimentos de computación',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${jetbrainsMono.variable} ${sora.variable}`}>
      <body className="bg-[#090a0d] text-[#dde1ea] font-sora antialiased overflow-hidden">
        {children}
      </body>
    </html>
  );
}
app/globals.css
css@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --c-bg: #090a0d;
  --c-surface: #0a0b0e;
  --c-surface2: #111318;
  --c-border: #1a1d28;
  --c-border2: #2a3040;
  --c-accent: #4f8ef7;
  --c-text: #dde1ea;
  --c-muted: #6b7280;
  --c-dim: #2a3040;
  /* estados grafo */
  --c-visited: #22c55e;
  --c-frontier: #f59e0b;
  --c-current: #ef4444;
  --c-path: #8b5cf6;
  --c-goal: #a78bfa;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; overflow: hidden; }

.font-mono { font-family: var(--font-mono), monospace; }
.font-sora { font-family: var(--font-sora), sans-serif; }

/* Scrollbars compactos para paneles internos */
::-webkit-scrollbar { width: 3px; height: 3px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--c-border2); border-radius: 2px; }
app/page.tsx (Landing)
tsximport Navbar from '@/components/layout/Navbar';
import Hero from '@/components/landing/Hero';
import FeatureCards from '@/components/landing/FeatureCards';
import GraphPreview from '@/components/landing/GraphPreview';

export default function LandingPage() {
  return (
    <main className="h-screen w-screen overflow-hidden flex flex-col bg-[#090a0d]">
      <Navbar />
      {/* Grid principal: izquierda contenido, derecha preview */}
      <div className="flex-1 grid grid-cols-[1fr_380px] overflow-hidden">
        {/* Columna izquierda */}
        <div className="flex flex-col justify-between p-10 border-r border-[#1a1d28]">
          <Hero />
          <FeatureCards />
        </div>
        {/* Columna derecha — preview del grafo */}
        <GraphPreview />
      </div>
      {/* Footer */}
      <footer className="h-9 border-t border-[#1a1d28] flex items-center justify-between px-7">
        <span className="font-mono text-[10px] text-[#2a3040] tracking-wide">
          diario48 · plataforma personal · 2025
        </span>
        <div className="flex items-center gap-2">
          <span className="w-[5px] h-[5px] rounded-full bg-green-500 animate-pulse" />
          <span className="font-mono text-[10px] text-green-500">sistema activo</span>
        </div>
      </footer>
    </main>
  );
}
components/layout/Navbar.tsx
tsximport Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="h-11 border-b border-[#1a1d28] flex items-center justify-between px-7 bg-[#0a0b0e]">
      <div className="font-mono text-[15px] font-bold tracking-tight">
        Diario<span className="text-[#4f8ef7]">48</span>
      </div>
      <div className="flex gap-6">
        {['herramientas', 'proyectos', 'laboratorio', 'sobre mí'].map(link => (
          <Link
            key={link}
            href={link === 'herramientas' ? '/tools/graph' : '#'}
            className="font-mono text-[11px] text-[#6b7280] hover:text-[#dde1ea] 
                       transition-colors tracking-wide"
          >
            {link}
          </Link>
        ))}
      </div>
      <span className="font-mono text-[10px] px-2.5 py-1 rounded-full border 
                       border-[#4f8ef744] text-[#4f8ef7] bg-[#4f8ef710] tracking-wide">
        v0.1 — alpha
      </span>
    </nav>
  );
}
components/landing/Hero.tsx
tsximport Link from 'next/link';

export default function Hero() {
  return (
    <div>
      <p className="font-mono text-[10px] tracking-[2px] text-[#4f8ef7] uppercase mb-3">
        — plataforma personal
      </p>
      <h1 className="text-[56px] font-bold leading-none tracking-[-3px] text-[#f1f3f9] mb-4">
        Diario<span className="text-[#4f8ef7]">48</span>
      </h1>
      <p className="text-[13px] text-[#6b7280] leading-relaxed max-w-[440px] mb-8 font-light">
        Plataforma personal de herramientas, proyectos y experimentos de computación.
        Algoritmos visualizados, estructuras exploradas, ideas documentadas.
      </p>
      <div className="flex gap-3">
        <Link
          href="/tools/graph"
          className="font-mono text-[11px] font-bold px-5 py-2.5 rounded-md 
                     bg-[#4f8ef7] text-[#0a0b0e] hover:opacity-85 transition-opacity"
        >
          explorar herramientas ↗
        </Link>
        <button
          className="font-mono text-[11px] px-5 py-2.5 rounded-md border 
                     border-[#2a3040] text-[#9ca3af] hover:border-[#4f8ef755] 
                     hover:text-[#dde1ea] transition-all bg-transparent"
        >
          ver proyectos
        </button>
      </div>
    </div>
  );
}
components/landing/FeatureCards.tsx
tsxconst features = [
  {
    dot: 'bg-[#4f8ef7] shadow-[0_0_6px_#4f8ef766]',
    title: 'Visualizador de grafos',
    desc: 'BFS · DFS · A* · Greedy',
    tag: 'activo',
    href: '/tools/graph',
  },
  {
    dot: 'bg-green-500 shadow-[0_0_6px_#22c55e66]',
    title: 'Proyectos universitarios',
    desc: 'CC · IS · BD · SO',
    tag: 'pronto',
    href: '#',
  },
  {
    dot: 'bg-amber-400 shadow-[0_0_6px_#f59e0b66]',
    title: 'Laboratorio personal',
    desc: 'experimentos · ideas',
    tag: 'pronto',
    href: '#',
  },
];

export default function FeatureCards() {
  return (
    <div>
      <p className="font-mono text-[9px] tracking-[1.5px] text-[#2a3040] uppercase mb-2.5">
        // módulos disponibles
      </p>
      <div className="grid grid-cols-3 gap-2.5">
        {features.map(f => (
          
            key={f.title}
            href={f.href}
            className="relative bg-[#111318] border border-[#1a1d28] rounded-lg p-3.5
                       hover:border-[#4f8ef744] hover:bg-[#13151e] transition-all cursor-pointer
                       no-underline"
          >
            <div className={`w-1.5 h-1.5 rounded-full mb-2.5 ${f.dot}`} />
            <p className="text-[12px] font-semibold text-[#dde1ea] mb-1">{f.title}</p>
            <p className="font-mono text-[11px] text-[#4b5563]">{f.desc}</p>
            <span className="absolute top-2.5 right-2.5 font-mono text-[9px] text-[#374151]">
              {f.tag}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
app/tools/graph/page.tsx
tsx'use client';

import { useState, useCallback } from 'react';
import ToolHeader from '@/components/layout/ToolHeader';
import LeftPanel from '@/components/graph-tool/LeftPanel';
import GraphCanvas from '@/components/graph-tool/GraphCanvas';
import RightPanel from '@/components/graph-tool/RightPanel';
import SimulationControls from '@/components/graph-tool/SimulationControls';
import { runBFS } from '@/lib/bfs';
import { EXAMPLE_GRAPH } from '@/lib/mock-graph';
import type { GraphData, AlgorithmStep, AlgorithmType } from '@/lib/types';

export default function GraphToolPage() {
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('BFS');
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [startNode, setStartNode] = useState('A');
  const [goalNode, setGoalNode]   = useState('H');

  const loadExample = useCallback(() => {
    setGraphData(EXAMPLE_GRAPH);
    const bfsSteps = runBFS(EXAMPLE_GRAPH, startNode, goalNode);
    setSteps(bfsSteps);
    setCurrentStep(0);
  }, [startNode, goalNode]);

  const clearGraph = useCallback(() => {
    setGraphData(null);
    setSteps([]);
    setCurrentStep(-1);
  }, []);

  const goNext = () => setCurrentStep(s => Math.min(s + 1, steps.length - 1));
  const goPrev = () => setCurrentStep(s => Math.max(s - 1, 0));
  const reset  = () => setCurrentStep(0);

  const activeStep = steps[currentStep] ?? null;

  return (
    <main className="h-screen w-screen overflow-hidden flex flex-col bg-[#090a0d]">
      <ToolHeader
        algorithm={algorithm}
        onAlgorithmChange={setAlgorithm}
        onLoadExample={loadExample}
        onClear={clearGraph}
      />
      <div className="flex-1 grid grid-cols-[200px_1fr_210px] overflow-hidden">
        <LeftPanel
          graphData={graphData}
          startNode={startNode}
          goalNode={goalNode}
          onStartChange={setStartNode}
          onGoalChange={setGoalNode}
          onLoadExample={loadExample}
          onClear={clearGraph}
          onAddNode={(node) => {
            /* TODO: conectar con estado del grafo */
          }}
          onAddEdge={(edge) => {
            /* TODO: conectar con estado del grafo */
          }}
        />
        <div className="flex flex-col overflow-hidden border-x border-[#1a1d28]">
          <GraphCanvas
            graphData={graphData}
            nodeStates={activeStep?.nodeStates ?? {}}
          />
          <SimulationControls
            currentStep={currentStep}
            totalSteps={steps.length}
            onNext={goNext}
            onPrev={goPrev}
            onReset={reset}
            onExecute={() => {
              if (!graphData) loadExample();
              else goNext();
            }}
          />
        </div>
        <RightPanel step={activeStep} />
      </div>
    </main>
  );
}
components/graph-tool/GraphCanvas.tsx
tsx'use client';

import { useEffect, useRef } from 'react';
import type { GraphData, NodeState } from '@/lib/types';

// COLORES por estado del nodo — fácil de extender
const NODE_COLORS: Record<NodeState, { fill: string; stroke: string; text: string }> = {
  unvisited: { fill: '#1e2333', stroke: '#2a3040',  text: '#4b5563' },
  current:   { fill: '#ef444420', stroke: '#ef4444', text: '#ef4444' },
  visited:   { fill: '#22c55e20', stroke: '#22c55e', text: '#22c55e' },
  frontier:  { fill: '#f59e0b20', stroke: '#f59e0b', text: '#f59e0b' },
  path:      { fill: '#8b5cf620', stroke: '#8b5cf6', text: '#8b5cf6' },
  start:     { fill: '#4f8ef720', stroke: '#4f8ef7', text: '#4f8ef7' },
  goal:      { fill: '#7c3aed20', stroke: '#a78bfa', text: '#a78bfa' },
};

interface Props {
  graphData: GraphData | null;
  nodeStates: Record<string, NodeState>;
}

export default function GraphCanvas({ graphData, nodeStates }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // TODO: Integrar Cytoscape.js aquí
    // Instalar: npm install cytoscape @types/cytoscape
    //
    // import cytoscape from 'cytoscape';
    // const cy = cytoscape({
    //   container: containerRef.current,
    //   elements: [
    //     ...graphData.nodes.map(n => ({ data: { id: n.id, label: n.label ?? n.id } })),
    //     ...graphData.edges.map(e => ({ data: { id: e.id, source: e.source, target: e.target } })),
    //   ],
    //   style: buildCytoscapeStyle(nodeStates),
    //   layout: { name: 'preset', positions: ... }
    // });
    // return () => cy.destroy();

  }, [graphData, nodeStates]);

  if (!graphData) {
    return (
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center relative overflow-hidden"
        style={{
          backgroundImage: 'linear-gradient(#1a1d2818 1px, transparent 1px), linear-gradient(90deg, #1a1d2818 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      >
        <div className="text-center">
          <p className="font-mono text-[11px] text-[#2a3040]">
            cytoscape.js — canvas listo para integrar
          </p>
          <p className="font-mono text-[10px] text-[#1a1d28] mt-1">
            carga un grafo de ejemplo para empezar
          </p>
        </div>
      </div>
    );
  }

  // Renderizado SVG mientras se integra Cytoscape.js
  return (
    <div
      ref={containerRef}
      className="flex-1 relative overflow-hidden"
      style={{
        backgroundImage: 'linear-gradient(#1a1d2818 1px, transparent 1px), linear-gradient(90deg, #1a1d2818 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }}
    >
      <svg
        viewBox="0 0 600 400"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Aristas */}
        {graphData.edges.map(edge => {
          const src = graphData.nodes.find(n => n.id === edge.source);
          const dst = graphData.nodes.find(n => n.id === edge.target);
          if (!src || !dst) return null;
          return (
            <line
              key={edge.id}
              x1={src.x} y1={src.y}
              x2={dst.x} y2={dst.y}
              stroke="#1e2333" strokeWidth="1.5"
            />
          );
        })}

        {/* Nodos */}
        {graphData.nodes.map(node => {
          const state = nodeStates[node.id] ?? 'unvisited';
          const col = NODE_COLORS[state];
          return (
            <g key={node.id}>
              <circle
                cx={node.x} cy={node.y} r={18}
                fill={col.fill} stroke={col.stroke} strokeWidth={1.8}
              />
              <text
                x={node.x} y={(node.y ?? 0) + 5}
                textAnchor="middle"
                fontFamily="JetBrains Mono"
                fontSize={12} fontWeight={700}
                fill={col.text}
              >
                {node.id}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
components/graph-tool/RightPanel.tsx
tsximport type { AlgorithmStep } from '@/lib/types';

interface Props { step: AlgorithmStep | null; }

export default function RightPanel({ step }: Props) {
  return (
    <div className="flex flex-col gap-2.5 p-3.5 bg-[#0a0b0e] overflow-y-auto">

      <InfoCard label="// paso actual">
        <span className="font-mono text-[13px] text-[#4f8ef7]">
          {step?.label ?? '—'}
        </span>
      </InfoCard>

      <InfoCard label="// nodo procesando">
        <span className="font-mono text-[16px] font-bold text-[#ef4444]">
          {step?.currentNode ?? '—'}
        </span>
      </InfoCard>

      <InfoCard label="// visitados">
        <div className="flex flex-wrap gap-1 mt-1">
          {step?.visited.map(n => (
            <NodePill key={n} label={n} variant="visited" />
          ))}
        </div>
      </InfoCard>

      <InfoCard label="// cola / frontera">
        <div className="flex flex-wrap gap-1 mt-1">
          {step?.frontier.map(n => (
            <NodePill key={n} label={n} variant="frontier" />
          ))}
        </div>
      </InfoCard>

      <InfoCard label="// acción actual" className="flex-1">
        <p className="font-mono text-[11px] text-[#6b7280] leading-relaxed mt-1">
          {step?.description ?? 'Carga un ejemplo y presiona ejecutar para iniciar la simulación BFS paso a paso.'}
        </p>
      </InfoCard>

      {/* Tabla de costos — activa en modo A* */}
      <InfoCard label="// tabla de costos (A*)">
        <table className="w-full text-center border-collapse mt-1">
          <thead>
            <tr>
              {['nodo','g(n)','h(n)','f(n)'].map(h => (
                <th key={h} className="font-mono text-[9px] text-[#2a3040] py-1 
                                       border-b border-[#1a1d28]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={4} className="font-mono text-[9px] text-[#1a1d28] py-2">
                — disponible en modo A* —
              </td>
            </tr>
          </tbody>
        </table>
      </InfoCard>

    </div>
  );
}

// Sub-componentes locales
function InfoCard({ label, children, className = '' }: {
  label: string; children: React.ReactNode; className?: string;
}) {
  return (
    <div className={`bg-[#111318] border border-[#1a1d28] rounded-md p-2.5 ${className}`}>
      <p className="font-mono text-[8px] tracking-[1.5px] text-[#2a3040] uppercase mb-1">
        {label}
      </p>
      {children}
    </div>
  );
}

function NodePill({ label, variant }: { label: string; variant: 'visited' | 'frontier' }) {
  const styles = {
    visited:  'bg-green-500/10 border-green-500/30 text-green-500',
    frontier: 'bg-amber-400/10 border-amber-400/30 text-amber-400',
  };
  return (
    <span className={`font-mono text-[10px] px-2 py-0.5 rounded border ${styles[variant]}`}>
      {label}
    </span>
  );
}
components/graph-tool/SimulationControls.tsx
tsxinterface Props {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  onExecute: () => void;
}

export default function SimulationControls({
  currentStep, totalSteps, onNext, onPrev, onReset, onExecute
}: Props) {
  return (
    <div className="h-12 border-t border-[#1a1d28] bg-[#0a0b0e] flex items-center gap-2 px-4">
      <CtrlBtn onClick={onExecute} accent>▶ ejecutar</CtrlBtn>
      <Sep />
      <CtrlBtn onClick={onPrev}>← anterior</CtrlBtn>
      <CtrlBtn onClick={onNext}>siguiente →</CtrlBtn>
      <Sep />
      <CtrlBtn onClick={onReset}>↺ reiniciar</CtrlBtn>
      <CtrlBtn onClick={() => {}}>⟳ auto-play</CtrlBtn>
      <span className="font-mono text-[10px] text-[#2a3040] ml-auto">
        paso <span className="text-[#4f8ef7]">{Math.max(currentStep + 1, 0)}</span> / {totalSteps}
      </span>
    </div>
  );
}

function CtrlBtn({ children, onClick, accent }: {
  children: React.ReactNode; onClick: () => void; accent?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`font-mono text-[10px] px-3.5 py-1.5 rounded border transition-all
        ${accent
          ? 'bg-[#4f8ef720] border-[#4f8ef755] text-[#4f8ef7] font-bold hover:bg-[#4f8ef730]'
          : 'bg-transparent border-[#1a1d28] text-[#6b7280] hover:border-[#2a3040] hover:text-[#9ca3af]'
        }`}
    >
      {children}
    </button>
  );
}

function Sep() {
  return <div className="w-px h-4 bg-[#1a1d28] mx-1" />;
}