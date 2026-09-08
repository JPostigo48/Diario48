# Bloque 05 — puntuación manual y ajustes de biblioteca

## Objetivo

Hacer operativa la puntuación manual de canciones dentro de la biblioteca y ajustar la UI para que conviva con la importación real.

---

## Tareas de implementación

1. Conectar la puntuación manual al modelo `Song.rating`.
2. Permitir editar rating desde:
   - detalle de canción;
   - y si conviene, desde la biblioteca maestra.
3. Validar rango y persistencia.
4. Reflejar rating en reportes básicos.
5. Revisar si conviene agregar:
   - “favorita real”
   - nota personal
   - o ambos
   dentro del mismo ajuste de biblioteca.

---

## Consideraciones UX

- la puntuación debe sentirse rápida;
- no debe abrir un flujo pesado;
- debe quedar visible que es una decisión manual del usuario.

---

## Criterios de aceptación

- el usuario puede puntuar canciones de su biblioteca;
- el rating se persiste correctamente;
- la UI lo expone de forma simple y usable;
- queda lista la base para futuros modelos de preferencia y recomendación.
