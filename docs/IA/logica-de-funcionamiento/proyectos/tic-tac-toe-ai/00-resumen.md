# Tic-Tac-Toe AI

## Archivo principal

`src/components/tictactoe/TicTacToePage.tsx`

## Qué resuelve

Este mini proyecto permite jugar contra una IA y probar distintas implementaciones de algoritmos adversariales.

## Flujo principal

1. El humano hace clic en una celda.
2. La UI valida si la jugada todavía es posible.
3. Aplica la jugada localmente.
4. Si el juego sigue activo, llama al backend.
5. El backend valida el payload.
6. El engine selecciona el algoritmo correspondiente.
7. La respuesta devuelve el tablero actualizado.

## API involucrada

- `POST /api/tictactoe/move`

## Dispatcher del engine

Verificado en `src/lib/tictactoe/engine.ts`.

Variantes detectadas:

- `minimax`
- `minimax-professor`
- `alpha-beta`
- `alpha-beta-professor`

## Lógica de dominio

Módulos importantes:

- `src/lib/tictactoe/gameState.ts`
- `src/lib/tictactoe/engine.ts`
- `src/lib/tictactoe/minimax.ts`
- `src/lib/tictactoe/minimax_first.ts`
- `src/lib/tictactoe/alphaBeta.ts`
- `src/lib/tictactoe/types.ts`

## Idea arquitectónica

La UI no implementa directamente la IA. Eso es correcto.

La pantalla:

- representa el tablero;
- gestiona turnos;
- muestra estado;
- delega la jugada de la IA al backend.

El backend:

- valida;
- resuelve el algoritmo;
- devuelve el nuevo estado.

Eso mantiene una separación razonable entre interfaz y motor de juego.
