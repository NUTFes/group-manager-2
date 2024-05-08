<template>
  <div class="main-content">
    <SubHeader pageTitle="在庫場所一覧">
      <CommonButton iconName="add_circle" :on_click="openModal">
        追加
      </CommonButton>
    </SubHeader>
    <Card width="100%">
      <table>
        <thead>
          <th v-for="(header, index) in headers" v-bind:key="index">
            {{ header }}
          </th>
        </thead>
        <tbody>
          <tr
            v-for="(stageOrder, index) in stageOrders"
            @click="
              () =>
                $router.push({
                  path: `/stage_orders/` + stageOrder.stage_order.id,
                })
            "
            :key="index"
          >
            <td>{{ stageOrder.stage_order.id }}</td>
            <td>{{ stageOrder.group.name }}</td>
            <td>{{ stageOrder.stage_order.is_sunny }}</td>
            <td>{{ stageOrder.stage_order_info.date }}</td>
            <td>{{ stageOrder.stage_order_info.stage_first }}</td>
            <td>{{ stageOrder.stage_order_info.stage_second }}</td>
            <td>{{ stageOrder.stage_order.created_at | formatDate }}</td>
            <td>{{ stageOrder.stage_order.updated_at | formatDate }}</td>
          </tr>
        </tbody>
      </table>
    </Card>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState({
      selfRoleId: (state) => state.users.role,
    }),
  },
  mounted() {
    window.scrollTo(0, 0);
  },
  methods: {
    reload: function () {
      this.$axios
        .get("/stocker_places", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.stocker_places = response.data;
        });
    },
    register: function () {
      this.$axios.defaults.headers.common["Content-Type"] = "application/json";
      var params = new URLSearchParams();
      params.append("name", this.name);
      params.append("stock_item_status", this.stock_item_status);
      params.append("assign_item_status", this.assign_item_status);
      this.$axios.post("/stocker_places", params).then((response) => {
        console.log(response);
        this.dialog = false;
        this.reload();
        this.name = "";
        this.stock_item_status = "";
        this.assign_item_status = "";
      });
    },
  },
};
</script>
