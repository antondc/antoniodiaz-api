# Dockerfile

# Build stage
FROM node:18-bookworm AS build

WORKDIR /app

ARG APP_ENV
ENV APP_ENV=${APP_ENV}
ARG NPM_TOKEN

# Native deps for modules like `mmmagic` (libmagic) + build tooling
RUN apt-get update -o Acquire::Retries=5 -o Acquire::http::Timeout="30" \
  && apt-get install -y --no-install-recommends \
    python3 make g++ \
    rsync \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY .npmrc ./.npmrc

RUN npm ci

COPY . .

RUN npm run build && npm run copy:sql

# Development runtime stage (HMR)
FROM node:18-bookworm AS development

WORKDIR /app

ARG APP_ENV
ENV APP_ENV=${APP_ENV}
ARG NPM_TOKEN

# Native deps for modules like `mmmagic` (libmagic) + build tooling
RUN apt-get update -o Acquire::Retries=5 -o Acquire::http::Timeout="30" \
  && apt-get install -y --no-install-recommends \
    python3 make g++ \
    rsync \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY .npmrc ./.npmrc

RUN npm ci

COPY . .

ENV NODE_ENV=development

CMD ["npm", "run", "http:dev"]


# Runtime stage
FROM node:18-bookworm-slim AS production

WORKDIR /app

# Runtime deps for `mmmagic`
RUN apt-get update -o Acquire::Retries=5 -o Acquire::http::Timeout="30" \
  && apt-get install -y --no-install-recommends libmagic1 ca-certificates \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production

COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

CMD ["node", "dist/src/infrastructure/http/http.js"]
