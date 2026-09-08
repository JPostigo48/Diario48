'use client';

import { useRouter } from 'next/navigation';

const features = [
  'Visualización interactiva de grafos',
  'Ejecución paso a paso de algoritmos',
  'Editor de nodos y aristas en tiempo real',
  'Guardado y carga de grafos (MongoDB)',
  'Modo claro / oscuro integrado',
];

const gameFeatures = [
  'Tablero 3x3 conectado a backend',
  'Selector entre Minimax y Alpha-Beta',
  'Engine aislado para que programes la lógica',
  'Respuesta de la IA usando tu archivo TypeScript',
];

const papersReviewFeatures = [
  'Embudo temático por capas editables',
  'Vista comparativa y cards filtrables',
  'Relaciones manuales entre papers',
  'Persistencia real e importación/exportación JSON',
];

const algorithms = [
  { name: 'BFS', label: 'Breadth-First Search', status: 'live' },
  { name: 'DFS', label: 'Depth-First Search', status: 'live' },
  { name: 'UCS', label: 'Uniform Cost Search', status: 'live' },
  { name: 'A*', label: 'A* Search', status: 'soon' },
  { name: 'Greedy', label: 'Greedy Best-First', status: 'soon' },
];

const stack = ['Next.js + TypeScript', 'Cytoscape.js', 'React 19', 'MongoDB', 'Tailwind CSS'];

function AccessBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex rounded border border-(--br) bg-(--bg3) px-2 py-0.5 font-mono text-[10px] text-(--tx3)">
      {label}
    </span>
  );
}

export default function ToolsRedirectPanel() {
  const router = useRouter();

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-7 py-5 border-b border-(--br) bg-(--bg2)">
        <p className="font-mono text-[10px] tracking-[2px] text-(--acc) uppercase mb-1">
          {"// herramientas"}
        </p>
        <h2 className="text-[26px] font-bold text-(--tx) tracking-tight">Herramientas</h2>
        <p className="text-[14px] text-(--tx3) leading-relaxed mt-1 max-w-[560px]">
          Un conjunto de herramientas visuales y experimentales construidas dentro de Diario48,
          pensadas para estudiar, organizar y probar ideas con una interfaz clara.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-7 py-5">
        <div className="grid grid-cols-2 gap-4">

          {/* Card principal */}
          <div className="bg-(--acc2) border border-(--acc3) rounded-[10px] p-[18px] flex flex-col gap-5">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <h3 className="text-[16px] font-semibold text-(--acc)">Visualizador de algoritmos</h3>
                <AccessBadge label="requiere sesión" />
              </div>
              <p className="text-[13px] text-(--tx2) leading-relaxed">
                Construye grafos desde cero o carga ejemplos predefinidos. Ejecuta algoritmos de
                búsqueda y observa cada decisión del algoritmo en tiempo real con controles de
                reproducción paso a paso.
              </p>
            </div>
            <button
              onClick={() => router.push('/tools/graphs')}
              className="font-mono text-[12px] font-bold px-5 py-2.5 rounded-md
                         bg-(--acc) text-white border-none cursor-pointer
                         hover:opacity-85 transition-opacity self-start"
            >
              abrir graph visualizer →
            </button>
          </div>

          <div className="bg-(--bg2) border border-(--br) rounded-[10px] p-[18px] flex flex-col gap-5">
            <div className="flex-1">
              <h3 className="text-[16px] font-semibold text-(--tx) mb-1">Tic-Tac-Toe AI</h3>
              <p className="text-[13px] text-(--tx2) leading-relaxed">
                Playground simple para probar Minimax y Alpha-Beta desde la web, enviando la
                matriz 3x3 al backend y delegando la jugada de la IA a tu lógica.
              </p>
            </div>
            <button
              onClick={() => router.push('/tools/tic-tac-toe')}
              className="font-mono text-[12px] font-bold px-5 py-2.5 rounded-md
                         bg-(--bg3) text-(--tx) border border-(--br) cursor-pointer
                         hover:opacity-85 transition-opacity self-start"
            >
              abrir tic-tac-toe →
            </button>
          </div>

          <div className="col-span-2 bg-(--bg2) border border-(--br) rounded-[10px] p-[18px] flex items-start justify-between gap-6">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <h3 className="text-[16px] font-semibold text-(--tx)">Papers Review</h3>
                <AccessBadge label="requiere sesión" />
              </div>
              <p className="text-[13px] text-(--tx2) leading-relaxed max-w-[560px]">
                Dashboard bibliográfico para estructurar estados del arte por capas, comparar papers,
                abrir PDFs, tomar notas y mapear relaciones entre trabajos.
              </p>
            </div>
            <button
              onClick={() => router.push('/tools/papers-review')}
              className="flex-shrink-0 font-mono text-[12px] font-bold px-5 py-2.5 rounded-md
                         bg-(--bg3) text-(--tx) border border-(--br) cursor-pointer
                         hover:opacity-85 transition-opacity self-center"
            >
              abrir papers review →
            </button>
          </div>

          {/* Algoritmos */}
          <div className="bg-(--bg2) border border-(--br) rounded-[10px] p-[18px]">
            <h4 className="text-[15px] font-semibold text-(--tx) mb-3">Algoritmos</h4>
            <ul className="flex flex-col gap-2">
              {algorithms.map((a) => (
                <li key={a.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        a.status === 'live' ? 'bg-(--green)' : 'bg-(--br2)'
                      }`}
                    />
                    <span className="font-mono text-[11px] text-(--acc)">{a.name}</span>
                    <span className="text-[12px] text-(--tx3)">{a.label}</span>
                  </div>
                  {a.status === 'soon' && (
                    <span className="font-mono text-[9px] px-1.5 py-px rounded border border-(--br2) text-(--tx4)">
                      pronto
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Funcionalidades + Stack */}
          <div className="flex flex-col gap-4">
            <div className="bg-(--bg2) border border-(--br) rounded-[10px] p-[18px]">
              <h4 className="text-[15px] font-semibold text-(--tx) mb-3">Funcionalidades</h4>
              <ul className="flex flex-col gap-2">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-[12px] text-(--tx2)">
                    <span className="w-1.5 h-1.5 rounded-full bg-(--acc) flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-(--bg2) border border-(--br) rounded-[10px] p-[14px]">
              <h4 className="text-[13px] font-semibold text-(--tx) mb-2">Stack</h4>
              <div className="flex flex-wrap gap-1.5">
                {stack.map((s) => (
                  <span
                    key={s}
                    className="font-mono text-[10px] px-2 py-0.5 rounded
                               bg-(--bg3) text-(--tx3) border border-(--br)"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-(--bg2) border border-(--br) rounded-[10px] p-[18px]">
              <h4 className="text-[15px] font-semibold text-(--tx) mb-3">Tic-Tac-Toe AI</h4>
              <ul className="flex flex-col gap-2">
                {gameFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-[12px] text-(--tx2)">
                    <span className="w-1.5 h-1.5 rounded-full bg-(--purple) flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-(--bg2) border border-(--br) rounded-[10px] p-[18px]">
              <h4 className="text-[15px] font-semibold text-(--tx) mb-3">Papers Review</h4>
              <ul className="flex flex-col gap-2">
                {papersReviewFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-[12px] text-(--tx2)">
                    <span className="w-1.5 h-1.5 rounded-full bg-(--amber) flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
