# Build用 コンテナ
FROM node:16.13.0 AS builder
WORKDIR /app
COPY ./user_front /app
RUN npm install
RUN npm run build

# 本番用 軽量 nodejs16
FROM gcr.io/distroless/nodejs16-debian11:nonroot
WORKDIR /app
LABEL org.opencontainers.image.source="https://github.com/NUTFes/group-manager-2"

COPY --from=builder --chown=nonroot:nonroot /app/.nuxt ./.nuxt
COPY --from=builder --chown=nonroot:nonroot /app/.output ./.output
COPY --from=builder /app/node_modules ./node_modules

USER nonroot
EXPOSE 8000
CMD ["node", ".output/server/index.mjs"]
