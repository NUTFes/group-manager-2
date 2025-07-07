<template>
  <div class="main-content" v-if="this.$role(roleID).cooking_process_orders.read">
    <SubHeader pageTitle="調理工程申請一覧">
      <CommonButton
        v-if="this.$role(roleID).cooking_process_orders.create"
        iconName="add_circle"
        :on_click="openAddModal"
      >
        追加
      </CommonButton>
      <CommonButton
        v-if="this.$role(roleID).cooking_process_orders.create"
        iconName="file_download"
        :on_click="downloadCSV"
      >
        CSV
      </CommonButton>
    </SubHeader>

    <SubSubHeader>
      <template v-slot:refinement>
        <SearchDropDown
          :nameList="yearList"
          :on_click="refinementCookingProcessOrders"
          value="year_num"
        >
          {{ refYears }}
        </SearchDropDown>
      </template>
      <template v-slot:search>
        <SearchBar>
          <input
            v-model="searchText"
            @keypress.enter="searchCookingProcessOrders"
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
            v-for="food_product in food_products"
            :key="food_product.id"
            @click="
              () =>
                $router.push({
                  path: `/cooking_process_order/${food_product.id}`,
                })
            "
          >
            <td>{{ food_product.id }}</td>
            <td>{{ food_product.group.name }}</td>
            <td>{{ food_product.name }}</td>
            <td>
              <div v-if="food_product.cooking_process_order">
                登録済み
              </div>
              <div v-else>未登録</div>
            </td>
          </tr>
        </template>
      </Table>
    </Card>

    <AddModal
      @close="closeAddModal"
      v-if="isOpenAddModal"
      title="調理工程申請の追加"
    >
      <template v-slot:form>
        <div>
          <h3>販売品</h3>
          <select v-model="food_product_id">
            <option v-for="food_product in food_products_have_no_cooking_process_order" :key="food_product.id" :value="food_product.id">
              {{ food_product.group.name }} - {{ food_product.name }}
            </option>
          </select>
        </div>
        <div>
          <h3>調理場：営業前</h3>
          <div class="radio-group">
            <input
              type="radio"
              id="preOpenKitchenYes"
              value="true"
              v-model="pre_open_kitchen"
            />
            <label for="preOpenKitchenYes">使用する</label>
          </div>
          <div class="radio-group">
            <input
              type="radio"
              id="preOpenKitchenNo"
              value="false"
              v-model="pre_open_kitchen"
            />
            <label for="preOpenKitchenNo">使用しない</label>
          </div>
        </div>

        <div>
          <h3>調理場：営業中</h3>
          <div class="radio-group">
            <input
              type="radio"
              id="duringOpenKitchenYes"
              value="true"
              v-model="during_open_kitchen"
            />
            <label for="duringOpenKitchenYes">使用する</label>
          </div>
          <div class="radio-group">
            <input
              type="radio"
              id="duringOpenKitchenNo"
              value="false"
              v-model="during_open_kitchen"
            />
            <label for="duringOpenKitchenNo">使用しない</label>
          </div>
        </div>

        <div>
          <h3>テント内での作業内容</h3>
          <input v-model="tent" placeholder="入力してください" />
        </div>
      </template>
      <template v-slot:method>
        <CommonButton iconName="add_circle" :on_click="submit"
          >登録</CommonButton
        >
      </template>
    </AddModal>
    <SnackBar v-if="isOpenSnackBar" @close="closeSnackBar">
      {{ snackMessage }}
    </SnackBar>
  </div>
  <h1 v-else>閲覧権限がありません</h1>
</template>

<script>
import { mapState } from "vuex";
import { downloadFile } from '~/utils/download-file';

export default {
  watchQuery: ["page"],
  data() {
    return {
      headers: ["ID", "参加団体", "販売品名", "申請状況"],
      isOpenAddModal: false,
      isOpenSnackBar: false,
      food_product_id: null,
      food_products: [],
      food_products_have_no_cooking_process_order: [],
      dialog: false,
      snackMessage: "",
      refYears: "Years",
      refYearID: 0,
      searchText: "",
      pre_open_kitchen: null,
      during_open_kitchen: null,
      tent: "",
    };
  },
  async asyncData({ $axios }) {
    const currentYearUrl = "/user_page_settings/1";
    const currentYearRes = await $axios.$get(currentYearUrl);
    const url =
      "/api/v1/get_refinement_cooking_process_orders?fes_year_id=" +
      currentYearRes.data.fes_year_id;
    const cooking_process_ordersRes = await $axios.$post(url);
    const yearsUrl = "/fes_years";
    const yearsRes = await $axios.$get(yearsUrl);
    const currentYears = yearsRes.data.filter(function (element) {
      return element.id == currentYearRes.data.fes_year_id;
    });

    return {
      food_products: cooking_process_ordersRes.data,
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
    this.refinementCookingProcessOrders(this.refYearID, this.yearList);

    window.addEventListener("scroll", this.saveScrollPosition);
  },
  methods: {

    async openAddModal() {
      const url = "/api/v1/get_food_products_have_no_cooking_process_order";
      const res = await this.$axios.$get(url);
      this.food_products_have_no_cooking_process_order = res.data;
      this.isOpenAddModal = true;
    },
    closeAddModal() {
      this.isOpenAddModal = false;
    },
    openSnackBar(message) {
      this.snackMessage = message;
      this.isOpenSnackBar = true;
      setTimeout(this.closeSnackBar, 2000);
    },
    closeSnackBar() {
      this.isOpenSnackBar = false;
    },
    reload() {
      const url =
        "/api/v1/get_refinement_cooking_process_orders?fes_year_id=" +
        this.refYearID;
      this.$axios.post(url).then((res) => {
        this.food_products = res.data.data;
      });
    },
    async submit() {
      // フォーム入力のバリデーション
      if (
        !this.food_product_id ||
        this.pre_open_kitchen === null ||
        this.during_open_kitchen === null ||
        !this.tent
      ) {
        this.openSnackBar("販売品と全ての調理工程申請を入力してください");
        return;
      }
      const cookingProcessOrderData = {
        food_product_id: this.food_product_id,
        pre_open_kitchen: this.pre_open_kitchen,
        during_open_kitchen: this.during_open_kitchen,
        tent: this.tent,
      };

      const url = `/cooking_process_orders`;

      try {
        const response = await this.$axios.$post(
          url,
          { cooking_process_order: cookingProcessOrderData }
        );
        this.openSnackBar("調理工程申請を登録しました");
        this.clearForm();
        this.reload();
        this.closeAddModal();
      } catch (error) {
        this.openSnackBar(
          "エラーが発生しました: " + error.response.data.message
        );
      }
    },
    clearForm() {
      this.food_product_id = null;
      this.pre_open_kitchen = null;
      this.during_open_kitchen = null;
      this.tent = "";
    },

    async refinementCookingProcessOrders(item_id, name_list) {
      // fes_yearで絞り込むとき
      this.refYearID = item_id;
      // ALLの時
      if (item_id == 0) {
        this.refYears = "ALL";
      } else {
        this.refYears = name_list[item_id - 1].year_num;
      }
      this.food_products = [];
      const refUrl =
        "/api/v1/get_refinement_cooking_process_orders?fes_year_id=" +
        this.refYearID;
      const refRes = await this.$axios.$post(refUrl);
      this.food_products = refRes.data;
      const storedSearchText = localStorage.getItem(
        this.$route.path + "SearchText"
      );
      if (storedSearchText) {
        this.searchText = storedSearchText;
        this.searchCookingProcessOrders();
      }
    },
    async searchCookingProcessOrders() {
      localStorage.setItem(this.$route.path + "SearchText", this.searchText);
      this.food_products = [];
      const searchUrl =
        "/api/v1/get_search_cooking_process_orders?word=" + this.searchText;
      const refRes = await this.$axios.$post(searchUrl);
      this.food_products = refRes.data;
    },
    // TODO: get_cooking_process_orders_csvを年数指定できるように
    async downloadCSV() {
      const url =
        this.$config.apiURL + "/api/v1/get_cooking_process_orders_csv";
      await downloadFile(this.$axios,url, "調理工程申請_CSV", "text/csv");
      this.openSnackBar("調理工程申請のCSVをダウンロードしました");
    },
  },
};
</script>

<style scoped>
.radio-group {
  display: flex;
  align-items: center;
  justify-content: left;
  flex-flow: row nowrap;
  width: 500px;
}
</style>
