# Bloque 03 — ingesta, normalización y fuentes

## Objetivo

Construir el primer pipeline operativo de entrada de datos.

---

## Problema que resuelve

El prompt exige importar playlists y canciones sin perder información original.

Eso implica un pipeline claro:

1. recibir fuente externa;
2. persistir dato bruto;
3. normalizar título/artista;
4. detectar candidato a canción;
5. asociar aparición en playlist;
6. dejar tarea de revisión si hace falta.

---

## Recomendación crítica del MVP

Para este sprint, la primera fuente de importación debería ser algo CONTROLABLE.

Recomendado:

- JSON estructurado;
- CSV enriquecido;
- o snapshot exportado desde fuente externa.

Después vendrán conectores vivos.

Eso NO es cobardía.
Eso es DISEÑO SANO.

---

## Responsabilidades del pipeline

## Etapa A — recepción

Guardar:

- proveedor;
- playlist externa;
- track externo;
- payload original útil;
- fecha de importación.

## Etapa B — normalización

Aplicar limpieza base:

- remover “official video”, “lyrics”, “audio”, etc.;
- separar artista y canción cuando sea posible;
- preservar siempre el valor original.

## Etapa C — matching inicial

Buscar si ya existe canción canónica compatible por:

- external id;
- URL;
- título normalizado + artista aproximado;
- evidencia secundaria.

## Etapa D — consolidación o creación

Si hay match confiable:

- asociar ocurrencia a canción existente.

Si no:

- crear nueva canción canónica provisional.

## Etapa E — revisión

Si la confianza es baja:

- crear caso de revisión;
- no inventar certeza.

---

## Casos de uso recomendados

- `importPlaylistSnapshot`
- `normalizeImportedTrack`
- `matchImportedTrackToSong`
- `createCanonicalSongFromImport`
- `attachTrackOccurrenceToPlaylist`
- `createReviewTaskForUncertainMetadata`

---

## Criterios de aceptación

- el sistema ya puede importar sin perder bruto;
- la normalización no pisa el original;
- las canciones se consolidan o crean de forma controlada;
- la incertidumbre termina en revisión manual, no en datos falsamente confiables.
