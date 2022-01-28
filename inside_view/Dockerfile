FROM node:16.12.0

WORKDIR /app/vue-project

RUN npm install -g @vue/cli

CMD ["/bin/sh"]

COPY ./vue-project/package*.json /app/
RUN npm install

# ENV VUE_APP_URL='https://group-manager-api.nutfes.net'
# ENV VUE_APP_PORT='3000'
