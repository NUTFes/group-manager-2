<template>
  <div class="main-content">
    <SubHeader
      v-bind:pageTitle="group.group.name"
      pageSubTitle="参加団体申請一覧"
    >
      <CommonButton iconName="edit" :on_click="openEditModal"> 編集 </CommonButton>
      <CommonButton iconName="delete" :on_click="openDeleteModal"> 削除 </CommonButton>
      <CommonButton iconName="download" :on_click="printPDF"> 参加団体情報 </CommonButton>
      <CommonButton iconName="download" :on_click="printRentalItemsPDF"> 物品貸し出し表 </CommonButton>
    </SubHeader>
    <Row>
      <Card padding="40px 150px" gap="20px">
        <Row justify="start">
          <h4>基本情報</h4>
        </Row>
        <VerticalTable>
          {{ group }}
            <tr>
              <th>ID</th><td>{{ group.group.id }}</td>
            </tr>
            <tr>
              <th>代表者氏名</th><td>{{ group.user.name }}</td>
            </tr>
            <tr>
              <th>団体名</th><td>{{ group.group.name }}</td>
            </tr>
            <tr>
              <th>企画名</th><td>{{ group.group.project_name }}</td>
            </tr>
            <tr>
              <th>活動内容</th><td>{{ group.group.activity }}</td>
            </tr>
            <tr>
              <th>カテゴリー</th><td>{{ group.group_category }}</td>
            </tr>
            <tr>
              <th>開催年</th><td>{{ group.fes_year }}</td>
            </tr>
            <tr>
              <th>登録日時</th><td>{{ group.group.created_at | formatDate }}</td>
            </tr>
            <tr>
              <th>編集日時</th><td>{{ group.group.updated_at | formatDate }}</td>
            </tr>
          </VerticalTable>
      </Card>
    </Row>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
import moment from "moment";

export default {
  watchQuery: ["page"],
  data() {
    return {
      headers: [
        "ID",
        "ユーザー",
        "団体名",
        "企画名",
        "活動内容",
        "カテゴリー",
        "開催年",
        "登録日時",
        "編集日時",
      ],
      data: [],
      detail_data: [],
      group: [],
    };
  },
  computed: {
    ...mapState({
      selfRoleId: (state) => state.users.role,
    }),
  },
  async asyncData({ $axios, route }) {
    const routeId = route.path.replace("/groups/", "");
    const url = "/api/v1/get_group_show_for_admin_view/" + routeId;
    const response = await $axios.$get(url);
    return {
      group: response.data,
      route: url,
    };
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
      const routeId = route.path.replace("/groups/", "");
      const url = "/api/v1/get_group_show_for_admin_view/" + routeId;
      const response = await $axios.$get(url);
      const groupId = this.groups.slice(-1)[0].group.id + 1;
      const reUrl = "/api/v1/get_group_for_admin_view?id=" + groupId;
      this.$axios.$get(reUrl).then((response) => {
        this.groups.push(response.data[0]);
      });
    },
    async submitGroup() {
      const currentUserUrl = "/api/v1/current_user/show";
      const CurrentUser = await this.$axios.get(currentUserUrl, {
        headers: {
          "Content-Type": "application/json",
          "access-token": localStorage.getItem("access-token"),
          client: localStorage.getItem("client"),
          uid: localStorage.getItem("uid"),
        },
      });
      const putGroupUrl =
        "/groups/" +
        "?user_id=" +
        CurrentUser.data.data.id +
        "&name=" +
        this.groupName +
        "&project_name=" +
        this.projectName +
        "&activity=" +
        this.activity +
        "&group_category_id=" +
        this.groupCategoryId +
        "&fes_year_id=" +
        this.fesYearId;

      this.$axios.$put(putGroupUrl).then((response) => {
        this.groupName = "";
        this.projectName = "";
        this.activity = "";
        this.groupCategoryId = "";
        this.fesYearId = "";
        this.reload();
        this.closeAddModal();
      });
    },
    async printPDF() {
      const url = "http://localhost:3000" + "/print_pdf/group_info/" + this.group.group.id + "/output.pdf";
      window.open(
        url,
        this.group.group.name + "_PDF"
      );
    },
    async printRentalItemsPDF() {
      const url = "http://localhost:3000" + "/print_pdf/group/" + this.group.group.id + "/output.pdf";
      window.open(
        url,
        this.group.group.name + "_PDF"
      );
    }
  }
};
</script>
