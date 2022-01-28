<template>
  <div class="main-content">
    <SubHeader
      v-bind:pageTitle="rentalItem.name"
      pageSubTitle="物品一覧"
    >
      <CommonButton iconName="edit"> 編集 </CommonButton>
      <CommonButton iconName="delete"> 削除 </CommonButton>
    </SubHeader>
    <Row>
      <Card padding="40px 150px" gap="20px">
        <Row justify="start">
          <h4>基本情報</h4>
        </Row>
        <VerticalTable>
            <tr>
              <th>ID</th><td>{{ rentalItem.id }}</td>
            </tr>
            <tr>
              <th>名前</th><td>{{ rentalItem.name }}</td>
            </tr>
            <tr>
              <th>貸し出し</th><td>{{ rentalItem.is_rentable }}</td>
            </tr>
            <tr>
              <th>登録日時</th><td>{{ rentalItem.created_at | formatDate }}</td>
            </tr>
            <tr>
              <th>編集日時</th><td>{{ rentalItem.updated_at | formatDate }}</td>
            </tr>
          </VerticalTable>
      </Card>
    </Row>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  watchQuery: ["page"],
  data() {
    return {
      headers: [
        "ID",
        "名前",
        "貸し出し",
        "登録日時",
        "編集日時"
      ]
    };
  },
  async asyncData({ $axios, route }) {
    const routeId = route.path.replace("/rental_items/", "");
    const url = "/rental_items/" + routeId;
    const response = await $axios.$get(url);
    return {
      rentalItem: response.data,
      route: url,
    };
  },
  computed: {
    ...mapState({
      selfRoleId: (state) => state.users.role,
    }),
  },
  methods: {
    reload: function () {
      console.log("reload");
      const url = "/rental_items/" + this.$route.params.id;
      this.$axios
        .get(url, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.rental_item = response.data;
          this.id = response.data.id;
          this.name = response.data.name;
          this.is_rentable = response.data.is_rentable;
        });
    },
    edit_dialog_open: function () {
      this.edit_dialog = true;
    },
    edit: function () {
      const edit_url =
        "/rental_items/" +
        this.id +
        "?name=" +
        this.name +
        "&is_rentable=" +
        this.is_rentable;
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
      const url = "/rental_items/" + this.$route.params.id;
      this.$axios.delete(url);
      this.$router.push("/rental_items");
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
