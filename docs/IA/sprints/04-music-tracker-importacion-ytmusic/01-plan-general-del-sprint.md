# Sprint 04 — plan general de importación inicial con YT Music

## Propósito real

El Sprint 03 dejó lista la base:

- dominio;
- arquitectura;
- pipeline de ingesta controlado;
- biblioteca maestra;
- deduplicación;
- UI base.

Ahora toca conectar esa base con una fuente real de valor para el usuario:

- **YT Music**

---

## Qué debe resolver este sprint

Este sprint debe permitir que un usuario autenticado en tu web pueda:

1. registrar su credencial sensible derivada de `browser.json`;
2. importarla de forma segura;
3. sincronizar sus likes;
4. sincronizar sus playlists creadas;
5. volver a actualizar cuando quiera;
6. buscar canciones en YT Music y agregarlas individualmente;
7. puntuar canciones dentro de su biblioteca.

---

## Qué NO debe hacer todavía

No conviene meter en este sprint:

- sincronización automática en background tipo cron complejo;
- edición remota de playlists en YT Music;
- scraping improvisado desde frontend;
- compartir credenciales entre herramientas;
- recomendador basado en puntajes;
- clustering avanzado.

Primero integración segura y flujo operativo. Luego inteligencia.

---

## Decisión arquitectónica importante

La integración con YT Music debe entrar como **adaptador externo** del módulo `import-sources`.

NO debe contaminar:

- la UI;
- el dominio de canción;
- ni los repositorios principales.

La herramienta debe seguir pensando:

```txt
canción canónica primero
YT Music como proveedor externo
```

---

## Orden recomendado

### Etapa 1 — credencial segura

`03-bloque-01-credencial-segura-ytmusic.md`

### Etapa 2 — conector YT Music

`04-bloque-02-conector-de-importacion-ytmusic.md`

### Etapa 3 — sincronización real

`05-bloque-03-sincronizacion-de-playlists-y-likes.md`

### Etapa 4 — alta manual por buscador

`06-bloque-04-buscador-y-alta-manual-de-canciones.md`

### Etapa 5 — puntuación manual

`07-bloque-05-puntuacion-manual-y-ajustes-de-biblioteca.md`

---

## Resultado esperado al terminar Sprint 04

Al finalizar, el usuario debería poder:

- guardar su secreto de YT Music de forma segura;
- importar o refrescar sus likes y playlists;
- agregar canciones individuales desde buscador;
- verlas en la biblioteca maestra;
- puntuarlas manualmente;
- y mantener todo desacoplado del dominio central.
