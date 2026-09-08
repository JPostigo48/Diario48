# Bloque 03 — matriz de selección

## Objetivo

Crear una evaluación bibliográfica formal para decidir si un paper avanza o no.

Este bloque es el corazón académico mínimo del Sprint 02.

---

## Problema que resuelve

La propuesta exige separar claramente:

- registrar un paper;
- evaluar si vale la pena;
- decidir si avanza.

Hoy eso todavía no existe como entidad o estructura clara.

---

## Alcance recomendado

Implementar una primera versión de matriz de selección con:

- criterios configurados en código al inicio;
- puntaje por criterio;
- comentario breve opcional;
- score total;
- decisión final.

No hace falta todavía hacer un sistema hiper configurable por usuario.

---

## Criterios sugeridos para la primera versión

- relevancia temática
- calidad de fuente
- actualidad
- reproducibilidad
- utilidad para el proyecto

Si quieres añadir citaciones después, mejor hacerlo cuando tengas mejor fuente de datos.

---

## Decisiones finales mínimas

La evaluación debería permitir, como mínimo:

- descartar
- conservar como contexto
- conservar como seleccionado
- promover a síntesis

---

## Tareas de implementación

1. Crear estructura de evaluación de selección.
2. Separarla del paper base.
3. Asociarla al paper dentro del proyecto.
4. Calcular score total.
5. Permitir guardar decisión final.
6. Mostrar una vista tabla o panel claro para comparar evaluaciones.

---

## Criterios de aceptación

- cada paper puede ser evaluado formalmente;
- la evaluación tiene criterios claros;
- la decisión final queda persistida;
- la UI permite comparar papers con la misma lógica;
- selección y síntesis siguen separadas.

---

## Regla metodológica

No permitir que “promovido a síntesis” exista sin evaluación previa.

Si rompes esa regla, rompiste el valor del flujo.
