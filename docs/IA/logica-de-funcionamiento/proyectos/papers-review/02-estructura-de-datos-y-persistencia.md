# Papers Review — estructura de datos y persistencia

## Dónde guarda la información

La información se persiste en MongoDB usando Mongoose.

Piezas verificadas:

- conexión: `src/lib/db/mongodb.ts`
- repositorio de agregación: `src/lib/research/repository.ts`
- modelos normalizados:
  - `src/lib/models/ResearchWorkspaceRecord.ts`
  - `src/lib/models/ResearchPaperCatalogRecord.ts`
  - `src/lib/models/ResearchWorkspacePaperLinkRecord.ts`
  - `src/lib/models/ResearchRelationRecord.ts`
  - `src/lib/models/ResearchLayerRecord.ts`
- modelo legacy conservado para compatibilidad:
  - `src/lib/models/ResearchPaperRecord.ts`
  - `src/lib/models/ResearchWorkspace.ts`
- APIs:
  - `src/app/api/research/workspaces/route.ts`
  - `src/app/api/research/workspaces/[id]/route.ts`

## Unidad lógica vs unidad física

Lógicamente, el frontend sigue trabajando con un `workspace`.

Pero físicamente, la persistencia ya está separada en documentos distintos:

- workspace metadata;
- layers;
- papers;
- relations.

## Entidades persistidas

### 1. Workspace

Guarda:

- nombre;
- descripción;
- timestamps.

### 2. Layer

Guarda por separado:

- `workspaceId`
- `layerId`
- `name`
- `order`
- `description`

### 3. Paper catalog

Ahora existe un catálogo canónico de papers.

Objetivo:

- evitar duplicar información del mismo paper entre proyectos;
- reutilizar el mismo paper si comparte DOI.

Regla implementada:

- si dos papers tienen el mismo DOI normalizado, apuntan al mismo registro canónico.

Nota importante:

- si el DOI está vacío, NO se puede deduplicar con garantías.

### 4. Workspace-paper link

Ahora el vínculo entre proyecto y paper vive separado.

Guarda:

- `workspaceId`
- `paperId` local dentro del workspace
- `paperRefId` hacia el catálogo canónico
- `layerIds`
- `personalSummary`
- `researchUsefulness`
- `personalNotes`
- `selectionEvaluation`
- `synthesisPromotion`
- `analyticalClassification`
- `readingStatus`
- `priority`

Esto separa correctamente:

- **datos globales del paper**
- **datos específicos del workspace**

### 5. Relation

Cada relación también vive como documento separado.

Guarda:

- `workspaceId`
- `relationId`
- `fromPaperId`
- `toPaperId`
- `type`
- `note`

## Agregación de lectura

La API recompone un `ResearchWorkspace` desde estas entidades:

- workspace
- layers
- workspace-paper links
- paper catalog
- relations

Todo eso se ensambla en `repository.ts`.

Eso significa:

- almacenamiento normalizado;
- respuesta de API todavía conveniente para la UI.

## Legacy y transición

El sistema conserva lectura del modelo legacy `ResearchWorkspace.ts` como fallback.

Eso sirve para:

- no romper datos antiguos;
- permitir transición gradual hacia la persistencia nueva.

## Forma lógica que sigue viendo el frontend

Un workspace sigue exponiendo:

- `project`
- `layers`
- `papers`
- `relations`

Cada paper sigue pudiendo almacenar:

- autores;
- año;
- venue;
- DOI;
- URL del paper;
- URL del PDF;
- abstract;
- resumen personal;
- keywords;
- categoría;
- subcategoría;
- capas;
- objetivo;
- métodos;
- datasets;
- métricas;
- limitaciones;
- desafíos futuros;
- utilidad para la investigación;
- notas personales;
- estructura jerárquica del paper;
- evaluación de selección;
- promoción a síntesis;
- clasificación analítica inicial;
- estado de lectura;
- prioridad.

## Dirección preparada para Sprint 03

La persistencia ya deja una dirección más clara:

- **selección**:
  - `workflowStatus`
  - `selectionEvaluation`
- **promoción**:
  - `synthesisPromotion`
- **clasificación**:
  - `analyticalClassification`
- **síntesis futura**:
  - todavía NO tiene ficha propia
  - pero ya quedó separada conceptualmente de selección

## Implicación arquitectónica

Hoy tienes una arquitectura mejor balanceada:

- **persistencia interna normalizada**
- **respuesta externa agregada**
- **paper canónico reutilizable por DOI**

Ese patrón es MUCHO más sano que guardar siempre todo en un único documento enorme.
