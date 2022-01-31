<template>
  <div class="main-content">
    <SubHeader pageTitle="購入食品申請一覧">
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
          <input v-model="searchText" @keypress.enter="searchPurchaseLists" type="text" size="25" placeholder="search" />
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
            @click="() => $router.push({ path: `/purchase_lists/` + purchaseList.purchase_list.id })"
            :key="index"
          >
            <td>{{ purchaseList.purchase_list.id }}</td>
            <td>{{ purchaseList.group.name }}</td>
            <td>{{ purchaseList.purchase_list_info.food_product }}</td>
            <td>{{ purchaseList.purchase_list.items }}</td>
            <td>{{ purchaseList.purchase_list.is_fresh }}</td>
            <td>{{ purchaseList.purchase_list.created_at | formatDate }}</td>
            <td>{{ purchaseList.purchase_list.updated_at | formatDate }}</td>
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
        "販売食品",
        "購入品",
        "なまもの",
        "登録日時",
        "編集日時",
      ],
      isFreshList: [
        { id: 1, value: "はい" },
        { id: 2, value: "いいえ" }
      ],
      refYears: "Years",
      refYearID: 0,
      refIsFresh: "なまもの",
      refIsFreshID: 0,
      searchText: "",
      purchaseLists: []
    };
  },
  async asyncData({ $axios }) {
    const currentYearUrl = "/user_page_settings/1";
    const currentYearRes = await $axios.$get(currentYearUrl);

    // const url = "/api/v1/get_purchase_list_index_for_admin_view";
    const url = "/api/v1/get_refinement_purchase_lists?fes_year_id=" + currentYearRes.data.fes_year_id + "&is_fresh=0";
    const purchaseListsRes = await $axios.$post(url);
    const yearsUrl = "/fes_years";
    const yearsRes = await $axios.$get(yearsUrl);
    const currentYears = yearsRes.data.filter(function (element) {
      return element.id == currentYearRes.data.fes_year_id
    })
    return {
      purchaseLists: purchaseListsRes.data,
      yearList: yearsRes.data,
      refYearID: currentYearRes.data.fes_year_id,
      refYears: currentYears[0].year_num
    };
  },
  methods: {
    async refinementPurchaseLists(item_id, name_list){
      // fes_yearで絞り込むとき
      if (name_list.toString() == this.yearList.toString()) {
        this.refYearID = item_id
        // ALLの時
        if (item_id == 0) {
          this.refYears = "ALL"
        }else{
          this.refYears = name_list[item_id - 1].year_num
        }
      // is_freshで絞り込むとき
      }else if (Object.is(name_list, this.isFreshList)){
        this.refIsFreshID = item_id
        // ALLの時
        if (item_id == 0){
          this.refIsFresh = "ALL"
        }else{
          this.refIsFresh = name_list[item_id - 1].value
        }
      }
      this.purchaseLists = []
      const refUrl = "/api/v1/get_refinement_purchase_lists?fes_year_id=" + this.refYearID + "&is_fresh=" + this.refIsFreshID
      const refRes = await this.$axios.$post(refUrl);
      for (const res of refRes.data) {
        this.purchaseLists.push(res)
      }
    },
    async searchPurchaseLists() {
      this.purchaseLists = []
      const searchUrl = "/api/v1/get_search_purchase_lists?word=" + this.searchText;
      const refRes = await this.$axios.$post(searchUrl);
      for (const res of refRes.data) {
        this.purchaseLists.push(res)
      }
    },
    openModal: function () {
      this.$axios
        .get("/groups", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.groups = response.data;
        });
        this.$axios
          .get("/fes_dates", {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            this.fes_dates = response.data;
          });
          this.$axios
            .get("/shops", {
              headers: {
                "Content-Type": "application/json",
              },
            })
            .then((response) => {
              this.shops = response.data;
            });

            this.dialog = true;
    },

    getPurchaseList: function (groupId) {
      const url = "/api/v1/get_food_products_from_group/" + groupId;
      this.$axios
        .get(url, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.food_products = response.data;
          console.log(this.group);
        });
    },

    reload: function () {
      this.$axios
        .get("/api/v1/get_purchase_lists", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.purchase_lists = response.data;
        });
    },

    register: function () {
      this.$axios.defaults.headers.common["Content-Type"] = "application/json";
      var params = new URLSearchParams();
      params.append("group_id", this.Group);
      params.append("food_product_id", this.foodProductId);
      params.append("fes_date_id", this.fesDateId);
      params.append("shop_id", this.shopId);
      params.append("items", this.item);
      params.append("is_fresh", this.isFresh);
      this.$axios.post("/purchase_lists", params).then((response) => {
        console.log(response);
        this.dialog = false;
        this.reload();
        this.Group = "";
        this.foodProductId = "";
        this.fesDateId = "";
        this.shopId = "";
        this.item = "";
        this.isFresh = "";
      });
    },
    async downloadCSV() {
      const url = "http://localhost:3000" + "/api/v1/get_purchase_lists_csv/" + 0;
      window.open(
        url,
        "購入品申請_CSV"
      );
    },
  },
};
</script>
