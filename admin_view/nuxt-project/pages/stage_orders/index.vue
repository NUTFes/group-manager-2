<template>
  <div class="main-content" v-if="this.$role(roleID).stage_orders.read">
    <SubHeader pageTitle="ステージ申請一覧">
      <CommonButton
        v-if="this.$role(roleID).stage_orders.create"
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
          :on_click="refinementStageOrders"
          value="year_num"
        >
          {{ refYears }}
        </SearchDropDown>

        <SearchDropDown
          :nameList="isSunnyList"
          :on_click="refinementStageOrders"
          value="text"
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
          <input
            v-model="searchText"
            @keypress.enter="searchStageOrders"
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
          </tr>
        </template>
      </Table>
    </Card>

    <AddModal
      @close="closeAddModal"
      v-if="isOpenAddModal"
      title="ステージ申請の追加"
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
          <h3>晴れ希望</h3>
          <select v-model="isSunny">
            <option disabled value="">選択してください</option>
            <option
              v-for="list in isSunnyList"
              :key="list.id"
              :value="list.value"
            >
              {{ list.text }}
            </option>
          </select>
        </div>
        <div>
          <h3>希望日</h3>
          <select v-model="fesDateID">
            <option disabled value="">選択してください</option>
            <option
              v-for="list in fesDatesList"
              :key="list.id"
              :value="list.id"
            >
              {{ list.date }} - {{ list.days_num }}日目
            </option>
          </select>
        </div>
        <div>
          <h3>第一希望</h3>
          <select v-model="first">
            <option disabled value="">選択してください</option>
            <option v-for="list in stageList" :key="list.id" :value="list.id">
              {{ list.name }}
            </option>
          </select>
        </div>
        <div>
          <h3>第二希望</h3>
          <select v-model="second">
            <option disabled value="">選択してください</option>
            <option v-for="list in stageList" :key="list.id" :value="list.id">
              {{ list.name }}
            </option>
          </select>
        </div>
        <div>
          <h3>準備時間幅</h3>
          <select v-model="prepareTimeInterval">
            <option disabled value="">選択してください</option>
            <option v-for="list in timeBox" :key="list" :value="list">
              {{ list }}
            </option>
          </select>
        </div>
        <div>
          <h3>使用時間幅</h3>
          <select v-model="useTimeInterval">
            <option disabled value="">選択してください</option>
            <option v-for="list in timeBox" :key="list" :value="list">
              {{ list }}
            </option>
          </select>
        </div>
        <div>
          <h3>掃除時間幅</h3>
          <select v-model="cleanUpTimeInterval">
            <option disabled value="">選択してください</option>
            <option v-for="list in timeBox" :key="list" :value="list">
              {{ list }}
            </option>
          </select>
        </div>
        <div>
          <h3>準備開始時刻</h3>
          <select v-model="prepareStartTime">
            <option disabled value="">選択してください</option>
            <option v-for="list in timeRange" :key="list" :value="list">
              {{ list }}
            </option>
          </select>
        </div>
        <div>
          <h3>パフォーマンス開始時刻</h3>
          <select v-model="performanceStartTime">
            <option disabled value="">選択してください</option>
            <option v-for="list in timeRange" :key="list" :value="list">
              {{ list }}
            </option>
          </select>
        </div>
        <div>
          <h3>パフォーマンス終了時刻</h3>
          <select v-model="performanceEndTime">
            <option disabled value="">選択してください</option>
            <option v-for="list in timeRange" :key="list" :value="list">
              {{ list }}
            </option>
          </select>
        </div>
        <div>
          <h3>掃除終了時刻</h3>
          <select v-model="cleanUpEndTime">
            <option disabled value="">選択してください</option>
            <option v-for="list in timeRange" :key="list" :value="list">
              {{ list }}
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
        "晴れ希望",
        "希望日",
        "第一希望",
        "第二希望",
      ],
      isOpenAddModal: false,
      isOpenSnackBar: false,
      isIntervalMode: true,
      isSunnyList: [
        { id: 1, text: "はい", value: true },
        { id: 2, text: "いいえ", value: false },
      ],
      daysNumList: [
        { id: 1, days_num: "1日目" },
        { id: 2, days_num: "2日目" },
      ],
      fesDatesList: [],
      stageList: [],
      timeBox: [
        "5分",
        "10分",
        "15分",
        "20分",
        "25分",
        "30分",
        "35分",
        "40分",
        "45分",
        "50分",
        "55分",
        "60分",
        "65分",
        "70分",
        "75分",
        "80分",
        "90分",
        "95分",
        "100分",
        "105分",
        "110分",
        "115分",
        "120分",
      ],
      hour_range: ["9", "10", "11", "12", "13", "14", "15", "16", "17", "18"],
      minute_range: [
        "00",
        "05",
        "10",
        "15",
        "20",
        "25",
        "30",
        "35",
        "40",
        "45",
        "50",
        "55",
      ],
      timeRange: [],
      refYears: "Years",
      refYearID: 0,
      refIsSunny: "晴れ希望",
      refIsSunnyID: 0,
      refDaysNum: "何日目",
      refDaysNumID: 0,
      refStage: "Stages",
      refStageID: 0,
      stageOrders: [],
      groupID: null,
      isSunny: null,
      fesDateID: null,
      first: null,
      second: null,
      prepareTimeInterval: "指定なし",
      useTimeInterval: "指定なし",
      cleanUpTimeInterval: "指定なし",
      prepareStartTime: "指定なし",
      performanceStartTime: "指定なし",
      performanceEndTime: "指定なし",
      cleanUpEndTime: "指定なし",
      searchText: "",
    };
  },
  async asyncData({ $axios }) {
    const currentYearUrl = "/user_page_settings/1";
    const currentYearRes = await $axios.$get(currentYearUrl);

    // const url = "/api/v1/get_stage_order_index_for_admin_view";
    const url =
      "/api/v1/get_refinement_stage_orders?fes_year_id=" +
      currentYearRes.data.fes_year_id +
      "&stage_id=0&days_num=0&is_sunny=0";

    const stageOrdersRes = await $axios.$post(url);

    const yearsUrl = "/fes_years";
    const yearsRes = await $axios.$get(yearsUrl);
    const stagesUrl = "/stages";
    const stagesRes = await $axios.$get(stagesUrl);
    const currentYears = yearsRes.data.filter(function (element) {
      return element.id == currentYearRes.data.fes_year_id;
    });
    return {
      stageOrders: stageOrdersRes.data,
      yearList: yearsRes.data,
      refYearID: currentYearRes.data.fes_year_id,
      refYears: currentYears[0].year_num,
      stageList: stagesRes.data,
    };
  },
  mounted() {
    window.scrollTo(0, 0);
    
    // 時間を作る
    for (let hour of this.hour_range) {
      for (let minute of this.minute_range) {
        this.timeRange.push(hour + ":" + minute);
      }
    }

    const storedYearID = localStorage.getItem(this.$route.path + 'RefYear');
    if (storedYearID) {
      this.refYearID = Number(storedYearID);
      this.updateFilters(this.refYearID, this.yearList);
    } else {
      this.refYears = 'Year';
    }

    const storedIsSunnyID = localStorage.getItem(this.$route.path + 'RefIsSunny');
    if (storedIsSunnyID) {
      this.refIsSunnyID = Number(storedIsSunnyID);
      this.updateFilters(this.refIsSunnyID, this.isSunnyList);
    } else {
      this.refIsSunny = '晴れ希望';
    }

    const storedDaysNumID = localStorage.getItem(this.$route.path + 'RefDaysNum');
    if (storedDaysNumID) {
      this.refDaysNumID = Number(storedDaysNumID);
      this.updateFilters(this.refDaysNumID, this.daysNumList);
    } else {
      this.refDaysNum = '何日目';
    }

    const storedStageID = localStorage.getItem(this.$route.path + 'RefStage');
    if (storedStageID) {
      this.refStageID = Number(storedStageID);
      this.updateFilters(this.refStageID, this.stageList);
    } else {
      this.refStage = 'Stage';
    }

    this.fetchFilteredData();
  },
  computed: {
    useInterval() {
      let minute = this.performanceEndTime.mm - this.performanceStartTime.mm;
      let hour =
        (this.performanceEndTime.HH - this.performanceStartTime.HH) * 60;
      return hour + minute;
    },
    ...mapState({
      roleID: (state) => state.users.role,
    }),
  },
  methods: {
    changeMode() {
      this.isIntervalMode = !this.isIntervalMode;
    },
    async refinementStageOrders(item_id, name_list) {
      this.updateFilters(item_id, name_list);
      localStorage.setItem(this.$route.path + 'RefYear', this.refYearID);
      localStorage.setItem(this.$route.path + 'RefIsSunny', this.refIsSunnyID);
      localStorage.setItem(this.$route.path + 'RefDaysNum', this.refDaysNumID);
      localStorage.setItem(this.$route.path + 'RefStage', this.refStageID);
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
        // is_sunnyで絞り込むとき
      } else if (Object.is(name_list, this.isSunnyList)) {
        this.refIsSunnyID = item_id;
        // ALLの時
        if (item_id == 0) {
          this.refIsSunny = "ALL";
        } else {
          this.refIsSunny = name_list[item_id - 1].text;
        }
        // days_numで絞り込むとき
      } else if (Object.is(name_list, this.daysNumList)) {
        this.refDaysNumID = item_id;
        // ALLの時
        if (item_id == 0) {
          this.refDaysNum = "ALL";
        } else {
          this.refDaysNum = name_list[item_id - 1].days_num;
        }
        // stage_idで絞り込むとき
      } else if (name_list.toString() == this.stageList.toString()) {
        this.refStageID = item_id;
        // ALLの時
        if (item_id == 0) {
          this.refStage = "ALL";
        } else {
          this.refStage = name_list[item_id - 1].name;
        }
      }
    },
    async fetchFilteredData() {
      this.stageOrders = [];
      const refUrl =
        "/api/v1/get_refinement_stage_orders?fes_year_id=" +
        this.refYearID +
        "&stage_id=" +
        this.refStageID +
        "&days_num=" +
        this.refDaysNumID +
        "&is_sunny=" +
        this.refIsSunnyID;
      const refRes = await this.$axios.$post(refUrl);
      for (const res of refRes.data) {
        this.stageOrders.push(res);
      }
      const storedSearchText = localStorage.getItem(
        this.$route.path + "SearchText"
      );
      if (storedSearchText) {
        this.searchText = storedSearchText;
        this.searchStageOrders();
      }
    },
    async searchStageOrders() {
      localStorage.setItem(this.$route.path + "SearchText", this.searchText);
      this.stageOrders = [];
      const searchUrl =
        "/api/v1/get_search_stage_orders?word=" + this.searchText;
      const refRes = await this.$axios.$post(searchUrl);
      for (const res of refRes.data) {
        const url =
          "/api/v1/get_stage_order_show_for_admin_view/" + res.stage_order.id;
        const response = await this.$axios.$get(url);
        this.stageOrders.push(res);
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
    async openAddModal() {
      const groupsListUrl =
        "/api/v1/get_groups_refinemented_by_current_fes_year";
      const resGroups = await this.$axios.$get(groupsListUrl);
      const fesDatesListUrl = "/api/v1/get_current_fes_dates";
      const resFesDates = await this.$axios.$get(fesDatesListUrl);
      const stageUrl = "/stages";
      const resStages = await this.$axios.$get(stageUrl);
      this.groupList = resGroups.data;
      this.fesDatesList = resFesDates.data;
      this.stageList = resStages.data;
      this.isOpenAddModal = false;
      this.isOpenAddModal = true;
    },
    closeAddModal() {
      this.isOpenAddModal = false;
    },
    reload(id) {
      const url = "/api/v1/get_stage_order_show_for_admin_view/" + id;
      this.$axios.$get(url).then((response) => {
        this.stageOrders.push(response.data);
      });
    },
    async submit() {
      const url =
        "/stage_orders/" +
        "?group_id=" +
        this.groupID +
        "&is_sunny=" +
        this.isSunny +
        "&fes_date_id=" +
        this.fesDateID +
        "&stage_first=" +
        this.first +
        "&stage_second=" +
        this.second +
        "&use_time_interval=" +
        this.useTimeInterval +
        "&prepare_time_interval=" +
        this.prepareTimeInterval +
        "&cleanup_time_interval=" +
        this.cleanUpTimeInterval +
        "&prepare_start_time=" +
        this.prepareStartTime +
        "&performance_start_time=" +
        this.performanceStartTime +
        "&performance_end_time=" +
        this.performanceEndTime +
        "&cleanup_end_time=" +
        this.cleanUpEndTime;

      this.$axios.$post(url).then((response) => {
        this.reload(response.data.id);
        this.groupID = null;
        this.isSunny = null;
        this.fesDateID = null;
        this.first = null;
        this.second = null;
        this.useTimeInterval = null;
        this.prepareTimeInterval = null;
        this.cleanUpTimeInterval = null;
        this.prepareStartTime = null;
        this.performanceStartTime = null;
        this.performanceEndTime = null;
        this.cleanUpEndTime = null;
        this.openSnackBar("追加しました");
        this.closeAddModal();
      });
    },
    async downloadCSV() {
      const url =
        this.$config.apiURL + "/api/v1/get_stage_orders_csv/" + this.refYearID;
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
