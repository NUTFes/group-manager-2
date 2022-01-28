<template>
  <div class="main-content">
    <SubHeader pageTitle="物品申請一覧">
      <CommonButton iconName="add_circle" :on_click="openModal">
        追加
      </CommonButton>
      <CommonButton iconName="file_download" :on_click="downloadCSV">
        CSVダウンロード
      </CommonButton>
    </SubHeader>
    <Card width="100%">
      <Table>
      <template v-slot:table-header>
        <th v-for="(header, index) in headers" v-bind:key="index">
          {{ header }}
        </th>
      </template>
      <template v-slot:table-body>
        <tr
          v-for="(rentalOrder, index) in rentalOrders"
          @click="() => $router.push({path: `/rental_orders/` + rentalOrder.rental_order.id})"
          :key="index"
        >
          <td>{{ rentalOrder.rental_order.id }}</td>
          <td>{{ rentalOrder.group.name }}</td>
          <td>{{ rentalOrder.rental_item.name }}</td>
          <td>{{ rentalOrder.rental_order.num }}</td>
          <td>{{ rentalOrder.rental_order.created_at | formatDate }}</td>
          <td>{{ rentalOrder.rental_order.updated_at | formatDate }}</td>
        </tr>
      </template>
    </Table>
  </Card>
</div>
</template>

<script>
export default {
  watchQuery: ["page"],
  data() {
    return {
      headers: ["ID", "参加団体", "貸出物品", "個数", "登録日時", "編集日時"],
    };
  },
  async asyncData({ $axios }) {
    const url = "/api/v1/get_rental_order_index_for_admin_view";
    const rentalOrdersRes = await $axios.$get(url);
    const yearsUrl = "/fes_years";
    const yearsRes = await $axios.$get(yearsUrl);
    return {
      rentalOrders: rentalOrdersRes.data,
      yearList: yearsRes.data,
    };
  },
  methods: {
    reload: function () {
      this.$axios
        .get("/api/v1/get_rental_orders", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.rental_orders = response.data;
        });
    },
    register: function () {
      this.$axios.defaults.headers.common["Content-Type"] = "application/json";
      var params = new URLSearchParams();
      params.append("group_id", this.Group);
      params.append("rental_item_id", this.item_id);
      params.append("num", this.num);
      this.$axios.post("/rental_orders", params).then((response) => {
        console.log(response);
        this.dialog = false;
        this.reload();
        this.Group = "";
        this.item_id = "";
        this.num = "";
      });
    },
    async downloadCSV() {
      const url = "http://localhost:3000" + "/api/v1/get_rental_orders_csv/" + 1;
      window.open(
        url,
        "物品申請一覧_CSV"
      );
    },
  },
};
</script>
