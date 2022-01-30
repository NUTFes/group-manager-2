<template>
  <div class="main-content">
    <SubHeader pageTitle="販売食品申請一覧">
      <CommonButton iconName="add_circle" :on_click="openModal">
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
          <input v-model="searchText" @keypress.enter="searchFoodProducts" type="text" size="25" placeholder="search" />
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
      isCookingList: [
        { id: 1, value: "調理あり" },
        { id: 2, value: "調理なし" }
      ],
      refYears: "Year",
      refYearID: 0,
      refIsCooking: "調理あり/なし",
      refIsCookingID: 0,
      searchText: '',
    };
  },
  async asyncData({ $axios }) {
    const currentYearUrl = "/user_page_settings/1";
    const currentYearRes = await $axios.$get(currentYearUrl);

    // const url = "/api/v1/get_food_product_index_for_admin_view";
    const url = "/api/v1/get_refinement_food_products?fes_year_id" +currentYearRes.data.fes_year_id + "&is_cooking=1";
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
      refYears: currentYears[0].year_num
    };
  },
  methods: {
    async refinementFoodProducts(item_id, name_list){
      // fes_yearで絞り込むとき
      if(name_list.toString() == this.yearList.toString()) {
        this.refYearID = item_id
        // ALLの時
        if (item_id == 0) {
          this.refYears = "ALL"
        }else{
          this.refYears = name_list[item_id - 1].year_num
        }
      // 調理の有無で絞り込むとき
      }else if(name_list.toString() == this.isCookingList.toString()){
        this.refIsCookingID = item_id
        // ALLの時
        if (item_id == 0){
          this.refIsCooking == "ALL"
        }else{
          this.refIsCooking = name_list[item_id - 1].value
        }
      }
      this.foodProducts = []
      const refUrl = "/api/v1/get_refinement_food_products?fes_year_id=" + this.refYearID + "&is_cooking=" + this.refIsCookingID;
      console.log(refUrl)
      const refRes = await this.$axios.$post(refUrl);
      for (const res of refRes.data){
        this.foodProducts.push(res)
      }
    },
    async searchFoodProducts() {
      this.foodProducts = []
      const searchUrl = "/api/v1/get_search_food_products?word=" + this.searchText;
      const refRes = await this.$axios.$post(searchUrl);
      for (const res of refRes.data) {
        this.foodProducts.push(res)
      }
    },
    reload: function () {
      this.$axios
        .get("/api/v1/get_food_products", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.food_products = response.data;
        });
    },
    register: function () {
      this.$axios.defaults.headers.common["Content-Type"] = "application/json";
      var params = new URLSearchParams();
      params.append("group_id", this.Group);
      params.append("name", this.productName);
      params.append("is_cooking", this.isCooking);
      params.append("first_day_num", this.firstDayNum);
      params.append("second_day_num", this.secondDayNum);
      this.$axios.post("/food_products", params).then((response) => {
        console.log(response);
        this.dialog = false;
        this.reload();
        this.Group = "";
        this.productName = "";
        this.isCooking = "";
        this.firstDayNum = "";
        this.secondDayNum = "";
      });
    },
    async downloadCSV() {
      const url = "http://localhost:3000" + "/api/v1/get_food_products_csv/" + 1;
      window.open(
        url,
        "販売食品申請_CSV"
      );
    },
  },
};
</script>
