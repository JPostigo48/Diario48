# Sprint 02 — consideraciones previas antes de empezar

## Esto es lo más importante

Antes de tocar código, hay que entender una idea CENTRAL:

`papers-review` ya NO debería crecer como una ficha gigante por paper.

Eso sería un error conceptual.

La propuesta y su análisis dejan claro que el problema no es “faltan más campos”, sino “falta modelar mejor el proceso”.

---

## Consideraciones obligatorias

## 1. No mezclar selección con síntesis

Un paper candidato y un paper sintetizado NO son lo mismo.

Por tanto:

- la evaluación de selección debe vivir separada;
- la síntesis técnica debe venir después;
- no se debe seguir extendiendo una sola entidad plana para ambos momentos.

## 2. No seguir cargando `ResearchToolPage.tsx`

Si el próximo cambio vuelve a meter más lógica ahí, ya empezaste mal.

Antes de crecer funcionalmente:

- separar contenedores;
- separar hooks;
- separar casos de uso;
- separar vistas por módulo.

## 3. Mantener la decisión de paper canónico global

Esto NO se toca hacia atrás.

Debe mantenerse:

- paper global con metadata compartida;
- uso específico dentro del workspace/proyecto;
- evaluación y relevancia dependientes del proyecto.

## 4. Pensar en operaciones semánticas, no solo CRUD

Este sprint debe empezar a introducir operaciones como:

- registrar candidato;
- evaluar selección;
- descartar;
- conservar como contexto;
- promover a síntesis.

Si todo sigue siendo `updateWorkspace`, la arquitectura seguirá gritando que está mal.

## 5. No rediseñar todavía toda la UI final

La UI por fases completas llegará después.

En este sprint basta con:

- introducir estructura mínima correcta;
- crear vistas o paneles específicos necesarios;
- mejorar la semántica del flujo.

## 6. Mantener compatibilidad con lo ya existente

Hay que aprovechar lo que ya sirve:

- workspaces;
- ownership;
- persistencia separada;
- import/export base;
- paper global;
- grafo actual como apoyo.

El objetivo no es tirar el sistema, sino encauzarlo.

---

## Preguntas que deben responderse ANTES de implementar

1. ¿Cuál es exactamente el estado mínimo de un paper dentro del proyecto?
2. ¿Qué datos pertenecen a selección y cuáles pertenecen a síntesis?
3. ¿Qué operaciones de negocio ya no deberían expresarse como edición libre?
4. ¿Qué partes de la UI actual deben sobrevivir y cuáles deben empezar a modularizarse?
5. ¿Qué cambios requieren migración de persistencia y cuáles pueden convivir con lo actual?

Si estas preguntas no están claras, no conviene empezar el bloque siguiente.

---

## Riesgos si empiezas mal

- mezclar más campos dentro de la ficha del paper;
- crear lógica duplicada entre UI y repositorio;
- construir estados solo en frontend;
- seguir usando una única mutación gruesa para todo;
- inventar pantallas sin antes fijar el dominio.

Eso te daría velocidad falsa y deuda real.

---

## Recomendación ejecutiva

La ruta correcta para Sprint 02 es:

- primero consolidar base;
- luego introducir workflow mínimo;
- luego matriz de selección;
- luego promoción;
- y recién después preparar síntesis.

NO al revés.
