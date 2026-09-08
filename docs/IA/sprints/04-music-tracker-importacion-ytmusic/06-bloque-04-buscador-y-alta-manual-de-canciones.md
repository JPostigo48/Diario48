# Bloque 04 — buscador y alta manual de canciones

## Objetivo

Permitir que el usuario agregue canciones individuales desde un buscador conectado a YT Music.

---

## Problema que resuelve

No toda canción relevante entrará por like o playlist.

El usuario debe poder:

- buscar;
- seleccionar;
- importar individualmente;
- guardar link y trazabilidad de origen.

---

## Tareas de implementación

1. Crear caso de uso tipo `searchSongsInYtMusic`.
2. Exponer API protegida de búsqueda.
3. Crear UI de buscador dentro de Music Tracker.
4. Mostrar resultados mínimos:
   - título
   - artista
   - link
   - identificador externo si está disponible
5. Permitir “agregar a biblioteca”.
6. Reusar pipeline de consolidación:
   - fuente bruta
   - normalización
   - matching
   - creación si no existe

---

## Criterios de aceptación

- existe buscador funcional;
- el usuario puede agregar una canción individual;
- se guarda su link y origen;
- no se crea una segunda ruta de importación inconsistente.
