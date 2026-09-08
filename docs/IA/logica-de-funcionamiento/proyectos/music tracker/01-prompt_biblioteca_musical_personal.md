# Prompt para el agente: Biblioteca musical personal

Quiero que programes una herramienta para construir y mantener mi biblioteca musical personal.  
El objetivo inicial es simple: **guardar todas las canciones que me gustan, importarlas desde mis playlists actuales y organizarlas sin tener que llenarlas manualmente una por una**.

No tomes decisiones de arquitectura ni de tecnologías antes de entender la lógica. Concéntrate primero en implementar correctamente el funcionamiento.

---

## 1. Objetivo principal

La herramienta debe permitirme:

- Importar canciones desde mis playlists actuales.
- Guardar una biblioteca maestra con todas las canciones que me gustan.
- Saber en qué playlists aparece cada canción.
- Detectar canciones repetidas o casi repetidas.
- Enriquecer cada canción con información automática cuando sea posible.
- Marcar canciones que necesitan revisión manual.
- Exportar mi biblioteca para no depender únicamente de una cuenta externa.

La herramienta no debe intentar reemplazar una app de música.  
Debe funcionar como un **gestor personal de canciones favoritas, organización, backup y futura recomendación**.

---

## 2. Concepto central

No quiero organizar mi música únicamente por playlists.

La lógica debe ser:

```txt
Canciones primero.
Playlists después.
```

Es decir, la entidad principal debe ser la **canción**.

Una canción puede estar en varias playlists, y eso debe registrarse claramente.

Ejemplo:

```txt
Canción: Numb
Artista: Linkin Park
Aparece en:
- Rock
- Nostalgia
- Favoritas
```

---

## 3. Importación inicial

La herramienta debe poder importar canciones desde fuentes externas de música, principalmente playlists del usuario.

Durante la importación debe guardar, como mínimo:

- Nombre de la playlist de origen.
- Identificador externo de la playlist.
- Posición de la canción dentro de la playlist.
- Título original como aparece en la fuente.
- Nombre del canal, artista o fuente visible.
- Identificador externo de la canción o video.
- Enlace original.
- Fecha de importación.
- Fuente de origen.

No se debe perder el dato original aunque luego se limpie o normalice.

---

## 4. Biblioteca maestra

La herramienta debe crear una biblioteca maestra donde cada canción tenga una versión normalizada.

Cada registro de canción debe poder contener:

- Título original.
- Título limpio o normalizado.
- Artista detectado.
- Artista corregido manualmente.
- Álbum, si se encuentra.
- Año, si se encuentra.
- Enlaces externos relacionados.
- Playlists donde aparece.
- Tags automáticos.
- Géneros automáticos.
- Estados de ánimo automáticos.
- Tags personales.
- Estado de revisión.
- Calificación personal.
- Nota personal.
- Fecha en que fue agregada.
- Fecha de última actualización.

La herramienta debe diferenciar entre:

```txt
Dato bruto importado
Dato automático inferido
Dato corregido manualmente
```

Nunca debe sobrescribir una corrección manual sin confirmación.

---

## 5. Limpieza de títulos

La herramienta debe intentar limpiar títulos de canciones importadas.

Debe reconocer y remover elementos comunes como:

- “Official Video”
- “Official Music Video”
- “Lyrics”
- “Lyric Video”
- “Audio”
- “HD”
- “Remastered”
- “Live”
- Texto entre corchetes o paréntesis cuando parezca metadata del video
- Emojis innecesarios
- Sufijos promocionales
- Nombres de canales que no son artistas

Ejemplos:

```txt
"Linkin Park - Numb (Official Music Video) [HD]"
→ Artista: Linkin Park
→ Canción: Numb
```

```txt
"Coldplay - Yellow (Lyrics)"
→ Artista: Coldplay
→ Canción: Yellow
```

La limpieza no debe borrar el título original.  
Debe guardar ambas versiones:

```txt
titulo_original
titulo_limpio
```

---

## 6. Detección de duplicados

La herramienta debe detectar posibles canciones duplicadas.

Debe considerar duplicados por:

- Mismo identificador externo.
- Mismo enlace.
- Título limpio muy parecido.
- Artista muy parecido.
- Duración parecida, si está disponible.
- Coincidencias entre versiones oficiales, lyric videos, audios y remasters.

No todos los duplicados deben fusionarse automáticamente.

Debe haber estados como:

```txt
duplicado_confirmado
posible_duplicado
no_duplicado
fusionado
pendiente_revision
```

Cuando detecte posibles duplicados, debe mostrar algo como:

```txt
Estas canciones parecen ser la misma:

1. Linkin Park - Numb (Official Music Video)
2. Numb - Linkin Park [Lyrics]
3. Linkin Park - Numb (Audio)

Acción sugerida:
- Fusionar como una sola canción
- Mantener separadas
- Revisar después
```

---

## 7. Relación canción-playlist

La herramienta debe permitir saber claramente en qué playlists está cada canción.

Ejemplo:

```txt
Canción: Yellow
Artista: Coldplay

Aparece en:
- Chill
- Noche
- Favoritas suaves
```

También debe detectar canciones que:

- Solo están en una playlist temporal.
- Están en muchas playlists.
- No tienen playlist final asignada.
- Están duplicadas dentro de una misma playlist.
- Están duplicadas entre varias playlists.

---

## 8. Estados de organización

Cada canción debe tener un estado de organización.

Estados sugeridos:

```txt
importada
por_revisar
limpia
enriquecida
duplicado_posible
duplicado_confirmado
clasificada
pendiente_de_tags
pendiente_de_playlist
archivada
descartada
```

La herramienta debe permitir filtrar canciones por estado.

Ejemplos de filtros útiles:

```txt
Ver canciones por revisar.
Ver canciones sin género.
Ver canciones sin mood.
Ver canciones sin playlist final.
Ver posibles duplicados.
Ver canciones importadas recientemente.
```

---

## 9. Enriquecimiento automático

La herramienta debe intentar completar información adicional de cada canción usando fuentes externas de metadata.

Debe intentar obtener:

- Artista correcto.
- Título correcto.
- Álbum.
- Año.
- Géneros.
- Tags.
- Estado de ánimo aproximado.
- Popularidad o relevancia, si está disponible.
- Identificadores externos útiles.

El enriquecimiento debe ser tolerante a errores.

Si no encuentra una coincidencia confiable, debe marcar la canción como:

```txt
metadata_no_encontrada
```

o

```txt
metadata_dudosa
```

La herramienta debe distinguir entre:

```txt
metadata_confiable
metadata_probable
metadata_dudosa
metadata_no_encontrada
```

---

## 10. Tags y categorías

La herramienta debe manejar dos tipos de tags:

```txt
tags_automaticos
tags_personales
```

Los tags automáticos vienen de metadata externa o inferencia.

Los tags personales los agrego yo manualmente.

Ejemplos de tags automáticos:

```txt
rock
pop
alternative
indie
2000s
latin
electronic
sad
chill
energetic
```

Ejemplos de tags personales:

```txt
madrugada
para manejar
nostalgia
gym
programar
favorita real
recuerdo personal
no borrar
```

Los tags personales deben tener prioridad sobre los automáticos cuando haya conflicto.

---

## 11. Mood y uso personal

La herramienta debe permitirme clasificar canciones por mood y uso.

Moods posibles:

```txt
feliz
triste
melancolico
nostalgico
energetico
tranquilo
oscuro
romantico
epico
relajado
```

Usos posibles:

```txt
programar
estudiar
manejar
caminar
gym
madrugada
trabajar
descansar
fiesta
viaje
```

Estos valores deben poder ampliarse después.

---

## 12. Revisión manual rápida

La herramienta debe incluir una forma rápida de revisar canciones pendientes.

Para cada canción pendiente debe mostrar:

- Título original.
- Título limpio sugerido.
- Artista sugerido.
- Playlists donde aparece.
- Tags automáticos.
- Mood automático.
- Posibles duplicados.
- Acciones rápidas.

Acciones rápidas necesarias:

```txt
Confirmar datos.
Editar título.
Editar artista.
Agregar tag.
Quitar tag.
Asignar mood.
Asignar uso.
Marcar como favorita real.
Marcar como revisada.
Marcar como duplicado.
Ignorar por ahora.
Descartar.
```

---

## 13. Playlist temporal o inbox

La herramienta debe considerar la existencia de una playlist o grupo temporal llamado:

```txt
Por ordenar
```

o equivalente.

Las canciones que estén ahí deben marcarse como pendientes de clasificación.

La lógica debe ayudarme a responder:

```txt
¿Qué canciones nuevas me gustan pero todavía no he organizado?
```

---

## 14. Sugerencias de playlists

La herramienta debe poder sugerir playlists para una canción usando:

- Playlists donde ya aparece.
- Tags.
- Mood.
- Uso personal.
- Género.
- Canciones parecidas ya clasificadas.

Ejemplo:

```txt
Canción: Sparks
Artista: Coldplay

Sugerencias:
- Noche
- Chill
- Melancolía
- Favoritas suaves
```

Estas sugerencias no deben aplicarse automáticamente sin confirmación.

---

## 15. Preparación para clustering futuro

Aunque el primer MVP no necesita clustering avanzado, la información debe guardarse pensando en eso.

Cada canción debería poder tener características útiles para agruparla después:

- Géneros.
- Tags.
- Mood.
- Uso.
- Artista.
- Año.
- Idioma, si se puede inferir.
- Calificación personal.
- Número de playlists donde aparece.
- Si fue marcada como favorita real.
- Texto combinado de título, artista y tags.

La herramienta debe facilitar exportar estos datos para análisis futuro.

---

## 16. Preparación para recomendaciones futuras

La herramienta debe guardar señales de gusto personal.

Señales importantes:

```txt
Canción con like.
Canción en varias playlists.
Canción marcada como favorita real.
Canción con rating alto.
Canción reproducida mucho, si ese dato está disponible.
Canción agregada manualmente.
Canción no descartada después de revisión.
```

Más adelante estas señales servirán para recomendar canciones parecidas.

---

## 17. Exportación y backup

La herramienta debe permitir exportar la biblioteca completa.

Formatos deseados:

```txt
CSV
Excel
JSON
```

La exportación debe incluir:

- Canciones limpias.
- Datos originales importados.
- Playlists.
- Relación canción-playlist.
- Tags.
- Estados.
- Duplicados detectados.
- Correcciones manuales.
- Fecha de importación.
- Fecha de última revisión.

El objetivo es que mi biblioteca no dependa únicamente de una cuenta externa.

---

## 18. Reportes útiles

La herramienta debe poder mostrar reportes simples como:

```txt
Total de canciones importadas.
Total de canciones únicas.
Total de playlists importadas.
Canciones duplicadas.
Posibles duplicados.
Canciones sin metadata.
Canciones sin tags.
Canciones sin mood.
Canciones sin playlist final.
Canciones pendientes de revisión.
Top géneros.
Top moods.
Top artistas.
Playlists con más canciones.
Canciones que aparecen en más playlists.
```

---

## 19. Reglas importantes

La herramienta debe seguir estas reglas:

1. No borrar información original importada.
2. No sobrescribir correcciones manuales sin confirmación.
3. No fusionar duplicados dudosos automáticamente.
4. No asumir que el título de YouTube siempre es el título real de la canción.
5. No asumir que el canal de YouTube siempre es el artista.
6. Permitir revisión manual cuando la metadata sea dudosa.
7. Guardar suficientes datos para exportar y reconstruir la biblioteca.
8. Priorizar utilidad práctica sobre perfección automática.
9. Diseñar la lógica para que pueda crecer hacia clustering y recomendaciones.
10. Mantener clara la diferencia entre canción, fuente externa y playlist.

---

## 20. Flujo principal esperado

El flujo mínimo debería ser:

```txt
1. Importo mis playlists.
2. La herramienta guarda todos los elementos encontrados.
3. La herramienta limpia títulos y detecta artista/canción.
4. La herramienta intenta enriquecer metadata.
5. La herramienta detecta duplicados.
6. La herramienta crea una biblioteca maestra.
7. Yo reviso canciones pendientes.
8. Yo confirmo o corrijo datos.
9. La herramienta me muestra en qué playlists está cada canción.
10. La herramienta exporta todo como backup.
```

---

## 21. Resultado esperado del primer MVP

El primer MVP será exitoso si logra esto:

```txt
Puedo importar mis playlists.
Puedo ver todas mis canciones en una biblioteca maestra.
Puedo saber en qué playlist está cada canción.
Puedo detectar posibles duplicados.
Puedo ver qué canciones faltan revisar.
Puedo enriquecer parte de la metadata automáticamente.
Puedo agregar tags personales.
Puedo exportar todo.
```

No necesito todavía:

```txt
Recomendaciones perfectas.
Clustering avanzado.
Interfaz compleja.
Reproductor musical.
Sincronización automática perfecta.
```

Primero quiero resolver bien el problema base:

```txt
No perder mis canciones favoritas y poder organizarlas sin hacerlo todo a mano.
```
