<template>
  <div class="main-content">
    <SubHeader pageTitle="ステージ申請一覧">
      <CommonButton iconName="add_circle" :on_click="openModal">
        追加
      </CommonButton>
      <CommonButton iconName="file_download" :on_click="downloadCSV">
        CSVダウンロード
      </CommonButton>
    </SubHeader>
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
    };
  },
  async asyncData({ $axios }) {
    const url = "/api/v1/get_stage_order_index_for_admin_view";
    const stageOrdersRes = await $axios.$get(url);
    const yearsUrl = "/fes_years";
    const yearsRes = await $axios.$get(yearsUrl);
    return {
      stageOrders: stageOrdersRes.data,
      yearList: yearsRes.data,
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
    set_time_range: function () {
      for (var hour of this.hour_range) {
        for (var minute of this.minute_range) {
          this.time_range.push(hour + ":" + minute);
        }
      }
    },
    open_dialog: function () {
      this.$axios
        .get("/stages", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.stages_list = response.data;
        });
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
          this.fes_date_list = response.data;
        });
      this.dialog = true;
    },
    reload: function () {
      this.$axios
        .get("/api/v1/get_stage_orders_details", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.stage_orders = response.data;
        });
    },
    register: function () {
      if (this.prepareTimeInterval.length == 0) {
        this.prepareTimeInterval = "-9999";
      }
      if (this.useTimeInterval.length == 0) {
        this.useTimeInterval = "-9999";
      }
      if (this.cleanupTimeInterval.length == 0) {
        this.cleanupTimeInterval = "-9999";
      }
      if (this.prepareStartTime.length == 0) {
        this.prepareStartTime = "00:00";
      }
      if (this.prepareStartTime.HH == "" && this.prepareStartTime.mm == "") {
        this.prepareStartTime = "00:00";
      }
      if (this.performanceStartTime.length == 0) {
        this.performanceStartTime = "00:00";
      }
      if (
        this.performanceStartTime.HH == "" &&
        this.performanceStartTime.mm == ""
      ) {
        this.performanceStartTime = "00:00";
      }
      if (this.performanceEndTime.length == 0) {
        this.performanceEndTime = "00:00";
      }
      if (
        this.performanceEndTime.HH == "" &&
        this.performanceEndTime.mm == ""
      ) {
        this.performanceEndTime = "00:00";
      }
      if (this.cleanupEndTime.length == 0) {
        this.cleanupEndTime = "00:00";
      }
      if (this.cleanupEndTime.HH == "" && this.cleanupEndTime.mm == "") {
        this.cleanupEndTime = "00:00";
      }
      this.$axios.defaults.headers.common["Content-Type"] = "application/json";
      var params = new URLSearchParams();
      params.append("group_id", this.Group);
      params.append("is_sunny", this.isSunny);
      params.append("fes_date_id", this.fesDateId);
      params.append("stage_first", this.stageFirst);
      params.append("stage_second", this.stageSecond);
      params.append("use_time_interval", this.useTimeInterval);
      params.append("prepare_time_interval", this.prepareTimeInterval);
      params.append("cleanup_time_interval", this.cleanupTimeInterval);
      params.append("prepare_start_time", this.prepareStartTime);
      params.append("performance_start_time", this.performanceStartTime);
      params.append("performance_end_time", this.performanceEndTime);
      params.append("cleanup_end_time", this.cleanupEndTime);

      this.$axios.post("/stage_orders", params).then((response) => {
        console.log(response);
        this.dialog = false;
        this.reload();
        this.Group = "";
        this.isSunny = "";
        this.fesDateId = "";
        this.stageFirst = "";
        this.stageSecond = "";
        this.useTimeInterval = "";
        this.prepareTimeInterval = "";
        this.cleanupTimeInterval = "";
        this.prepareStartTime = "";
        this.performanceStartTime = "";
        this.performanceEndTime = "";
        this.cleanupEndTime = "";
      });
    },
    async downloadCSV() {
      const url = "http://localhost:3000" + "/api/v1/get_stage_orders_csv/" + this.refYearID;
      window.open(
        url,
        "ステージ申請一覧_CSV"
      );
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
