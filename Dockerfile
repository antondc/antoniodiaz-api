# Build stage
FROM node:18-bookworm AS build

WORKDIR /app

# Native deps for modules like `mmmagic` (libmagic) + build tooling
RUN apt-get update -o Acquire::Retries=5 -o Acquire::http::Timeout="30" \
  && apt-get install -y --no-install-recommends \
    python3 make g++ \
    rsync \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY .npmrc ./.npmrc

# If you use private packages, set NPM_TOKEN at build time:
COPY .npmrc ./.npmrc
ARG NPM_TOKEN
RUN npm ci

COPY . .

RUN npm run build \
  && npm run copy:sql


# Runtime stage
FROM node:18-bookworm-slim

WORKDIR /app

# Runtime deps for `mmmagic`
RUN apt-get update -o Acquire::Retries=5 -o Acquire::http::Timeout="30" \
  && apt-get install -y --no-install-recommends libmagic1 ca-certificates \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production

COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# Media is written at runtime; create it so bind-mounts work cleanly.
RUN mkdir -p media

EXPOSE 3002

CMD ["node", "dist/src/infrastructure/http/http.js"]
