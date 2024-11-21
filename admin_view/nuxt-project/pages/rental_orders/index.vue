<template>
  <div class="main-content" v-if="this.$role(roleID).rental_orders.read">
    <SubHeader pageTitle="物品申請一覧">
      <CommonButton v-if="this.$role(roleID).rental_orders.create" iconName="add_circle" :on_click="openAddModal">
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
          :on_click="refinementRentalOrders"
          value="year_num"
        >
          {{ refYears }}
        </SearchDropDown>
        <SearchDropDown
          :nameList="rentalItemsList"
          :on_click="refinementRentalOrders"
          value="name"
        >
          {{ refRentalItems }}
        </SearchDropDown>
        <SearchDropDown
          :nameList="groupCategories"
          :on_click="refinementRentalOrders"
          value="name"
        >
          {{ refGroupCategories }}
        </SearchDropDown>
      </template>
      <template v-slot:search>
        <SearchBar>
          <input
            v-model="searchText"
            @keypress.enter="searchRentalOrders"
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
            v-for="(rentalOrder, index) in rentalOrders"
            @click="
              () =>
                $router.push({
                  path: `/rental_orders/` + rentalOrder.rental_order.id,
                })
            "
            :key="index"
          >
            <td>{{ rentalOrder.rental_order.id }}</td>
            <td>{{ rentalOrder.group.name }}</td>
            <td>{{ rentalOrder.group.committee }}</td>
            <td>{{ rentalOrder.rental_item.name }}</td>
            <td>{{ rentalOrder.rental_order.num }}</td>
          </tr>
        </template>
      </Table>
    </Card>

    <AddModal
      @close="closeAddModal"
      v-if="isOpenAddModal"
      title="物品申請の追加"
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
          <h3>物品</h3>
          <select v-model="rentalItemID">
            <option disabled value="">選択してください</option>
            <option
              v-for="item in rentableItemList"
              :key="item.id"
              :value="item.id"
            >
              {{ item.name }}
            </option>
          </select>
        </div>
        <div>
          <h3>個数</h3>
          <input v-model="num" type="number" placeholder="入力してください" />
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
      headers: ["ID", "参加団体", "委員", "貸出物品", "個数"],
      isOpenAddModal: false,
      rentalOrders: [],
      refYears: "Year",
      refYearID: 0,
      refRentalItems: "Items",
      refRentalItemID: 0,
      refGroupCategories: "Categories",
      refCategoryID: 0,
      groupCategories: [],
      searchText: "",
      groupID: null,
      rentalItemID: null,
      num: null,
      groupList: [],
      rentableItemList: [],
      isOpenSnackBar: false,
    };
  },
  async asyncData({ $axios }) {
    const currentYearUrl = "/user_page_settings/1";
    const currentYearRes = await $axios.$get(currentYearUrl);
    const groupCategoryRes = await $axios.$get('group_categories');
    const url =
      "/api/v1/get_refinement_rental_orders?fes_year_id=" +
      currentYearRes.data.fes_year_id +
      "&rental_item_id=0";
    const rentalOrdersRes = await $axios.$post(url);
    const yearsUrl = "/fes_years";
    const yearsRes = await $axios.$get(yearsUrl);
    const rentalItemsUrl = "/rental_items";
    const rentalItemsRes = await $axios.$get(rentalItemsUrl);
    const currentYears = yearsRes.data.filter(function (element) {
      return element.id == currentYearRes.data.fes_year_id;
    });
    return {
      rentalOrders: rentalOrdersRes.data,
      yearList: yearsRes.data,
      rentalItemsList: rentalItemsRes.data,
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
    window.addEventListener('scroll', this.saveScrollPosition);

    const storedYearID = localStorage.getItem(this.$route.path + 'RefYear');
    if (storedYearID) {
      this.refYearID = Number(storedYearID);
      this.updateFilters(this.refYearID, this.yearList);
    } else {
      this.refYears = 'Year';
    }

    const storedRentalItemID = localStorage.getItem(this.$route.path + 'RefRentalItem');
    if (storedRentalItemID) {
      this.refRentalItemID = Number(storedRentalItemID);
      this.updateFilters(this.refRentalItemID, this.rentalItemsList);
    } else {
      this.refRentalItems = 'Items';
    }

    const storedCategoryID = localStorage.getItem(this.$route.path + 'RefCategory');
    if (storedCategoryID) {
      this.refCategoryID = Number(storedCategoryID);
      this.updateFilters(this.refCategoryID, this.groupCategories);
    } else {
      this.refGroupCategories = 'Categories';
    }

    this.fetchFilteredData();
    
  },
  methods: {
    saveScrollPosition() {
      localStorage.setItem('scrollPosition-' + this.$route.path, window.scrollY);
    },
    async refinementRentalOrders(item_id, name_list) {
      this.updateFilters(item_id, name_list);
      localStorage.setItem(this.$route.path + 'RefYear', this.refYearID);
      localStorage.setItem(this.$route.path + 'RefRentalItem', this.refRentalItemID);
      localStorage.setItem(this.$route.path + 'RefCategory', this.refCategoryID);
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
        // itemで絞り込むとき
      } else if (name_list.toString() == this.rentalItemsList.toString()) {
        this.refRentalItemID = item_id;
        // ALLの時
        if (item_id == 0) {
          this.refRentalItems = "ALL";
        } else {
          this.refRentalItems = name_list[item_id - 1].name;
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
      this.rentalOrders = [];
      const refUrl =
        "/api/v1/get_refinement_rental_orders?fes_year_id=" +
        this.refYearID +
        "&rental_item_id=" +
        this.refRentalItemID +
        "&group_category_id=" +
        this.refCategoryID;
      const refRes = await this.$axios.$post(refUrl);
      for (const res of refRes.data) {
        this.rentalOrders.push(res);
      }
      const storedSearchText = localStorage.getItem(
        this.$route.path + "SearchText"
      );
      if (storedSearchText) {
        this.searchText = storedSearchText;
        this.searchRentalOrders();
      }
      this.$nextTick(() => {
        window.scrollTo(0, parseInt(localStorage.getItem('scrollPosition-' + this.$route.path)))
      });
    },
    async searchRentalOrders() {
      localStorage.setItem(this.$route.path + "SearchText", this.searchText);
      this.rentalOrders = [];
      const searchUrl =
        "/api/v1/get_search_rental_orders?word=" + this.searchText;
      const refRes = await this.$axios.$post(searchUrl);
      for (const res of refRes.data) {
        this.rentalOrders.push(res);
      }
    },
    async openAddModal() {
      const groupUrl = "/api/v1/get_groups_refinemented_by_current_fes_year";
      const resGroups = await this.$axios.$get(groupUrl);
      this.groupList = resGroups.data;
      const rentableItemsUrl = "/api/v1/get_all_rentable_items";
      const resRentableItems = await this.$axios.$get(rentableItemsUrl);
      this.rentableItemList = resRentableItems.data;
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
      const url = "/api/v1/get_rental_order_show_for_admin_view/" + id;
      this.$axios.$get(url).then((response) => {
        this.rentalOrders.push(response.data);
      });
    },
    async submit() {
      const url =
        "/rental_orders?group_id=" +
        this.groupID +
        "&rental_item_id=" +
        this.rentalItemID +
        "&num=" +
        this.num;

      this.$axios.$post(url).then((response) => {
        this.openSnackBar("物品申請を追加しました");
        this.groupID = null;
        this.rentalItemID = null;
        this.num = null;
        this.reload(response.data.id);
        this.closeAddModal();
      });
    },
    async downloadCSV() {
      const url =
        this.$config.apiURL + "/api/v1/get_rental_orders_csv/" + this.refYearID;
      window.open(url, "物品申請一覧_CSV");
    },
  },
};
</script>
