# Bloque 02 — sesiones y autenticación

## Objetivo

Construir el acceso funcional por email y contraseña, junto con una sesión válida que permita resolver al usuario actual desde el servidor.

---

## Decisiones fijas

- login por email + contraseña;
- sin Google login en este sprint;
- sin roles;
- la sesión debe resolverse del lado servidor;
- debe existir helper central tipo `getCurrentUser`.

---

## Alcance

Este bloque SÍ incluye:

- endpoint o flujo de login;
- verificación de contraseña;
- creación de sesión;
- lectura de sesión en servidor;
- logout;
- helper reutilizable para usuario actual.

Este bloque NO incluye:

- ownership en entidades de negocio;
- protección completa de todas las APIs privadas;
- UI final completa;
- proveedores externos de identidad.

---

## Tareas de implementación

1. Definir mecanismo de sesión del proyecto.
2. Implementar login con email + contraseña.
3. Implementar validación segura de credenciales.
4. Crear persistencia o transporte de sesión.
5. Implementar logout.
6. Crear helper de servidor para resolver usuario autenticado.
7. Definir comportamiento cuando no hay sesión válida.

---

## Archivos probables a tocar

- rutas API de autenticación
- utilidades de servidor para autenticación
- helpers de cookies/sesión
- modelos o almacenamiento auxiliar si aplica

---

## Criterios de aceptación

- un usuario válido puede iniciar sesión;
- una credencial inválida se rechaza correctamente;
- el sistema puede resolver usuario actual del lado servidor;
- existe logout funcional;
- la lógica de autenticación no está dispersa en muchos componentes cliente.

---

## Checklist de revisión humana

- verificar que login y logout existan;
- verificar que el helper central de usuario actual sea reutilizable;
- verificar que el servidor pueda distinguir sesión válida de inválida;
- verificar que este bloque no toque todavía ownership de herramientas.

---

## Regla de parada

Al terminar:

- presentar resumen de cambios;
- esperar revisión humana;
- no continuar al bloque 03 sin aprobación.
