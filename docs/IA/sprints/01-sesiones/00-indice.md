# Sprint 01 — sesiones

## Objetivo

Esta carpeta concentra el **plan de implementación** para introducir sesiones, ownership y base multiusuario en el proyecto.

La lógica conceptual transversal se documenta aparte en:

- `../../logica-de-funcionamiento/04-sesiones-y-multiusuario.md`

Este sprint sí está orientado a ejecución por etapas.

---

## Archivos

- `01-plan-de-sesiones-y-multiusuario.md` — portada del sprint, decisiones cerradas, orden de ejecución y reglas de supervisión.
- `02-bloque-01-modelo-de-usuario.md` — creación del modelo de usuario y bootstrap inicial.
- `03-bloque-02-sesiones-y-autenticacion.md` — login por email/contraseña, sesión y helper de usuario actual.
- `04-bloque-03-ownership-y-persistencia.md` — incorporación de `ownerId` y separación entre datos privados y globales.
- `05-bloque-04-proteccion-de-apis.md` — protección de rutas API y filtrado por usuario autenticado.
- `06-bloque-05-ui-y-flujo-de-acceso.md` — pantallas y comportamiento cliente para acceso, logout y estados privados.
- `07-bloque-06-adaptacion-de-herramientas.md` — adaptación de herramientas hacia URL única por recurso, ownership y modo lectura para no dueños.
- `08-nota-de-direccion-comparticion-y-modo-lectura.md` — explicación de la dirección recomendada para compartir recursos sin perder ownership.

## Orden recomendado

1. `01-plan-de-sesiones-y-multiusuario.md`
2. `02-bloque-01-modelo-de-usuario.md`
3. `03-bloque-02-sesiones-y-autenticacion.md`
4. `04-bloque-03-ownership-y-persistencia.md`
5. `05-bloque-04-proteccion-de-apis.md`
6. `06-bloque-05-ui-y-flujo-de-acceso.md`
7. `07-bloque-06-adaptacion-de-herramientas.md`
8. `08-nota-de-direccion-comparticion-y-modo-lectura.md`
