<template>
  <div class="main-content">
    <SubHeader pageTitle="会場申請一覧">
      <CommonButton v-if="this.$role(roleID).place_orders.create" iconName="add_circle" :on_click="openAddModal">
        追加
      </CommonButton>
      <CommonButton iconName="file_download" :on_click="downloadCSV">
        CSVダウンロード
      </CommonButton>
    </SubHeader>

    <SubSubHeader>
      <template v-slot:refinement>
        <SearchDropDown
          :nameList="yearList"
          :on_click="refinementPlaceOrders"
          value="year_num"
        >
          {{ refYears }}
        </SearchDropDown>
        <SearchDropDown
          :nameList="placeList"
          :on_click="refinementPlaceOrders"
          value="name"
        >
          {{ refPlaces }}
        </SearchDropDown>
      </template>
      <template v-slot:search>
        <SearchBar>
          <input
            v-model="searchText"
            @keypress.enter="searchPlaceOrders"
            type="text"
            size="25"
            placeholder="search"
          />
        </SearchBar>
      </template>
    </SubSubHeader>

    <Card width="100%">
      <Table>
        <template v-slot:table-header>
          <th v-for="(header, index) in headers" :key="index">
            {{ header }}
          </th>
        </template>
        <template v-slot:table-body>
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
        </template>
      </Table>
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
        <div>
          <h3>備考</h3>
          <textarea v-model="remark" placeholder="入力してください" />
        </div>
      </template>
      <template v-slot:method>
        <CommonButton iconName="add_circle" :on_click="submitPlaceOrder"
          >登録</CommonButton
        >
      </template>
    </AddModal>
    <SnackBar v-if="isOpenSnackBar" @close="closeSnackBar">
      {{ message }}
    </SnackBar>
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
        "参加団体",
        "第一希望",
        "第二希望",
        "第三希望",
        "登録日時",
        "編集日時",
      ],
      isOpenAddModal: false,
      isOpenSnackBar: false,
      placeList: [],
      appGroup: "",
      placeOrders: [],
      firstPlaceOrder: "",
      secondPlaceOrder: "",
      thirdPlaceOrder: "",
      remark: "",
      refYears: "Year",
      refYearID: 0,
      refPlaces: "Places",
      refPlaceID: 0,
      searchText: "",
      groupList: null,
    };
  },
  async asyncData({ $axios }) {
    const currentYearUrl = "/user_page_settings/1";
    const currentYearRes = await $axios.$get(currentYearUrl);
    // const placeOrderUrl = "/api/v1/get_place_order_index_for_admin_view";
    const placeOrderUrl =
      "/api/v1/get_refinement_place_orders?fes_year_id=" +
      currentYearRes.data.fes_year_id;
    const placeOrderRes = await $axios.$post(placeOrderUrl);

    const placesUrl = "/places";
    const placesRes = await $axios.$get(placesUrl);

    const yearUrl = "/fes_years";
    const yearsRes = await $axios.$get(yearUrl);

    const currentYears = yearsRes.data.filter(function (element) {
      return element.id == currentYearRes.data.fes_year_id;
    });

    return {
      placeOrders: placeOrderRes.data,
      placeList: placesRes.data,
      yearList: yearsRes.data,
      refYearID: currentYearRes.data.fes_year_id,
      refYears: currentYears[0].year_num,
    };
  },
  computed: {
    ...mapState({
      roleID: (state) => state.users.role,
    }),
  },
  methods: {
    async refinementPlaceOrders(item_id, name_list) {
      // fes_yearで絞り込むとき
      if (name_list.toString() == this.yearList.toString()) {
        this.refYearID = item_id;
        // ALLの時
        if (item_id == 0) {
          this.refYears == "ALL";
        } else {
          this.refYears = name_list[item_id - 1].year_num;
        }
      } else if (name_list.toString() == this.placeList.toString()) {
        this.refPlaceID = item_id;
        // ALLの時
        if (item_id == 0) {
          this.refPlaces = "ALL";
        } else {
          this.refPlaces = name_list[item_id - 1].name;
        }
      }
      this.placeOrders = [];
      const refUrl =
        "/api/v1/get_refinement_place_orders?fes_year_id=" +
        this.refYearID +
        "&place_id=" +
        this.refPlaceID;
      console.log(refUrl);
      const refRes = await this.$axios.$post(refUrl);
      for (const res of refRes.data) {
        this.placeOrders.push(res);
      }
    },
    async searchPlaceOrders() {
      this.placeOrders = [];
      const searchUrl =
        "/api/v1/get_search_place_orders?word=" + this.searchText;
      const refRes = await this.$axios.$post(searchUrl);
      for (const res of refRes.data) {
        this.placeOrders.push(res);
      }
    },
    async openAddModal() {
      const url = "/api/v1/get_groups_refinemented_by_current_fes_year";
      const resGroups = await this.$axios.$get(url);
      this.groupList = resGroups.data;
      this.isOpenAddModal = true;
    },
    closeAddModal() {
      this.isOpenAddModal = false;
    },
    openSnackBar(message) {
      this.message = message;
      this.isOpenSnackBar = true;
      setTimeout(this.closeSnackBar, 2000);
    },
    closeSnackBar() {
      this.isOpenSnackBar = false;
    },
    reload(id) {
      const placeOrderUrl = "/api/v1/get_place_order_show_for_admin_view/" + id;
      this.$axios.$get(placeOrderUrl).then((response) => {
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
        this.thirdPlaceOrder +
        "&remark=" +
        this.remark;

      this.$axios.$post(postPlaceOrderUrl).then((response) => {
        this.openSnackBar(this.addGroup + "の申請を追加しました");
        this.appGroup = "";
        this.firstPlaceOrder = "";
        this.secondPlaceOrder = "";
        this.thirdPlaceOrder = "";
        this.reload(response.data.id);
        this.closeAddModal();
      });
    },
    async downloadCSV() {
      const url =
        this.$config.apiURL + "/api/v1/get_place_orders_csv/" + this.refYearID;
      window.open(url, "会場申請一覧_CSV");
    },
  },
};
</script>
