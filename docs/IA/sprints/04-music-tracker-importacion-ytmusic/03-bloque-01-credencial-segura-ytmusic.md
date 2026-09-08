# Bloque 01 — credencial segura de YT Music

## Objetivo

Agregar la capacidad de guardar, validar y actualizar la credencial sensible de YT Music por usuario, sin romper el modelo de seguridad del sistema.

---

## Problema que resuelve

Para importar likes y playlists, el backend necesita una credencial utilizable por `ytmusicapi`.

Eso no puede tratarse como un password de login común.

---

## Tareas de implementación

1. Crear entidad persistida para credencial externa del usuario.
2. Guardar la credencial cifrada, no en texto plano.
3. Asociarla al `ownerId`.
4. Registrar estado de la credencial:
   - `configured`
   - `valid`
   - `invalid`
   - `needs-refresh`
5. Crear caso de uso para:
   - guardar credencial
   - validar credencial
   - actualizar credencial
   - eliminar credencial
6. Crear API backend protegida para estas operaciones.

---

## Consideraciones de diseño

- la credencial externa no es parte del dominio de canción;
- pertenece a infraestructura/conexión del usuario con proveedor;
- debe quedar fuera del frontend una vez persistida;
- debe poder invalidarse sin afectar el login normal del usuario.

---

## Criterios de aceptación

- el usuario puede guardar su credencial de YT Music;
- la credencial queda cifrada;
- puede validarse desde backend;
- puede reemplazarse;
- la UI refleja su estado sin exponer el secreto.
