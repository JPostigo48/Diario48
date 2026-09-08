# Bloque 03 — ownership y persistencia

## Objetivo

Introducir la noción de dueño de recurso en la persistencia para que los datos privados queden ligados a un usuario autenticado.

---

## Decisiones fijas

- no todo dato debe ser privado;
- los catálogos canónicos pueden seguir siendo globales;
- los recursos de trabajo del usuario sí deben quedar asociados a `ownerId` o equivalente.

---

## Alcance

Este bloque SÍ incluye:

- revisión de entidades privadas;
- incorporación de `ownerId` en recursos raíz correspondientes;
- definición explícita de qué queda global y qué queda privado;
- ajustes en repositorios o modelos para soportarlo.

Este bloque NO incluye:

- protección final de todos los endpoints;
- UI;
- adaptación completa de cada herramienta.

---

## Tareas de implementación

1. Identificar entidades privadas del sistema.
2. Identificar entidades globales reutilizables.
3. Agregar `ownerId` o equivalente donde corresponda.
4. Ajustar repositorios para aceptar contexto de usuario.
5. Preparar estrategia de migración o compatibilidad para datos existentes.

---

## Archivos probables a tocar

- modelos en `src/lib/models/`
- repositorios en `src/lib/`
- estructuras de dominio por herramienta persistente

---

## Criterios de aceptación

- los recursos privados relevantes tienen dueño;
- los datos globales no se duplican innecesariamente;
- el repositorio ya puede operar con contexto de usuario;
- existe una decisión explícita para datos antiguos o legacy.

---

## Checklist de revisión humana

- verificar que `ownerId` no se agregó indiscriminadamente a todo;
- verificar que se mantenga la separación entre global y privado;
- verificar que el repositorio esté preparado para consultas por usuario;
- verificar que no se rompió el concepto de papel canónico/global cuando aplique.

---

## Regla de parada

Al terminar:

- presentar resumen;
- esperar aprobación humana;
- no continuar al bloque 04 sin aprobación.
