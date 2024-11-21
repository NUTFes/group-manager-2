<template>
  <div class="main-content" v-if="this.$role(roleID).food_products.read">
    <SubHeader pageTitle="販売品申請一覧">
      <CommonButton
        v-if="this.$role(roleID).food_products.create"
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
          :on_click="refinementFoodProducts"
          value="year_num"
        >
          {{ refYears }}
        </SearchDropDown>
        <SearchDropDown
          :nameList="isCookingList"
          :on_click="refinementFoodProducts"
          value="text"
        >
          {{ refIsCooking }}
        </SearchDropDown>
        <SearchDropDown
          :nameList="CategoryList"
          :on_click="refinementFoodProducts"
          value="text"
        >
          {{ refCategory }}
        </SearchDropDown>
      </template>
      <template v-slot:search>
        <SearchBar>
          <input
            v-model="searchText"
            @keypress.enter="fetchFilteredData"
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
            v-for="(foodProduct, index) in foodProducts"
            @click="
              () =>
                $router.push({
                  path: `/food_products/` + foodProduct.food_product.id,
                })
            "
            :key="index"
          >
            <td>{{ foodProduct.food_product.id }}</td>
            <td>{{ foodProduct.group.name }}</td>
            <td>{{ foodProduct.food_product.name }}</td>
            <td>{{ foodProduct.food_product.first_day_num }}</td>
            <td>{{ foodProduct.food_product.second_day_num }}</td>
            <td>
              <div v-if="foodProduct.food_product.is_cooking">○</div>
              <div v-else-if="!foodProduct.food_product.is_cooking">✖</div>
            </td>
          </tr>
        </template>
      </Table>
    </Card>

    <AddModal
      @close="closeAddModal"
      v-if="isOpenAddModal"
      title="販売品申請の追加"
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
          <h3>食品名</h3>
          <input v-model="name" placeholder="入力してください" />
        </div>
        <div>
          <h3>調理するか</h3>
          <select v-model="isCooking">
            <option disabled value="">選択してください</option>
            <option
              v-for="isCook in isCookingList"
              :key="isCook.id"
              :value="isCook.value"
            >
              {{ isCook.text }}
            </option>
          </select>
        </div>
        <div>
          <h3>1日目の個数</h3>
          <input v-model="first" type="number" placeholder="入力してください" />
        </div>
        <div>
          <h3>2日目の個数</h3>
          <input
            v-model="second"
            type="number"
            placeholder="入力してください"
          />
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
      headers: [
        "ID",
        "参加団体",
        "名前",
        "1日目の個数",
        "2日目の個数",
        "調理の有無",
      ],
      isOpenAddModal: false,
      isCookingList: [
        { id: 1, text: "調理あり", value: true },
        { id: 2, text: "調理なし", value: false },
      ],
      CategoryList: [
        { id: 1, text: "食品販売" },
        { id: 2, text: "物品販売" },
      ],
      foodProducts: [],
      refYears: "Year",
      refYearID: 0,
      refIsCooking: "ALL",
      refIsCookingID: 0,
      refCategory: "ALL",
      refCategoryID: 0,
      searchText: "",
      groupID: null,
      name: "",
      isCooking: null,
      first: null,
      second: null,
      isOpenSnackBar: false,
    };
  },
  async asyncData({ $axios }) {
    const currentYearUrl = "/user_page_settings/1";
    const currentYearRes = await $axios.$get(currentYearUrl);

    // const url = "/api/v1/get_food_product_index_for_admin_view";
    const url =
      "/api/v1/get_refinement_food_products?fes_year_id=" +
      currentYearRes.data.fes_year_id +
      "&is_cooking=0";
    const foodProductRes = await $axios.$post(url);
    const yearsUrl = "/fes_years";
    const yearsRes = await $axios.$get(yearsUrl);
    const currentYears = yearsRes.data.filter(function (element) {
      return element.id == currentYearRes.data.fes_year_id;
    });
    return {
      foodProducts: foodProductRes.data,
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
  mounted() {
    window.addEventListener("scroll", this.saveScrollPosition);

    const storedYearID = localStorage.getItem(this.$route.path + "RefYear");
    if (storedYearID) {
      this.refYearID = Number(storedYearID);
      this.updateFilters(this.refYearID, this.yearList);
    } else {
      this.refYears = "Year";
    }

    const storedIsCookingID = localStorage.getItem(
      this.$route.path + "RefIsCooking"
    );
    if (storedIsCookingID) {
      this.refIsCookingID = Number(storedIsCookingID);
      this.updateFilters(this.refIsCookingID, this.isCookingList);
    } else {
      this.refIsCooking = "ALL";
    }

    const storedCategoryID = localStorage.getItem(
      this.$route.path + "RefCategory"
    );
    if (storedCategoryID) {
      this.refCategoryID = Number(storedCategoryID);
      this.updateFilters(this.refCategoryID, this.CategoryList);
    } else {
      this.refCategory = "ALL";
    }

    const storedSearchText = localStorage.getItem(
      this.$route.path + "SearchText"
    );
    if (storedSearchText) {
      this.searchText = storedSearchText;
    } else {
      this.searchText = "";
    }

    this.fetchFilteredData();
  },
  methods: {
    saveScrollPosition() {
      localStorage.setItem(
        "scrollPosition-" + this.$route.path,
        window.scrollY
      );
    },
    async refinementFoodProducts(item_id, name_list) {
      this.updateFilters(item_id, name_list);
      localStorage.setItem(this.$route.path + "RefYear", this.refYearID);
      localStorage.setItem(
        this.$route.path + "RefIsCooking",
        this.refIsCookingID
      );
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
        // 調理の有無で絞り込むとき
      } else if (
        JSON.stringify(name_list) == JSON.stringify(this.isCookingList)
      ) {
        this.refIsCookingID = item_id;
        // ALLの時
        if (item_id === 0) {
          this.refIsCooking = "ALL";
        } else {
          this.refIsCooking = name_list[item_id - 1].text;
        }
      } else if (
        JSON.stringify(name_list) == JSON.stringify(this.CategoryList)
      ) {
        this.refCategoryID = item_id;
        // ALLの時
        if (item_id === 0) {
          this.refCategory = "ALL";
        } else {
          this.refCategory = name_list[item_id - 1].text;
        }
      }
    },
    async fetchFilteredData() {
      this.foodProducts = [];
      const refUrl =
        "/api/v1/get_refinement_food_products?fes_year_id=" +
        this.refYearID +
        "&is_cooking=" +
        this.refIsCookingID +
        "&category_id=" +
        this.refCategoryID +
        "&word=" +
        this.searchText;
      const refRes = await this.$axios.$post(refUrl);
      for (const res of refRes.data) {
        this.foodProducts.push(res);
      }

      localStorage.setItem(this.$route.path + "SearchText", this.searchText);
      this.$nextTick(() => {
        window.scrollTo(
          0,
          parseInt(localStorage.getItem("scrollPosition-" + this.$route.path))
        );
      });
    },
    // async searchFoodProducts() {
    //   localStorage.setItem(this.$route.path + "SearchText", this.searchText);
    //   this.foodProducts = [];
    //   const searchUrl =
    //     "/api/v1/get_search_food_products?word=" + this.searchText;
    //   const refRes = await this.$axios.$post(searchUrl);
    //   for (const res of refRes.data) {
    //     this.foodProducts.push(res);
    //   }
    // },
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
      const url = "/api/v1/get_food_product_show_for_admin_view/" + id;
      this.$axios.$get(url).then((response) => {
        this.foodProducts.push(response.data);
      });
    },
    async submit() {
      const url =
        "/food_products?group_id=" +
        this.groupID +
        "&name=" +
        this.name +
        "&is_cooking=" +
        this.isCooking +
        "&first_day_num=" +
        this.first +
        "&second_day_num=" +
        this.second;

      this.$axios.$post(url).then((response) => {
        this.openSnackBar(this.name + "を追加しました");
        this.groupID = null;
        this.name = "";
        this.isCooking = null;
        this.first = null;
        this.second = null;
        this.reload(response.data.id);
        this.closeAddModal();
      });
    },
    async downloadCSV() {
      const url =
        this.$config.apiURL + "/api/v1/get_food_products_csv/" + this.refYearID;
      window.open(url, "販売品申請_CSV");
    },
  },
};
</script>
