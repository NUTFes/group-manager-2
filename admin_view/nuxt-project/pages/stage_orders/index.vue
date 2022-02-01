<template>
  <div class="main-content">
    <SubHeader pageTitle="ステージ申請一覧">
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
        :on_click="refinementStageOrders"
        value="year_num"
      >
        {{ refYears }}
      </SearchDropDown>

      <SearchDropDown
        :nameList="isSunnyList"
        :on_click="refinementStageOrders"
        value="value"
      >
        {{ refIsSunny }}
      </SearchDropDown>

      <SearchDropDown
        :nameList="daysNumList"
        :on_click="refinementStageOrders"
        value="days_num"
      >
        {{ refDaysNum }}
      </SearchDropDown>

      <SearchDropDown
        :nameList="stageList"
        :on_click="refinementStageOrders"
        value="name"
      >
        {{ refStage }}
      </SearchDropDown>
      </template>
      <template v-slot:search>
        <SearchBar>
          <input v-model="searchText" @keypress.enter="searchStageOrders" type="text" size="25" placeholder="search" />
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
            v-for="(stageOrder, index) in stageOrders"
            @click="
              () =>
                $router.push({
                  path: `/stage_orders/` + stageOrder.stage_order.id,
                })
            "
            :key="index"
          >
            <td>{{ stageOrder.stage_order.id }}</td>
            <td>{{ stageOrder.group.name }}</td>
            <td>{{ stageOrder.stage_order.is_sunny }}</td>
            <td>{{ stageOrder.stage_order_info.date }}</td>
            <td>{{ stageOrder.stage_order_info.stage_first }}</td>
            <td>{{ stageOrder.stage_order_info.stage_second }}</td>
            <td>{{ stageOrder.stage_order.created_at | formatDate }}</td>
            <td>{{ stageOrder.stage_order.updated_at | formatDate }}</td>
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
        "晴れ希望",
        "希望日",
        "第一希望",
        "第二希望",
        "登録日時",
        "編集日時",
      ],
      isOpenAddModal: false,
      isSunnyList: [
        { id: 1, value: "はい" },
        { id: 2, value: "いいえ" }
      ],
      daysNumList: [
        { id: 1, days_num: "1日目" },
        { id: 2, days_num: "2日目" },
     ],
      refYears: "Years",
      refYearID: 0,
      refIsSunny: "晴れ希望",
      refIsSunnyID: 0,
      refDaysNum: "何日目",
      refDaysNumID: 0,
      refStage: "Stages",
      refStageID: 0,
      stageOrders: []
    };
  },
  async asyncData({ $axios }) {
    const currentYearUrl = "/user_page_settings/1";
    const currentYearRes = await $axios.$get(currentYearUrl);

    // const url = "/api/v1/get_stage_order_index_for_admin_view";
    const url = "/api/v1/get_refinement_stage_orders?fes_year_id=" + currentYearRes.data.fes_year_id + "&stage_id=0&days_num=0&is_sunny=0";
    const stageOrdersRes = await $axios.$post(url);
    const yearsUrl = "/fes_years";
    const yearsRes = await $axios.$get(yearsUrl);
    const stagesUrl = "/stages";
    const stagesRes = await $axios.$get(stagesUrl);
    const currentYears = yearsRes.data.filter(function (element) {
      return element.id == currentYearRes.data.fes_year_id
    })
    return {
      stageOrders: stageOrdersRes.data,
      yearList: yearsRes.data,
      refYearID: currentYearRes.data.fes_year_id,
      refYears: currentYears[0].year_num,
      stageList: stagesRes.data
    };
  },
  computed: {
    useInterval() {
      let minute = this.performanceEndTime.mm - this.performanceStartTime.mm;
      let hour =
        (this.performanceEndTime.HH - this.performanceStartTime.HH) * 60;
      return hour + minute;
    },
  },
  methods: {
    async refinementStageOrders(item_id, name_list){
      // fes_yearで絞り込むとき
      if (name_list.toString() == this.yearList.toString()) {
        this.refYearID = item_id
        // ALLの時
        if (item_id == 0) {
          this.refYears = "ALL"
        }else{
          this.refYears = name_list[item_id - 1].year_num
        }
      // is_sunnyで絞り込むとき
      }else if (Object.is(name_list, this.isSunnyList)){
        this.refIsSunnyID = item_id
        // ALLの時
        if (item_id == 0){
          this.refIsSunny = "ALL"
        }else{
          this.refIsSunny = name_list[item_id - 1].value
        }
      // days_numで絞り込むとき
      }else if (Object.is(name_list, this.daysNumList)){
        this.refDaysNumID = item_id
        // ALLの時
        if (item_id == 0){
          this.refDaysNum = "ALL"
        }else{
          this.refDaysNum = name_list[item_id - 1].days_num
        }
      // stage_idで絞り込むとき
      }else if (name_list.toString() == this.stageList.toString()) {
        this.refStageID = item_id
        // ALLの時
        if (item_id == 0){
          this.refStage = "ALL"
        }else{
          this.refStage = name_list[item_id - 1].name
        }
      }
      this.stageOrders = []
      const refUrl = "/api/v1/get_refinement_stage_orders?fes_year_id=" + this.refYearID + "&stage_id=" + this.refStageID + "&days_num=" + this.refDaysNumID + "&is_sunny=" + this.refIsSunnyID;
      const refRes = await this.$axios.$post(refUrl);
      for (const res of refRes.data) {
        this.stageOrders.push(res)
      }
    },
    async searchStageOrders() {
      this.stageOrders = []
      const searchUrl = "/api/v1/get_search_stage_orders?word=" + this.searchText;
      const refRes = await this.$axios.$post(searchUrl);
      for (const res of refRes.data) {
        this.stageOrders.push(res)
      }
    },
    set_time_range: function () {
      for (var hour of this.hour_range) {
        for (var minute of this.minute_range) {
          this.time_range.push(hour + ":" + minute);
        }
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
        this.$config.apiURL + 
        "/api/v1/get_stage_orders_csv/" +
        this.refYearID;
      window.open(url, "ステージ申請一覧_CSV");
    },
  },
};
</script>

<style>
.card {
  padding-left: 1%;
  padding-right: 5%;
}
input.timepicker {
  padding: 0 12px !important;
  align-items: stretch !important;
  min-height: 56px !important;
  cursor: text !important;
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1) !important;
  border-radius: 8px !important;
  margin-bottom: 8px !important;
  width: 100% !important;
  display: flex !important;
  box-sizing: inherit !important;
  font-size: 16px !important;
  text-align: left !important;
  letter-spacing: normal !important;
  flex: 1 1 auto !important;
  font-weight: 400 !important;
  line-height: 1.375rem !important;
  overflow-wrap: break-word !important;
  white-space: normal !important;
  border-color: rgb(9e, 9e, 9e) !important;
}
</style>
