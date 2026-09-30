# ==============================================================================
# JanSetu AI - Google Cloud Run Dockerfile
# Multi-stage production build for Node.js Full-Stack Applet
# ==============================================================================

FROM node:22-slim AS builder

WORKDIR /app

# Copy package configurations
COPY package*.json tsconfig.json vite.config.ts ./

# Install dependencies
RUN npm ci

# Copy full application source code
COPY . .

# Build frontend static bundle
RUN npm run build

# ==============================================================================
# Production Image
# ==============================================================================
FROM node:22-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled files and server source
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/server.ts ./server.ts
COPY --from=builder /app/ai ./ai
COPY --from=builder /app/data ./data
COPY --from=builder /app/db ./db
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Copy tsx for running server.ts directly
RUN npm install -g tsx

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/api/health').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

CMD ["tsx", "server.ts"]
