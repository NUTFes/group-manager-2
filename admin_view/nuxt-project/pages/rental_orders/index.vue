<template>
  <div class="main-content">
    <SubHeader pageTitle="物品申請一覧">
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
      </template>
      <template v-slot:search>
        <SearchBar>
          <input v-model="searchText" @keypress.enter="searchRentalOrders" type="text" size="25" placeholder="search" />
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
          @click="() => $router.push({path: `/rental_orders/` + rentalOrder.rental_order.id})"
          :key="index"
        >
          <td>{{ rentalOrder.rental_order.id }}</td>
          <td>{{ rentalOrder.group.name }}</td>
          <td>{{ rentalOrder.rental_item.name }}</td>
          <td>{{ rentalOrder.rental_order.num }}</td>
          <td>{{ rentalOrder.rental_order.created_at | formatDate }}</td>
          <td>{{ rentalOrder.rental_order.updated_at | formatDate }}</td>
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
      headers: ["ID", "参加団体", "貸出物品", "個数", "登録日時", "編集日時"],
      rentalOrders: [],
      refYears: "Year",
      refYearID: 0,
      refRentalItems: "Items",
      refRentalItemID: 0,
      searchText: ""
    };
  },
  async asyncData({ $axios }) {
    const currentYearUrl = "/user_page_settings/1";
    const currentYearRes = await $axios.$get(currentYearUrl);
    
    // const url = "/api/v1/get_rental_order_index_for_admin_view";
    const url = "/api/v1/get_refinement_rental_orders?fes_year_id=" + currentYearRes.data.fes_year_id + "&rental_item_id=0";
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
      refYearID: currentYearRes.data.fes_year_id,
      refYears: currentYears[0].year_num
    };
  },
  methods: {
    async refinementRentalOrders(item_id, name_list){
      // fes_yearで絞り込むとき
      if (name_list.toString() == this.yearList.toString()){
        this.refYearID = item_id
        // ALLの時
        if (item_id == 0){
          this.refYears = "ALL"
        }else{
          this.refYears = name_list[item_id - 1].year_num
        }
      // group_categoryで絞り込むとき
      }else if(name_list.toString() == this.rentalItemsList.toString()){
        this.refRentalItemID = item_id
        // ALLの時
        if (item_id == 0){
          this.refRentalItems = "ALL"
        }else{
          this.refRentalItems = name_list[item_id - 1].name
        }
      }
      this.rentalOrders = []
      const refUrl = "/api/v1/get_refinement_rental_orders?fes_year_id=" + this.refYearID + "&rental_item_id=" + this.refRentalItemID;
      const refRes = await this.$axios.$post(refUrl);
      for (const res of refRes.data){
        this.rentalOrders.push(res)
      }
    },
    async searchRentalOrders() {
      this.rentalOrders = []
      const searchUrl = "/api/v1/get_search_rental_orders?word=" + this.searchText
      const refRes = await this.$axios.$post(searchUrl);
      for (const res of refRes.data){
        this.rentalOrders.push(res)
      }
    },
    reload: function () {
      this.$axios
        .get("/api/v1/get_rental_orders", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.rental_orders = response.data;
        });
    },
    register: function () {
      this.$axios.defaults.headers.common["Content-Type"] = "application/json";
      var params = new URLSearchParams();
      params.append("group_id", this.Group);
      params.append("rental_item_id", this.item_id);
      params.append("num", this.num);
      this.$axios.post("/rental_orders", params).then((response) => {
        console.log(response);
        this.dialog = false;
        this.reload();
        this.Group = "";
        this.item_id = "";
        this.num = "";
      });
    },
    async downloadCSV() {
      const url = "http://localhost:3000" + "/api/v1/get_rental_orders_csv/" + 1;
      window.open(
        url,
        "物品申請一覧_CSV"
      );
    },
  },
};
</script>
