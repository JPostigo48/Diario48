# Bloque 05 — preparación para síntesis y clasificación

## Objetivo

Dejar la arquitectura y el dominio listos para que el siguiente sprint pueda entrar a:

- ficha de síntesis separada;
- clasificación analítica por rol;
- tablero más metodológico.

Este bloque NO busca terminar esas capacidades, sino preparar el terreno sin improvisación.

---

## Tareas de implementación

1. Definir claramente qué datos pasarán a futura ficha de síntesis.
2. Marcar qué campos actuales están mal ubicados y deberían migrar después.
3. Preparar punto de extensión para clasificación analítica por rol.
4. Revisar si la API actual ya necesita handlers más semánticos por capacidad.
5. Ajustar documentación técnica interna si el modelo cambió.

---

## Entregable esperado

Al cerrar este bloque, debe quedar claro:

- qué pertenece a selección;
- qué pertenece a síntesis;
- qué pertenece a clasificación;
- qué endpoints o módulos deberían existir en Sprint 03.

---

## Criterios de aceptación

- el código ya no empuja a mezclar selección y síntesis;
- la persistencia tiene una dirección clara;
- la documentación del sprint deja listo el siguiente paso;
- el sistema queda estable, no “a medio refactor”.

---

## Cierre recomendado del sprint

Antes de abrir Sprint 03, revisar:

1. si el workflow mínimo ya existe de verdad;
2. si la evaluación de selección es usable;
3. si la promoción a síntesis ya está gobernada por reglas;
4. si la arquitectura quedó más limpia que al inicio.

Si alguna de estas respuestas es “no”, no conviene pasar todavía al siguiente sprint.
