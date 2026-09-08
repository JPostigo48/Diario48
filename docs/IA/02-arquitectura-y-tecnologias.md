# Arquitectura y tecnologías

## Stack principal

Tecnologías verificadas en `package.json`:

- **Next.js 16.2.4**
- **React 19.2.4**
- **TypeScript 5**
- **Tailwind CSS 4**
- **Mongoose 9.5.0**
- **Cytoscape + react-cytoscapejs**

Además:

- `reactCompiler: true` en `next.config.ts`
- alias `@/* -> ./src/*` en `tsconfig.json`

## Estilo arquitectónico observable

No hay una separación hexagonal estricta, pero sí una división bastante clara por capas prácticas:

- **App/Routes** en `src/app`
- **Componentes de UI y páginas de herramienta** en `src/components`
- **Lógica de dominio / utilidades** en `src/lib`
- **Persistencia MongoDB / modelos** en `src/lib/db` y `src/lib/models`

Eso significa que la aplicación sigue una organización tipo:

1. **ruta**
2. **componente contenedor**
3. **lógica reusable**
4. **persistencia**

No es arquitectura enterprise formal, pero SÍ hay una separación suficiente para crecer sin mezclar todo en un solo archivo.

## Estructura principal

### `src/app`

Contiene:

- la landing principal;
- las rutas de herramientas;
- las APIs internas.

APIs detectadas:

- `/api/graphs`
- `/api/graphs/[id]`
- `/api/research/workspaces`
- `/api/research/workspaces/[id]`
- `/api/tictactoe/move`

### `src/components`

Agrupación por dominio:

- `landing`
- `graph`
- `research`
- `tictactoe`
- `ui`

Esto es una BUENA decisión. La agrupación por dominio reduce el caos mejor que una carpeta plana de componentes.

### `src/lib`

Agrupación de lógica y datos:

- `data` → contenido estático del portafolio
- `db` → conexión MongoDB
- `graph` → algoritmos, tipos, estilos y utilidades
- `models` → esquemas Mongoose
- `research` → tipos, defaults, validación y normalización
- `tictactoe` → estado del juego, engine y algoritmos

## Persistencia

### MongoDB

La conexión está centralizada en `src/lib/db/mongodb.ts`:

- lee `MONGODB_URI` desde variables de entorno;
- usa caché global de conexión;
- evita recrear conexiones en cada request.

### Modelos Mongoose

Modelos verificados:

- `Graph`
- `ResearchWorkspace`

#### `Graph`

Persistencia de:

- nombre y descripción;
- si es dirigido o no;
- nodos con posición y heurística;
- aristas con peso;
- nodo inicial y nodo objetivo.

#### `ResearchWorkspace`

Persistencia de:

- metadatos del proyecto;
- capas de investigación;
- papers;
- relaciones entre papers.

El modelo de `ResearchWorkspace` es el más rico del sistema. Ahí vive la mayor parte del valor de negocio actual.

## Renderizado y modo de ejecución

Observaciones verificadas:

- varias pantallas usan `"use client"`;
- las APIs exportan `dynamic = "force-dynamic"`;
- la UI depende de `localStorage` para tema;
- la interacción principal ocurre en cliente;
- el backend se usa para persistencia y cálculo puntual.

En otras palabras:

- **frontend rico en estado local**;
- **backend ligero como capa de API interna**.

## Sistema visual

En `src/app/globals.css` hay:

- variables CSS para dark/light mode;
- tokens compartidos como `--bg`, `--tx`, `--acc`;
- una estética técnica/terminal/minimalista;
- tipografías `Sora` y `JetBrains Mono`.

Esto da coherencia visual entre landing y herramientas, aunque hay rastros de variables “legacy” del módulo de grafos.

## Convenciones técnicas visibles

- TypeScript en modo `strict`
- separación por dominio
- validación previa antes de persistir en APIs
- normalización de datos en el módulo de research
- uso de componentes contenedores grandes por herramienta

## Riesgos / deuda técnica detectada

### 1. Componentes muy grandes

`ResearchToolPage.tsx` y `GraphToolPage.tsx` concentran MUCHA responsabilidad:

- estado;
- fetch;
- reglas de interacción;
- mensajes;
- composición visual.

Funcionan, sí. Pero a mediano plazo esto dificulta pruebas, mantenimiento y cambios finos.

### 2. Duplicidad potencial en landing

Hay una implementación de landing en `src/app/page.tsx` y otra en `src/components/landing/LandingPage.tsx`. Eso suele ser una señal de refactor incompleto o experimento no retirado.

### 3. Backend acoplado al frontend

Las APIs están pensadas solo para esta UI. Eso no es malo para un proyecto personal, pero implica menor reutilización si mañana quieres exponer estos datos a otros clientes.
