FROM node:12.14.1

WORKDIR /app/vue-project

RUN npm install -g @vue/cli

# CMD ["/bin/ash"]
CMD ["/bin/sh"]

COPY ./vue-project/package*.json /app/
COPY ./vue-project/ /app/vue-project
RUN npm install
RUN npm install --save axios
RUN npm install --save vuex-persistedstate
RUN npm install --save moment
RUN npm install --save vue2-timepicker
RUN npm install --save ismobilejs

ENV VUE_APP_URL='https://group-manager-api.nutfes.net'
# ENV VUE_APP_PORT='3000'

RUN npm run build
