# Build用 コンテナ
FROM node:16.13.0 AS builder
WORKDIR /app/nuxt-project
COPY ./admin_view/nuxt-project /app/nuxt-project
RUN npm install
RUN npm run build

# 本番用 軽量 nodejs16
FROM gcr.io/distroless/nodejs16-debian11:nonroot
WORKDIR /app
LABEL org.opencontainers.image.source="https://github.com/NUTFes/group-manager-2"
ENV NODE_ENV production

COPY --from=builder /app/nuxt-project/nuxt.config.js ./nuxt.config.js
COPY --from=builder --chown=nonroot:nonroot /app/nuxt-project/.nuxt ./.nuxt
COPY --from=builder /app/nuxt-project/node_modules ./node_modules
COPY --from=builder /app/nuxt-project/package.json ./package.json
COPY --from=builder /app/nuxt-project/package-lock.json ./package-lock.json
COPY --from=builder /app/nuxt-project/store ./store
COPY --from=builder /app/nuxt-project/static ./static
COPY --from=builder /app/nuxt-project/assets ./assets

USER nonroot
EXPOSE 8000
CMD ["node_modules/.bin/nuxt", "start"]
