<template>
  <div class="main-content">
    <SubHeader pageTitle="購入食品申請一覧">
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
            <td>{{ purchaseList.purchase_list.created_at | formatDate }}</td>
            <td>{{ purchaseList.purchase_list.updated_at | formatDate }}</td>
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
        "販売食品",
        "購入品",
        "なまもの",
        "登録日時",
        "編集日時",
      ],
      isOpenAddModal: false,
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
    openAddModal() {
      this.isOpenAddModal = false;
      this.isOpenAddModal = true;
    },
    closeAddModal() {
      this.isOpenAddModal = false;
    },
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
      const url = this.$config.apiURL + "/api/v1/get_purchase_lists_csv/" + this.refYearID;
      window.open(
        url,
        "購入品申請_CSV"
      );
    },
  },
};
</script>
