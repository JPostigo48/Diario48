# Bloque 01 — consolidación arquitectónica

## Objetivo

Preparar `papers-review` para crecer sin seguir concentrando todo en una sola página y en una sola mutación gruesa.

Este bloque debe ocurrir ANTES de meter más dominio.

---

## Problema que resuelve

Hoy el análisis ya advirtió el principal riesgo:

- `ResearchToolPage.tsx` concentra demasiada responsabilidad;
- el flujo actual está demasiado centrado en CRUD;
- la API todavía puede expresar mejor las capacidades reales del módulo.

Si no se corrige eso primero, el resto del sprint se vuelve frágil.

---

## Tareas de implementación

1. Identificar responsabilidades actuales de `ResearchToolPage.tsx`.
2. Separarlas en módulos más claros, como mínimo:
   - shell / container principal;
   - estado del workspace actual;
   - listado y navegación de papers;
   - toolbar y filtros;
   - inspector;
   - vistas por modo;
   - acciones de persistencia.
3. Revisar que las features internas actuales estén realmente actuando como features y no solo como carpetas decorativas.
4. Reducir dependencia de mutaciones globales tipo “guardar todo el workspace” cuando una capacidad ya tiene identidad propia.
5. Preparar contracts más claros entre:
   - UI
   - features
   - API
   - repositorio

---

## Resultado esperado

Al cerrar este bloque debe ser más fácil introducir:

- estados del paper;
- evaluación de selección;
- promoción a síntesis;

sin seguir inflando el componente principal.

---

## Criterios de aceptación

- `ResearchToolPage.tsx` queda más pequeño o al menos más delgado en responsabilidad;
- la lógica de negocio deja de vivir pegada al JSX principal;
- la UI puede crecer por módulos;
- el código queda listo para introducir workflow académico mínimo.

---

## Regla de revisión humana

Antes de aprobar este bloque, revisar:

- si realmente hubo separación de responsabilidades;
- si no se movió código solo por moverlo;
- si la nueva estructura expresa mejor el dominio;
- si el siguiente bloque puede apoyarse en esta base sin parchear encima.
