# Bloque 04 — promoción a síntesis

## Objetivo

Convertir la promoción a síntesis en un evento de negocio explícito.

---

## Problema que resuelve

La propuesta insiste correctamente en que:

> no todos los papers deben pasar a síntesis profunda.

Entonces la herramienta necesita una frontera real entre:

- paper evaluado;
- paper promovido;
- paper listo para síntesis posterior.

---

## Tareas de implementación

1. Crear operación semántica tipo:
   - `promotePaperToSynthesis`
2. Definir precondiciones mínimas, por ejemplo:
   - existe evaluación;
   - existe decisión compatible;
   - existe justificación suficiente.
3. Registrar fecha o marca de promoción.
4. Reflejar en UI qué papers ya cruzaron esa frontera.
5. Evitar que la promoción sea un simple cambio libre de checkbox sin contexto.

---

## Qué NO hacer

- no mezclar todavía la ficha de síntesis completa aquí;
- no meter todos los campos profundos del paper en este bloque;
- no usar promoción automática solo por score sin decisión humana.

---

## Criterios de aceptación

- la promoción existe como operación de negocio real;
- solo puede ocurrir cuando corresponde;
- queda persistida claramente;
- la UI distingue bien entre seleccionado y promovido a síntesis.
