# Build用 コンテナ
FROM node:16.12.0 AS builder
WORKDIR /app/vue-project
COPY ./view/vue-project /app/vue-project
RUN npm install
RUN npm run build

# 本番用 軽量 nodejs16
FROM gcr.io/distroless/nodejs16-debian11:nonroot
WORKDIR /app
LABEL org.opencontainers.image.source="https://github.com/NUTFes/group-manager-2"
ENV NODE_ENV production

COPY --from=builder /app/vue-project/vue.config.js ./
COPY --from=builder /app/vue-project/public ./public
COPY --from=builder --chown=vuejs:nodejs /app/vue-project/.vue ./.vue
COPY --from=builder /app/vue-project/node_modules ./node_modules
COPY --from=builder /app/vue-project/package.json ./package.json

USER nonroot
EXPOSE 8080
CMD ["node_modules/.bin/vue", "start"]
