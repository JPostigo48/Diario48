# Bloque 03 — sincronización de playlists y likes

## Objetivo

Conectar el adaptador de YT Music con el pipeline ya existente de importación del `music tracker`.

---

## Tareas de implementación

1. Crear caso de uso tipo:
   - `syncLikedSongsFromYtMusic`
   - `syncUserPlaylistsFromYtMusic`
   - o uno unificado tipo `syncMusicLibraryFromYtMusic`
2. Reusar el pipeline de:
   - persistencia de fuente bruta
   - normalización
   - matching
   - creación de canción
   - asociación a playlist
   - review task
3. Registrar `lastSyncAt`.
4. Registrar errores de sincronización.
5. Evitar duplicar ítems ya importados cuando correspondan al mismo track.

---

## UX requerida

Dentro de `music tracker` debe existir una zona clara con botones como:

- `importar desde YT Music`
- `actualizar likes`
- `actualizar playlists`
- o una acción equivalente bien pensada

Debe estar en un lugar natural del flujo, por ejemplo:

- topbar de herramienta;
- dashboard;
- o panel de conexión del proveedor.

No esconderlo en un rincón arbitrario.

---

## Criterios de aceptación

- el usuario puede lanzar sincronización manual;
- likes y playlists llegan a la biblioteca;
- la importación reusa tu pipeline y no crea otra lógica paralela;
- el sistema deja trazabilidad de última sincronización y errores.
