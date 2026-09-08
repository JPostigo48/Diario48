# Bloque 02 — workflow académico mínimo

## Objetivo

Introducir un ciclo de vida explícito del paper dentro del proyecto.

Este es el primer salto real desde CRUD enriquecido hacia workflow.

---

## Problema que resuelve

Hoy el sistema puede guardar papers, pero no modela con claridad en qué momento metodológico está cada uno.

Eso hace que:

- todos los papers se parezcan demasiado;
- la herramienta no guíe el proceso;
- selección y avance se vuelvan ambiguos.

---

## Estado mínimo recomendado

No intentes meter todos los estados finales de la propuesta de una vez.

Para este sprint basta con un conjunto mínimo y útil, por ejemplo:

- `registered`
- `screening`
- `selected`
- `discarded`
- `contextual`
- `promoted-to-synthesis`

Esto ya permite expresar decisiones reales sin caer en complejidad excesiva.

---

## Tareas de implementación

1. Definir el estado del paper dentro del proyecto.
2. Guardarlo en la capa correcta:
   - como dato del uso del paper en el workspace/proyecto;
   - NO como dato canónico global del paper.
3. Formalizar reglas mínimas de transición.
4. Crear operaciones semánticas para cambiar estado.
5. Mostrar estado actual en UI de forma clara.
6. Evitar que el cambio de estado sea solo una edición libre de texto.

---

## Consideraciones de diseño

- el estado debe pertenecer al proyecto, no al paper global;
- las transiciones deben ser entendibles;
- `discarded` y `contextual` no son lo mismo;
- `promoted-to-synthesis` debe reservarse para papers realmente avanzados.

---

## Criterios de aceptación

- cada paper tiene un estado metodológico explícito;
- el estado se persiste correctamente;
- la UI refleja el estado;
- existen operaciones coherentes para cambiarlo;
- el sistema ya no trata todos los papers como si estuvieran en la misma fase.
