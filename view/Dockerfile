FROM node:16.12.0

WORKDIR /app/vue-project

RUN npm install -g @vue/cli

# CMD ["/bin/ash"]
CMD ["/bin/sh"]

COPY ./vue-project/package*.json /app/
#COPY ./vue-project/ /app/vue-project
RUN npm install

ENV VUE_APP_URL='https://group-manager-api.nutfes.net'
# ENV VUE_APP_PORT='3000'

#RUN npm run build
