# syntax=docker/dockerfile:1

# ----------------------
# Etapa base
# ----------------------
FROM node:24-alpine AS base
WORKDIR /app

# Desactivar la restricción estricta de scripts de dependencias en pnpm v10+ para entornos de CI/Docker
ENV pnpm_config_strict_dep_builds=false

# Instalar pnpm globalmente
RUN npm install -g pnpm

# ----------------------
# Etapa de dependencias (Caching)
# ----------------------
FROM base AS deps

# Instalar dependencias nativas necesarias para algunas librerías
RUN apk update && apk add --no-cache python3 make g++ libc6-compat

COPY package.json pnpm-lock.yaml ./

# Instalar dependencias completas para el build
RUN pnpm install --frozen-lockfile 

# ----------------------
# Etapa de build (Compilación)
# ----------------------
FROM base AS builder

# 1. Copiar package.json y lockfile
COPY package.json pnpm-lock.yaml ./

# 2. Copiar la carpeta node_modules desde la etapa de dependencias para usar el cache
COPY --from=deps /app/node_modules ./node_modules

# 3. Copiar el resto del código del proyecto
COPY . .

# Variables de entorno para el build (requeridas por Next.js)
ARG BACKEND_URL
ARG BACKEND_AUTH_URL
ARG NEXTAUTH_URL
ARG NEXTAUTH_SECRET

ENV BACKEND_URL=${BACKEND_URL} \
    BACKEND_AUTH_URL=${BACKEND_AUTH_URL} \
    NEXTAUTH_URL=${NEXTAUTH_URL} \
    NEXTAUTH_SECRET=${NEXTAUTH_SECRET}

# Re-verificar e instalar los links de pnpm súper rápido usando la caché local
RUN pnpm install --frozen-lockfile

# Ejecutar el build de Next.js (crea .next/standalone)
RUN pnpm build

# ----------------------
# Etapa de ejecución (Producción - Imagen Ligera)
# ----------------------
FROM node:24-alpine AS runner
WORKDIR /app

# Configuración de variables de entorno de producción
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000

# Configuración de usuario no-root
RUN addgroup -S nodejs \
    && adduser -S nextjs -G nodejs \
    && chown -R nextjs:nodejs /app

# Copia los archivos de ejecución (Optimizados para Next.js Standalone)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
