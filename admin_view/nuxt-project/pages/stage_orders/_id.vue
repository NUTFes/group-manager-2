<template>
  <div class="main-content">
    <SubHeader
      v-bind:pageTitle="stageOrder.group.name"
      pageSubTitle="ステージ申請一覧"
    >
      <CommonButton v-if="this.$role(this.roleID).stage_orders.update" iconName="edit" :on_click="openEditModal">
        編集
      </CommonButton>
      <CommonButton v-if="this.$role(this.roleID).stage_orders.delete" iconName="delete" :on_click="openDeleteModal">
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
            <th>使用時間幅</th>
            <td>{{ stageOrder.stage_order_info.use_time_interval }}</td>
          </tr>
          <tr>
            <th>準備時間幅</th>
            <td>{{ stageOrder.stage_order_info.prepare_time_interval }}</td>
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
      title="参加団体申請の編集"
    >
      <template v-slot:form>
        <div>
          <h3>団体名</h3>
          <input v-model="groupName" placeholder="入力してください" />
        </div>
        <div>
          <h3>カテゴリー</h3>
          <select v-model="groupCategoryId">
            <option disabled value="">選択してください</option>
            <option
              v-for="category in groupCategories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
        </div>
        <div>
          <h3>企画名</h3>
          <input v-model="projectName" placeholder="入力してください" />
        </div>
        <div>
          <h3>活動内容</h3>
          <textarea v-model="activity" placeholder="入力してください" />
        </div>
        <div>
          <h3>開催年</h3>
          <select v-model="fesYearId">
            <option disabled value="">選択してください</option>
            <option v-for="year in yearList" :key="year.id" :value="year.id">
              {{ year.year_num }}
            </option>
          </select>
        </div>
      </template>
      <template v-slot:method>
        <CommonButton iconName="edit" :on_click="editGroup">登録</CommonButton>
      </template>
    </EditModal>

    <DeleteModal
      @close="closeDeleteModal"
      v-if="isOpenDeleteModal"
      title="参加団体申請の削除"
    >
      <template v-slot:method>
        <YesButton iconName="delete" :on_click="deleteGroup">はい</YesButton>
        <NoButton iconName="close" :on_click="closeDeleteModal"
          >いいえ</NoButton
        >
      </template>
    </DeleteModal>
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
    };
  },
  async asyncData({ $axios, route }) {
    const routeId = route.path.replace("/stage_orders/", "");
    const url = "/api/v1/get_stage_order_show_for_admin_view/" + routeId;
    const response = await $axios.$get(url);
    return {
      stageOrder: response.data,
      route: url,
    };
  },
  computed: {
    ...mapState({
      roleID: (state) => state.users.role,
    }),
  },
  methods: {
    openEditModal() {
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
    async reload() {
      const reUrl = this.groupUrl;
      const reGroupRes = await this.$axios.$get(reUrl);
      this.group = reGroupRes.data;
    },
    async editGroup() {
      console.log(this.group.group.id);
      const putGroupUrl =
        "/groups/" +
        this.group.group.id +
        "?name=" +
        this.groupName +
        "&project_name=" +
        this.projectName +
        "&group_category_id=" +
        this.groupCategoryId +
        "&activity=" +
        this.activity +
        "&fes_year_id=" +
        this.fesYearId;
      console.log(putGroupUrl);

      await this.$axios.$put(putGroupUrl).then((response) => {
        this.groupName = "";
        this.projectName = "";
        this.activity = "";
        this.groupCategoryId = "";
        this.fesYearId = "";
        this.reload();
        this.closeEditModal();
      });
    },
    async deleteGroup() {
      const delUrl = "/groups/" + this.$route.params.id;
      const delRes = await this.$axios.$delete(delUrl);
      this.$router.push("/groups");
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
