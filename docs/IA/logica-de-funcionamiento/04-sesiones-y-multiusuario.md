# Sesiones y multiusuario — lógica de funcionamiento

## Objetivo

Este documento explica **cómo debe entenderse la lógica de sesiones y multiusuario a nivel global del proyecto**, no solo dentro de `papers-review`.

Aquí NO se define el paso a paso de implementación.  
Aquí se define la lógica transversal que afecta a cualquier herramienta que persista información por usuario.

El plan de implementación vive aparte en:

- `../sprints/01-sesiones/`

---

## 1. Problema que resuelve

Hoy la aplicación está pensada, en la práctica, como si existiera un único usuario implícito.

Eso funciona mientras el sistema sea personal o local, pero deja de tener sentido cuando la web pasa a ser pública y varias personas quieren:

- entrar con su cuenta;
- guardar sus propios datos;
- usar herramientas distintas;
- recuperar su información después;
- y no ver ni tocar datos ajenos.

Por eso, la lógica de sesiones NO pertenece a una sola herramienta.  
Pertenece al comportamiento transversal de toda la plataforma.

---

## 2. Qué significa “sesiones” en este proyecto

En este contexto, sesiones significa:

- identificar al usuario actual;
- mantener autenticación entre peticiones;
- usar esa identidad para resolver qué datos puede consultar;
- y aislar sus recursos frente a otros usuarios.

O sea: la sesión no es solo un login visible.  
Es el puente entre identidad, persistencia y autorización.

---

## 3. Conceptos que deben mantenerse separados

Este punto es CRÍTICO.

## 3.1. Identidad

Responde:

- quién es el usuario.

## 3.2. Sesión

Responde:

- cómo sabe el sistema que ese usuario ya está autenticado en esta petición.

## 3.3. Ownership

Responde:

- qué recursos pertenecen a ese usuario.

## 3.4. Autorización

Responde:

- qué acciones puede hacer sobre esos recursos.

Si mezclas estas cuatro piezas, el sistema se vuelve ambiguo y luego cuesta muchísimo escalarlo.

---

## 4. Regla general de la plataforma

Toda herramienta que guarde información personal debe operar con esta regla:

1. existe un usuario actual;
2. la sesión permite resolverlo;
3. los recursos privados tienen dueño;
4. las APIs filtran por dueño;
5. la UI representa solo el espacio del usuario autenticado.

Eso vale para:

- `papers-review`;
- cualquier futuro workspace;
- herramientas que guarden configuraciones;
- historiales personales;
- estados persistidos de uso.

---

## 5. Qué datos deberían ser privados y cuáles globales

No todo debe ser privado.  
Y no todo debe ser global.

La distinción correcta es por naturaleza del dato.

## 5.1. Datos privados

Son los que representan trabajo, decisiones o contexto propio de una persona.

Ejemplos:

- proyectos del usuario;
- notas personales;
- clasificaciones hechas por el usuario;
- relaciones creadas por el usuario;
- configuraciones personales;
- historiales de trabajo.

## 5.2. Datos globales

Son los que pueden existir una sola vez y reutilizarse entre usuarios sin comprometer privacidad.

Ejemplos:

- catálogos canónicos;
- metadatos bibliográficos base;
- referencias normalizadas;
- taxonomías compartidas;
- configuraciones públicas del sistema.

## 5.3. Datos mixtos o contextuales

Hay datos que no son puramente globales ni puramente privados, sino dependientes del contexto de uso.

Ejemplos:

- un paper global y su uso dentro de un proyecto concreto;
- una referencia compartida y la evaluación que un usuario hace de ella;
- un recurso base y sus anotaciones personales.

Aquí es donde una mala arquitectura suele romperse.

---

## 6. Aplicación transversal al proyecto

## 6.1. Papers Review

Debe separar:

- paper canónico global;
- proyecto/workspace del usuario;
- uso del paper dentro del proyecto;
- notas, clasificación y decisiones del usuario.

## 6.2. Otras herramientas

Toda herramienta futura debe responder estas preguntas desde el diseño:

- ¿este dato pertenece a un usuario?
- ¿es compartible?
- ¿es reutilizable globalmente?
- ¿depende de un workspace?
- ¿requiere autorización explícita?

Si eso no se define temprano, luego aparecen modelos mal acoplados.

---

## 7. Comportamiento esperado de las APIs

Desde la lógica funcional, toda API privada debería seguir este flujo:

1. resolver sesión;
2. obtener usuario actual;
3. validar que exista;
4. operar solo sobre recursos del usuario;
5. rechazar acceso no autorizado.

Eso implica que ya no debe existir la idea de:

- “traer todos los workspaces”;
- “editar cualquier recurso por id”;
- “borrar si existe”.

La pregunta correcta siempre es:

- ¿ese recurso pertenece al usuario autenticado?

---

## 8. Comportamiento esperado de la UI

La UI también cambia conceptualmente.

Ya no es una app local donde “todo está ahí”.

Pasa a ser una plataforma donde el usuario debe percibir:

- que está autenticado;
- que tiene su propio espacio;
- que sus herramientas guardan su propio trabajo;
- que existe separación frente a otros usuarios.

Eso impacta cosas como:

- vista de login/logout;
- estado de usuario actual;
- vacíos para primer uso;
- listas tipo “mis proyectos”;
- mensajes de acceso restringido;
- recuperación de contexto al volver.

---

## 9. Regla de diseño recomendada

Cuando agregues una nueva herramienta con persistencia, deberías documentar siempre:

1. qué entidad raíz pertenece al usuario;
2. qué datos son globales;
3. qué datos son contextuales;
4. qué endpoints requieren autenticación;
5. qué políticas mínimas de acceso existen.

Eso debería volverse una convención del proyecto.

---

## 10. Riesgo de no tratarlo como lógica transversal

Si sesiones se piensa solo dentro de una herramienta, ocurre esto:

- cada módulo inventa sus propias reglas;
- ownership queda inconsistente;
- la API se fragmenta;
- el modelo global se contamina;
- y luego cuesta unificar permisos y experiencia de usuario.

Por eso mover esta documentación fuera de `papers-review` tiene TODO el sentido.

---

## 11. Conclusión

La lógica de sesiones y multiusuario no es una feature aislada.  
Es una capa transversal del sistema.

Su responsabilidad es sostener:

- identidad;
- persistencia privada;
- separación entre usuarios;
- y consistencia de acceso en todas las herramientas.

`papers-review` es solo uno de los módulos impactados por esta lógica, no su dueño conceptual.

---

## Relación con otros documentos

- lógica transversal: `04-sesiones-y-multiusuario.md`
- plan de implementación: `../sprints/01-sesiones/`
- impacto específico en papers-review: `proyectos/papers-review/06-analisis-de-propuesta.md`
