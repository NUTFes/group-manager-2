<template>
  <div class="main-content">
    <SubHeader
      v-bind:pageTitle="user.user.name"
      pageSubTitle="ユーザー一覧"
    >
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
              <td>{{ user.user.id }}</td>
              <td>{{ user.user.name }}</td>
              <td>{{ user.role.name }}</td>
              <td>{{ user.user.email }}</td>
              <td>{{ user.user_detail.tel }}</td>
              <td>{{ user.user_detail.student_id }}</td>
              <td>{{ user.user_detail_info.department }}</td>
              <td>{{ user.user_detail_info.grade }}</td>
              <td>{{ user.user.created_at | formatDate }}</td>
              <td>{{ user.user.updated_at | formatDate }}</td>
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
  watchQuery: ["page"],
  computed: {
    ...mapState({
      selfRoleId: (state) => state.users.role,
      uid: (state) => state.users.uid,
    }),
  },
  data() {
    return {
      headers: [
        "ID",
        "名前",
        "権限",
        "メールアドレス",
        "電話番号",
        "学籍番号",
        "課程・専攻",
        "学年"
      ]
    }
  },
  async asyncData({ $axios, route }) {
    const routeId = route.path.replace("/users/", "");
    const url = "/api/v1/get_user_show_for_admin_view/" + routeId;
    const response = await $axios.$get(url);
    return {
      user: response.data,
      route: url,
    };
  },
  methods: {
    reload: function () {
      const url = "api/v1/users/show_user_detail/" + this.$route.params.id;
      this.$axios
        .get(url, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.show = response.data;
          this.user = response.data.user;
          this.role_id = response.data.user.role_id;
        });
    },
    edit_role_dialog_open: function () {
      this.edit_role_dialog = true;
    },
    open_edit_user_dialog_open: function () {
      this.edit_user_info_dialog = true;
    },
    edit_role: function () {
      const edit_url =
        "/api/v1/update_user/" + this.user.id + "/" + this.role_id;
      this.$axios
        .get(edit_url, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log(response);
          this.reload();
          this.edit_role_dialog = false;
          this.success_snackbar = true;
        });
    },
    edit_user_info: function () {
      if (!this.$refs.form.validate()) return;
      const edit_user_info_url = "/api/v1/users/edit_user_info";
      var params = {
        user_id: this.user_id,
        name: this.name,
        student_id: this.student_id,
        grade_id: this.grade_id,
        department_id: this.department_id,
        tel: this.tel,
        email: this.email,
      };
      this.$axios.post(edit_user_info_url, params).then((response) => {
        this.reload();
        this.edit_user_info_dialog = false;
        this.success_snackbar = true;
      });
    },
    reset_password: function () {
      if (!this.$refs.form.validate()) return;
      const reset_password_url = "/api/v1/users/reset_password";
      var params = {
        user_id: this.user_id,
        password: this.password,
        password_confirmation: this.password_confirmation,
      };
      this.$axios.post(reset_password_url, params).then((response) => {
        this.reload();
        this.reset_password_dialog = false;
        this.success_snackbar = true;
      });
    },
    delete_yes: function () {
      this.$router.push("/users");
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

<style>
.card {
  padding-left: 1%;
  padding-right: 5%;
}
</style>
