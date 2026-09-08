# Sprint 03 — consideraciones previas antes de empezar

## Principio rector

Este proyecto puede romperse muy rápido si se empieza desde la UI o desde la integración externa.

La base correcta NO es:

- “conectar Spotify o YouTube primero”

La base correcta es:

- “modelar bien canción, fuente, playlist, ocurrencia y revisión”

---

## Consideraciones obligatorias

## 1. La canción canónica es la entidad principal

Esto debe quedar CLARO desde el inicio.

La playlist no manda el modelo.

La fuente externa no manda el modelo.

La entidad principal debe ser la canción consolidada dentro de tu biblioteca.

## 2. Nunca perder el dato importado bruto

Debe existir separación entre:

- dato bruto importado;
- dato normalizado/inferido;
- dato corregido manualmente.

Si mezclas esas capas, luego:

- no sabrás qué vino de afuera;
- no sabrás qué fue inferido;
- no sabrás qué corrigió el usuario;
- y terminarás sobrescribiendo correcciones.

## 3. No acoplar dominio a una plataforma externa

Arquitectónicamente esto es CRÍTICO.

No diseñes:

- `SpotifySong`
- `YouTubeSong`

como centro del dominio.

Diseña:

- `ImportedTrackSource`
- `ImportedPlaylistSource`
- `Song`
- `SongPlaylistOccurrence`

y deja a Spotify/YouTube como adaptadores externos.

## 4. No automatizar fusiones dudosas

La deduplicación puede sugerir.

La deduplicación no debe mandar.

Por tanto:

- detectar ≠ fusionar;
- sugerir ≠ sobrescribir;
- confianza alta ≠ permiso automático irrestricto.

## 5. No mezclar metadata externa con verdad manual

La corrección manual debe tener prioridad.

Eso debe verse en:

- modelo;
- casos de uso;
- API;
- UI;
- persistencia.

## 6. La primera integración externa debe ser reemplazable

Si se implementa importación desde plataforma externa, debe entrar por una frontera limpia:

- puerto de importación;
- adaptador por proveedor;
- DTO de entrada;
- mapeador hacia el dominio.

Nada de meter llamadas externas directamente en componentes React o en repositorios del dominio.

## 7. El MVP debe poder operar aun sin integración viva

Esto es MUY recomendable.

Para no bloquear el desarrollo, conviene que el MVP soporte:

- importación por JSON/CSV estructurado;
- quizá importación de snapshot exportado;
- y luego conectores reales.

Eso reduce dependencia externa y acelera validación del dominio.

---

## Preguntas que deben quedar resueltas antes de implementar

1. ¿Qué identifica a una canción canónica?
2. ¿Qué parte del sistema guarda la ocurrencia de una canción en una playlist?
3. ¿Qué parte guarda la fuente original sin pérdida?
4. ¿Cómo se representa la confianza de metadata?
5. ¿Cómo se representa la prioridad de dato manual sobre dato automático?
6. ¿Cuál será la primera fuente de importación del MVP?
7. ¿Qué operación concreta crea o actualiza la canción canónica?

Si esto no está definido, empezar código sería precipitado.

---

## Decisiones recomendadas antes de empezar

### Decisión A — primer origen del MVP

Recomendación:

- primero soportar importación estructurada por archivo o snapshot;
- después integrar APIs de plataformas.

### Decisión B — persistencia

Recomendación:

- mantener Mongo como persistencia inicial, alineado al proyecto actual;
- pero separar colecciones por responsabilidad, no una sola colección monstruosa.

### Decisión C — arquitectura

Recomendación:

- usar módulos por feature;
- separar dominio, casos de uso, infraestructura y UI;
- evitar lógica importante en páginas gigantes.

---

## Riesgos si se empieza mal

- diseñar todo alrededor de playlists;
- pegar scraping/importación a la UI;
- guardar solo el dato limpio y perder el original;
- fusionar duplicados de forma agresiva;
- convertir el modelo en una ficha enorme sin trazabilidad;
- meter enriquecimiento automático sin niveles de confianza.

Eso daría una app frágil y muy difícil de depurar.
