# Papers Review — operaciones y capacidades

## Qué se puede hacer hoy

### Gestión de workspaces

Se puede:

- listar workspaces;
- crear workspace;
- cargar workspace;
- renombrar workspace;
- eliminar workspace.

La lógica cliente de esta parte ya quedó separada en:

- `src/features/papers-review/workspace-management/api.ts`

Regla visible:

- el sistema intenta conservar al menos un workspace.

## Gestión de papers

Se puede:

- crear paper;
- editar paper;
- eliminar paper;
- seleccionar paper para inspección;
- registrar PDF y enlaces;
- registrar notas, métricas, datasets, métodos y estructura.
- evaluar papers con matriz de selección.
- promover un paper a síntesis con justificación.
- asignar una clasificación analítica inicial.

La lógica base de mutación sobre el agregado de workspace quedó separada en:

- `src/features/papers-review/paper-management/workspacePaperMutations.ts`

## Regla de DOI

Ahora se valida que NO existan dos papers con el mismo DOI dentro del mismo workspace.

Además, a nivel de persistencia:

- el DOI se usa para reutilizar un paper canónico global cuando ya existe.

Eso significa:

- mismo DOI entre proyectos → mismo paper canónico;
- DOI vacío → no hay deduplicación garantizada.

## Organización temática

Se puede:

- asignar papers a capas;
- filtrar por capa;
- clasificar por categoría y subcategoría;
- priorizar por estado y relevancia.

## Filtros disponibles

Se puede filtrar por:

- texto;
- año;
- capa;
- categoría;
- prioridad;
- fase metodológica;
- estado de lectura;
- presencia de PDF.

## Workflow académico mínimo ya disponible

Hoy la herramienta YA permite:

- registrar un paper;
- moverlo por fases metodológicas;
- evaluarlo con criterios homogéneos;
- dejar decisión final;
- promoverlo a síntesis con reglas explícitas.

Eso significa que ya no es solo un CRUD enriquecido.

## Preparación para Sprint 03

Ya quedó preparado el terreno para introducir:

- ficha de síntesis separada;
- clasificación analítica por rol más rica;
- handlers semánticos dedicados por capacidad.

Handlers/módulos que ya se perfilan:

- `saveSelectionEvaluation`
- `promotePaperToSynthesis`
- `saveAnalyticalClassification`
- `saveSynthesisRecord`

La lógica de filtros ya está separada en:

- `src/features/papers-review/paper-filters/usePaperFilters.ts`

## Modos de visualización

### Tarjetas

Sirve para exploración rápida y lectura contextual.

### Tabla comparativa

Sirve para contrastar papers por columnas visibles.

### Grafo

Sirve para ver afinidades y relaciones entre papers.

La inferencia del grafo quedó separada en:

- `src/features/papers-review/paper-graph/buildGraphData.ts`

## Exportación e importación

Se puede:

- exportar el workspace a JSON;
- disparar importación desde archivo;
- descargar una plantilla base JSON.

La lógica correspondiente quedó separada en:

- `src/features/papers-review/import-export/json.ts`

## Visualización de PDF

Se puede:

- ver un PDF embebido si el paper tiene `pdfUrl`;
- abrir el PDF en otra pestaña;
- mostrar mensaje de ausencia cuando no existe PDF.

## Grafo de relaciones

Se pueden ver:

- relaciones explícitas guardadas;
- afinidades inferidas por capas, categorías, keywords, datasets y métodos.

Eso significa que el grafo NO depende solo de relaciones manuales; también construye conexiones derivadas.
