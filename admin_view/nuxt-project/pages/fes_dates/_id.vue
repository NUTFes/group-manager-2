<template>
  <div class="main-content">
    <SubHeader
      v-bind:pageTitle="fesDate.fes_date.date"
      pageSubTitle="開催日一覧"
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
              <th>ID</th><td>{{ fesDate.fes_date.id }}</td>
            </tr>
            <tr>
              <th>開催年</th><td>{{ fesDate.fes_year.year_num }}</td>
            </tr>
            <tr>
              <th>何日目</th><td>{{ fesDate.fes_date.days_num }}</td>
            </tr>
            <tr>
              <th>開催日</th><td>{{ fesDate.fes_date.date }}</td>
            </tr>
            <tr>
              <th>曜日</th><td>{{ fesDate.fes_date.day }}</td>
            </tr>
            <tr>
              <th>登録日時</th><td>{{ fesDate.fes_date.created_at | formatDate }}</td>
            </tr>
            <tr>
              <th>編集日時</th><td>{{ fesDate.fes_date.updated_at | formatDate }}</td>
            </tr>
          </VerticalTable>
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
        "何日目",
        "開催日",
        "曜日",
        "登録日時",
        "編集日時"
      ]
    };
  },
  async asyncData({ $axios, route }) {
    const routeId = route.path.replace("/fes_dates/", "");
    const fesDateUrl = "/fes_dates/" + routeId;
    const fesDateRes = await $axios.$get(fesDateUrl);
    return {
      fesDate: fesDateRes.data,
    };
  },
  methods: {
    reload: function () {
      const url = "/api/v1/get_fes_date/" + this.$route.params.id;
      this.$axios
        .get(url, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.fes_date = response.data;
          this.id = this.fes_date.fes_date.id;
          this.days_num = this.fes_date.fes_date.days_num;
          this.date = this.fes_date.fes_date.date;
          this.day = this.fes_date.fes_date.day;
          this.fes_year_id = this.fes_date.fes_date.fes_year_id;
        });
    },
    edit_dialog_open: function () {
      this.$axios
        .get("/fes_years", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.fes_years = response.data;
        });
      this.edit_dialog = true;
    },
    edit: function () {
      const edit_url =
        "/fes_dates/" +
        this.id +
        "?days_num=" +
        this.days_num +
        "&date=" +
        this.date +
        "&day=" +
        this.day +
        "&fes_year_id=" +
        this.fes_year_id;
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
      const url = "/fes_dates/" + this.id;
      this.$axios.delete(url);
      this.$router.push("/fes_dates");
    },
  },
};
</script>
