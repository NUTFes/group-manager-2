<template>
  <div class="main-content">
    <SubHeader pageTitle="購入食品申請一覧">
      <CommonButton v-if="this.$role(roleID).purchase_lists.create" iconName="add_circle" :on_click="openAddModal">
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
          :on_click="refinementPurchaseLists"
          value="year_num"
        >
          {{ refYears }}
        </SearchDropDown>
        <SearchDropDown
          :nameList="isFreshList"
          :on_click="refinementPurchaseLists"
          value="value"
        >
          {{ refIsFresh }}
        </SearchDropDown>
      </template>
      <template v-slot:search>
        <SearchBar>
          <input
            v-model="searchText"
            @keypress.enter="searchPurchaseLists"
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
            v-for="(purchaseList, index) in purchaseLists"
            @click="
              () =>
                $router.push({
                  path: `/purchase_lists/` + purchaseList.purchase_list.id,
                })
            "
            :key="index"
          >
            <td>{{ purchaseList.purchase_list.id }}</td>
            <td>{{ purchaseList.group.name }}</td>
            <td>{{ purchaseList.purchase_list_info.food_product }}</td>
            <td>{{ purchaseList.purchase_list.items }}</td>
            <td>{{ purchaseList.purchase_list.is_fresh }}</td>
          </tr>
        </template>
      </Table>
    </Card>

    <AddModal
      @close="closeAddModal"
      v-if="isOpenAddModal"
      title="購入品申請の追加"
    >
      <template v-slot:form>
        <div>
          <h3>団体名</h3>
          <select v-model="groupID" @change="getFoodProducts">
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
          <h3>販売食品</h3>
          <select v-model="foodProductID">
            <option disabled value="">選択してください</option>
            <option
              v-for="list in foodProductsList"
              :key="list.id"
              :value="list.id"
            >
              {{ list.name }}
            </option>
          </select>
        </div>
        <div>
          <h3>品名</h3>
          <input v-model="items" placeholder="入力してください" />
        </div>
        <div>
          <h3>購入店</h3>
          <select v-model="shopID">
            <option disabled value="">選択してください</option>
            <option
              v-for="list in shopList"
              :key="list.id"
              :value="list.id"
            >
              {{ list.name }}
            </option>
          </select>
        </div>
        <div>
          <h3>購入日</h3>
          <select v-model="fesDateID">
            <option disabled value="">選択してください</option>
            <option
              v-for="list in fesDatesList"
              :key="list.id"
              :value="list.id"
            >
              {{ list.date }}
            </option>
          </select>
        </div>
        <div>
          <h3>なまものか</h3>
          <select v-model="isFresh">
            <option disabled value="">選択してください</option>
            <option
              v-for="list in isFreshList"
              :key="list.id"
              :value="list.value"
            >
              {{ list.text }}
            </option>
          </select>
        </div>
      </template>
      <template v-slot:method>
        <CommonButton iconName="add_circle" :on_click="submit"
          >登録</CommonButton
        >
      </template>
    </AddModal>
    <SnackBar
      v-if="isOpenSnackBar"
      @close="closeSnackBar"
    >
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
        "販売食品",
        "購入品",
        "なまもの",
      ],
      isOpenAddModal: false,
      isOpenSnackBar: false,
      isFreshList: [
        { id: 1, text: "はい", value: true },
        { id: 2, text: "いいえ", value: false },
      ],
      groupList: [],
      shopList: [],
      fesDatesList: [],
      refYears: "Years",
      refYearID: 0,
      refIsFresh: "なまもの",
      refIsFreshID: 0,
      searchText: "",
      purchaseLists: [],
      foodProductsList: [],
      groupID: null,
      foodProductID: null,
      items: null,
      shopID: null,
      fesDateID: null,
      isFresh: null,
    };
  },
  async asyncData({ $axios }) {
    const currentYearUrl = "/user_page_settings/1";
    const currentYearRes = await $axios.$get(currentYearUrl);

    // const url = "/api/v1/get_purchase_list_index_for_admin_view";
    const url =
      "/api/v1/get_refinement_purchase_lists?fes_year_id=" +
      currentYearRes.data.fes_year_id +
      "&is_fresh=0";
    const purchaseListsRes = await $axios.$post(url);
    const yearsUrl = "/fes_years";
    const yearsRes = await $axios.$get(yearsUrl);
    const currentYears = yearsRes.data.filter(function (element) {
      return element.id == currentYearRes.data.fes_year_id;
    });
    return {
      purchaseLists: purchaseListsRes.data,
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
    async getFoodProducts(){
      const url = "/api/v1/get_food_products_by_group_id/" + this.groupID
      const res = await this.$axios.$get(url)
      this.foodProductsList = res.data
    },
    async openAddModal() {
      const groupUrl = "/api/v1/get_groups_refinemented_by_current_fes_year";
      const resGroups = await this.$axios.$get(groupUrl);
      this.groupList = resGroups.data;
      const shopUrl = "/shops";
      const resShops = await this.$axios.$get(shopUrl);
      this.shopList = resShops.data;
      const fesDatesListUrl = "/api/v1/get_current_fes_dates";
      const resFesDates = await this.$axios.$get(fesDatesListUrl);
      this.fesDatesList = resFesDates.data;
      this.isOpenAddModal = false;
      this.isOpenAddModal = true;
    },
    closeAddModal() {
      this.isOpenAddModal = false;
    },
    async refinementPurchaseLists(item_id, name_list) {
      // fes_yearで絞り込むとき
      if (name_list.toString() == this.yearList.toString()) {
        this.refYearID = item_id;
        // ALLの時
        if (item_id == 0) {
          this.refYears = "ALL";
        } else {
          this.refYears = name_list[item_id - 1].year_num;
        }
        // is_freshで絞り込むとき
      } else if (Object.is(name_list, this.isFreshList)) {
        this.refIsFreshID = item_id;
        // ALLの時
        if (item_id == 0) {
          this.refIsFresh = "ALL";
        } else {
          this.refIsFresh = name_list[item_id - 1].value;
        }
      }
      this.purchaseLists = [];
      const refUrl =
        "/api/v1/get_refinement_purchase_lists?fes_year_id=" +
        this.refYearID +
        "&is_fresh=" +
        this.refIsFreshID;
      const refRes = await this.$axios.$post(refUrl);
      for (const res of refRes.data) {
        this.purchaseLists.push(res);
      }
    },
    async searchPurchaseLists() {
      this.purchaseLists = [];
      const searchUrl =
        "/api/v1/get_search_purchase_lists?word=" + this.searchText;
      const refRes = await this.$axios.$post(searchUrl);
      for (const res of refRes.data) {
        this.purchaseLists.push(res);
      }
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
      const url = "/api/v1/get_purchase_list_show_for_admin_view/" + id;
      this.$axios.$get(url).then((response) => {
        this.purchaseLists.push(response.data);
      });
    },
    async submit() {
      const url =
        "/purchase_lists" +
        "?food_product_id=" + 
        this.foodProductID +
        "&shop_id=" +
        this.shopID +
        "&fes_date_id=" +
        this.fesDateID +
        "&items=" +
        this.items +
        "&is_fresh=" + 
        this.isFresh;

      this.$axios.$post(url).then((response) => {
        this.openSnackBar(this.items + "を追加しました");
        this.groupID = null
        this.items = null
        this.foodProductID = null
        this.shopID = null
        this.isFresh = null
        this.reload(response.data.id);
        this.closeAddModal();
      });
    },
    async downloadCSV() {
      const url =
        this.$config.apiURL +
        "/api/v1/get_purchase_lists_csv/" +
        this.refYearID;
      window.open(url, "購入品申請_CSV");
    },
  },
};
</script>
