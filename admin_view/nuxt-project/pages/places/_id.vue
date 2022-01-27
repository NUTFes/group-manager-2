<template>
  <div class="main-content">
    <SubHeader
      v-bind:pageTitle="place.name"
      pageSubTitle="会場一覧"
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
              <td>{{ place.id }}</td>
              <td>{{ place.name }}</td>
              <td>{{ place.created_at | formatDate }}</td>
              <td>{{ place.updated_at | formatDate }}</td>
            </tr>
            <tbody></tbody>
          </table>
        </Row>
      </Card>
    </Row>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  watchQuery: ["page"],
  computed: {
    ...mapState({
      selfRoleId: (state) => state.users.role,
    }),
  },
  data() {
    return {
      headers: [
        "ID",
        "名前",
        "登録日時",
        "編集日時",
      ],
    };
  },
  async asyncData({ $axios, route }) {
    const routeId = route.path.replace("/places/", "");
    const placeUrl = "/places/" + routeId;
    const placeRes = await $axios.$get(placeUrl);
    return {
      place: placeRes.data,
    };
  },
  methods: {
    reload: function () {
      console.log("reload");
      const url = "/places/" + this.$route.params.id;
      this.$axios
        .get(url, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.place = response.data;
          this.id = response.data.id;
          this.name = response.data.name;
        });
    },
    edit_dialog_open: function () {
      this.edit_dialog = true;
    },
    edit: function () {
      const edit_url = "/places/" + this.id + "?name=" + this.name;
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
      const url = "/places/" + this.$route.params.id;
      this.$axios.delete(url);
      this.$router.push("/places");
    },
  },
};
</script>

<style scoped>
td {
  width: 70%;
}
th {
  width: 30%;
}
</style>
