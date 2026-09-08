# Graph Visualizer

## Archivo principal

`src/components/graph/GraphToolPage.tsx`

## Qué resuelve

Este mini proyecto permite:

- crear nodos y aristas;
- definir origen y destino;
- ejecutar algoritmos;
- inspeccionar cada paso;
- guardar y recuperar grafos.

## Estado principal

Entre los estados más importantes están:

- algoritmo seleccionado;
- modo de tema;
- grafo actual;
- nombre y descripción;
- nodo de inicio y nodo objetivo;
- índice del paso actual;
- autoplay;
- lista de grafos guardados;
- elemento seleccionado.

## Flujo funcional principal

1. El usuario crea un grafo o carga uno existente.
2. La página construye un `GraphData`.
3. `runAlgorithm(...)` genera una lista de pasos.
4. La UI reparte responsabilidades en tres zonas:
   - editor lateral,
   - canvas central,
   - panel lateral del algoritmo.
5. El usuario navega paso a paso o reproduce automáticamente.

## Persistencia

APIs verificadas:

- `GET /api/graphs`
- `POST /api/graphs`
- `GET /api/graphs/[id]`
- `PUT /api/graphs/[id]`
- `DELETE /api/graphs/[id]`

## Lógica importante

La lógica fuerte NO está toda en la página. Está separada en:

- `src/lib/graph/algorithmSteps.ts`
- `src/lib/graph/bfs.ts`
- `src/lib/graph/dfs.ts`
- `src/lib/graph/astar.ts`
- `src/lib/graph/uniformCost.ts`
- `src/lib/graph/greedyBestFirst.ts`
- `src/lib/graph/greedyColoring.ts`
- `src/lib/graph/antColony.ts`
- `src/lib/graph/utils.ts`

## Render visual

El canvas usa Cytoscape mediante:

- `src/components/graph/GraphCanvas.tsx`

Ese componente:

- transforma nodos y aristas a elementos Cytoscape;
- sincroniza posiciones;
- resalta estados del algoritmo;
- pinta badges heurísticos;
- expone selección de nodos y aristas.

## Idea arquitectónica

Este módulo está bien encaminado porque separa:

- UI de edición;
- UI de visualización;
- ejecución de algoritmos;
- persistencia.

Eso es MUCHO mejor que mezclar todo en un solo bloque procedural.
