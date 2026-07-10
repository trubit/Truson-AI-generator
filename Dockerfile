# Multi-Stage Dockerfile for Neurova Platform

# Base Stage
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# Dependencies Stage
FROM base AS dependencies
RUN npm ci

# Build Stage
FROM dependencies AS build
COPY . .
RUN npm run build
RUN npm run build:server

# Production Runner Stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

EXPOSE 5050 5180

CMD ["node", "dist/server/server/src/server.js"]
