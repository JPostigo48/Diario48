# Flujo general de la aplicación

## Punto de entrada

La aplicación arranca en `src/app/layout.tsx`.

Responsabilidades verificadas:

- definir metadata global;
- cargar tipografías;
- renderizar el árbol principal;
- montar el hidratador de tema en cliente.

## Estructura general del funcionamiento

A nivel conceptual, el proyecto opera así:

1. **layout global** prepara el documento.
2. **ruta actual** renderiza una landing o una herramienta.
3. **cada herramienta** administra su propio estado cliente.
4. **las APIs internas** resuelven persistencia o lógica de backend.
5. **MongoDB** persiste los módulos que lo necesitan.

## Dos tipos de comportamiento

### 1. Interacción puramente cliente

Ejemplos:

- cambio de panel en la landing;
- cambio de tema;
- reproducción de pasos en grafos;
- selección de vista y filtros locales.

### 2. Interacción cliente + backend interno

Ejemplos:

- guardar/cargar grafos;
- cargar/crear/actualizar workspaces de research;
- pedir la jugada de la IA en tic-tac-toe.

## Módulos funcionales

Los mini proyectos o funciones principales de la web son:

- landing principal;
- graph visualizer;
- papers review;
- tic-tac-toe AI.

Cada uno tiene su propia lógica, pero todos siguen el mismo patrón:

- componente cliente grande;
- estado local;
- utilidades de dominio en `src/lib`;
- API interna si necesitan persistencia o cálculo server-side.
