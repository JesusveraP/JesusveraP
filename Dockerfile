# Etapa 1: Builder - Compilar dependencias
FROM dunglas/frankenphp:1.1-php8.3 AS builder

WORKDIR /app

# Instalar dependencias necesarias
RUN apk add --no-cache nodejs npm git

# Copiar archivos de configuración
COPY composer.json composer.lock package.json package-lock.json ./

# Instalar dependencias de PHP
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Instalar dependencias de Node
RUN npm install

# Copiar el proyecto completo
COPY . .

# Generar la clave de aplicación si no existe
RUN php artisan key:generate --show > /dev/null 2>&1 || true

# Compilar assets con Vite
RUN npm run build

# Cachear configuración y rutas
RUN php artisan config:cache
RUN php artisan route:cache

# Etapa 2: Runtime - Imagen final
FROM dunglas/frankenphp:1.1-php8.2

WORKDIR /app

# Instalar solo lo necesario para runtime
RUN apk add --no-cache mysql-client

# Copiar archivos compilados desde builder
COPY --from=builder /app /app

# Crear directorios necesarios
RUN mkdir -p storage/logs storage/framework/cache storage/framework/views
RUN chmod -R 775 storage bootstrap/cache

# Variable de puerto (Render la proporciona)
ENV PORT=8080

# Exponer el puerto
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD php artisan ping || exit 1

# Comando para iniciar la aplicación
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8080"]
