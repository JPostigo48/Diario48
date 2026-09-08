# Plan de sesiones y multiusuario

## Objetivo

Este documento funciona como **portada operativa del sprint**.

No contiene la implementación detallada de cada bloque.  
Su trabajo es fijar:

- decisiones ya cerradas;
- alcance del sprint;
- orden de ejecución;
- reglas que debe seguir cualquier agente que implemente;
- y el punto de control humano entre bloques.

La implementación detallada está separada en los archivos `02` a `07`.

---

## 1. Decisiones ya cerradas

Estas decisiones NO deben reabrirse durante este sprint:

### 1.1. Tipo de acceso inicial

- el acceso inicial será con **email y contraseña escritos**;
- NO se implementará login con Google en este sprint;
- a futuro sí podrá existir login con Gmail, pero queda fuera de alcance ahora.

### 1.2. Cuenta inicial del sistema

- email inicial: `AUTH_BOOTSTRAP_EMAIL`
- contraseña inicial: `AUTH_BOOTSTRAP_PASSWORD`

Esto debe tratarse como **bootstrap temporal**, no como diseño final de seguridad.

---

### 1.3. Roles

- por ahora NO habrá diferencia de roles;
- el sistema debe asumir un único tipo de usuario autenticado;
- el modelo puede quedar preparado para crecer después, pero NO debe introducir complejidad de roles ahora.

---

### 1.4. Alcance arquitectónico

- primero se construye base mínima de identidad, sesión y ownership;
- luego se adapta la persistencia y las APIs;
- después se ajusta la UI;
- y recién entonces se aterriza cada herramienta persistente.

### 1.5. Dirección ajustada después del bloque 05

Después de implementar hasta `06-bloque-05-ui-y-flujo-de-acceso.md`, la dirección del sprint queda refinada así:

- las herramientas persistentes NO deben pensarse como “solo privadas”;
- cada recurso debe tener **un dueño** y **una URL estable**;
- el mismo link debe servir tanto para lectura como para edición;
- si el usuario autenticado es el dueño, entra en modo edición;
- si no es el dueño, solo puede entrar en modo lectura;
- pero eso solo aplica si el recurso permite lectura por link;
- si el recurso no permite lectura por link y no eres el dueño, no hay acceso.

Esto evita introducir desde ya:

- links separados para leer y editar;
- sharing complejo por invitaciones;
- colaboración estilo Overleaf en este sprint.

La lógica base recomendada es:

- **URL única**
- **ownership**
- **visibilidad**
- **readonly para no dueño**

---

## 2. Resultado esperado del sprint

Al cerrar este sprint, el proyecto debería tener:

- modelo de usuario;
- autenticación por email + contraseña;
- sesión persistente válida;
- helper estándar para resolver usuario actual;
- recursos privados con `ownerId` o equivalente;
- APIs privadas protegidas;
- UI mínima de acceso y salida;
- herramientas persistentes adaptadas al nuevo contexto;
- base lista para que un recurso pueda abrirse con la misma URL en modo edición o lectura según ownership y visibilidad.

---

## 3. Qué queda fuera de alcance

En este sprint NO se debe implementar:

- Google login;
- recuperación de contraseña;
- verificación de email;
- roles;
- permisos por organización;
- sharing entre usuarios;
- colaboración en tiempo real;
- administración avanzada.

La regla es CLARA: primero base mínima funcional.

---

## 4. Orden de ejecución obligatorio

1. `02-bloque-01-modelo-de-usuario.md`
2. `03-bloque-02-sesiones-y-autenticacion.md`
3. `04-bloque-03-ownership-y-persistencia.md`
4. `05-bloque-04-proteccion-de-apis.md`
5. `06-bloque-05-ui-y-flujo-de-acceso.md`
6. `07-bloque-06-adaptacion-de-herramientas.md`

Ningún agente debe saltarse bloques.

---

## 5. Regla de ejecución por bloque

Cada bloque debe ejecutarse así:

1. el agente lee el MD del bloque;
2. implementa SOLO lo definido ahí;
3. deja un resumen de cambios realizados;
4. un humano revisa el resultado;
5. solo con aprobación humana se continúa al siguiente bloque.

Esto es IMPORTANTE porque evita que un agente “se lleve de encuentro” media arquitectura en una sola pasada.

---

## 6. Estructura mínima que debe tener cada bloque

Cada archivo de bloque debe poder ser usado como guía ejecutable por un agente.  
Por eso cada uno incluye:

- objetivo;
- decisiones fijas;
- alcance;
- tareas de implementación;
- archivos probables a tocar;
- criterios de aceptación;
- checklist de revisión humana;
- regla de parada.

Si un agente termina un bloque y los criterios no están cumplidos, NO debe continuar.

---

## 7. Justificación técnica del orden

Este orden no es arbitrario.

- primero identidad;
- luego sesión;
- luego ownership;
- luego protección de APIs;
- luego UI;
- luego adaptación de herramientas.

Si cambias el orden, aparecen refactors innecesarios o soluciones parche.

---

## 8. Recomendación final

La decisión correcta para tu futuro público es esta:

**primero base mínima de sesiones y multiusuario; después profundizar módulos específicos.**

Ese orden te da:

- menos retrabajo;
- mejor diseño de dominio;
- APIs más sanas;
- persistencia más correcta;
- mejor separación entre datos globales y privados.

## 8.1. Recomendación específica para compartir recursos

La recomendación para el cierre del sprint NO es introducir un “botón de compartir” complejo todavía.

La recomendación correcta para esta etapa es:

1. cada recurso persistente tiene una URL estable;
2. el dueño entra al mismo recurso en modo edición;
3. un no dueño entra al mismo recurso en modo lectura;
4. eso solo ocurre si el recurso está marcado como visible por link;
5. si el recurso sigue siendo privado, un no dueño no puede abrirlo.

Eso te da:

- UX simple;
- ownership claro;
- menos pasos innecesarios;
- y una base buena para crecer después a permisos más ricos si lo necesitas.

---

## 9. Nota importante de seguridad temporal

La cuenta inicial:

- `AUTH_BOOTSTRAP_EMAIL`
- `AUTH_BOOTSTRAP_PASSWORD`

solo existe como punto de arranque del sprint.

Un agente puede implementar ese bootstrap, pero debe dejar claro en el código y en la documentación que:

- es temporal;
- no equivale a un sistema final seguro;
- y más adelante deberá reemplazarse por credenciales reales, cambio de contraseña y mejoras de seguridad.
