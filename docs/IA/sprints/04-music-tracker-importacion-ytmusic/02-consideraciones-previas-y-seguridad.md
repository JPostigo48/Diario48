# Sprint 04 — consideraciones previas y seguridad

## Lo primero: aquí NO puedes improvisar seguridad

Tu idea tiene sentido funcionalmente, pero hay que corregir el modelo mental:

el contenido derivado de `browser.json` **NO debe guardarse “como una contraseña”** en el sentido habitual del login del usuario.

### Por qué

Una contraseña normal:

- se almacena como hash;
- no necesita recuperarse en texto claro;
- solo se verifica.

La credencial de YT Music:

- sí debe recuperarse para llamar a `ytmusicapi`;
- por tanto no sirve tratarla como un password hash normal.

## Recomendación correcta

Guardar esa información como:

- **credencial externa sensible del usuario**
- cifrada en base de datos
- separada de la contraseña de acceso a tu web

No mezclar ambas cosas.

---

## Reglas obligatorias de seguridad

1. Nunca guardar el `browser.json` plano en texto visible.
2. Nunca reutilizar la contraseña de login del usuario para esta credencial.
3. Cifrar el secreto con una clave del servidor.
4. Permitir reemplazar o revocar la credencial.
5. No exponer la credencial al frontend una vez guardada.
6. No usar la credencial en cliente; solo en backend.
7. Registrar estado de validez:
   - configurada
   - inválida
   - requiere actualización

---

## UX recomendada para esto

Dentro de `music tracker` debe existir una sección clara, por ejemplo:

- `Conexión con YT Music`

Ahí el usuario puede:

- pegar o subir el contenido necesario;
- guardarlo;
- probar conexión;
- ver si está vigente;
- actualizarlo;
- eliminarlo.

Eso tiene MUCHO más sentido de UX que esconderlo en un lugar genérico.

---

## Decisiones técnicas recomendadas antes de implementar

### 1. Fuente de integración

Usar `ytmusicapi` desde backend, nunca desde cliente.

### 2. Tipo de credencial

Guardar un secreto/artefacto mínimo necesario para operar con `ytmusicapi`, no basura completa innecesaria si puedes reducirla.

### 3. Persistencia

Crear entidad propia para la conexión externa del usuario, por ejemplo:

- `MusicProviderCredential`

con:

- `ownerId`
- `provider`
- `encryptedSecret`
- `status`
- `lastValidatedAt`
- `lastSyncAt`
- `lastError`

### 4. Flujo de sincronización

La importación debe ser iniciada explícitamente por el usuario en esta etapa:

- botón “importar ahora”
- botón “actualizar biblioteca”

Nada automático todavía.

---

## Riesgos si se hace mal

- filtrar secreto sensible;
- acoplar la librería a YT Music;
- bloquear toda la herramienta si la credencial expira;
- mezclar lógica de sesión local con credencial externa;
- crear una UI que haga llamadas inseguras desde cliente.

Eso sería una deuda grave, no un detalle menor.
