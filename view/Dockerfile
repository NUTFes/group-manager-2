FROM node:12.14.1

WORKDIR /app/vue-project

RUN npm install -g @vue/cli

# CMD ["/bin/ash"]
CMD ["/bin/sh"]

COPY ./vue-project/package*.json /app/
# COPY ./vue-project/ /app/vue-project
RUN npm install
RUN npm install --save axios
RUN npm install --save vuex-persistedstate
RUN npm install --save moment
RUN npm install --save vue2-timepicker

ENV VUE_APP_URL='http://133.125.44.106:3000'
# ENV VUE_APP_PORT='3000'

RUN npm run build
