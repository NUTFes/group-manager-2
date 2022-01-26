<template>
	<div class="main-content">
		<SubHeader v-bind:pageTitle="stageOrder.group.name" pageSubTitle="ステージ申請一覧">
			<CommonButton iconName="edit"> 編集 </CommonButton>
			<CommonButton iconName="delete"> 削除 </CommonButton>
		</SubHeader>
		<Row>
			<Card padding="40px 150px" gap="20px">
				<Row justify="start">
					<h4>基本情報</h4>
				</Row>
				<table class="vertical-table">
					<thead>
						<th v-for="(n, i) in headers" :key="i">
							{{ n }}
						</th>
					</thead>
					<tbody>
						<tr>
              <td>{{ stageOrder.stage_order.id }}</td>
              <td>{{ stageOrder.group.name }}</td>
              <td>{{ stageOrder.stage_order.is_sunny }}</td>
              <td>{{ stageOrder.stage_order_info.date }} - {{stageOrder.stage_order_info.day }} - {{ stageOrder.stage_order_info.day_num }}日目</td>
              <td>{{ stageOrder.stage_order_info.stage_first }}</td>
              <td>{{ stageOrder.stage_order_info.stage_second }}</td>
              <td>{{ stageOrder.stage_order_info.use_time_interval }}</td>
              <td>{{ stageOrder.stage_order_info.prepare_time_interval }}</td>
              <td>{{ stageOrder.stage_order_info.cleanup_time_interval }}</td>
              <td>{{ stageOrder.stage_order_info.prepare_start_time }}</td>
              <td>{{ stageOrder.stage_order_info.performance_start_time }}</td>
              <td>{{ stageOrder.stage_order_info.performance_end_time }}</td>
              <td>{{ stageOrder.stage_order_info.cleanup_end_time }}</td>
              <td>{{ stageOrder.stage_order.created_at | formatDate }}</td>
              <td>{{ stageOrder.stage_order.updated_at | formatDate }}</td>
						</tr>
					</tbody>
				</table>
			</Card>
		</Row>
	</div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      headers: [
        "ID",
        "参加団体",
        "晴れ希望",
        "希望日",
        "第一希望",
        "第二希望",
        "使用時間幅",
        "準備時間幅",
        "掃除時間幅",
        "準備開始時刻",
        "パフォーマンス開始時刻",
        "パフォーマンス終了時刻",
        "掃除終了時刻",
        "登録日時",
        "編集日時",
      ]
    };
  },
	async asyncData({ $axios, route}){
		const routeId = route.path.replace("/stage_orders/", "");
		const url = "/api/v1/get_stage_order_show_for_admin_view/" + routeId;
		const response = await $axios.$get(url);
		return {
			stageOrder: response.data,
			route: url,
		}
	},
  computed: {
    ...mapState({
      selfRoleId: (state) => state.users.role,
    }),
  },
  methods: {
    reload: function () {
      const url = "/api/v1/get_stage_order_details/" + this.$route.params.id;
      this.$axios
        .get(url, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.stage_order = response.data.stage_order;
          this.group = response.data.group;
          this.stage_first = response.data.stage_first;
          this.stage_second = response.data.stage_second;
          this.fes_date = response.data.fes_date;
          this.fes_date_id = this.stage_order.fes_date_id;
          this.group_id = this.stage_order.group_id;
          this.is_sunny = this.stage_order.is_sunny;
          this.stage_first_id = this.stage_order.stage_first;
          this.stage_second_id = this.stage_order.stage_second;
          this.prepare_time_interval = this.stage_order.prepare_time_interval;
          this.use_time_interval = this.stage_order.use_time_interval;
          this.cleanup_time_interval = this.stage_order.cleanup_time_interval;
          this.prepareStartTime = this.stage_order.prepare_start_time;
          this.performanceStartTime = this.stage_order.performance_start_time;
          this.performanceEndTime = this.stage_order.performance_end_time;
          this.cleanupEndTime = this.stage_order.cleanup_end_time;
        });
    },
    set_time_range: function () {
      for (var hour of this.hour_range) {
        for (var minute of this.minute_range) {
          this.time_range.push(hour + ":" + minute);
        }
      }
    },
    edit_dialog_open: function () {
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
      this.edit_dialog = true;
    },
    edit: function () {
      const edit_url =
        "/stage_orders/" +
        this.stage_order.id +
        "?group_id=" +
        this.group_id +
        "&is_sunny=" +
        this.is_sunny +
        "&fes_date_id=" +
        this.fes_date_id +
        "&stage_first_id=" +
        this.stage_first_id +
        "&stage_second=" +
        this.stage_second_id +
        "&use_time_interval=" +
        this.use_time_interval +
        "&prepare_time_interval=" +
        this.prepare_time_interval +
        "&cleanup_time_interval=" +
        this.cleanup_time_interval +
        "&prepare_start_time=" +
        this.prepareStartTime +
        "&performance_start_time=" +
        this.performanceStartTime +
        "&performance_end_time=" +
        this.performanceEndTime +
        "&cleanup_end_time=" +
        this.cleanupEndTime;
      this.$axios
        .put(edit_url, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log(response);
          this.reload();
          this.edit_dialog = false;
          this.success_snackbar = true;
        });
    },
    delete_yes: function () {
      const url = "/stage_orders/" + this.$route.params.id;
      this.$axios.delete(url);
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
