<template>
  <div class="main-content">
    <SubHeader pageTitle="電力申請一覧">
      <CommonButton iconName="add_circle" :on_click="openModal">
        追加
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
            v-for="(powerOrder, index) in powerOrders"
            @click="
            () =>
            $router.push({
              path: `/power_orders/` + powerOrder.power_order.id,
            })
            "
            :key="index"
          >
            <td>{{ powerOrder.power_order.id }}</td>
            <td>{{ powerOrder.group.name }}</td>
            <td>{{ powerOrder.power_order.item }}</td>
            <td>{{ powerOrder.power_order.power }}</td>
            <td>{{ powerOrder.power_order.created_at | formatDate }}</td>
            <td>{{ powerOrder.power_order.updated_at | formatDate }}</td>
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
      powerOrders: [],
      headers: ["ID", "参加団体", "製品", "電力", "登録日時", "編集日時"],
    };
  },
  async asyncData({ $axios }) {
    const url = "/api/v1/get_power_order_index_for_admin_view";
    const powerOrdersRes = await $axios.$get(url);
    const yearsUrl = "/fes_years";
    const yearsRes = await $axios.$get(yearsUrl);
    return {
      powerOrders: powerOrdersRes.data,
      yearList: yearsRes.data,
    };
  },
  methods: {
    reload: function () {
      this.$axios
        .get("/api/v1/get_power_orders", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.power_orders = response.data;
        });
    },
    register: function () {
      this.$axios.defaults.headers.common["Content-Type"] = "application/json";
      var params = new URLSearchParams();
      params.append("group_id", this.Group);
      params.append("item", this.item);
      params.append("power", this.power);
      params.append("manufacturer", this.manufacturer);
      params.append("model", this.model);
      params.append("item_url", this.itemUrl);
      this.$axios.post("/power_orders", params).then((response) => {
        console.log(response);
        this.dialog = false;
        this.reload();
        this.Group = "";
        this.power_order.item = "";
        this.power_order.power = "";
        this.manufacturer = "";
        this.model = "";
        this.itemUrl = "";
      });
    },
  },
};
</script>
