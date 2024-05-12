<template>
  <div class="main-content" v-if="this.$role(roleID).power_orders.read">
    <SubHeader pageTitle="電力申請一覧">
      <CommonButton
        v-if="this.$role(roleID).power_orders.create"
        iconName="add_circle"
        :on_click="openAddModal"
      >
        追加
      </CommonButton>
      <CommonButton iconName="file_download" :on_click="downloadCSV">
        CSV
      </CommonButton>
    </SubHeader>

    <SubSubHeader>
      <template v-slot:refinement>
        <SearchDropDown
          :nameList="yearList"
          :on_click="refinementPowerOrders"
          value="year_num"
        >
          {{ refYears }}
        </SearchDropDown>
        <SearchDropDown
          :nameList="powerList"
          :on_click="refinementPowerOrders"
          value="power"
        >
          {{ refPower }} [w] 以上
        </SearchDropDown>
        <SearchDropDown
          :nameList="groupCategories"
          :on_click="refinementPowerOrders"
          value="name"
        >
          {{ refGroupCategories }}
        </SearchDropDown>
      </template>
      <template v-slot:search>
        <SearchBar>
          <input
            v-model="searchText"
            @keypress.enter="searchPowerOrders"
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
            <td>{{ powerOrder.group.committee }}</td>
            <td>{{ powerOrder.power_order.item }}</td>
            <td>{{ powerOrder.power_order.power }}</td>
          </tr>
        </template>
      </Table>
    </Card>

    <AddModal
      @close="closeAddModal"
      v-if="isOpenAddModal"
      title="電力申請の追加"
    >
      <template v-slot:form>
        <div>
          <h3>団体名</h3>
          <select v-model="groupID">
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
          <h3>製品</h3>
          <input v-model="item" placeholder="入力してください" />
        </div>
        <div>
          <h3>電力</h3>
          <input v-model="power" type="number" placeholder="入力してください" />
        </div>
        <div>
          <h3>メーカー</h3>
          <input v-model="manufacturer" placeholder="入力してください" />
        </div>
        <div>
          <h3>型番</h3>
          <input v-model="model" placeholder="入力してください" />
        </div>
        <div>
          <h3>製品URL</h3>
          <input v-model="itemUrl" placeholder="入力してください" />
        </div>
      </template>
      <template v-slot:method>
        <CommonButton iconName="add_circle" :on_click="submit"
          >登録</CommonButton
        >
      </template>
    </AddModal>

    <SnackBar v-if="isOpenSnackBar" @close="closeSnackBar">
      {{ message }}
    </SnackBar>
  </div>
  <h1 v-else>閲覧権限がありません</h1>
</template>

<script>
import { mapState } from "vuex";
export default {
  watchQuery: ["page"],
  data() {
    return {
      powerOrders: [],
      headers: ["ID", "参加団体", "委員", "製品", "電力 [w]"],
      isOpenAddModal: false,
      refYears: "Years",
      refYearID: 0,
      refPower: "0",
      refGroupCategories: "Categories",
      refCategoryID: 0,
      searchText: "",
      powerList: [
        { id: 1, power: 0 },
        { id: 2, power: 100 },
        { id: 3, power: 200 },
        { id: 4, power: 300 },
        { id: 5, power: 400 },
        { id: 6, power: 500 },
        { id: 7, power: 600 },
        { id: 8, power: 700 },
        { id: 9, power: 800 },
        { id: 10, power: 900 },
        { id: 11, power: 1000 },
      ],
      groupCategories: [],
      groupID: null,
      item: null,
      power: 0,
      manufacturer: null,
      model: null,
      itemUrl: null,
      isOpenSnackBar: false,
    };
  },
  async asyncData({ $axios }) {
    const currentYearUrl = "/user_page_settings/1";
    const currentYearRes = await $axios.$get(currentYearUrl);
    const groupCategoryRes = await $axios.$get('group_categories');
    // const url = "/api/v1/get_power_order_index_for_admin_view";
    const url =
      "/api/v1/get_refinement_power_orders?fes_year_id=" +
      currentYearRes.data.fes_year_id +
      "&power=0";
    const powerOrdersRes = await $axios.$post(url);
    const yearsUrl = "/fes_years";
    const yearsRes = await $axios.$get(yearsUrl);
    const currentYears = yearsRes.data.filter(function (element) {
      return element.id == currentYearRes.data.fes_year_id;
    });
    return {
      powerOrders: powerOrdersRes.data,
      yearList: yearsRes.data,
      groupCategories: groupCategoryRes.data,
      refYearID: currentYearRes.data.fes_year_id,
      refYears: currentYears[0].year_num,
    };
  },
  computed: {
    ...mapState({
      roleID: (state) => state.users.role,
    }),
  },
  mounted() {
    const storedYearID = localStorage.getItem(this.$route.path + "RefYear");
    if (storedYearID) {
      this.refYearID = Number(storedYearID);
      this.updateFilters(this.refYearID, this.yearList);
    } else {
      this.refYears = "Year";
    }

    const storedPower = localStorage.getItem(this.$route.path + "RefPower");
    if (storedPower) {
      this.refPower = Number(storedPower);
      this.updateFilters(this.refPower, this.powerList);
    } else {
      this.refPower = 0;
    }

    const storedCategoryID = localStorage.getItem(
      this.$route.path + "RefCategory"
    );
    if (storedCategoryID) {
      this.refCategoryID = Number(storedCategoryID);
      this.updateFilters(this.refCategoryID, this.groupCategories);
    } else {
      this.refGroupCategories = "Category";
    }

    this.fetchFilteredData();

    window.addEventListener("scroll", this.saveScrollPosition);
  },
  methods: {
    saveScrollPosition() {
      localStorage.setItem(
        "scrollPosition-" + this.$route.path,
        window.scrollY
      );
    },
    async refinementPowerOrders(item_id, name_list) {
      this.updateFilters(item_id, name_list);
      localStorage.setItem(this.$route.path + "RefYear", this.refYearID);
      localStorage.setItem(this.$route.path + "RefPower", this.refPower);
      localStorage.setItem(
        this.$route.path + "RefCategory",
        this.refCategoryID
      );
      this.fetchFilteredData();
    },
    updateFilters(item_id, name_list) {
      // fes_yearで絞り込むとき
      if (name_list.toString() == this.yearList.toString()) {
        this.refYearID = item_id;
        // ALLの時
        if (item_id == 0) {
          this.refYears = "ALL";
        } else {
          this.refYears = name_list[item_id - 1].year_num;
        }
        // powerで絞り込むとき
      } else if (name_list.toString() == this.powerList.toString()) {
        // ALLの時
        if (item_id == 0) {
          this.refPower = 0;
        } else {
          this.refPower = name_list[item_id - 1].power;
        }
        // group_categoryで絞り込むとき
      } else if (name_list.toString() == this.groupCategories.toString()) {
        this.refCategoryID = item_id;
        // ALLの時
        if (item_id == 0) {
          this.refGroupCategories = "ALL";
        } else {
          this.refGroupCategories = name_list[item_id - 1].name;
        }
      }
    },
    async fetchFilteredData() {
      this.powerOrders = [];
      const refUrl =
        "/api/v1/get_refinement_power_orders?fes_year_id=" +
        this.refYearID +
        "&power=" +
        this.refPower +
        "&group_category_id=" +
        this.refCategoryID;
      const refRes = await this.$axios.$post(refUrl);
      for (const res of refRes.data) {
        this.powerOrders.push(res);
      }
      const storedSearchText = localStorage.getItem(
        this.$route.path + "SearchText"
      );
      if (storedSearchText) {
        this.searchText = storedSearchText;
        this.searchPowerOrders();
      }
      this.$nextTick(() => {
        window.scrollTo(
          0,
          parseInt(localStorage.getItem("scrollPosition-" + this.$route.path))
        );
      });
    },
    async searchPowerOrders() {
      localStorage.setItem(this.$route.path + "SearchText", this.searchText);
      this.powerOrders = [];
      const searchUrl =
        "/api/v1/get_search_power_orders?word=" + this.searchText;
      const refRes = await this.$axios.$post(searchUrl);
      for (const res of refRes.data) {
        this.powerOrders.push(res);
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
      const powerOrderUrl = "/api/v1/get_power_order_show_for_admin_view/" + id;
      this.$axios.$get(powerOrderUrl).then((response) => {
        this.powerOrders.push(response.data);
      });
    },
    async submit() {
      const url =
        "/power_orders?group_id=" +
        this.groupID +
        "&item=" +
        this.item +
        "&power=" +
        this.power +
        "&manufacturer=" +
        this.manufacturer +
        "&model=" +
        this.model +
        "&item_url=" +
        this.itemUrl;
      this.$axios.$post(url).then((response) => {
        this.reload(response.data.id);
        this.openSnackBar(this.item + "を追加しました");
        this.closeAddModal();
        this.groupID = null;
        this.item = null;
        this.power = null;
        this.manufacturer = null;
        this.model = null;
        this.item_url = null;
      });
    },
    async downloadCSV() {
      const url =
        this.$config.apiURL + "/api/v1/get_power_orders_csv/" + this.refYearID;
      window.open(url, "電力申請_CSV");
    },
  },
};
</script>
