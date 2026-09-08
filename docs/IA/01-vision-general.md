# Visión general del proyecto

## Qué es Diario48

`Diario48` es una plataforma personal construida con Next.js que combina:

- una **landing personal** con secciones de proyectos, universidad, perfil y acerca de;
- una herramienta de **visualización de algoritmos de grafos**;
- una herramienta de **revisión de papers** orientada a workspaces de investigación;
- una interfaz de **Tic-Tac-Toe con IA** para probar variantes de minimax y alpha-beta.

En términos de arquitectura, NO es un sitio estático simple: es una aplicación web con UI interactiva en cliente y APIs internas para persistencia y ejecución de lógica.

## Módulos funcionales

### 1. Landing principal

Ruta principal: `/`

Responsabilidad:

- presentar la identidad de Diario48;
- navegar entre paneles internos;
- enlazar a herramientas y proyectos.

Paneles detectados:

- `home`
- `projects`
- `university`
- `personal`
- `about`
- `tools`

## 2. Tool: Graph Visualizer

Ruta: `/tools/graphs`

Responsabilidad:

- crear grafos manualmente;
- ejecutar algoritmos paso a paso;
- visualizar estados intermedios;
- guardar y recuperar grafos desde MongoDB.

Algoritmos visibles en código:

- BFS
- DFS
- Costo uniforme
- Greedy Best-First
- A*
- Greedy Coloring
- Ant Colony

## 3. Tool: Papers Review

Ruta: `/tools/papers-review`

Responsabilidad:

- administrar workspaces de revisión bibliográfica;
- organizar papers por capas temáticas;
- filtrar, comparar y visualizar papers;
- exportar/importar estructura en JSON;
- registrar PDF, métricas, estructura del paper, notas y prioridad.

## 4. Tool: Tic-Tac-Toe AI

Ruta: `/tools/tic-tac-toe`

Responsabilidad:

- permitir que el usuario juegue contra la IA;
- delegar la jugada de la IA al backend;
- comparar variantes de algoritmos de búsqueda.

Variantes detectadas:

- `minimax`
- `minimax-professor`
- `alpha-beta`
- `alpha-beta-professor`

## Naturaleza del proyecto

El proyecto mezcla tres intenciones:

- **portafolio personal**;
- **laboratorio educativo**;
- **herramientas de apoyo académico**.

Eso explica por qué conviven contenido personal, visualización algorítmica y gestión de papers dentro del mismo repo.

## Estado visible del producto

Según los datos del propio código:

- hay módulos ya funcionales y navegables;
- no hay autenticación ni roles visibles en esta revisión;
- la persistencia se hace directamente contra MongoDB mediante APIs del App Router;
- el enfoque está más en **interacción, experimentación y organización personal** que en un SaaS multiusuario tradicional.

## Hallazgos rápidos de mantenimiento

- La ruta real `/` está implementada en `src/app/page.tsx`.
- También existe `src/components/landing/LandingPage.tsx`, pero en esta revisión rápida NO encontré referencias activas a ese componente.
- Existe la carpeta `src/app/tools/atlas-bib`, pero en esta revisión no se detectó una página implementada dentro de esa ruta.
