# Configuración privada de la cuenta inicial

Configura estas variables exclusivamente en el servidor: en `.env` local (ignorado por Git) o en el gestor de secretos del despliegue. Los valores siguientes son ejemplos, no credenciales funcionales.

```dotenv
AUTH_BOOTSTRAP_EMAIL="<correo-de-la-cuenta-inicial>"
AUTH_BOOTSTRAP_PASSWORD="<contraseña-privada>"
```

No uses el prefijo `NEXT_PUBLIC_`, no precargues credenciales en el formulario y no publiques archivos `.env`.

El correo identifica la cuenta bootstrap y permite asignar propiedad a datos heredados. La contraseña solo se consulta cuando la cuenta todavía no existe; no hay contraseña predeterminada en código. La configuración faltante produce un error explícito, sin incluir valores.

Trasladar la configuración NO modifica la contraseña ni los datos de una cuenta existente. Para rotar una contraseña existente hace falta un procedimiento independiente y autorizado sobre la cuenta; cambiar `.env` no la rota. Una instalación existente debe mantener el mismo correo bootstrap salvo una migración de propiedad planificada.

El formulario de acceso comienza vacío. En producción, configurar estas variables antes de habilitar el inicio de sesión.
