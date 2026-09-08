# Bloque 06 — adaptación de herramientas

## Objetivo

Ajustar las herramientas persistentes del proyecto para que trabajen correctamente sobre la nueva base de identidad, sesión y ownership, **sin forzar un modelo de “herramienta totalmente privada”**.

La dirección correcta para este bloque es:

- **un recurso, una URL**
- **el dueño edita**
- **el no dueño solo lee**
- **la lectura ajena depende de visibilidad por link**

---

## Decisiones fijas

- este bloque ocurre al final;
- primero se adapta lo que ya persiste datos;
- `papers-review` es prioritario, pero no es la única herramienta a revisar si hay otras con persistencia;
- el mismo link del recurso debe servir para lectura y edición;
- NO se introducirán links separados para leer y editar en este sprint;
- NO se implementará todavía colaboración en edición entre múltiples usuarios;
- el modo lectura para no dueños será **readonly**;
- el acceso readonly de terceros depende de una política simple de visibilidad, no de invitaciones complejas.

---

## Alcance

Este bloque SÍ incluye:

- adaptación funcional de herramientas persistentes al contexto multiusuario;
- ajuste de queries, repositorios, APIs y UX donde aplique;
- incorporación de un modo de visualización readonly para no dueños;
- incorporación de una política simple de visibilidad por recurso;
- validación de que cada herramienta use solo datos del usuario autenticado cuando se trata de edición;
- validación de que un tercero solo pueda leer si la visibilidad lo permite.

Este bloque NO incluye:

- nuevas features grandes de dominio;
- expansión del roadmap académico de `papers-review`;
- permisos complejos entre usuarios;
- comentarios, invitaciones o colaboración simultánea estilo Overleaf;
- control fino por listas de usuarios;
- links especiales distintos del recurso base.

---

## Tareas de implementación

1. Identificar herramientas que persisten datos y que deberían poder compartirse en lectura.
2. Priorizar `graph` y `papers-review`.
3. Definir en cada herramienta:
   - qué entidad es el recurso raíz;
   - cuál es su URL estable;
   - qué parte es editable;
   - qué parte puede mostrarse en readonly.
4. Incorporar un campo de visibilidad simple por recurso, por ejemplo:
   - `private`
   - `link-readonly`
5. Ajustar consultas y mutaciones al ownership.
6. Hacer que el mismo recurso se resuelva en dos modos:
   - dueño autenticado → edición
   - no dueño → lectura readonly si la visibilidad lo permite
7. Bloquear mutaciones para no dueños aunque puedan abrir la URL.
8. Revisar UX de cada herramienta en contexto autenticado y en contexto readonly.
9. Detectar supuestos single-tenant aún presentes y corregirlos.

---

## Estrategia recomendada por herramienta

## A. Graph

Este es el mejor candidato para aterrizar primero.

Dirección recomendada:

- cada grafo tiene una URL estable;
- el dueño autenticado lo abre como editor;
- un tercero lo abre como viewer readonly si está en `link-readonly`.

Qué conviene añadir:

- `visibility` en el recurso;
- resolución del grafo por `id`;
- bifurcación de UI:
  - editable si eres dueño;
  - solo lectura si no eres dueño.

## B. Papers Review

También puede compartirse, pero aquí hay más cuidado metodológico.

Dirección recomendada para este sprint:

- mantener URL estable por workspace;
- permitir lectura readonly por link solo si el workspace está marcado para ello;
- bloquear edición a no dueños;
- mantener fuera del sprint cualquier sistema de publicación avanzada o snapshot separada.

Regla importante:

en esta etapa el objetivo es habilitar lectura externa simple, NO resolver todavía la mejor experiencia académica final de publicación.

---

## Archivos probables a tocar

- módulos por herramienta en `src/components/`, `src/features/`, `src/lib/`, `src/app/api/`
- definición de tipos o modelos para visibilidad;
- rutas por recurso si hoy la herramienta depende demasiado de un listado interno.

---

## Criterios de aceptación

- cada herramienta persistente funciona con datos del usuario autenticado cuando el dueño edita;
- un no dueño no puede mutar recursos ajenos;
- un no dueño puede leer un recurso solo si la visibilidad lo permite;
- el mismo link del recurso funciona en modo edición o lectura según ownership;
- no quedan consultas principales asumiendo un único usuario global;
- `papers-review` opera sobre recursos propios del usuario cuando hay edición;
- no se agregaron todavía permisos complejos ni colaboración simultánea.

---

## Checklist de revisión humana

- verificar herramienta por herramienta qué cambió;
- verificar que `graph` y `papers-review` resuelvan bien dueño vs lector;
- verificar que `papers-review` ya opere con ownership correcto;
- verificar que la visibilidad esté modelada de forma simple y entendible;
- verificar que el mismo link cambie de modo sin duplicar rutas innecesarias;
- verificar que no se haya mezclado este bloque con colaboración en edición;
- verificar coherencia entre UI, API y persistencia.

---

## Cómo proceder de forma ordenada

Si vas a implementar este bloque, el orden recomendado dentro del bloque es:

### Paso 1 — introducir visibilidad simple

Agregar al recurso raíz algo como:

- `visibility: "private" | "link-readonly"`

Primero en `graph`, luego en `papers-review`.

### Paso 2 — resolver recurso por URL estable

Asegurarte de que la herramienta no dependa solo de “mis listados”, sino de una ruta estable por recurso.

### Paso 3 — separar lectura de mutación

La carga del recurso puede permitir readonly según visibilidad, pero las mutaciones deben seguir exigiendo ownership.

### Paso 4 — adaptar la UI

Mostrar claramente cuándo el usuario está:

- editando su recurso;
- o viendo el recurso de otro en modo lectura.

### Paso 5 — revisar copy y navegación

Evitar que la herramienta parezca editable cuando en realidad está en readonly.

---

## Nota de dirección

La idea NO es copiar todavía a Overleaf.

La idea correcta para este sprint es mucho más simple:

- URL única;
- ownership claro;
- lectura compartible;
- edición solo para el dueño.

Eso deja una base sana para crecer después si algún día quieres:

- comentarios;
- edición compartida;
- invitaciones;
- o permisos más finos.

---

## Regla de parada

Al terminar:

- presentar resumen de cierre del sprint;
- esperar validación humana final;
- solo después de esa aprobación puede abrirse el siguiente sprint.
