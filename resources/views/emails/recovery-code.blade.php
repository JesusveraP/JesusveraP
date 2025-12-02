<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Código de Recuperación - {{ $systemName }}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8fafc;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #059669 0%, #047857 100%);
            padding: 30px;
            text-align: center;
            color: white;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .subtitle {
            font-size: 14px;
            opacity: 0.9;
        }
        .content {
            padding: 40px 30px;
            text-align: center;
        }
        .greeting {
            font-size: 18px;
            color: #374151;
            margin-bottom: 20px;
        }
        .message {
            font-size: 16px;
            color: #6b7280;
            margin-bottom: 30px;
            line-height: 1.6;
        }
        .code-container {
            background-color: #f3f4f6;
            border: 2px dashed #059669;
            border-radius: 8px;
            padding: 30px;
            margin: 30px 0;
            text-align: center;
        }
        .code {
            font-size: 36px;
            font-weight: bold;
            color: #059669;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
        }
        .code-label {
            font-size: 14px;
            color: #6b7280;
            margin-top: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .warning {
            background-color: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 6px;
            padding: 20px;
            margin: 30px 0;
        }
        .warning-icon {
            color: #f59e0b;
            font-size: 20px;
            margin-bottom: 10px;
        }
        .warning-text {
            color: #92400e;
            font-size: 14px;
            margin: 0;
        }
        .footer {
            background-color: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        .footer-text {
            font-size: 14px;
            color: #6b7280;
            margin: 0;
        }
        .system-name {
            color: #059669;
            font-weight: bold;
        }
        .btn {
            display: inline-block;
            background-color: #059669;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            margin: 20px 0;
        }
        .security-tips {
            background-color: #eff6ff;
            border: 1px solid #3b82f6;
            border-radius: 6px;
            padding: 20px;
            margin: 30px 0;
            text-align: left;
        }
        .security-title {
            color: #1e40af;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .security-list {
            color: #1e40af;
            font-size: 14px;
            margin: 0;
            padding-left: 20px;
        }
        .security-list li {
            margin-bottom: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🛡️ SENA</div>
            <div class="subtitle">Sistema de Gestión de Instructores</div>
        </div>
        
        <div class="content">
            <div class="greeting">
                ¡Hola {{ $user->name }}!
            </div>
            
            <div class="message">
                Recibimos una solicitud para restablecer la contraseña de tu cuenta en el 
                <strong class="system-name">{{ $systemName }}</strong>.
            </div>
            
            <div class="code-container">
                <div class="code">{{ $code }}</div>
                <div class="code-label">Código de Recuperación</div>
            </div>
            
            <div class="warning">
                <div class="warning-icon">⚠️</div>
                <p class="warning-text">
                    <strong>Importante:</strong> Este código es válido por <strong>{{ $expiryMinutes }} minutos</strong> 
                    y solo puede usarse una vez. No compartas este código con nadie.
                </p>
            </div>
            
            <div class="security-tips">
                <div class="security-title">🔒 Consejos de Seguridad:</div>
                <ul class="security-list">
                    <li>Nunca compartas tu código de recuperación con otras personas</li>
                    <li>El equipo de SENA nunca te pedirá tu contraseña por correo</li>
                    <li>Si no solicitaste este código, ignora este mensaje</li>
                    <li>Usa una contraseña fuerte y única para tu cuenta</li>
                </ul>
            </div>
            
            <div class="message">
                Si no solicitaste este código de recuperación, puedes ignorar este correo. 
                Tu cuenta permanecerá segura.
            </div>
        </div>
        
        <div class="footer">
            <p class="footer-text">
                Este es un correo automático del <strong class="system-name">{{ $systemName }}</strong><br>
                Por favor, no respondas a este mensaje.
            </p>
            <p class="footer-text">
                © {{ date('Y') }} SENA - Servicio Nacional de Aprendizaje<br>
                Todos los derechos reservados.
            </p>
        </div>
    </div>
</body>
</html>