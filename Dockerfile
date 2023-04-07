# syntax=docker/dockerfile:1.2

# Build stage
FROM registry.access.redhat.com/ubi8/nodejs-18-minimal:1-40 as build
WORKDIR /app
USER root
# layer caching for pnpm install
RUN --mount=type=cache,target=/root/.cache/npm npm install -g pnpm
# copy pkg management files
COPY vite.config.ts tsconfig.json package*.json ./
RUN --mount=type=cache,target=/root/.cache/pnpm pnpm install
# copy over project files
COPY . . 
RUN pnpm build

# parallel building: production image prepare
FROM registry.access.redhat.com/ubi9/ubi-minimal:9.1.0-1793 AS production-setup
# caching pkgs
RUN --mount=type=cache,target=/root/.cache/dnf microdnf update -y && \
    microdnf install -y nodejs && \
    microdnf clean all
RUN --mount=type=cache,target=/root/.cache/npm npm install -g pnpm

# Production stage
FROM production-setup AS production
WORKDIR /app
COPY --from=build /app/ ./
RUN --mount=type=cache,target=/root/.cache/pnpm pnpm install --production
CMD ["pnpm", "start"]