<template>
  <div class="main-content">
    <SubHeader pageTitle="会場申請一覧">
      <CommonButton iconName="add_circle" :on_click="openAddModal">
        追加
      </CommonButton>
    </SubHeader>

    <Card width="100%">
      <table>
        <thead>
          <th v-for="(header, index) in headers" :key="index">
            {{ header }}
          </th>
        </thead>
        <tbody>
          <tr
            v-for="(placeOrder, index) in placeOrders"
            :key="index"
            @click="
              () =>
                $router.push({
                  path: `/place_orders/` + placeOrder.place_order.id,
                })
            "
          >
            <td>{{ placeOrder.place_order.id }}</td>
            <td>{{ placeOrder.group.name }}</td>
            <td>{{ placeOrder.place_order_name.first }}</td>
            <td>{{ placeOrder.place_order_name.second }}</td>
            <td>{{ placeOrder.place_order_name.third }}</td>
            <td>{{ placeOrder.place_order.created_at | formatDate }}</td>
            <td>{{ placeOrder.place_order.updated_at | formatDate }}</td>
          </tr>
        </tbody>
      </table>
    </Card>

    <AddModal
      @close="closeAddModal"
      v-if="isOpenAddModal"
      title="会場申請の追加"
    >
      <template v-slot:form>
        <div>
          <h3>団体名</h3>
          <select v-model="appGroup">
            <option disabled value="">選択してください</option>
            <option
              v-for="group in groupList"
              :key="group.id"
              :value="group.id"
            >
              {{ group.name }}
            </option>
          </select>
        </div>
        <div>
          <h3>第一希望</h3>
          <select v-model="firstPlaceOrder">
            <option disabled value="">選択してください</option>
            <option
              v-for="place in placeList"
              :key="place.id"
              :value="place.id"
            >
              {{ place.name }}
            </option>
          </select>
        </div>
        <div>
          <h3>第二希望</h3>
          <select v-model="secondPlaceOrder">
            <option disabled value="">選択してください</option>
            <option
              v-for="place in placeList"
              :key="place.id"
              :value="place.id"
            >
              {{ place.name }}
            </option>
          </select>
        </div>
        <div>
          <h3>第三希望</h3>
          <select v-model="thirdPlaceOrder">
            <option disabled value="">選択してください</option>
            <option
              v-for="place in placeList"
              :key="place.id"
              :value="place.id"
            >
              {{ place.name }}
            </option>
          </select>
        </div>
      </template>
      <template v-slot:method>
        <CommonButton iconName="add_circle" :on_click="submitPlaceOrder"
          >登録</CommonButton
        >
      </template>
    </AddModal>
  </div>
</template>

<script>
export default {
  watchQuery: ["page"],
  data() {
    return {
      headers: [
        "ID",
        "参加団体",
        "第一希望",
        "第二希望",
        "第三希望",
        "登録日時",
        "編集日時",
      ],
      isOpenAddModal: false,
      groupList: [],
      placeList: [],
      appGroup: "",
      firstPlaceOrder: "",
      secondPlaceOrder: "",
      thirdPlaceOrder: "",
    };
  },
  async asyncData({ $axios }) {
    const placeOrderUrl = "/api/v1/get_place_order_index_for_admin_view";
    const placeOrderRes = await $axios.$get(placeOrderUrl);

    const currentFesYearId = 1;
    const groupsUrl =
      "/api/v1/get_groups_refinemented_by_fes_year?fes_year_id=" +
      currentFesYearId;
    const groupsRes = await $axios.$get(groupsUrl);

    const placesUrl = "/places";
    const placesRes = await $axios.$get(placesUrl);

    const yearUrl = "/fes_years";
    const yearRes = await $axios.$get(yearUrl);

    return {
      placeOrders: placeOrderRes.data,
      groupList: groupsRes.data,
      placeList: placesRes.data,
      yearList: yearRes,
    };
  },
  methods: {
    openAddModal() {
      this.isOpenAddModal = false;
      this.isOpenAddModal = true;
    },
    closeAddModal() {
      this.isOpenAddModal = false;
    },
    reload() {
      const placeOrderId = this.placeOrders.length + 1;
      const reUrl =
        "/api/v1/get_place_order_show_for_admin_view/" + placeOrderId;
      this.$axios.$get(reUrl).then((response) => {
        this.placeOrders.push(response.data);
      });
    },
    async submitPlaceOrder() {
      const postPlaceOrderUrl =
        "/place_orders/" +
        "?group_id=" +
        this.appGroup +
        "&first=" +
        this.firstPlaceOrder +
        "&second=" +
        this.secondPlaceOrder +
        "&third=" +
        this.thirdPlaceOrder;

      this.$axios.$post(postPlaceOrderUrl).then((response) => {
        this.appGroup = "";
        this.firstPlaceOrder = "";
        this.secondPlaceOrder = "";
        this.thirdPlaceOrder = "";
        this.reload();
        this.closeAddModal();
      });
    },
  },
};
</script>
