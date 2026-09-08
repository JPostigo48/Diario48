# Bloque 02 — arquitectura de módulos y fronteras

## Objetivo

Definir una arquitectura limpia y sostenible para que `music tracker` no nazca acoplado a UI o a APIs externas.

---

## Principio de arquitectura recomendado

La lógica de dominio debe mandar.

Las fuentes externas, la base de datos y la UI deben adaptarse al dominio, NO al revés.

---

## Estructura recomendada

Recomendación de módulos internos por feature:

- `library-core`
- `import-sources`
- `title-normalization`
- `metadata-enrichment`
- `duplicate-detection`
- `review-queue`
- `playlist-analysis`
- `export-reporting`

---

## Capas recomendadas dentro de cada feature

Como mínimo:

### dominio

- entidades;
- value objects;
- reglas;
- invariantes.

### aplicación

- casos de uso;
- comandos;
- consultas;
- DTOs internos.

### infraestructura

- repositorios concretos;
- mapeadores de persistencia;
- adaptadores externos;
- clientes de APIs.

### presentación

- páginas;
- contenedores;
- componentes;
- hooks de interfaz.

---

## Puertos que conviene definir desde el inicio

### A. ImportSourcePort

Para importar playlists o tracks desde cualquier proveedor.

### B. SongRepositoryPort

Para persistencia de canciones canónicas.

### C. ImportedSourceRepositoryPort

Para persistencia de tracks/playlists crudas importadas.

### D. MetadataProviderPort

Para enriquecimiento automático desacoplado del dominio.

### E. DuplicateDetectionPort

Si luego la lógica usa heurísticas externas o servicios específicos.

### F. ExportLibraryPort

Para exportaciones sin acoplar el dominio a CSV/JSON/Excel concretamente.

---

## Recomendaciones específicas para este proyecto

## 1. No repetir el error de centralizar lógica en un solo page component

Si la herramienta nace con una página gigante, luego será costoso arreglarla.

## 2. Evitar mutaciones gruesas de “guardar toda la biblioteca”

Mejor pensar por capacidades:

- registrar importación;
- consolidar canción;
- confirmar corrección manual;
- resolver duplicado;
- completar revisión;
- exportar biblioteca.

## 3. Separar lectura y escritura

Conviene empezar a pensar en:

- queries para reportes y revisión;
- commands para cambios de estado y consolidación.

No hace falta CQRS formal completo, pero sí claridad mental.

---

## Criterios de aceptación

- existe una propuesta clara de módulos;
- la integración externa queda aislada;
- la UI no toma decisiones de dominio;
- la persistencia no dicta el lenguaje del modelo;
- el sistema puede crecer sin reventar en una sola feature monstruosa.
