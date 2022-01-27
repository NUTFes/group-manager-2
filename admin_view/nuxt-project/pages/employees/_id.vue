<template>
  <div class="main-content">
    <SubHeader
      v-bind:pageTitle="employee.employee.name"
      pageSubTitle="従業員申請"
    >
      <CommonButton iconName="edit"> 編集 </CommonButton>
      <CommonButton iconName="delete"> 削除 </CommonButton>
    </SubHeader>
    <Row>
      <Card padding="40px 150px" gap="20px">
        <Row justify="start">
          <h4>基本情報</h4>
        </Row>
        <VerticalTable>
          <tr>
            <th>ID</th><td>{{ employee.employee.id }}</td>
          </tr>
          <tr>
            <th>参加団体</th><td>{{ employee.group.name }}</td>
          </tr>
          <tr>
            <th>氏名</th><td>{{ employee.employee.name }}</td>
          </tr>
          <tr>
            <th>学籍番号</th><td>{{ employee.employee.student_id }}</td>
          </tr>
          <tr>
            <th>登録日時</th><td>{{ employee.employee.created_at | formatDate }}</td>
          </tr>
          <tr>
            <th>編集日時</th><td>{{ employee.employee.updated_at | formatDate }}</td>
          </tr>
        </VerticalTable>
      </Card>
    </Row>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  watchQuery: ["page"],
  data() {
    return {
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
      selfRoleId: (state) => state.users.role,
    }),
  },
  methods: {
    reload: function () {
      console.log("reload");
      const url = "/api/v1/get_employee/" + this.$route.params.id;
      this.$axios
        .get(url, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.employee = response.data.employee;
          this.id = response.data.employee.id;
          this.group = response.data.group;
          this.student_id = response.data.employee.student_id;
          this.group_id = response.data.employee.group_id;
          this.name = response.data.employee.name;
        });
    },
    edit_dialog_open: function () {
      this.edit_dialog = true;
    },
    edit: function () {
      const edit_url =
        "/employees/" +
        this.id +
        "?group_id=" +
        this.group_id +
        "&name=" +
        this.name +
        "&student_id=" +
        this.student_id;
      console.log(edit_url);
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
      const url = "/employees/" + this.$route.params.id;
      this.$axios.delete(url);
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
