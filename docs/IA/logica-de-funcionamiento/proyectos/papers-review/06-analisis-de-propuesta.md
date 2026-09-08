# Papers Review — análisis de la propuesta

## Objetivo de este documento

Este informe describe **qué habría que cambiar en el proyecto actual** para llevar `papers-review` desde su estado presente hacia la ruta planteada en `05-propuesta.md`.

Importante:

- este documento **NO implementa** cambios;
- este documento **NO redefine** todavía el sistema final;
- este documento identifica brechas, impactos y una posible ruta de evolución.

---

## 1. Diagnóstico general

## Lo que el proyecto ya tiene

Hoy `papers-review` YA cuenta con una base útil:

- gestión de workspaces;
- gestión de papers;
- capas temáticas;
- relaciones entre papers;
- filtros;
- vista de grafo;
- importación y exportación JSON;
- persistencia más normalizada;
- separación inicial por features internas.

Además, ya existe una decisión arquitectónica correcta:

- **paper canónico global**
- **uso específico del paper dentro de cada workspace**

Eso está ALINEADO con la propuesta, porque la propuesta exige distinguir:

- datos globales del paper;
- datos dependientes del proyecto.

## Lo que todavía NO tiene

Lo que falta es lo más importante desde el punto de vista conceptual:

el sistema actual sigue siendo principalmente un **gestor de papers enriquecido**, mientras que la propuesta pide un **sistema guiado por el flujo académico completo**.

Esa diferencia es la clave.

No se trata de “agregar más campos”.  
Se trata de cambiar el eje del producto:

- de almacenar papers
- a conducir una revisión bibliográfica por fases, decisiones y matrices.

---

## 2. Brecha principal entre estado actual y propuesta

La propuesta introduce una lógica que hoy no está modelada de forma nativa:

1. definición formal del proyecto;
2. criterios de inclusión y exclusión;
3. estrategia de búsqueda;
4. candidatos vs papers aprobados;
5. preselección rápida;
6. matriz de selección bibliográfica;
7. promoción controlada a síntesis;
8. matriz de síntesis técnica;
9. clasificación analítica por rol;
10. detección de vacíos;
11. exportaciones pensadas para escritura académica.

Hoy varios de esos conceptos podrían simularse con campos manuales, pero ESO NO ES LO MISMO que tenerlos como parte del dominio.

Si el dominio no los modela, la UI termina siendo ambigua, los datos se mezclan y el sistema no guía el proceso.

---

## 3. Qué habría que cambiar en el modelo de dominio

## 3.1. Elevar `workspace` a `proyecto de revisión`

Hoy el `workspace` sirve como contenedor funcional.  
Para seguir la propuesta, debería evolucionar conceptualmente a un **proyecto de revisión bibliográfica**.

Debería incorporar de forma explícita:

- problema de investigación;
- alcance;
- preguntas de investigación;
- palabras clave;
- criterios de inclusión;
- criterios de exclusión;
- estado del proyecto;
- fase actual;
- observaciones generales.

### Implicación

El `workspace` actual es insuficiente como modelo académico.  
Sirve como contenedor técnico, pero no como unidad metodológica completa.

---

## 3.2. Separar mejor las entidades del proceso

La propuesta no pide una sola ficha grande por paper.  
Pide ENTIDADES DISTINTAS para momentos distintos del análisis.

Habría que introducir, como mínimo, estas piezas:

### A. Proyecto

Ya existe parcialmente como `workspace`, pero necesita más estructura metodológica.

### B. Estrategia de búsqueda

Nueva entidad o submódulo para guardar:

- fuentes consultadas;
- cadenas de búsqueda;
- combinaciones de keywords;
- fechas de búsqueda;
- notas sobre cobertura.

### C. Candidato de paper dentro del proyecto

Hoy el vínculo workspace-paper ya existe, pero todavía no distingue con claridad entre:

- paper apenas registrado;
- paper preseleccionado;
- paper evaluado;
- paper promovido a síntesis.

La propuesta exige que ese ciclo de vida sea formal.

### D. Evaluación de selección

Nueva entidad o subdocumento separado para registrar:

- criterios;
- puntajes;
- justificaciones;
- decisión final;
- fecha de evaluación.

### E. Ficha de síntesis

Nueva entidad o subdocumento independiente del registro básico del paper.

Debe guardar el análisis profundo:

- problema;
- método;
- dataset;
- métricas;
- resultados;
- limitaciones;
- trabajos futuros;
- valor para el proyecto.

### F. Clasificación analítica

Hoy existen categoría y subcategoría, pero la propuesta pide una capa analítica más rica:

- núcleo;
- metodológico;
- contexto;
- frontera;
- seminal;
- benchmark;
- puente;
- pivote.

Eso merece modelo propio o, al menos, estructura más formal que un simple texto libre.

### G. Hallazgos / vacíos / patrones

Hoy NO existe una entidad clara para registrar hallazgos analíticos del proyecto:

- limitaciones repetidas;
- benchmarks dominantes;
- ausencia de datasets;
- huecos metodológicos;
- oportunidades de investigación.

Si la herramienta quiere ayudar a construir estado del arte, esta capa debe existir.

---

## 4. Qué habría que cambiar en persistencia

## 4.1. La normalización actual es buena, pero no suficiente

La persistencia ya mejoró al separar:

- workspace;
- paper;
- relation;
- layer.

Eso está BIEN, pero la propuesta exige una normalización semántica mayor.

### Harían falta nuevas entidades persistidas

Como mínimo:

- `research-project-definition`
- `research-search-strategy`
- `research-paper-selection`
- `research-paper-synthesis`
- `research-paper-classification`
- `research-project-insight` o `research-gap-finding`

No necesariamente con esos nombres exactos, pero sí con esa responsabilidad separada.

## 4.2. Mantener el paper canónico global

Esto NO debería revertirse.  
Al contrario: es una de las mejores decisiones actuales.

La propuesta refuerza precisamente esta idea:

- datos globales del paper viven una vez;
- evaluación, rol, relevancia y notas profundas dependen del proyecto.

### Conclusión

La arquitectura correcta NO es “herencia” en sentido POO.  
Es una **separación entre entidad canónica compartida y contexto de uso por proyecto**.

## 4.3. Crear modelos por fase o capacidades

Hoy muchos campos viven todavía “pegados” al paper agregado del workspace.  
Para seguir la propuesta habría que desacoplar:

- registro inicial;
- evaluación bibliográfica;
- síntesis técnica;
- clasificación analítica.

Eso reduce mezcla de responsabilidades y permite validar mejor cada fase.

---

## 5. Qué habría que cambiar en lógica de negocio

## 5.1. Pasar de CRUD general a workflow explícito

Hoy la lógica principal permite:

- crear;
- editar;
- borrar;
- filtrar;
- visualizar.

Eso es CRUD enriquecido.

La propuesta exige workflow:

- registrar candidato;
- preseleccionar;
- evaluar;
- decidir;
- promover;
- sintetizar;
- clasificar;
- conectar;
- analizar vacíos;
- exportar.

### Consecuencia

Las operaciones del sistema ya no deberían pensarse solo como “guardar paper”, sino como **transiciones de estado con reglas**.

## 5.2. Definir máquina de estados para papers dentro del proyecto

La propuesta sugiere estados como:

- registrado;
- en preselección;
- preseleccionado;
- evaluado;
- descartado;
- contextual;
- promovido a síntesis;
- sintetizado;
- clasificado;
- conectado;
- citado.

Eso implica:

- reglas de transición;
- validaciones;
- acciones habilitadas por estado;
- indicadores de progreso.

## 5.3. Definir criterios configurables de selección

Hoy no existe una matriz formal de selección.  
Para alinearse con la propuesta haría falta:

- catálogo de criterios;
- escala de puntuación;
- pesos opcionales;
- comentarios justificativos;
- score total;
- decisión final.

Esto es un cambio de dominio, no solo de UI.

## 5.4. Definir la promoción a síntesis como evento de negocio

La propuesta insiste en algo MUY importante:

no todos los papers deben pasar a síntesis profunda.

Eso significa que el sistema debe tener una operación explícita:

- `promotePaperToSynthesis`

Y esa operación debería exigir condiciones mínimas, por ejemplo:

- haber sido evaluado;
- tener decisión compatible;
- tener justificación suficiente.

## 5.5. Separar inferencias automáticas de decisiones humanas

El grafo actual ya infiere relaciones por coincidencias.  
Eso está bien, pero la propuesta pide distinguir entre:

- relaciones manuales;
- relaciones inferidas;
- relevancia académica;
- decisiones de análisis humano.

La inferencia automática NO debería decidir por sí sola qué paper es central o qué gap existe.

---

## 6. Qué habría que cambiar en la UI y experiencia de uso

## 6.1. De una herramienta centrada en listado a una centrada en fases

La UI actual gira bastante alrededor de:

- listado de papers;
- edición;
- filtros;
- tabla;
- grafo.

La propuesta requiere una navegación por módulos o etapas:

1. definición del proyecto;
2. búsqueda e ingesta;
3. preselección;
4. matriz de selección;
5. síntesis;
6. clasificación;
7. mapa y relaciones;
8. hallazgos y gaps;
9. exportación.

## 6.2. Crear vistas especializadas

Habría que diseñar vistas separadas, no solo un componente principal grande.

Mínimo:

- panel de definición del proyecto;
- panel de estrategia de búsqueda;
- bandeja de candidatos;
- tablero de preselección;
- matriz de selección;
- matriz de síntesis;
- módulo de clasificación analítica;
- módulo de hallazgos/gaps;
- exportador académico.

## 6.3. Reducir más la responsabilidad de `ResearchToolPage.tsx`

Esto es CRÍTICO.

Hoy ya está documentado que ese componente concentra mucha lógica.  
La propuesta volvería ese problema todavía peor si se siguiera extendiendo allí.

Antes de crecer funcionalmente, habría que separar mucho mejor:

- containers por módulo;
- componentes presentacionales;
- hooks de estado;
- casos de uso;
- mapeadores entre API y UI.

Si no haces eso, la propuesta se convertiría en una maraña inmantenible.

---

## 7. Qué habría que cambiar en la API

## 7.1. Pasar de endpoints gruesos a endpoints por capacidad

La persistencia ya va en esa dirección, pero la API aún puede afinarse mucho.

Para seguir la propuesta, serían necesarios endpoints o handlers específicos para:

- definición del proyecto;
- estrategia de búsqueda;
- candidatos;
- evaluaciones de selección;
- promociones a síntesis;
- fichas de síntesis;
- clasificaciones analíticas;
- hallazgos o gaps;
- exportaciones académicas.

## 7.2. Exponer operaciones semánticas, no solo mutaciones genéricas

Ejemplos conceptuales:

- crear proyecto;
- registrar candidato;
- evaluar paper;
- descartar paper;
- conservar como contexto;
- promover a síntesis;
- guardar síntesis;
- clasificar paper;
- registrar gap;
- exportar matriz de selección.

Eso expresa mejor el dominio que un simple “update workspace”.

---

## 8. Qué habría que cambiar en importación y exportación

## 8.1. Importación

Hoy la importación/exportación está centrada en JSON del workspace.

La propuesta pediría ampliar la importación para soportar mejor:

- DOI;
- BibTeX;
- lotes de candidatos;
- datasets bibliográficos externos;
- referencias desde metadatos externos.

## 8.2. Exportación académica real

La exportación debería dejar de ser solo “snapshot del workspace”.

Debería poder sacar artefactos útiles como:

- matriz de selección;
- matriz de síntesis;
- lista de papers por rol;
- papers descartados con motivo;
- resumen de hallazgos;
- bibliografía estructurada;
- tablas Markdown o CSV listas para documentos.

---

## 9. Qué habría que cambiar en el grafo

## 9.1. El grafo actual es una buena base visual, pero no la propuesta completa

Hoy el grafo mezcla:

- relaciones explícitas;
- afinidades inferidas.

La propuesta exige una capa más rica:

- papers principales aprobados;
- referencias compartidas;
- referencias puente;
- referencias directas relevantes;
- periferia colapsada.

## 9.2. Habría que incorporar citaciones y referencias

Eso implica nuevas capacidades:

- almacenar referencias bibliográficas de cada paper;
- resolver identificadores;
- deduplicar referencias;
- distinguir papers del proyecto vs referencias externas;
- calcular score estructural de referencias.

## 9.3. Habría que evitar un grafo decorativo

La propuesta es clara en esto: el grafo debe servir para análisis.

Por tanto, habría que añadir:

- reglas de visibilidad;
- niveles de expansión;
- señales de centralidad;
- sugerencias de papers puente;
- posible promoción de referencias a candidatos.

---

## 10. Qué habría que cambiar en detección de gaps

Hoy no existe realmente este módulo.

Para que exista de verdad, haría falta:

- estructura para registrar limitaciones de papers;
- taxonomía o categorías analíticas comparables;
- agregación por patrones;
- panel que resuma recurrencias;
- posibilidad de registrar interpretación humana del gap.

Aquí hay un punto importante:

un gap académico NO debe salir solo de automatización.  
La herramienta puede sugerir patrones, pero la interpretación final debe seguir siendo del investigador.

---

## 11. Compatibilidad con lo ya construido

## Qué sí se puede reutilizar

La propuesta NO exige rehacer todo desde cero.

Se pueden reutilizar bastante bien:

- paper canónico global por DOI;
- vínculo paper-proyecto;
- workspaces como base del concepto de proyecto;
- layers como posible apoyo temático;
- relaciones manuales;
- filtros;
- import/export base;
- parte del grafo actual;
- separación inicial por features.

## Qué probablemente habría que reconceptualizar

- `workspace` como simple contenedor;
- `paper` del workspace como ficha única;
- edición plana de todos los campos del paper;
- flujo libre sin estados ni promociones;
- grafo basado solo en afinidades;
- exportación centrada solo en JSON.

---

## 12. Riesgos de seguir la propuesta sin una refactorización previa

Si intentaras agregar la propuesta encima de la estructura actual SIN refactor más profundo, pasarían estas cosas:

- `ResearchToolPage.tsx` crecería todavía más;
- el modelo se volvería ambiguo;
- campos de selección y síntesis se mezclarían;
- sería difícil validar estados;
- la UI perdería claridad;
- la API terminaría siendo un patchwork de excepciones.

Dicho claro:  
SERÍA UN ERROR construir la propuesta solo “añadiendo campos”.

La propuesta necesita una evolución de dominio y de arquitectura.

---

## 13. Ruta de cambio recomendada

## Etapa 1 — consolidar el dominio actual

Antes de abrir más funcionalidades:

- terminar de separar lógica fuera de `ResearchToolPage.tsx`;
- formalizar mejor el modelo `project/workspace`;
- consolidar endpoints por entidad/capacidad;
- estabilizar contratos entre UI, API y repositorio.

## Etapa 2 — introducir workflow académico mínimo

Después:

- agregar fases del proyecto;
- agregar estados del paper;
- crear preselección;
- crear evaluación de selección;
- crear decisión de promoción a síntesis.

## Etapa 3 — introducir síntesis y clasificación

Luego:

- ficha de síntesis separada;
- clasificación analítica por rol;
- tablero de distribución por estados y roles.

## Etapa 4 — enriquecer grafo y referencias

Más adelante:

- referencias bibliográficas;
- nodos puente;
- referencias compartidas;
- expansión controlada;
- sugerencias de candidatos.

## Etapa 5 — capa analítica y exportación académica

Finalmente:

- hallazgos y gaps;
- reportes de patrones;
- exportaciones académicas especializadas.

---

## 14. Conclusión ejecutiva

La propuesta es buena, pero representa un cambio de NIVEL, no un ajuste menor.

Hoy `papers-review` está más cerca de:

- un gestor estructurado de papers por proyecto

que de:

- un sistema guiado para construir estado del arte.

Para tomar la ruta de la propuesta, habría que cambiar principalmente:

1. **el modelo de dominio**, para representar fases, evaluaciones, síntesis y hallazgos;
2. **la lógica de negocio**, para pasar de CRUD a workflow académico;
3. **la UI**, para organizarse por módulos metodológicos;
4. **la API y persistencia**, para separar entidades del proceso;
5. **el grafo y las exportaciones**, para servir al análisis académico real.

La buena noticia es esta:

el trabajo ya hecho NO está mal encaminado.  
De hecho, la separación entre paper canónico global y uso por workspace es una base MUY valiosa para la propuesta.

Lo que toca ahora no es improvisar más campos, sino decidir una evolución arquitectónica consciente.

---

## Recomendación final

Si esta propuesta se va a adoptar de verdad, el siguiente paso correcto NO es implementar pantallas sueltas.

El siguiente paso correcto sería producir primero:

- un diseño de dominio objetivo;
- un mapa de entidades;
- un workflow formal de estados;
- y una estrategia de migración desde el modelo actual.

Sin eso, la implementación se volvería reactiva y desordenada.
