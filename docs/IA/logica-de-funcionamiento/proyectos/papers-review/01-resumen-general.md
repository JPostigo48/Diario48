# Papers Review — resumen general

## Archivo principal

`src/components/research/ResearchToolPage.tsx`

## Qué resuelve

Este mini proyecto es un sistema para organizar revisión bibliográfica académica.

Permite:

- administrar workspaces;
- organizar papers por capas;
- registrar metadatos y notas;
- filtrar y comparar;
- ver PDFs;
- exportar JSON;
- visualizar relaciones y afinidades.

## Flujo principal

1. Al montar, intenta cargar la lista de workspaces.
2. Si no hay ninguno, crea uno inicial.
3. Carga el workspace activo.
4. Normaliza la estructura recibida.
5. Expone operaciones CRUD sobre workspaces y papers.
6. Permite cambiar entre vista tarjetas, tabla y grafo.

## Estados de UI importantes

- `workspaceList`
- `workspace`
- `selectedWorkspaceId`
- `selectedPaperId`
- `viewMode`
- `visibleColumns`
- filtros de texto, año, capa, categoría, prioridad y estado

## Refactor interno aplicado

Ahora el módulo ya no depende solo de un bloque monolítico. Se introdujo una separación interna por features:

- `src/features/papers-review/workspace-management/`
- `src/features/papers-review/paper-management/`
- `src/features/papers-review/paper-filters/`
- `src/features/papers-review/paper-graph/`
- `src/features/papers-review/import-export/`

Todavía falta profundizar más la extracción de `paper-management`, pero YA existe una base real de organización por feature.

## Idea arquitectónica

Este módulo ya parece un producto por sí solo. No es un simple visor. Tiene:

- modelo propio;
- persistencia propia;
- múltiples modos de visualización;
- lógica de normalización;
- flujo CRUD relativamente completo.

## Compatibilidad de contrato

Aunque la persistencia interna cambió, la API sigue devolviendo la forma lógica de `ResearchWorkspace`.

Eso significa:

- cambió la infraestructura interna;
- NO cambió el contrato principal que consume la UI.
