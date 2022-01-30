<template>
  <div class="main-content">
    <SubHeader pageTitle="販売食品申請一覧">
      <CommonButton iconName="add_circle" :on_click="openAddModal">
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
          :on_click="refinementFoodProducts"
          value="year_num"
        >
          {{ refYears }}
        </SearchDropDown>
        <SearchDropDown
          :nameList="isCookingList"
          :on_click="refinementFoodProducts"
          value="value"
        >
          {{ refIsCooking }}
        </SearchDropDown>
      </template>
      <template v-slot:search>
        <SearchBar>
          <input
            v-model="searchText"
            @keypress.enter="searchFoodProducts"
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
            <td>{{ foodProduct.food_product.is_cooking }}</td>
            <td>{{ foodProduct.food_product.created_at | formatDate }}</td>
            <td>{{ foodProduct.food_product.updated_at | formatDate }}</td>
          </tr>
        </template>
      </Table>
    </Card>

    <AddModal
      @close="closeAddModal"
      v-if="isOpenAddModal"
      title="従業員申請の追加"
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
          <h3>氏名</h3>
          <input v-model="employeeName" placeholder="入力してください" />
        </div>
        <div>
          <h3>学籍番号</h3>
          <input v-model="employeeStudentId" placeholder="入力してください" />
        </div>
      </template>
      <template v-slot:method>
        <CommonButton iconName="add_circle" :on_click="submitEmployee"
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
        "名前",
        "1日目の個数",
        "2日目の個数",
        "調理の有無",
        "登録日時",
        "編集日時",
      ],
      isOpenAddModal: false,
      isCookingList: [
        { id: 1, value: "調理あり" },
        { id: 2, value: "調理なし" },
      ],
      refYears: "Year",
      refYearID: 0,
      refIsCooking: "調理あり/なし",
      refIsCookingID: 0,
      searchText: "",
    };
  },
  async asyncData({ $axios }) {
    const currentYearUrl = "/user_page_settings/1";
    const currentYearRes = await $axios.$get(currentYearUrl);

    // const url = "/api/v1/get_food_product_index_for_admin_view";
    const url =
      "/api/v1/get_refinement_food_products?fes_year_id" +
      currentYearRes.data.fes_year_id +
      "&is_cooking=1";
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
  methods: {
    async refinementFoodProducts(item_id, name_list) {
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
      } else if (name_list.toString() == this.isCookingList.toString()) {
        this.refIsCookingID = item_id;
        // ALLの時
        if (item_id == 0) {
          this.refIsCooking == "ALL";
        } else {
          this.refIsCooking = name_list[item_id - 1].value;
        }
      }
      this.foodProducts = [];
      const refUrl =
        "/api/v1/get_refinement_food_products?fes_year_id=" +
        this.refYearID +
        "&is_cooking=" +
        this.refIsCookingID;
      console.log(refUrl);
      const refRes = await this.$axios.$post(refUrl);
      for (const res of refRes.data) {
        this.foodProducts.push(res);
      }
    },
    async searchFoodProducts() {
      this.foodProducts = [];
      const searchUrl =
        "/api/v1/get_search_food_products?word=" + this.searchText;
      const refRes = await this.$axios.$post(searchUrl);
      for (const res of refRes.data) {
        this.foodProducts.push(res);
      }
    },
    openAddModal() {
      this.isOpenAddModal = false;
      this.isOpenAddModal = true;
    },
    closeAddModal() {
      this.isOpenAddModal = false;
    },
    reload() {
      const employeeId = this.employees.slice(-1)[0].employee.id + 1;
      const reUrl = "/api/v1/get_employee_show_for_admin_view/" + employeeId;
      this.$axios.$get(reUrl).then((response) => {
        this.employees.push(response.data);
      });
    },
    async submitEmployee() {
      const postEmployeeUrl =
        "/employees/" +
        "?group_id=" +
        this.appGroup +
        "&name=" +
        this.employeeName +
        "&student_id=" +
        this.employeeStudentId;

      this.$axios.$post(postEmployeeUrl).then((response) => {
        this.appGroup = "";
        this.employeeName = "";
        this.employeeStudentId = "";
        this.reload();
        this.closeAddModal();
      });
    },
    async downloadCSV() {
      const url =
        "http://localhost:3000" +
        "/api/v1/get_food_products_csv/" +
        this.refYearID;
      window.open(url, "販売食品申請_CSV");
    },
  },
};
</script>
