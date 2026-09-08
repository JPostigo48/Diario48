# Bloque 04 — biblioteca maestra, duplicados y estados

## Objetivo

Consolidar la biblioteca maestra como eje del sistema y formalizar:

- estados de organización;
- casos de duplicado;
- prioridad de revisión.

---

## Problema que resuelve

Importar no basta.

La herramienta debe poder responder después:

- qué canciones únicas tengo;
- dónde aparecen;
- cuáles están dudosas;
- cuáles parecen repetidas;
- cuáles faltan revisar;
- cuáles ya fueron confirmadas.

---

## Estados recomendados

## A. estado organizacional de la canción

Ejemplo inicial:

- `imported`
- `needs-review`
- `clean`
- `enriched`
- `classified`
- `archived`
- `discarded`

## B. estado de duplicado

Separado del anterior.

Ejemplo:

- `not-duplicate`
- `possible-duplicate`
- `confirmed-duplicate`
- `merged`
- `pending-duplicate-review`

## C. estado de metadata

También separado.

Ejemplo:

- `metadata-reliable`
- `metadata-probable`
- `metadata-doubtful`
- `metadata-not-found`

No mezclar estas tres dimensiones en una sola bandera confusa.

---

## Duplicados — regla de diseño

La deduplicación debe producir:

- evidencia;
- score;
- explicación;
- acción sugerida;
- decisión humana.

No solo un booleano.

---

## Tareas de implementación

1. Formalizar estados de canción.
2. Formalizar estados de metadata.
3. Formalizar estados de duplicado.
4. Crear caso persistido de posible duplicado.
5. Permitir resolución humana de duplicado.
6. Registrar si dos ítems:
   - se fusionan;
   - se mantienen separados;
   - quedan pendientes.

---

## Criterios de aceptación

- la biblioteca maestra ya tiene lenguaje operativo claro;
- los duplicados no se pierden en lógica implícita;
- la revisión humana puede priorizar trabajo;
- la canción consolidada sigue siendo el centro del sistema.
