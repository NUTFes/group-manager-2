<template>
  <div class="main-content">
    <SubHeader
      v-bind:pageTitle="shop.name"
      pageSubTitle="店一覧"
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
              <th>ID</th><td>{{ shop.id }}</td>
            </tr>
            <tr>
              <th>名前</th><td>{{ shop.name }}</td>
            </tr>
            <tr>
              <th>電話番号</th><td>{{ shop.tel }}</td>
            </tr>
            <tr>
              <th>開店時間</th><td>{{ shop.opening_hours }}</td>
            </tr>
            <tr>
              <th>住所</th><td>{{ shop.address }}</td>
            </tr>
            <tr>
              <th>登録日時</th><td>{{ shop.created_at | formatDate }}</td>
            </tr>
            <tr>
              <th>編集日時</th><td>{{ shop.updated_at | formatDate }}</td>
            </tr>
          </VerticalTable>
        </Row>
      </Card>
    </Row>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      selfRoleId: (state) => state.users.role,
    }),
  },
  data() {
    return {
    };
  },
  async asyncData({ $axios, route }) {
    const routeId = route.path.replace("/shops/", "");
    const shopUrl = "/shops/" + routeId;
    const shopRes = await $axios.$get(shopUrl);
    return {
      shop: shopRes.data,
    };
  },
  methods: {
    reload: function () {
      console.log("reload");
      const url = "/shops/" + this.$route.params.id;
      this.$axios
        .get(url, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.shop = response.data;
          this.id = response.data.id;
          this.name = response.data.name;
          this.tel = response.data.tel;
          this.opening_hours = response.data.opening_hours;
          this.address = response.data.address;
        });
    },
    edit_dialog_open: function () {
      this.edit_dialog = true;
    },
    edit: function () {
      const edit_url =
        "/shops/" +
        this.id +
        "?name=" +
        this.name +
        "&tel=" +
        this.tel +
        "&opening_hours=" +
        this.opening_hours +
        "&address=" +
        this.address;
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
      const url = "/shops/" + this.$route.params.id;
      this.$axios.delete(url);
      this.$router.push("/shops");
    },
  },
};
</script>
