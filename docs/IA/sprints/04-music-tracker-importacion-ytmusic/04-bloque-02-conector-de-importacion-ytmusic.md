# Bloque 02 — conector de importación con YT Music

## Objetivo

Implementar el adaptador backend que usa `ytmusicapi` para leer información del usuario.

---

## Tareas de implementación

1. Instalar e integrar `ytmusicapi` en backend.
2. Crear adaptador concreto para `ImportSourcePort`.
3. Crear servicio para obtener:
   - likes
   - playlists creadas
   - metadata mínima útil de tracks
4. Transformar los resultados de YT Music a DTOs internos del sistema.
5. Mantener la frontera clara entre:
   - payload de proveedor
   - DTO de importación
   - entidades de dominio

---

## Regla importante

No dejar que el formato de `ytmusicapi` contamine directamente tus entidades internas.

Siempre mapear.

---

## Criterios de aceptación

- existe adaptador concreto YT Music;
- el backend puede leer likes y playlists del usuario;
- los resultados ya salen en formato interno del sistema;
- el dominio no depende de estructuras crudas de `ytmusicapi`.
