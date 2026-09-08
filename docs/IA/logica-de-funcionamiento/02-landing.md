# Landing principal

## Archivo principal

`src/app/page.tsx`

## Qué hace realmente

La landing NO funciona como un sitio marketing clásico con varias rutas públicas. Funciona más como una **interfaz contenedora** con paneles internos.

## Estado principal

Mantiene:

- `panel` → panel activo;
- `theme` → tema visual actual, sincronizado desde el hook compartido.

## Flujo de funcionamiento

1. La pantalla carga con el panel `home`.
2. `LandingNav` permite cambiar de panel.
3. `LandingSidebar` también permite cambiar de panel.
4. El contenido central renderiza un panel según el valor actual de `panel`.
5. El usuario puede alternar tema desde la navegación.

## Paneles detectados

- `home`
- `projects`
- `university`
- `personal`
- `about`
- `tools`

## Idea arquitectónica

Aquí la navegación principal es **por estado**, no por router.

Eso tiene ventajas:

- experiencia rápida;
- menos complejidad de rutas;
- sensación de shell interna.

Y también tiene tradeoff:

- URLs menos expresivas para cada subsección;
- menor deep-linking;
- más estado concentrado en una sola página.

## Componentes relevantes

- `src/components/landing/LandingNav.tsx`
- `src/components/landing/LandingSidebar.tsx`
- `src/components/landing/panels/HomePanel.tsx`
- `src/components/landing/panels/ProjectsPanel.tsx`
- `src/components/landing/panels/UniversityPanel.tsx`
- `src/components/landing/panels/PersonalPanel.tsx`
- `src/components/landing/panels/AboutPanel.tsx`
- `src/components/landing/panels/ToolsRedirectPanel.tsx`

## Observación importante

Existe también `src/components/landing/LandingPage.tsx`, pero en la revisión previa no se detectaron referencias activas. La entrada real sigue siendo `src/app/page.tsx`.
