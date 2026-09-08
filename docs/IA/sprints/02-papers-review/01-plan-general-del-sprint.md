# Sprint 02 — plan general del robustecimiento de Papers Review

## Objetivo

Robustecer `papers-review` para que deje de crecer como CRUD enriquecido y empiece a moverse hacia un **workflow académico explícito**.

La prioridad correcta NO es meter de frente todas las pantallas de la propuesta.

La prioridad correcta es:

1. consolidar arquitectura;
2. formalizar dominio mínimo;
3. introducir estados y transiciones;
4. crear evaluación de selección;
5. preparar promoción a síntesis;
6. dejar base limpia para sprints posteriores.

---

## Qué SÍ debería buscar este sprint

- reducir ambigüedad del modelo actual;
- sacar más responsabilidad de `ResearchToolPage.tsx`;
- separar mejor capacidades por módulo;
- introducir lenguaje de dominio real;
- modelar el ciclo de vida de un paper dentro del proyecto;
- crear una primera matriz de selección formal;
- dejar lista la frontera para síntesis posterior.

---

## Qué NO debería intentar este sprint

- resolver toda la propuesta completa;
- construir todavía el sistema final de gaps;
- rehacer el grafo bibliográfico avanzado de citaciones;
- meter clasificación analítica completa con todos los roles;
- implementar exportaciones académicas finales;
- mezclar selección y síntesis en una sola entrega.

Si intentas hacer TODO en este sprint, vas a romper el foco.

---

## Orden recomendado

### Etapa 0 — preflight

Leer primero:

- `02-consideraciones-previas.md`

### Etapa 1 — consolidación arquitectónica

Implementar:

- `03-bloque-01-consolidacion-arquitectonica.md`

### Etapa 2 — workflow académico mínimo

Implementar:

- `04-bloque-02-workflow-academico-minimo.md`

### Etapa 3 — matriz de selección

Implementar:

- `05-bloque-03-matriz-de-seleccion.md`

### Etapa 4 — promoción a síntesis

Implementar:

- `06-bloque-04-promocion-a-sintesis.md`

### Etapa 5 — preparación del siguiente salto

Implementar:

- `07-bloque-05-preparacion-para-sintesis-y-clasificacion.md`

---

## Resultado esperado al terminar Sprint 02

Al cierre de este sprint, `papers-review` debería quedar así:

- mejor separado internamente;
- menos dependiente de una página gigante;
- con papers que tienen estado dentro del proyecto;
- con evaluación bibliográfica formal de selección;
- con acción explícita de promoción a síntesis;
- con modelo listo para que Sprint 03 entre a síntesis y clasificación sin improvisación.
