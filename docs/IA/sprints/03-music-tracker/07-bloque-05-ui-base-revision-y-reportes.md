# Bloque 05 — UI base, revisión y reportes

## Objetivo

Crear la primera superficie web útil para operar la biblioteca sin convertir la UI en lógica de negocio disfrazada.

---

## Principio rector de UI

La UI del primer MVP debe servir para operar decisiones humanas rápidas, no para “verse completa”.

Debe ser clara antes que espectacular.

---

## Vistas mínimas recomendadas

## 1. Dashboard base

Debe mostrar:

- total de canciones importadas;
- total de canciones únicas;
- pendientes de revisión;
- posibles duplicados;
- canciones sin metadata;
- playlists importadas.

## 2. Biblioteca maestra

Lista principal de canciones consolidadas.

Con filtros por:

- estado;
- artista;
- tags;
- mood;
- uso;
- duplicados;
- metadata dudosa.

## 3. Cola de revisión

Vista especializada para revisar rápido:

- título original;
- título limpio sugerido;
- artista sugerido;
- playlists donde aparece;
- duplicados sugeridos;
- acciones rápidas.

## 4. Vista de detalle de canción

Debe permitir ver:

- dato bruto;
- dato normalizado;
- correcciones manuales;
- playlists donde aparece;
- tags;
- mood;
- historial de revisión.

## 5. Reportes y exportación

Vista simple para:

- exportar JSON/CSV/Excel;
- ver top artistas;
- top géneros;
- canciones más repetidas en playlists;
- pendientes de clasificación.

---

## Reglas de UX

## A. Las acciones importantes deben ser explícitas

Por ejemplo:

- confirmar metadata;
- corregir artista;
- marcar como duplicado;
- fusionar;
- descartar;
- marcar como revisada.

## B. No ocultar el original

Siempre debe poder verse:

- el valor original importado;
- el valor limpio;
- el valor manual.

## C. La UI debe exponer incertidumbre

Si la metadata es dudosa, debe notarse.

No maquillar incertidumbre como si fuera certeza.

---

## Criterios de aceptación

- existe una biblioteca maestra navegable;
- existe cola de revisión útil;
- existe detalle de canción con trazabilidad;
- existen reportes base;
- la UI usa la arquitectura y no la reemplaza.

---

## Cierre recomendado del sprint

Antes de abrir un sprint siguiente, revisar:

1. si el modelo soporta crecimiento real;
2. si la importación preserva el dato bruto;
3. si la revisión manual es usable;
4. si los duplicados están bien representados;
5. si la exportación ya sirve como backup real.

Si alguna de estas respuestas es “no”, no conviene pasar todavía a recomendaciones o clustering.
