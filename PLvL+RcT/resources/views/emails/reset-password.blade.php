<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
        }
        .header {
            background-color: #2ecc71;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            background-color: white;
            padding: 20px;
            border-radius: 0 0 5px 5px;
        }
        .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #2ecc71;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
        }
        .button:hover {
            background-color: #27ae60;
        }
        .footer {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
        }
        .security-info {
            background-color: #f0f0f0;
            padding: 15px;
            border-left: 4px solid #2ecc71;
            margin: 20px 0;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 Restablecimiento de Contraseña</h1>
        </div>
        
        <div class="content">
            <p>Hola <strong>{{ $user->name }}</strong>,</p>
            
            <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en el Sistema SENA.</p>
            
            <p>Para continuar con el restablecimiento, haz clic en el siguiente botón:</p>
            
            <center>
                <a href="{{ $resetUrl }}" class="button">Restablecer Contraseña</a>
            </center>
            
            <p>O copia y pega este enlace en tu navegador:</p>
            <p style="word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 3px;">
                {{ $resetUrl }}
            </p>
            
            <div class="security-info">
                <strong>⏱️ Información Importante:</strong>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>Este enlace expirará en <strong>60 minutos</strong></li>
                    <li>Solo puedes usar este enlace una vez</li>
                    <li>Si no solicitaste este cambio, ignora este mensaje</li>
                    <li>Nunca compartas este enlace con otras personas</li>
                </ul>
            </div>
            
            <p>Si el botón no funciona, copia y pega el enlace en tu navegador.</p>
            
            <div class="footer">
                <p>Este es un mensaje automático. Por favor, no respondas a este correo.</p>
                <p><strong>{{ config('app.name') }}</strong> - Sistema SENA de Gestión de Instructores</p>
                <p>© {{ date('Y') }} Todos los derechos reservados.</p>
            </div>
        </div>
    </div>
</body>
</html>
