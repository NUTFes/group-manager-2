<template>
  <div class="main-content">
    <SubHeader v-bind:pageTitle="placeOrder.group.name" pageSubTitle="会場申請一覧">
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
                <td>{{ placeOrder.place_order.id }}</td>
                <td>{{ placeOrder.group.name }}</td>
                <td>{{ placeOrder.place_order_name.first }}</td>
                <td>{{ placeOrder.place_order_name.second }}</td>
                <td>{{ placeOrder.place_order_name.third }}</td>
                <td>{{ placeOrder.place_order.remark }}</td>
                <td>{{ placeOrder.place_order.created_at | formatDate }}</td>
                <td>{{ placeOrder.place_order.updated_at | formatDate }}</td>
              </tr>
            <tbody>
            </tbody>
          </table>
        </Row>
      </Card>
    </Row>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      headers: [
        "ID",
        "参加団体",
        "第一希望",
        "第二希望",
        "第三希望",
        "備考",
        "登録日時",
        "編集日時",
      ]
    };
  },
  async asyncData({ $axios, route }){
    const routeId = route.path.replace("/place_orders/", "");
    const url = "/api/v1/get_place_order_show_for_admin_view/" + routeId;
    const response = await $axios.$get(url);
    return {
      placeOrder: response.data,
      route: url,
    }
  },
  computed: {
    ...mapState({
      selfRoleId: (state) => state.users.role,
    }),
  },
  methods: {
    reload: function () {
      const url = "/api/v1/get_place_order/" + this.$route.params.id;
      this.$axios
        .get(url, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.place_order = response.data.place_order;
          this.power_orders = response.data.power_orders;
          this.total_power = response.data.total_power;
          this.group_id = response.data.place_order.group_id;
          this.group_name = response.data.group_name;
          this.first = response.data.first;
          this.second = response.data.second;
          this.third = response.data.third;
          this.first_id = response.data.place_order.first;
          this.second_id = response.data.place_order.second;
          this.third_id = response.data.place_order.third;
          this.remark = response.data.place_order.remark;
        });
    },
    edit_dialog_open: function () {
      this.$axios
        .get("/places", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.places = response.data;
        });
      this.$axios
        .get("/groups", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.group_list = response.data;
        });
      this.edit_dialog = true;
    },
    edit: function () {
      const edit_url =
        "/place_orders/" +
        this.place_order.id +
        "?group_id=" +
        this.group_id +
        "&first=" +
        this.first_id +
        "&second=" +
        this.second_id +
        "&third=" +
        this.third_id +
        "&remark=" +
        this.remark;
      console.log(edit_url);
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
      const url = "/place_orders/" + this.$route.params.id;
      this.$axios.delete(url);
      this.$router.push("/place_orders");
    },
  },
};
</script>
