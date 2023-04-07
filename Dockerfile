# syntax=docker/dockerfile:1.2

# parallel building: Build stage
FROM registry.access.redhat.com/ubi8/nodejs-18-minimal:1-40 as build

WORKDIR /app

# USER root
# layer caching for pnpm install
RUN --mount=type=cache,target=/root/.cache npm install -g pnpm
# download packages
COPY pnpm-lock.yaml ./
RUN --mount=type=cache,target=/root/.cache \
    pnpm fetch
# install packages
COPY package.json ./
RUN --mount=type=cache,target=/root/.cache \
    pnpm install --prefer-offline
# copy over project files and compile
COPY . . 
RUN pnpm build

# parallel building: server
FROM registry.access.redhat.com/ubi9/ubi-minimal:9.1.0-1793 AS server
# caching pkgs
RUN --mount=type=cache,target=/root/.cache \
    microdnf update -y && \
    microdnf install -y nodejs && \
    microdnf clean all
RUN --mount=type=cache,target=/root/.cache \
    npm install -g pnpm

# Production stage
FROM server AS production
WORKDIR /app
COPY --from=build /app/ ./
RUN --mount=type=cache,target=/root/.cache \
    pnpm install --prefer-offline --prod
RUN pnpm install --prod
CMD ["pnpm", "start"]