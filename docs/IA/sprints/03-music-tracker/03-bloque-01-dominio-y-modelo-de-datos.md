# Bloque 01 — dominio y modelo de datos

## Objetivo

Definir el dominio mínimo correcto antes de hablar de pantallas o integraciones.

Este bloque es el más importante del sprint.

---

## Problema que resuelve

El prompt ya deja claro que hay varias capas mezcladas si no se modelan bien:

- canción favorita;
- fuente original;
- playlist externa;
- aparición de la canción dentro de playlists;
- metadata inferida;
- corrección manual;
- deduplicación;
- estado de revisión.

Si eso termina en una sola ficha gigante, el sistema nace mal.

---

## Entidades recomendadas

## A. Song

La canción canónica dentro de la biblioteca personal.

Debe representar la versión consolidada del ítem musical.

### Campos recomendados de alto nivel

- `id`
- `canonicalTitle`
- `canonicalArtist`
- `manualTitle`
- `manualArtist`
- `album`
- `year`
- `rating`
- `personalNote`
- `isRealFavorite`
- `organizationState`
- `reviewState`
- `metadataConfidence`
- `createdAt`
- `updatedAt`

## B. ImportedTrackSource

Registro bruto importado desde una fuente externa.

Aquí debe vivir:

- título original;
- artista/canal original;
- identificador externo;
- URL;
- posición en playlist;
- fecha de importación;
- proveedor de origen;
- payload original útil para reconstrucción.

## C. ImportedPlaylistSource

Representa una playlist externa o snapshot de origen.

Debe permitir saber:

- nombre original de playlist;
- identificador externo;
- proveedor;
- fecha de importación;
- snapshot o versión si aplica.

## D. SongPlaylistOccurrence

Relación entre canción consolidada y playlist donde aparece.

NO mezclar esto dentro de `Song` como lista cruda sin estructura.

Debe permitir saber:

- en qué playlist aparece;
- con qué posición;
- desde qué fuente;
- cuántas veces aparece;
- si está duplicada dentro de esa playlist.

## E. SongMetadataEvidence

Evidencia de metadata automática o inferida.

Sirve para registrar:

- qué fuente sugirió artista/título;
- con qué confianza;
- cuándo;
- y qué partes fueron aceptadas o no.

## F. SongDuplicateCase

Caso de posible duplicado.

Debe permitir:

- agrupar candidatos a duplicado;
- registrar score o razón de sospecha;
- guardar decisión humana;
- y rastrear fusiones confirmadas.

## G. SongReviewTask

Cola de revisión manual.

Sirve para expresar:

- qué canción requiere atención;
- por qué;
- qué acción falta;
- prioridad;
- estado de resolución.

---

## Separaciones obligatorias

Debe quedar separada la información en estas capas:

### 1. dato bruto importado

no se toca;
no se pierde.

### 2. dato normalizado automático

puede cambiar;
debe tener trazabilidad.

### 3. dato corregido manualmente

tiene prioridad;
no debe sobrescribirse automáticamente.

---

## Criterios de aceptación

- el modelo ya diferencia canción canónica, fuente importada y playlist;
- la ocurrencia canción-playlist tiene identidad propia;
- la deduplicación no está embebida de forma caótica en la canción;
- la revisión manual tiene lugar explícito;
- el modelo prepara bien enriquecimiento y exportación futura.

---

## Regla de revisión humana

Antes de aprobar este bloque, revisar:

- si la canción sigue siendo realmente la entidad principal;
- si el sistema preserva el origen bruto;
- si las fronteras del dominio se entienden sin leer implementación.
