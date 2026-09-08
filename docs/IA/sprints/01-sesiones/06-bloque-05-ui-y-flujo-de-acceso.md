# Bloque 05 — UI y flujo de acceso

## Objetivo

Dar a la aplicación una interfaz mínima y coherente para login, logout y navegación privada basada en usuario autenticado.

---

## Decisiones fijas

- la UI debe reflejar identidad del usuario;
- el acceso inicial es por email y contraseña;
- no se implementa Google login aquí;
- no se diseña todavía un sistema complejo de perfiles o roles.

---

## Alcance

Este bloque SÍ incluye:

- pantalla o flujo de login;
- salida de sesión;
- estados vacíos o redirecciones para acceso restringido;
- UX mínima de “mi espacio”.

Este bloque NO incluye:

- rediseño completo de toda la aplicación;
- dashboards avanzados;
- administración de usuarios.

---

## Tareas de implementación

1. Definir entrada de login visible para el usuario.
2. Mostrar errores básicos de autenticación.
3. Permitir cerrar sesión.
4. Ajustar navegación para áreas privadas.
5. Mostrar estados adecuados cuando no hay acceso o no hay datos.

---

## Archivos probables a tocar

- `src/app/**`
- componentes de navegación o layout
- componentes de formularios de acceso

---

## Criterios de aceptación

- el usuario puede iniciar y cerrar sesión desde la UI;
- la app comunica adecuadamente estados sin sesión;
- las vistas privadas no se presentan como si fueran públicas;
- la UI no introduce aún complejidad innecesaria.

---

## Checklist de revisión humana

- verificar claridad del flujo de login;
- verificar logout visible y funcional;
- verificar estados sin sesión;
- verificar que la UX siga simple y consistente con el alcance.

---

## Regla de parada

Al terminar:

- presentar resumen;
- esperar aprobación humana;
- no continuar al bloque 06 sin aprobación.
