# Papers Review — limitaciones y reglas actuales

## Qué NO hace hoy

Con la revisión actual del código, NO se observó:

- autenticación;
- permisos por usuario;
- colaboración multiusuario en tiempo real;
- versionado de workspaces;
- historial de cambios;
- búsqueda semántica real;
- ingestión automática de DOI o metadatos externos.

## Restricciones funcionales visibles

### 1. El frontend todavía opera por agregado

Aunque la persistencia interna ya está normalizada, la UI y la API principal todavía trabajan con el agregado `ResearchWorkspace`.

Consecuencia:

- muchas mutaciones siguen llegando como reemplazo del agregado lógico completo;
- todavía hay espacio para introducir endpoints más finos por entidad.

### 2. El grafo tiene límites operativos

Se observan límites prácticos en la construcción visual:

- papers visibles recortados;
- enlaces inferidos recortados.

Eso es una decisión de contención visual y de rendimiento, no una solución de escalado real.

### 3. Sigue habiendo lógica grande concentrada en un componente

`ResearchToolPage.tsx` concentra MUCHA responsabilidad:

- fetch;
- estado;
- acciones CRUD;
- filtros;
- modos de visualización;
- mensajes de UI.

Eso hace más difícil:

- testear;
- refactorizar;
- aislar casos de uso.

Sí hubo mejora con la extracción de features, pero todavía no es una separación completa de container/presenter o casos de uso puros.

## Qué reglas sí se ven hoy

- si no hay workspace, se crea uno inicial;
- al eliminar un paper, también se limpian relaciones asociadas;
- la estructura recibida se normaliza antes de usarse;
- si no hay PDF, la UI lo comunica explícitamente;
- el listado puede operar con filtros combinados.
- no se aceptan DOIs duplicados dentro del mismo workspace.
- si un DOI ya existe en otro proyecto, se reutiliza el paper canónico.
- no se puede promover a síntesis sin evaluación previa compatible.
- la promoción a síntesis requiere justificación explícita.

## Qué se implementó ya

### Refactor por feature interna

Ya se introdujo separación en:

- `workspace-management`
- `paper-management`
- `paper-filters`
- `paper-graph`
- `import-export`

### Persistencia más normalizada

Ya se separó en entidades persistidas:

- workspace
- paper
- relation
- layer

## Qué mejoraría aún más su arquitectura

### Siguiente paso A — profundizar separación por feature

Aunque `paper-management` ya existe, todavía falta empujar más lógica fuera de `ResearchToolPage.tsx`.

### Siguiente paso B — separar dominio y UI

Sacar más casos de uso fuera del componente principal.

### Siguiente paso C — endpoints más granulares

Si quieres explotar de verdad la persistencia normalizada, el paso correcto es exponer endpoints por entidad:

- workspace
- paper
- relation
- layer

Hoy ya está lista la base estructural para hacerlo.

## Mezclas que todavía existen y que conviene migrar después

Aunque el sprint 02 dejó más clara la frontera conceptual, todavía hay campos mezclados dentro de `ResearchPaper` que luego convendría mover a una ficha de síntesis separada:

- `personalSummary`
- `researchUsefulness`
- `personalNotes`
- parte del uso metodológico de:
  - `objective`
  - `methods`
  - `datasets`
  - `performanceMetrics`
  - `limitations`
  - `futureChallenges`
  - `structure`

Eso NO significa que hoy esté roto.

Significa que la siguiente evolución correcta es:

- mantener selección separada;
- crear ficha de síntesis propia;
- dejar `ResearchPaper` menos cargado semánticamente.

### Siguiente paso D — deduplicación más fuerte sin DOI

Hoy la deduplicación global confiable depende del DOI.

Si quieres evitar duplicados incluso cuando no hay DOI, necesitarás una estrategia adicional, por ejemplo:

- hash por título + año + autores;
- revisión manual de posibles duplicados;
- matching difuso asistido.
