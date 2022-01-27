<template>
  <div class="main-content">
    <SubHeader pageTitle="お知らせ一覧">
      <CommonButton iconName="add_circle" :on_click="openAddModal">
        追加
      </CommonButton>
    </SubHeader>

    <Card width="100%">
      <table>
        <thead>
          <th v-for="(header, index) in headers" :key="index">
            {{ header }}
          </th>
        </thead>
        <tbody>
          <tr
            v-for="(n, index) in news"
            :key="index"
            @click="
              () =>
                $router.push({
                  path: `/news/` + n.id,
                })
            "
          >
            <td>{{ n.id }}</td>
            <td>{{ n.title }}</td>
            <td>{{ n.created_at | formatDate }}</td>
            <td>{{ n.updated_at | formatDate }}</td>
          </tr>
        </tbody>
      </table>
    </Card>
  </div>
</template>

<script>
export default {
  watchQuery: ["page"],
  data() {
    return {
      headers: [
        "ID",
        "タイトル",
        "日時",
        "編集日時",
      ],
    };
  },
  async asyncData({ $axios }) {
    const newsUrl = "/news"
    const newsRes = await $axios.$get(newsUrl);
    return {
      news: newsRes.data,
    };
  },
  methods: {
    register: function () {
      this.$axios.defaults.headers.common["Content-Type"] = "application/json";
      var params = new URLSearchParams();
      params.append("title", this.title);
      params.append("body", this.body);
      this.$axios.post("/news", params);
    },
    reload: function () {
      this.$axios
        .get("/news", {
          headers: {
            "Content-Type": "application/json",
            dialog: false,
          },
        })
        .then((response) => {
          this.news = response.data;
        });
    },
  },
};
</script>
