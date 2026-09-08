# Sprint 03 — plan general de Music Tracker

## Propósito real

Este sprint NO debe intentar hacer “la app musical completa”.

Debe construir una base sana para resolver el problema principal del prompt:

> no perder canciones favoritas, importarlas desde playlists, organizarlas sin hacerlo todo a mano y dejar backup/exportación confiable.

---

## Cambio conceptual clave

La herramienta NO debe centrarse en playlists como entidad principal.

Debe centrarse en:

```txt
canción canónica primero
fuentes de importación después
playlists como contexto
```

Eso afecta TODO:

- dominio;
- persistencia;
- API;
- UI;
- deduplicación;
- exportación.

---

## Qué debería cubrir este sprint

Este sprint sí debería dejar clara y lista la primera columna vertebral de la herramienta:

1. modelo de dominio;
2. fronteras de arquitectura;
3. pipeline de ingesta;
4. normalización básica;
5. biblioteca maestra;
6. detección inicial de duplicados;
7. estados de organización;
8. cola de revisión manual;
9. exportación y reportes base.

---

## Qué NO debería intentar todavía

No conviene meter en este sprint:

- clustering avanzado;
- recomendaciones inteligentes;
- sincronización perfecta con plataformas externas;
- scraping complejo como base obligatoria;
- reproductor;
- automatización agresiva de fusiones;
- enriquecimiento “mágico” sin trazabilidad.

Eso sería arquitectura impulsiva, no sólida.

---

## Decisión de enfoque recomendada

La ruta correcta para un primer desarrollo web es:

### primero:

- importar datasets o snapshots de playlists;
- guardar datos brutos sin pérdida;
- normalizar;
- consolidar canciones candidatas;
- permitir revisión manual;
- exportar.

### después:

- integrar conectores externos más sofisticados;
- enriquecer metadata automática;
- recomendar;
- clusterizar.

---

## Orden recomendado del sprint

### Etapa 1 — dominio y modelo

`03-bloque-01-dominio-y-modelo-de-datos.md`

### Etapa 2 — arquitectura limpia y modular

`04-bloque-02-arquitectura-de-modulos-y-fronteras.md`

### Etapa 3 — ingesta y normalización

`05-bloque-03-ingesta-normalizacion-y-fuentes.md`

### Etapa 4 — biblioteca maestra y duplicados

`06-bloque-04-biblioteca-maestra-duplicados-y-estados.md`

### Etapa 5 — UI inicial y operación humana

`07-bloque-05-ui-base-revision-y-reportes.md`

---

## Resultado esperado al terminar Sprint 03

Al finalizar, deberías tener:

- un modelo claro entre canción, fuente importada, playlist y ocurrencia;
- una biblioteca maestra persistida;
- pipeline base de importación y limpieza;
- detección inicial de duplicados;
- revisión manual rápida;
- exportación útil;
- y una arquitectura que permita crecer sin convertirse en espagueti.
