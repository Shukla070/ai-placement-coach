# Multi-stage build for production deployment
FROM node:18-alpine AS base

# Stage 1: Dependencies
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm install --production

# Stage 2: Production
FROM base AS runner
WORKDIR /app

# Install ffmpeg for audio processing (needed by fluent-ffmpeg)
RUN apk add --no-cache ffmpeg

# Set environment to production
ENV NODE_ENV=production

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application code
COPY server ./server
COPY data ./data
COPY package*.json ./

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
  adduser --system --uid 1001 expressuser && \
  chown -R expressuser:nodejs /app

# Switch to non-root user
USER expressuser

# Expose port (Cloud Run will set PORT env variable)
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the server
CMD ["node", "server/index.js"]
