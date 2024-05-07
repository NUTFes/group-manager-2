<template>
  <div class="main-content">
    <SubHeader
      v-bind:pageTitle="group.group.name"
      pageSubTitle="参加団体申請一覧"
    >
      <CommonButton v-if="true" iconName="edit" :on_click="openEditModal">
        編集
      </CommonButton>
      <CommonButton v-if="true" iconName="delete" :on_click="openDeleteModal">
        削除
      </CommonButton>
      <CommonButton iconName="download" :on_click="printPDF">
        参加団体情報
      </CommonButton>
      <CommonButton iconName="download" :on_click="printRentalItemsPDF">
        物品貸し出し表
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
            <td>{{ group.group.id }}</td>
          </tr>
          <tr>
            <th>代表者氏名</th>
            <td>{{ group.user.name }}</td>
          </tr>
          <tr>
            <th>団体名</th>
            <td>{{ group.group.name }}</td>
          </tr>
          <tr>
            <th>企画名</th>
            <td>{{ group.group.project_name }}</td>
          </tr>
          <tr>
            <th>活動内容</th>
            <td>{{ group.group.activity }}</td>
          </tr>
          <tr>
            <th>カテゴリー</th>
            <td>{{ group.group_category }}</td>
          </tr>
          <tr>
            <th>開催年</th>
            <td>{{ group.fes_year }}</td>
          </tr>
          <tr>
            <th>登録日時</th>
            <td>{{ group.group.created_at | formatDate }}</td>
          </tr>
          <tr>
            <th>編集日時</th>
            <td>{{ group.group.updated_at | formatDate }}</td>
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
import axios from "axios";
import { mapState } from "vuex";
import moment from "moment";

export default {
  auth: false,
  watchQuery: ["page"],
  data() {
    return {
      data: [],
      detail_data: [],
      group: [],

      // v-model
      groupName: "",
      projectName: [],
      activity: [],
      groupCategoryId: "",
      fesYearId: "",

      isOpenEditModal: false,
      isOpenDeleteModal: false,

      groupCategories: [],
      yearList: [],
    };
  },
  async asyncData({ $axios, route }) {
    const routeId = route.path.replace("/rush_test/", "");

    const groupUrl = "/api/v1/get_group_show_for_admin_view/" + routeId;
    const groupRes = await $axios.$get(groupUrl);

    const catUrl = "/group_categories";
    const catRes = await $axios.$get(catUrl);

    const yearsUrl = "/fes_years";
    const yearsRes = await $axios.$get(yearsUrl);

    return {
      group: groupRes.data,
      groupName: groupRes.data.group.name,
      projectName: groupRes.data.group.project_name,
      activity: groupRes.data.group.activity,
      groupCategoryId: groupRes.data.group.group_category_id,
      fesYearId: groupRes.data.group.fes_year_id,
      groupCategories: catRes.data,
      yearList: yearsRes.data,
      groupUrl: groupUrl,
    };
  },
  mounted() {
    window.scrollTo(0, 0);
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
    async printPDF() {
      const url =
        this.$config.apiURL +
        "/print_pdf/group_info/" +
        this.group.group.id +
        "/output.pdf";
      window.open(url, this.group.group.name + "_PDF");
    },
    async printRentalItemsPDF() {
      const url =
        this.$config.apiURL +
        "/print_pdf/group/" +
        this.group.group.id +
        "/output.pdf";
      window.open(url, this.group.group.name + "_PDF");
    },
  },
};
</script>
