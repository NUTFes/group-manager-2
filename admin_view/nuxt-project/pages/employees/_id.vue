<template>
  <div class="main-content">
    <SubHeader
      v-bind:pageTitle="employee.employee.name"
      pageSubTitle="従業員申請"
    >
      <CommonButton v-if="this.$role(this.roleID).employees.update" iconName="edit" :on_click="openEditModal">
        編集
      </CommonButton>
      <CommonButton v-if="this.$role(this.roleID).employees.delete" iconName="delete" :on_click="openDeleteModal">
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
            <td>{{ employee.employee.id }}</td>
          </tr>
          <tr>
            <th>参加団体</th>
            <td>{{ employee.group.name }}</td>
          </tr>
          <tr>
            <th>氏名</th>
            <td>{{ employee.employee.name }}</td>
          </tr>
          <tr>
            <th>学籍番号</th>
            <td>{{ employee.employee.student_id }}</td>
          </tr>
          <tr>
            <th>検便</th>
            <td>{{ employee.stool_test.status }}</td>
          </tr>
          <tr>
            <th>登録日時</th>
            <td>{{ employee.employee.created_at | formatDate }}</td>
          </tr>
          <tr>
            <th>編集日時</th>
            <td>{{ employee.employee.updated_at | formatDate }}</td>
          </tr>
        </VerticalTable>
      </Card>
    </Row>

    <EditModal
      @close="closeEditModal"
      v-if="isOpenEditModal"
      title="従業員の編集"
    >
      <template v-slot:form>
        <div>
          <h3>氏名</h3>
          <input v-model="name" placeholder="入力してください" />
        </div>
        <div>
          <h3>学籍番号</h3>
          <input v-model="studentId" placeholder="入力してください" />
        </div>
        <div>
          <h3>検便</h3>
          <select v-model="stoolTestID">
            <option disabled value="">選択してください</option>
            <option
              v-for="list in stoolTestList"
              :key="list.id"
              :value="list.id"
            >
              {{ list.value }}
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
      title="従業員の削除"
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
      groupId: null,
      name: null,
      studentId: null,
      employee: null,
      stoolTestID: null,
      stoolTestList: [
        { id: 1, value: "検便準備中" },
        { id: 2, value: "検便無" },
        { id: 3, value: "検便有" }
      ]
    };
  },
  async asyncData({ $axios, route }) {
    const routeId = route.path.replace("/employees/", "");
    const url = "/api/v1/get_employee_show_for_admin_view/" + routeId;
    const response = await $axios.$get(url);
    return {
      employee: response.data,
      route: url,
    };
  },
  computed: {
    ...mapState({
      roleID: (state) => state.users.role,
    }),
  },
  mounted() {
    window.scrollTo(0, 0);
  },
  methods: {
    openEditModal() {
      this.groupId = this.employee.employee.group_id;
      this.name = this.employee.employee.name;
      this.studentId = this.employee.employee.student_id;
      this.stoolTestID = this.employee.employee.stool_test_id;
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
      const reUrl = "/api/v1/get_employee_show_for_admin_view/" + id;
      const res = await this.$axios.$get(reUrl);
      this.employee = res.data;
    },
    async edit() {
      const url =
        "/employees/" +
        this.employee.employee.id +
        "?group_id=" +
        this.groupId +
        "&name=" +
        this.name +
        "&student_id=" +
        this.studentId +
        "&stool_test_id=" +
        this.stoolTestID;

      await this.$axios.$put(url).then((response) => {
        this.openSnackBar(this.name + "を編集しました");
        this.groupId = null;
        this.name = null;
        this.studentId = null;
        this.stoolTestID = null;
        this.reload(response.data.id);
        this.closeEditModal();
      });
    },
    async destroy() {
      const delUrl = "/employees/" + this.employee.employee.id;
      await this.$axios.$delete(delUrl);
      this.$router.push("/employees");
    },
  },
};
</script>

<style scoped>
td {
  width: 70%;
}
th {
  width: 30%;
}
</style>
