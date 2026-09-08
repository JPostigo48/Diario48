# Nota de dirección — compartición y modo lectura

## Para qué existe esta nota

Esta nota explica el ajuste de dirección que apareció después de avanzar hasta:

- `06-bloque-05-ui-y-flujo-de-acceso.md`

Sirve para que un humano entienda la decisión antes de implementar el bloque 06 final.

---

## Problema detectado

La primera lectura natural del sprint podía llevar a pensar:

- herramientas privadas;
- acceso autenticado;
- edición solo para el dueño;
- sin apertura a terceros.

Pero eso NO encaja del todo con el objetivo real del proyecto, porque herramientas como:

- `graph`
- `papers-review`

tienen mucho sentido si el resultado puede compartirse con otras personas.

---

## Recomendación

La recomendación correcta para esta etapa es:

- no crear links separados para lectura y edición;
- no introducir todavía un sharing complejo;
- usar una sola URL estable por recurso;
- decidir el modo según ownership y visibilidad.

## Regla recomendada

### Si eres el dueño

- puedes leer;
- puedes editar.

### Si no eres el dueño

- solo puedes leer;
- y solo si el recurso permite lectura por link.

### Si no eres el dueño y el recurso es privado

- no hay acceso.

---

## Modelo mental correcto

No pienses en:

- “herramienta pública” vs “herramienta privada”

Piensa en:

- **recurso con dueño**
- **URL estable**
- **visibilidad**
- **modo readonly para terceros**

---

## Por qué esta dirección es mejor ahora

Porque evita complejidad innecesaria.

### Lo que EVITA

- botones de compartir demasiado sofisticados;
- links distintos para cada modo;
- colaboración simultánea fuera de alcance;
- permisos complejos demasiado pronto.

### Lo que SÍ habilita

- compartir un grafo con alguien;
- compartir un workspace de papers review para lectura;
- mantener ownership sano;
- y dejar la arquitectura lista para evolucionar más adelante.

---

## Cómo debería verse en práctica

## Ejemplo 1 — Graph

URL:

- `/tools/graphs/[id]`

Comportamiento:

- dueño → editor
- tercero con link y visibilidad permitida → viewer readonly
- tercero sin permiso → sin acceso

## Ejemplo 2 — Papers Review

URL:

- `/tools/papers-review/[id]`

Comportamiento:

- dueño → workspace editable
- tercero con link y visibilidad permitida → lectura readonly
- tercero sin permiso → sin acceso

---

## Lo que queda fuera por ahora

Esta recomendación NO implica todavía:

- edición compartida;
- comentarios;
- permisos por usuario;
- invitaciones;
- snapshots publicadas separadas;
- colaboración estilo Overleaf.

Eso puede venir después, si de verdad aporta valor.

---

## Cómo proceder

Si vas a continuar el sprint, la secuencia correcta es:

1. leer `07-bloque-06-adaptacion-de-herramientas.md`;
2. implementar primero `graph` como caso más simple;
3. validar ownership + readonly + visibilidad;
4. luego aplicar el mismo patrón a `papers-review`.

---

## Conclusión

La recomendación final es esta:

**una URL por recurso, edición para el dueño, lectura para terceros solo si la visibilidad lo permite.**

Eso es suficientemente simple para hoy y suficientemente sano para mañana.
