<template>
  <div>
    <div class="news-card">
      <div class="news-header">
        <span>お知らせ</span>
      </div>
      <div v-for="n in news" :key="n.id" class="news-content">
        <div class="news-title">{{ n.title }}</div>
        <div class="news-body">{{ n.body }}</div>
        <div class="news-date">更新日： {{ n.updated_at | moment }}</div>
      </div>
    </div>
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
        this.news = response.data.data;
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
      return id > this.news.length - this.times;
    },
  },
};
</script>

<style scoped>
.news-card {
  border-radius: 5px;
}
.news-header {
  color: #333333;
  font-size: 24px;
  font-weight: bold;
  background-color: #eceff1;
  padding: 1% 1% 1% 2%; 
}
.news-content {
  background-color: #ffffff;
  border-left: solid 1px #d3d3d3;
  border-right: solid 1px #d3d3d3;
  border-bottom: solid 1px #d3d3d3;
  border-top: solid 1px #d3d3d3;
  padding: 1% 1% 1% 2%; 
}
.news-title {
  font-size: 18px;
  color: #333333;
  font-weight: bold;
}
.news-body {
  font-size: 16px;
  background-color: #f5f5f5;
  margin-top: 1%;
  padding: 1% 1% 1% 1%;
}
.news-date {
  font-size: 12px;
  text-align: right;
  margin-top: 1%;
}
.acd-check{
  display: none;
}
.acd-label{
  background: #333;
  color: #fff;
  display: block;
  margin-bottom: 1px;
  padding: 10px;
}
.acd-content{
  border: 1px solid #333;
  height: 0;
  opacity: 0;
  padding: 0 10px;
  transition: .5s;
  visibility: hidden;
}
.acd-check:checked + .acd-label + .acd-content{
  height: 40px;
  opacity: 1;
  padding: 10px;
  visibility: visible;
}
</style>