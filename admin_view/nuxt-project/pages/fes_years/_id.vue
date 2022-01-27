<template>
  <div class="main-content">
    <SubHeader
      v-bind:pageTitle="fesYear.year_num"
      pageSubTitle="開催年一覧"
    >
      <CommonButton iconName="edit"> 編集 </CommonButton>
      <CommonButton iconName="edit"> 削除 </CommonButton>
    </SubHeader>
    <Row>
      <Card padding="40px 150px" gap="20px">
        <Row justify="start">
          <h4>基本情報</h4>
          <table class="vertical-table">
            <thead>
              <th v-for="(n, i) in headers" :key="i">
                {{ n }}
              </th>
            </thead>
            <tr>
              <td>{{ fesYear.id }}</td>
              <td>{{ fesYear.year_num }}</td>
              <td>{{ fesYear.created_at | formatDate }}</td>
              <td>{{ fesYear.updated_at | formatDate }}</td>
            </tr>
            <tbody></tbody>
          </table>
        </Row>
      </Card>
    </Row>
  </div>
</template>

<script>
export default {
  watchQuery: ["page"],
  data() {
    return {
      headers: [
        "ID",
        "開催年",
        "登録日時",
        "編集日時"
      ]
    };
  },
  async asyncData({ $axios, route }) {
    const routeId = route.path.replace("/fes_years/", "");
    const fesYearUrl = "/fes_years/" + routeId;
    const fesYearRes = await $axios.$get(fesYearUrl);
    return {
      fesYear: fesYearRes.data,
    };
  },
  methods: {
    reload: function () {
      const url = "/fes_years/" + this.$route.params.id;
      this.$axios
        .get(url, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.fes_year = response.data;
          this.id = response.data.id;
          this.year_num = response.data.year_num;
        });
    },
    edit_dialog_open: function () {
      this.edit_dialog = true;
    },
    edit: function () {
      const edit_url = "/fes_years/" + this.id + "?year_num=" + this.year_num;
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
      const url = "/fes_years/" + this.$route.params.id;
      this.$axios.delete(url);
      this.$router.push("/fes_years");
    },
  },
};
</script>
