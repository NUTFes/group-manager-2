<template>
  <div class="main-content">
    <SubHeader
      v-bind:pageTitle="news.title"
      pageSubTitle="お知らせ一覧"
    >
      <CommonButton iconName="edit"> 編集 </CommonButton>
      <CommonButton iconName="edit"> 削除 </CommonButton>
    </SubHeader>
    <Row>
      <Card padding="40px 150px" gap="20px">
        <Row justify="start">
          <h4>基本情報</h4>
          <VerticalTable>
            <tr>
              <th>ID</th><td>{{ news.id }}</td>
            </tr>
            <tr>
              <th>タイトル</th><td>{{ news.title }}</td>
            </tr>
            <tr>
              <th>内容</th><td>{{ news.body }}</td>
            </tr>
            <tr>
              <th>登録日時</th><td>{{ news.created_at | formatDate }}</td>
            </tr>
            <tr>
              <th>編集日時</th><td>{{ news.updated_at | formatDate }}</td>
            </tr>
        </VerticalTable>
        </Row>
      </Card>
    </Row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        "ID",
        "タイトル",
        "内容",
        "登録日時",
        "編集日時"
      ]
    };
  },
  async asyncData({ $axios, route }) {
    const routeId = route.path.replace("/news/", "");
    const newsUrl = "/news/" + routeId;
    const newsRes = await $axios.$get(newsUrl);
    return {
      news: newsRes.data,
    };
  },
  methods: {
    reload: function () {
      console.log("reload");
      const url = "/news/" + this.$route.params.id;
      this.$axios
        .get(url, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.news = response.data;
          (this.id = response.data), id;
          this.title = response.data.title;
          this.body = response.data.body;
        });
    },
    edit_dialog_open: function () {
      this.edit_dialog = true;
    },
    edit: function () {
      const edit_url =
        "/news/" + this.id + "?title=" + this.title + "&body=" + this.body;
      console.log(edit_url);
      this.$axios
        .put(edit_url, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log(response);
          this.reload();
          this.edit_dialog = false;
          this.success_snackbar = true;
        });
    },
    delete_yes: function () {
      const url = "/news/" + this.$route.params.id;
      this.$axios.delete(url);
      this.$router.push("/news");
    },
  },
};
</script>
