# Tema y experiencia cliente

## Qué es transversal en este proyecto

No toda la lógica pertenece a un mini proyecto específico. Hay comportamientos que cruzan toda la web.

El más claro aquí es el manejo de tema.

## Tema visual

Actualmente el proyecto usa:

- variables CSS globales;
- tema `dark` y `light`;
- sincronización cliente mediante hook compartido.

Archivos relevantes:

- `src/app/globals.css`
- `src/components/ui/useThemeMode.ts`
- `src/components/ui/ThemeHydrator.tsx`
- `src/components/ui/ThemeSwitcher.tsx`

## Flujo actual del tema

1. El servidor entrega el documento con tema base.
2. El cliente hidrata la app.
3. `ThemeHydrator` revisa `localStorage`.
4. Si hay tema persistido, actualiza `data-theme`.
5. Los componentes consumidores leen el tema desde el hook compartido.

## Por qué importa

Aquí hubo un problema real de hidratación.

La lección es simple: NO debes mezclar SSR con lecturas tempranas del DOM como si nada. Primero entiendes el flujo de render, luego escribes la solución.

## Tradeoff actual

### Ventaja

- reduce riesgo de hydration mismatch;
- centraliza la lógica del tema.

### Costo

- puede haber un pequeño flash visual al cargar si el tema persistido no coincide con el tema inicial del servidor.

## Mejora futura correcta

Si quieres resolverlo de forma más sólida:

- guardar el tema en cookie;
- leerlo en servidor;
- renderizar SSR ya con el tema correcto.

Eso mejoraría:

- consistencia SSR/cliente;
- experiencia visual;
- robustez arquitectónica.
