<template>
  <div class="main-content">
    <SubHeader
      v-bind:pageTitle="rentalOrder.group.name"
      pageSubTitle="物品申請一覧"
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
            <th>ID</th><td>{{ rentalOrder.rental_order.id }}</td>
          </tr>
          <tr>
            <th>団体名</th><td>{{ rentalOrder.group.name }}</td>
          </tr>
          <tr>
            <th>物品名</th><td>{{ rentalOrder.rental_item.name }}</td>
          </tr>
          <tr>
            <th>個数</th><td>{{ rentalOrder.rental_order.num }}</td>
          </tr>
          <tr>
            <th>登録日時</th><td>{{ rentalOrder.rental_order.created_at | formatDate }}</td>
          </tr>
          <tr>
            <th>編集日時</th><td>{{ rentalOrder.rental_order.updated_at | formatDate }}</td>
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
      headers: ["ID", "参加団体", "貸出物品", "個数", "登録日時", "編集日時"],
    };
  },
  async asyncData({ $axios, route }) {
    const routeId = route.path.replace("/rental_orders/", "");
    const url = "/api/v1/get_rental_order_show_for_admin_view/" + routeId;
    const response = await $axios.$get(url);
    return {
      rentalOrder: response.data,
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
      const url = "/api/v1/get_rental_order/" + this.$route.params.id;
      this.$axios
        .get(url, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.rental_order = response.data.rental_order;
          this.group_id = response.data.rental_order.group_id;
          this.group = response.data.group;
          this.item = response.data.item;
          this.item_id = response.data.rental_order.rental_item_id;
          this.num = response.data.rental_order.num;
        });
    },
    edit_dialog_open: function () {
      this.$axios
        .get("/groups", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.group_list = response.data;
        });
      this.$axios
        .get("/rental_items", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.item_list = response.data;
        });
      this.edit_dialog = true;
    },
    edit: function () {
      const edit_url =
        "/rental_orders/" +
        this.rental_order.id +
        "?group_id=" +
        this.group_id +
        "&rental_item_id=" +
        this.item_id +
        "&num=" +
        this.num;
      this.$axios
        .put(edit_url, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.reload();
          this.edit_dialog = false;
          this.success_snackbar = true;
        });
    },
    delete_yes: function () {
      const url = "/rental_orders/" + this.$route.params.id;
      this.$axios.delete(url);
      this.$router.push("/rental_orders");
    },
  },
};
</script>
