# Bloque 04 — protección de APIs

## Objetivo

Hacer que las APIs privadas operen solo para el usuario autenticado y solo sobre recursos que le pertenecen.

---

## Decisiones fijas

- toda API privada debe resolver usuario actual;
- sin sesión válida no hay acceso;
- por id no basta: también debe verificarse ownership.

---

## Alcance

Este bloque SÍ incluye:

- protección de endpoints privados;
- filtrado por usuario;
- rechazo de acceso no autenticado;
- rechazo de acceso a recursos ajenos.

Este bloque NO incluye:

- rediseño visual amplio;
- nuevas features funcionales;
- colaboración entre usuarios.

---

## Tareas de implementación

1. Identificar rutas privadas existentes.
2. Resolver usuario actual en esas rutas.
3. Rechazar peticiones sin sesión válida.
4. Filtrar consultas por `ownerId`.
5. Verificar ownership en operaciones por id.
6. Estandarizar respuestas de no autenticado / no autorizado si corresponde.

---

## Archivos probables a tocar

- `src/app/api/**`
- repositorios y helpers de autenticación

---

## Criterios de aceptación

- las rutas privadas ya no operan de forma anónima;
- un usuario no puede acceder a recursos de otro;
- las consultas ya no devuelven datos globales privados sin filtro;
- la protección es consistente entre endpoints equivalentes.

---

## Checklist de revisión humana

- verificar que las rutas privadas fallen correctamente sin sesión;
- verificar que por id también se revise ownership;
- verificar consistencia de respuestas;
- verificar que no se mezcló protección con lógica visual de UI.

---

## Regla de parada

Al terminar:

- presentar resumen;
- esperar aprobación humana;
- no continuar al bloque 05 sin aprobación.
