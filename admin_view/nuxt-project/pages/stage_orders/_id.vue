<template>
  <div class="main-content">
    <SubHeader
      v-bind:pageTitle="stageOrder.group.name"
      pageSubTitle="ステージ申請一覧"
    >
      <CommonButton
        v-if="this.$role(this.roleID).stage_orders.update"
        iconName="edit"
        :on_click="openEditModal"
      >
        編集
      </CommonButton>
      <CommonButton
        v-if="this.$role(this.roleID).stage_orders.delete"
        iconName="delete"
        :on_click="openDeleteModal"
      >
        削除
      </CommonButton>
    </SubHeader>
    <Row>
      <Card padding="40px 150px" gap="20px">
        <Row justify="start">
          <h4>基本情報</h4>
        </Row>
        <VerticalTable>
          <tr>
            <th>ID</th>
            <td>{{ stageOrder.stage_order.id }}</td>
          </tr>
          <tr>
            <th>参加団体</th>
            <td>{{ stageOrder.group.name }}</td>
          </tr>
          <tr>
            <th>晴れ希望</th>
            <td>{{ stageOrder.stage_order.is_sunny }}</td>
          </tr>
          <tr>
            <th>希望日</th>
            <td>
              {{ stageOrder.stage_order_info.date }} -
              {{ stageOrder.stage_order_info.day }} -
              {{ stageOrder.stage_order_info.day_num }}日目
            </td>
          </tr>
          <tr>
            <th>第一希望</th>
            <td>{{ stageOrder.stage_order_info.stage_first }}</td>
          </tr>
          <tr>
            <th>第二希望</th>
            <td>{{ stageOrder.stage_order_info.stage_second }}</td>
          </tr>
          <tr>
            <th>準備時間幅</th>
            <td>{{ stageOrder.stage_order_info.prepare_time_interval }}</td>
          </tr>
          <tr>
            <th>使用時間幅</th>
            <td>{{ stageOrder.stage_order_info.use_time_interval }}</td>
          </tr>
          <tr>
            <th>掃除時間幅</th>
            <td>{{ stageOrder.stage_order_info.cleanup_time_interval }}</td>
          </tr>
          <tr>
            <th>準備開始時刻</th>
            <td>{{ stageOrder.stage_order_info.prepare_start_time }}</td>
          </tr>
          <tr>
            <th>パフォーマンス開始時刻</th>
            <td>{{ stageOrder.stage_order_info.performance_start_time }}</td>
          </tr>
          <tr>
            <th>パフォーマンス終了時刻</th>
            <td>{{ stageOrder.stage_order_info.performance_end_time }}</td>
          </tr>
          <tr>
            <th>掃除終了時刻</th>
            <td>{{ stageOrder.stage_order_info.cleanup_end_time }}</td>
          </tr>
          <tr>
            <th>登録日時</th>
            <td>{{ stageOrder.stage_order.created_at | formatDate }}</td>
          </tr>
          <tr>
            <th>編集日時</th>
            <td>{{ stageOrder.stage_order.updated_at | formatDate }}</td>
          </tr>
        </VerticalTable>
      </Card>
    </Row>

    <EditModal
      @close="closeEditModal"
      v-if="isOpenEditModal"
      title="ステージ申請の編集"
    >
      <template v-slot:form>
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
              {{ list.date }}
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
        <CommonButton iconName="edit" :on_click="edit">登録</CommonButton>
      </template>
    </EditModal>

    <DeleteModal
      @close="closeDeleteModal"
      v-if="isOpenDeleteModal"
      title="ステージ申請の削除"
    >
      <template v-slot:method>
        <YesButton iconName="delete" :on_click="destroy">はい</YesButton>
        <NoButton iconName="close" :on_click="closeDeleteModal"
          >いいえ</NoButton
        >
      </template>
    </DeleteModal>
    <SnackBar v-if="isOpenSnackBar" @close="closeSnackBar">
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
      isOpenEditModal: false,
      isOpenDeleteModal: false,
      isOpenSnackBar: false,
      fesDatesList: [],
      stageList: [],
      isSunnyList: [
        { id: 1, text: "はい", value: true },
        { id: 2, text: "いいえ", value: false },
      ],
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
    };
  },
  async asyncData({ $axios, route }) {
    const routeId = route.path.replace("/stage_orders/", "");
    const url = "/api/v1/get_stage_order_show_for_admin_view/" + routeId;
    const response = await $axios.$get(url);
    return {
      stageOrder: response.data,
      route: url,
      routeId: routeId,
    };
  },
  computed: {
    ...mapState({
      roleID: (state) => state.users.role,
    }),
  },
  mounted() {
    window.scrollTo(0, 0);
    
    // 時間を作る
    for (let hour of this.hour_range) {
      for (let minute of this.minute_range) {
        this.timeRange.push(hour + ":" + minute);
      }
    }
  },
  methods: {
    async openEditModal() {
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
      let stageOrder = this.stageOrder.stage_order;
      console.log(stageOrder);
      this.groupID = stageOrder.group_id;
      this.isSunny = stageOrder.is_sunny;
      this.fesDateID = stageOrder.fes_date_id;
      this.first = stageOrder.stage_first;
      this.second = stageOrder.stage_second;
      this.prepareTimeInterval = stageOrder.prepare_time_interval;
      this.useTimeInterval = stageOrder.use_time_interval;
      this.cleanUpTimeInterval = stageOrder.cleanup_time_interval;
      this.prepareStartTime = stageOrder.prepare_start_time;
      this.performanceStartTime = stageOrder.performance_start_time;
      this.performanceEndTime = stageOrder.performance_end_time;
      this.cleanUpEndTime = stageOrder.cleanup_end_time;
      this.isOpenEditModal = false;
      this.isOpenEditModal = true;
    },
    closeEditModal() {
      this.isOpenEditModal = false;
    },
    openDeleteModal() {
      this.isOpenDeleteModal = false;
      this.isOpenDeleteModal = true;
    },
    closeDeleteModal() {
      this.isOpenDeleteModal = false;
    },
    openSnackBar(message) {
      this.message = message;
      this.isOpenSnackBar = true;
      setTimeout(this.closeSnackBar, 2000);
    },
    closeSnackBar() {
      this.isOpenSnackBar = false;
    },
    async reload(id) {
      const url = "/api/v1/get_stage_order_show_for_admin_view/" + id;
      const res = await this.$axios.$get(url);
      this.stageOrder = res.data;
    },
    async edit() {
      const url =
        "/stage_orders/" +
        this.routeId +
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

      console.log(url);

      await this.$axios.$put(url).then((response) => {
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
        this.openSnackBar("編集しました");
        this.closeEditModal();
      });
    },
    async destroy() {
      const delUrl = "/stage_orders/" + this.routeId;
      await this.$axios.$delete(delUrl);
      this.$router.push("/stage_orders");
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
