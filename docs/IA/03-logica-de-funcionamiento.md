# Lógica de funcionamiento

## Idea

Antes tenías toda la lógica funcional en un solo archivo. Eso sirve para una vista rápida, pero NO para entender de verdad cómo opera cada parte del proyecto.

Por eso ahora esta sección se desglosa en una carpeta dedicada:

- `logica-de-funcionamiento/00-indice.md`
- `logica-de-funcionamiento/01-flujo-general.md`
- `logica-de-funcionamiento/02-landing.md`
- `logica-de-funcionamiento/04-sesiones-y-multiusuario.md`
- `logica-de-funcionamiento/06-tema-y-experiencia-cliente.md`
- `logica-de-funcionamiento/proyectos/`

## Cómo leer esta sección

### Si quieres entender el proyecto completo

1. `logica-de-funcionamiento/01-flujo-general.md`
2. `logica-de-funcionamiento/02-landing.md`
3. `logica-de-funcionamiento/04-sesiones-y-multiusuario.md`
4. `logica-de-funcionamiento/proyectos/graph-visualizer/00-resumen.md`
5. `logica-de-funcionamiento/proyectos/papers-review/00-indice.md`
6. `logica-de-funcionamiento/proyectos/tic-tac-toe-ai/00-resumen.md`

### Si quieres entender solo una función o mini proyecto

- landing principal → `logica-de-funcionamiento/02-landing.md`
- sesiones y multiusuario → `logica-de-funcionamiento/04-sesiones-y-multiusuario.md`
- visualizador de grafos → `logica-de-funcionamiento/proyectos/graph-visualizer/00-resumen.md`
- papers review → `logica-de-funcionamiento/proyectos/papers-review/00-indice.md`
- tic-tac-toe con IA → `logica-de-funcionamiento/proyectos/tic-tac-toe-ai/00-resumen.md`
- tema y comportamiento cliente → `logica-de-funcionamiento/06-tema-y-experiencia-cliente.md`

## Resumen conceptual

- **landing** = shell principal de navegación
- **graph visualizer** = laboratorio visual de algoritmos
- **papers review** = organizador de literatura académica
- **tic-tac-toe AI** = sandbox de algoritmos adversariales

## Recomendación de documentación

Esta estructura es mejor porque separa:

- flujo general;
- navegación;
- herramientas;
- comportamiento transversal.

Eso hace que mañana puedas ampliar un módulo sin destruir la claridad del resto.
