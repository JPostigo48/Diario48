# Propuesta de herramienta web para sistematizar estado del arte y análisis bibliográfico

## 1. Propósito

Esta propuesta describe cómo debería ser una herramienta web pensada no solo para almacenar papers, sino para **guiar el proceso académico completo** de construcción del estado del arte.

La idea central es que la herramienta no funcione como una simple base de datos de artículos, sino como un sistema que acompañe fases reales del trabajo académico:

1. definición del proyecto,
2. estrategia de búsqueda,
3. preselección de papers,
4. matriz de selección bibliográfica,
5. matriz de síntesis técnica,
6. clasificación y conexión de papers,
7. detección de vacíos,
8. construcción del estado del arte narrado.

En otras palabras, la herramienta debe modelar el **flujo intelectual de la revisión bibliográfica**, no solo acumular información.

---

## 2. Problema que resuelve

Muchas herramientas de revisión de papers permiten guardar demasiados campos, enlaces y notas, pero no obligan a pensar de forma sistemática. El resultado suele ser:

- mucha información suelta,
- notas difíciles de comparar,
- papers guardados sin criterio claro,
- falta de separación entre selección y síntesis,
- y ausencia de una lógica clara para detectar el gap de investigación.

La herramienta propuesta busca corregir eso mediante una arquitectura basada en **fases**, **estados** y **matrices**.

---

## 3. Idea general de diseño

La herramienta debe organizar el trabajo por **proyectos** y, dentro de cada proyecto, por **fases de revisión bibliográfica**.

### Flujo general esperado

1. Crear proyecto.
2. Definir problema, alcance y palabras clave.
3. Registrar papers candidatos.
4. Hacer preselección rápida.
5. Aplicar matriz de selección.
6. Promover solo algunos papers a matriz de síntesis.
7. Clasificar los papers por rol dentro del estado del arte.
8. Construir relaciones y mapa de evolución.
9. Detectar patrones, vacíos y posibles líneas de investigación.

La clave es esta:

> no todos los papers deben entrar de frente a síntesis profunda.

Primero pasan por una fase de evaluación bibliográfica, y solo después algunos avanzan a análisis técnico más detallado.

---

## 4. Principio rector de la herramienta

La herramienta debe separar tres niveles de análisis:

### 4.1. Nivel bibliográfico

Sirve para responder:
- ¿este paper entra o no entra?
- ¿qué tan relevante es?
- ¿qué tan actual es?
- ¿qué tan confiable es su fuente?

### 4.2. Nivel técnico

Sirve para responder:
- ¿qué método usa?
- ¿qué dataset usa?
- ¿qué métricas reporta?
- ¿qué resultados y limitaciones tiene?

### 4.3. Nivel analítico

Sirve para responder:
- ¿cómo se conecta con otros papers?
- ¿qué vacíos aparecen?
- ¿qué subárea cubre?
- ¿qué rol cumple dentro del estado del arte?

Si estos niveles no se separan, el sistema se vuelve una mezcla confusa de campos.

---

## 5. Entidades principales del sistema

## 5.1. Proyecto

Unidad principal de trabajo.

Debe contener:
- nombre del proyecto,
- descripción breve,
- problema de investigación,
- alcance,
- fecha de inicio,
- estado,
- palabras clave,
- preguntas de investigación,
- observaciones generales.

Cada proyecto debe tener su propia bibliografía y su propia lógica de clasificación.

---

## 5.2. Paper candidato

Es un paper registrado todavía en fase de evaluación inicial.

Debe guardar:
- título,
- autores,
- año,
- venue,
- DOI,
- enlaces,
- PDF,
- abstract,
- keywords,
- notas rápidas,
- proyecto asociado.

En esta fase no hace falta llenar todavía la ficha técnica completa.

---

## 5.3. Evaluación de selección

Es la ficha donde se decide si un paper merece avanzar.

Debe guardar puntajes o valoraciones sobre:
- relevancia temática,
- calidad de la fuente,
- actualidad,
- citaciones,
- reproducibilidad,
- utilidad para el proyecto,
- decisión final.

La decisión final puede ser:
- descartar,
- conservar como contexto,
- conservar como metodológico,
- promover a síntesis.

---

## 5.4. Ficha de síntesis

Solo debe existir para papers que ya pasaron el filtro.

Debe guardar:
- problema abordado,
- motivación,
- tipo de contribución,
- método o técnica,
- dataset o contexto,
- métricas de evaluación,
- resultados clave,
- limitaciones,
- trabajos futuros,
- valor para el proyecto.

Esta ficha representa la matriz de síntesis técnica.

---

## 5.5. Clasificación conceptual del paper

La herramienta debe permitir clasificar cada paper por rol.

Ejemplos de clases:
- núcleo,
- metodológico,
- contexto,
- frontera,
- seminal,
- benchmark,
- puente,
- pivote.

Un mismo paper podría tener más de una etiqueta analítica.

---

## 5.6. Relación entre papers

La herramienta debería permitir relaciones manuales y relaciones inferidas.

Relaciones manuales:
- amplía a,
- compara con,
- corrige a,
- usa el dataset de,
- critica a,
- inspira a.

Relaciones inferidas:
- comparten dataset,
- comparten método,
- comparten tarea,
- comparten dominio,
- comparten métricas,
- pertenecen a la misma sublínea.

---

## 6. Fases que debería tener el sistema

Este es probablemente el aspecto más importante del diseño.

La herramienta no debería tratar todos los papers igual. Debería obligar a que pasen por estados.

### Fase 1. Definición del proyecto

Pantalla o módulo para registrar:
- problema,
- alcance,
- palabras clave,
- preguntas de investigación,
- criterios de inclusión y exclusión.

### Fase 2. Registro de candidatos

Aquí se agregan papers en bruto.

Objetivo:
- construir un conjunto de lectura preliminar.

### Fase 3. Preselección rápida

Lectura mínima de:
- título,
- abstract,
- conclusiones.

La herramienta puede marcar:
- central,
- útil,
- contextual,
- dudoso,
- descartar.

### Fase 4. Matriz de selección bibliográfica

Aquí se puntúa formalmente cada paper con criterios comunes.

Solo después de esta fase se decide si un paper sigue avanzando.

### Fase 5. Promoción a síntesis

Solo los papers suficientemente importantes se promueven a ficha de síntesis.

### Fase 6. Matriz de síntesis técnica

Se registran ya detalles profundos del paper.

### Fase 7. Organización analítica

Se clasifican papers por:
- rol,
- eje temático,
- subárea,
- conexión con otros.

### Fase 8. Detección de patrones y vacíos

La herramienta debe ayudar a identificar:
- limitaciones recurrentes,
- datasets repetidos,
- métricas dominantes,
- áreas poco cubiertas,
- posibles gaps.

### Fase 9. Exportación del estado del arte

Se exportan:
- tablas,
- resúmenes,
- matrices,
- mapa de relaciones,
- listas filtradas por categoría o fase.

---

## 7. Módulos funcionales recomendados

## 7.1. Módulo de proyectos

Funciones:
- crear proyecto,
- editar proyecto,
- definir problema,
- definir alcance,
- definir palabras clave,
- definir criterios de inclusión/exclusión,
- ver progreso del estado del arte.

---

## 7.2. Módulo de ingestión de papers

Funciones:
- registrar paper manualmente,
- importar desde DOI/BibTeX/JSON,
- registrar PDF,
- registrar abstract,
- registrar enlaces,
- detectar duplicados.

Este módulo debe ser ligero y rápido.

---

## 7.3. Módulo de evaluación de selección

Este módulo es central.

Debe mostrar una tabla con criterios como:
- relevancia temática,
- calidad de fuente,
- actualidad,
- citaciones,
- reproducibilidad,
- utilidad.

Y debe permitir:
- puntuar,
- justificar puntaje,
- decidir si el paper avanza,
- filtrar por score total o por score mínimo.

---

## 7.4. Módulo de síntesis técnica

Debe ser una vista más profunda del paper.

Idealmente organizada en bloques:
- problema,
- método,
- dataset,
- métricas,
- resultados,
- limitaciones,
- valor para mi investigación.

Este módulo ya no debe estar lleno de todos los papers, sino solo de los realmente relevantes.

---

## 7.5. Módulo de clasificación analítica

Aquí los papers deben poder agruparse por:
- tipo de contribución,
- rol en el estado del arte,
- subtema,
- benchmark,
- método,
- línea de investigación.

Esto sirve para que el estado del arte no sea una colección plana.

---

## 7.6. Módulo de relaciones y mapa bibliográfico

Debe permitir dos niveles:

### Relaciones explícitas
Guardadas manualmente por el usuario.

### Relaciones inferidas
Detectadas por coincidencias estructurales:
- mismo dataset,
- mismas métricas,
- mismo dominio,
- método similar,
- mismo benchmark,
- mismos keywords.

El grafo no debe ser solo decorativo; debe ayudar a responder:
- qué papers son nodos centrales,
- cuáles conectan subáreas,
- cuáles son aislados,
- qué líneas evolucionan desde cuáles otras.

### Extensión importante: grafo de citaciones de papers aprobados

Una vez que ciertos papers ya fueron **aprobados** o **promovidos a síntesis**, la herramienta puede habilitar una vista bibliográfica más rica basada en sus referencias.

Sin embargo, esta vista no debería dibujar automáticamente **todas** las referencias de cada paper aprobado, porque eso suele producir:

- nodos con demasiadas aristas,
- mucha periferia irrelevante,
- grafos tipo estrella,
- y una pérdida de legibilidad.

La idea correcta no es “mostrar toda la bibliografía”, sino mostrar un **subgrafo útil para análisis**.

### Niveles recomendados para el grafo de citaciones

#### Nivel 0. Papers principales

Son los papers ya aprobados dentro del proyecto.

Deben verse:
- más grandes,
- más oscuros,
- y visualmente más centrales.

#### Nivel 1. Referencias compartidas

Son referencias citadas por dos o más papers principales.

Estas referencias son valiosas porque muestran:
- base común,
- convergencia temática,
- y antecedentes fuertes compartidos.

#### Nivel 2. Referencias puente o intermedias

Son referencias que ayudan a conectar dos zonas del grafo, aunque no sean papers principales.

Ejemplos:
- una referencia de un principal que también aparece conectada con referencias de otro principal;
- una referencia que une subgrupos distintos;
- una referencia que actúa como paper puente entre dos líneas del proyecto.

#### Nivel 3. Referencias directas relevantes

No todas las referencias directas de un principal deben mostrarse por defecto, pero tampoco conviene quedarse solo con las compartidas, porque el grafo podría quedar demasiado pobre.

Por eso se propone una categoría intermedia: **referencias directas relevantes**.

Estas son referencias de un paper principal que, aunque no estén compartidas, tienen suficiente valor estructural como para aparecer en la vista inicial.

### Qué NO debe hacerse

No conviene usar como criterio:

- “las primeras referencias de la bibliografía”,
- “las primeras N referencias del PDF”,
- o asumir que el orden de la bibliografía refleja importancia.

Eso sería metodológicamente débil porque las bibliografías suelen estar ordenadas:
- alfabéticamente,
- o por orden de aparición en el texto,
- no por relevancia intelectual.

### Criterios sugeridos para escoger referencias visibles

La herramienta podría calcular un **score de referencia** para decidir qué referencias directas mostrar por defecto.

Ejemplo de criterios acumulables:

- +3 si la referencia es citada por dos o más papers principales;
- +2 si conecta con referencias de otro principal;
- +2 si tiene DOI o identificador resoluble con metadata completa;
- +2 si fue marcada manualmente como seminal, benchmark, survey o pivote;
- +1 si coincide con el mismo eje temático o sublínea del proyecto;
- -1 si queda como hoja totalmente aislada y sin reutilización.

Con ese score, la vista inicial podría mostrar:

- todos los papers principales,
- todas las referencias compartidas,
- todas las referencias puente,
- y un subconjunto de referencias directas relevantes.

### Manejo de periferia

Las referencias restantes no deberían desaparecer, pero sí quedar **colapsadas**.

Ejemplo visual:
- `+18 referencias periféricas`
- `+34 referencias no expandidas`

De esta manera:
- el grafo sigue siendo legible,
- el usuario no pierde información,
- y la expansión puede hacerse bajo demanda.

### Utilidad académica de esta vista

Este módulo serviría para:

- detectar antecedentes compartidos fuertes,
- identificar papers intermedios potencialmente importantes,
- descubrir referencias que todavía no han sido incorporadas al proyecto,
- analizar qué trabajos parecen seminales o puente,
- y decidir si ciertos nodos merecen ser promovidos como nuevos candidatos dentro del proyecto.

En otras palabras, el grafo no solo serviría para visualizar relaciones, sino también para **sugerir papers bibliográficamente prometedores** a partir de su posición estructural.

### Regla de diseño recomendada

La vista principal del grafo debería incluir:

1. papers principales aprobados,
2. referencias compartidas,
3. referencias puente,
4. top N referencias directas relevantes por principal,
5. y periferia colapsada.

Esto ofrece un punto intermedio entre:

- un grafo vacío y demasiado filtrado,
- y un grafo saturado por decenas de referencias por nodo.

### Apoyo mediante APIs y metadatos externos

Para construir esta capa, la herramienta podría resolver referencias mediante APIs bibliográficas, especialmente cuando existe:

- DOI,
- OpenAlex ID,
- Semantic Scholar ID,
- Crossref metadata.

Esto permitiría:
- recuperar listas de referencias,
- normalizar identificadores,
- deduplicar nodos,
- y enriquecer la selección de referencias relevantes.

La lógica correcta sería usar estos servicios como **fuente de estructura**, no como criterio automático absoluto de importancia.

---

## 7.7. Módulo de detección de gaps

Este módulo debería ser una capa analítica sobre la matriz de síntesis.

Podría detectar patrones como:
- muchos papers usan el mismo benchmark,
- pocas evaluaciones en cierto idioma,
- ausencia de cierto tipo de métrica,
- limitaciones repetidas,
- datasets pequeños,
- falta de multimodalidad,
- falta de análisis de error por clase.

No se trata de “inventar el gap”, sino de hacerlo visible a partir de patrones repetidos.

---

## 7.8. Módulo de exportación académica

Debe exportar cosas realmente útiles para investigación:
- matriz de selección,
- matriz de síntesis,
- lista de papers por rol,
- resumen de vacíos detectados,
- bibliografía en BibTeX/CSV/Markdown/JSON,
- vista imprimible del proyecto.

---

## 8. Esquema recomendado de matriz de selección en la web

La herramienta debería tener una tabla de este tipo:

| Paper | Año | Venue | Relevancia temática | Calidad de fuente | Actualidad | Citaciones | Reproducibilidad | Utilidad para el proyecto | Decisión |
|---|---:|---|---:|---:|---:|---:|---:|---:|---|

### Recomendación funcional

Cada criterio debe poder:
- puntuarse de 1 a 5,
- llevar comentario corto,
- quedar visible en vista tabla,
- y usarse para ordenamiento y filtros.

---

## 9. Esquema recomendado de matriz de síntesis en la web

La herramienta debería tener una segunda tabla o vista profunda:

| Paper | Problema | Método | Dataset / contexto | Métricas | Resultados clave | Limitaciones | Trabajos futuros | Valor para mi proyecto |
|---|---|---|---|---|---|---|---|---|

### Recomendación funcional

Esta matriz debe poder:
- filtrarse,
- expandirse,
- exportarse,
- conectarse con el grafo,
- y agruparse por categorías.

---

## 10. Estados recomendados para un paper

En vez de solo “pendiente” o “leído”, conviene que el sistema tenga estados más académicos.

### Estados sugeridos

- registrado,
- en preselección,
- preseleccionado,
- evaluado en matriz de selección,
- descartado,
- contextual,
- promovido a síntesis,
- sintetizado,
- clasificado,
- conectado en mapa,
- citado en redacción final.

Esto refleja mejor el proceso real de investigación.

---

## 11. Qué debería evitar la herramienta

Para que no se convierta en una base de datos pesada sin criterio, conviene evitar:

- pedir demasiados campos desde el inicio,
- mezclar en una sola ficha selección y síntesis,
- obligar a llenar todo para todos los papers,
- usar el grafo como adorno sin interpretación,
- guardar notas sin estructura,
- mezclar proyectos distintos en una sola taxonomía plana.

---

## 12. Qué haría buena a esta herramienta

La herramienta sería realmente valiosa si:

1. guía el proceso por fases,
2. obliga a separar selección y síntesis,
3. permite clasificar papers por rol conceptual,
4. conecta papers automáticamente e interpretativamente,
5. ayuda a detectar vacíos repetidos,
6. y exporta resultados útiles para la redacción académica.

Su valor no estaría en “guardar más datos”, sino en **hacer pensar mejor**.

---

## 13. Arquitectura conceptual mínima

Una arquitectura conceptual básica podría ser:

### Proyecto
contiene muchos papers.

### Paper
puede tener:
- ficha bibliográfica,
- evaluación de selección,
- ficha de síntesis,
- etiquetas analíticas,
- relaciones.

### Evaluación de selección
se llena primero.

### Ficha de síntesis
solo aparece cuando el paper fue promovido.

### Relación entre papers
puede ser manual o inferida.

### Dashboard analítico
resume:
- avance del proyecto,
- distribución de papers por estado,
- papers promovidos,
- temas dominantes,
- vacíos detectados.

---

## 14. Aplicación práctica a múltiples proyectos

Como la herramienta debe servir para varios proyectos, el diseño debe asumir que:

- cada proyecto tiene su propio problema y sus propias palabras clave,
- los mismos papers pueden aparecer en más de un proyecto,
- pero con distinta relevancia y distinto rol,
- y las clasificaciones deben ser sensibles al proyecto.

Por eso conviene distinguir:

### Datos globales del paper
- título,
- autores,
- DOI,
- abstract,
- venue.

### Datos dependientes del proyecto
- relevancia,
- utilidad,
- rol,
- notas analíticas,
- decisión de promoción,
- valor para el estado del arte específico.

---

## 15. Conclusión

La mejor versión de una herramienta web para revisión bibliográfica no es la que guarda más información, sino la que mejor traduce la lógica del trabajo académico.

Siguiendo la guía sistemática, la herramienta debería construirse alrededor de estas ideas:

- proyectos con identidad clara,
- papers como unidades evaluables,
- separación estricta entre selección y síntesis,
- matrices como núcleo operativo,
- clasificación por rol conceptual,
- detección de conexiones y vacíos,
- y exportación útil para la escritura del estado del arte.

En síntesis, la herramienta debe ayudar a pasar de una colección de papers a una **estructura analítica de conocimiento**.
