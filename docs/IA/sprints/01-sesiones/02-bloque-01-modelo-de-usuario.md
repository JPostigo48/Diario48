# Bloque 01 — modelo de usuario

## Objetivo

Crear la base mínima de identidad del sistema.

Al cerrar este bloque, el proyecto debe tener un concepto formal de usuario persistido en base de datos y un mecanismo inicial para garantizar que exista la cuenta base del sistema.

---

## Decisiones fijas

- el acceso inicial será por **email + contraseña escritos**;
- no se implementa Google login aquí;
- no hay roles;
- la primera cuenta debe ser:
  - email: `AUTH_BOOTSTRAP_EMAIL`
  - contraseña inicial: `AUTH_BOOTSTRAP_PASSWORD`

La contraseña no debe quedar como texto de uso normal en lógica de login.  
Debe tratarse como bootstrap temporal.

---

## Alcance

Este bloque SÍ incluye:

- modelo `User`;
- campos mínimos necesarios;
- unicidad por email;
- almacenamiento de contraseña de forma segura;
- estrategia de bootstrap para la primera cuenta.

Este bloque NO incluye:

- login funcional de UI;
- sesión;
- protección de APIs;
- roles;
- recuperación de contraseña.

---

## Tareas de implementación

1. Crear modelo persistente de usuario.
2. Definir campos mínimos, por ejemplo:
   - `email`
   - `passwordHash`
   - `displayName` opcional o derivable
   - timestamps
3. Asegurar unicidad del email.
4. Normalizar email antes de guardar y consultar.
5. Introducir una utilidad segura para hash/verificación de contraseña.
6. Crear mecanismo de bootstrap del primer usuario administrador inicial.
7. Documentar claramente que el bootstrap es temporal.

---

## Archivos probables a tocar

- modelos en `src/lib/models/`
- utilidades de autenticación en `src/lib/`
- posible capa de bootstrap o inicialización en servidor
- documentación si se requiere reflejar el cambio

---

## Criterios de aceptación

- existe modelo de usuario persistente;
- email es único y normalizado;
- la contraseña NO se guarda en texto plano;
- existe forma reproducible de garantizar la cuenta inicial `AUTH_BOOTSTRAP_EMAIL`;
- el bloque no introduce todavía sesiones ni UI de login.

---

## Checklist de revisión humana

- verificar que el email esté normalizado;
- verificar que no se persista contraseña en texto plano;
- verificar que el bootstrap no cree duplicados;
- verificar que NO se mezclen aquí responsabilidades de sesión;
- verificar que el código siga simple y sin roles innecesarios.

---

## Regla de parada

Cuando este bloque termine:

- se presenta resumen de cambios;
- el humano revisa;
- NO se continúa al bloque 02 sin aprobación explícita.
