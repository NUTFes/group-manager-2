FROM mcr.microsoft.com/playwright:v1.61.0-noble

ENV NODE_OPTIONS=--openssl-legacy-provider

WORKDIR /app
RUN chown pwuser:pwuser /app

COPY --chown=pwuser:pwuser nuxt-project/package*.json ./

USER pwuser

RUN npm ci

COPY --chown=pwuser:pwuser nuxt-project/ ./

CMD ["npm", "run", "test:e2e"]
