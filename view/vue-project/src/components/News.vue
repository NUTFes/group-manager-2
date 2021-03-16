<template>
  <div>
      <v-card class="mx-auto" outlined>
        <v-card-title style="background-color: #eceff1;" class="title">
          <v-icon class="pr-2" size="30">mdi-bell</v-icon>
          <b>お知らせ</b>
        </v-card-title>

        <v-list v-for="n in news" :key="n.id">
          <v-list-item v-if="isDisplayNews(n.id)" @click.stop="onClickBtn(n)">
            <v-list-item-content class="font-weight-medium">
              <v-col cols="4">{{ n.created_at | moment }}</v-col>
              <v-col cols="8">
                <v-list-item-title>{{ n.title }}</v-list-item-title>
              </v-col>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-dialog v-model="dialog" v-if="currentNews" activator max-width="1000">
          <v-card>
            <v-card-title class="headline grey lighten-2">
              <v-icon class="pr-2" size="40">mdi-bell-outline</v-icon>
              {{ currentNews.title }}
              <v-spacer></v-spacer>
              <v-btn text @click="dialog = false" fab>
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>
            <v-row>
              <v-col cols="2"></v-col>
              <v-col cols="8">
                <v-card-text class="body-1">
                  {{ currentNews.body }}
                </v-card-text>
              </v-col>
              <v-col cols="2"></v-col>
            </v-row>
            <v-row>
              <v-col cols="8"></v-col>
              <v-col cols="4">
                <v-card-text>
                  {{ currentNews.created_at | moment }}<br>
		  技大祭実行委員会
                </v-card-text>
              </v-col>
            </v-row>
          </v-card>
        </v-dialog>
      </v-card>
    </div>
</template>

<script>
import axios from "axios";
import moment from "moment";

export default {
  data() {
    return {
      right: null,
      news: null,
      dialog: false,
      currentNews: null,
      times: 5,
    };
  },

  mounted() {
    const url = process.env.VUE_APP_URL + "/news";
    axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.news = response.data;
      });
  },

  filters: {
    moment: function (date) {
      return moment(date).format("YYYY/MM/DD");
    },
  },

  methods: {
    onClickBtn(n) {
      this.currentNews = n;
      this.dialog = true;
    },

    isDisplayNews(id) {
      return id > this.news.length - this.times
    },
  },
};
</script>
