# Build stage
FROM registry.access.redhat.com/ubi8/nodejs-18-minimal:1-40 as build
WORKDIR /app
COPY vite.config.ts tsconfig.json package*.json ./
USER root
RUN npm install -g pnpm
RUN pnpm install
COPY . .
RUN pnpm build

# Production stage
FROM registry.access.redhat.com/ubi9/ubi-minimal:9.1.0-1793 AS production
WORKDIR /app
COPY --from=build /app/ ./
# COPY --from=build /app/dist ./dist
RUN microdnf update -y && \
    microdnf install -y nodejs && \
    microdnf clean all
RUN npm install --production
CMD ["npm", "start"]