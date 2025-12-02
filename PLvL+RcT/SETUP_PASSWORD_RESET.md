# Configuración de Restablecimiento de Contraseña

## ✅ Pasos Completados

Se ha configurado exitosamente el sistema de restablecimiento de contraseña para funcionar con cualquier correo electrónico registrado. El sistema utiliza el enfoque estándar de Laravel que es seguro y confiable.

### Cambios Realizados:

1. ✅ **Rutas habilitadas** - Descomenté las rutas estándar de restablecimiento en `routes/auth.php`
2. ✅ **Tabla de base de datos** - La tabla `password_reset_tokens` ya existe para almacenar tokens
3. ✅ **Notificación personalizada** - Creada `ResetPasswordNotification.php` para enviar emails
4. ✅ **Clase Mailable** - Creada `ResetPasswordMail.php` para formatos profesionales de emails
5. ✅ **Plantilla de email** - Creada `resources/views/emails/reset-password.blade.php`
6. ✅ **Modelo User actualizado** - Agregado método `sendPasswordResetNotification()`
7. ✅ **Vistas frontend** - Actualizadas `ForgotPassword.jsx` y `ResetPassword.jsx`

---

## 🔧 Configuración del Correo SMTP

Para que los emails de restablecimiento se envíen correctamente, necesitas configurar las credenciales SMTP en tu archivo `.env`:

### Opción 1: Gmail (Recomendado)

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=tu_correo@gmail.com
MAIL_PASSWORD=tu_contraseña_app
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@sena-system.com"
MAIL_FROM_NAME="Sistema SENA - Gestión Instructores"
```

**Pasos para Gmail:**
1. Habilita "Aplicaciones menos seguras" en tu cuenta de Gmail
2. O crea una "Contraseña de aplicación" en https://myaccount.google.com/security
3. Usa esa contraseña en `MAIL_PASSWORD`

### Opción 2: Mailtrap (Para desarrollo/testing)

```env
MAIL_MAILER=smtp
MAIL_HOST=live.smtp.mailtrap.io
MAIL_PORT=587
MAIL_USERNAME=tu_usuario_mailtrap
MAIL_PASSWORD=tu_contraseña_mailtrap
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@sena-system.com"
MAIL_FROM_NAME="Sistema SENA - Gestión Instructores"
```

Obtén credenciales en: https://mailtrap.io/

### Opción 3: SendGrid

```env
MAIL_MAILER=sendgrid
SENDGRID_API_KEY=tu_api_key_sendgrid
MAIL_FROM_ADDRESS="noreply@sena-system.com"
MAIL_FROM_NAME="Sistema SENA - Gestión Instructores"
```

---

## 🚀 Prueba el Sistema

### 1. **Prueba local con Mailtrap o MailHog**

Para desarrollo, recomiendo usar **Mailtrap** (servicio gratuito que no requiere instalación):

1. Crea una cuenta en https://mailtrap.io/
2. Obtén las credenciales SMTP
3. Configura en `.env` como se muestra arriba
4. Los emails aparecerán en tu dashboard de Mailtrap sin realmente enviarse

### 2. **Flujo de prueba completo**

1. Accede a: `http://tu-app/forgot-password`
2. Ingresa un email registrado en tu base de datos
3. Haz clic en "Enviar Enlace de Recuperación"
4. Verifica que el email llegó (en Mailtrap, Gmail, etc.)
5. Haz clic en el enlace de recuperación
6. Ingresa tu nueva contraseña
7. Haz clic en "Restablecer Contraseña"
8. Inicia sesión con la nueva contraseña

---

## 📋 Variables de Entorno Actualizadas

Tu archivo `.env` ya contiene:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=tu_correo@gmail.com
MAIL_PASSWORD=tu_contraseña_app
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@sena-system.com"
MAIL_FROM_NAME="Sistema SENA - Gestión Instructores"
```

⚠️ **IMPORTANTE:** Reemplaza `tu_correo@gmail.com` y `tu_contraseña_app` con tus credenciales reales.

---

## 🔐 Características de Seguridad

✅ **Tokens únicos y seguros** - Se generan tokens aleatorios de 64 caracteres
✅ **Expiración de tokens** - Los enlaces expiran en 60 minutos (configurable en `config/auth.php`)
✅ **One-time use** - Los tokens se usan una sola vez
✅ **Rate limiting** - Se pueden solicitar máximo 3 enlaces por minuto
✅ **Emails verificados** - Solo usuarios con correo registrado pueden resetear

---

## 🛠️ Archivos Modificados

| Archivo | Cambios |
|---------|---------|
| `routes/auth.php` | Rutas de forgot-password habilitadas |
| `.env` | Configuración SMTP actualizada |
| `app/Models/User.php` | Método `sendPasswordResetNotification()` agregado |
| `app/Mail/ResetPasswordMail.php` | Clase Mailable creada |
| `app/Notifications/ResetPasswordNotification.php` | Notificación personalizada creada |
| `resources/views/emails/reset-password.blade.php` | Plantilla de email profesional |
| `resources/js/Pages/Auth/ForgotPassword.jsx` | Vista mejorada para solicitar reset |
| `resources/js/Pages/Auth/ResetPassword.jsx` | Vista mejorada para resetear contraseña |

---

## 🐛 Solución de Problemas

### El email no se envía

**Solución:**
1. Verifica que `MAIL_MAILER` esté en `smtp`
2. Verifica credenciales SMTP en `.env`
3. Revisa logs: `storage/logs/laravel.log`
4. Prueba con Mailtrap primero (es más confiable)

### El enlace de reset expira muy rápido

Edita `config/auth.php`:
```php
'passwords' => [
    'users' => [
        'expire' => 120, // Cambiar de 60 a 120 minutos
    ],
],
```

### "Token de restablecimiento inválido"

- El token ya fue usado
- El token expiró (pasaron 60 minutos)
- Solicita un nuevo enlace desde la página de "Olvidé mi contraseña"

---

## 📞 Soporte

Si encuentras problemas:

1. Revisa `storage/logs/laravel.log` para mensajes de error
2. Verifica que la tabla `password_reset_tokens` existe en la BD
3. Asegúrate de que el usuario existe en la tabla `users`
4. Confirma que las credenciales SMTP sean correctas

---

## ✨ Próximos Pasos (Opcional)

- [ ] Configurar autenticación de dos factores (2FA)
- [ ] Agregar límite de intentos fallidos
- [ ] Registrar auditoría de cambios de contraseña
- [ ] Enviar notificaciones cuando la contraseña cambie

---

**Estado:** ✅ Sistema completamente configurado y listo para usar.
