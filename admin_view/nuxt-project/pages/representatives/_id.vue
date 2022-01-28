<template>
  <div class="main-content">
    <SubHeader
      v-bind:pageTitle="representative.user.name"
      pageSubTitle="代表者一覧"
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
              <td>{{ representative.user.id }}</td>
              <td>{{ representative.group.name }}</td>
              <td>{{ representative.user.name }}</td>
              <td>{{ representative.sub_rep.name }}</td>
              <td>{{ representative.user.created_at | formatDate }}</td>
              <td>{{ representative.user.updated_at | formatDate }}</td>
            </tr>
          </tbody>
        </table>
      </Card>
    </Row>
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
        "代表者",
        "副代表",
        "登録日時",
        "編集日時",
      ],
    }
  },
  async asyncData({ $axios, route }) {
    const routeId = route.path.replace("/representatives/", "");
    const url = "/api/v1/get_representative_show_for_admin_view/" + routeId;
    const response = await $axios.$get(url);
    return {
      representative: response.data,
      route: url,
    };
  },
  methods: {
    reload: function () {
      const url = "/api/v1/get_sub_rep_details/" + this.$route.params.id;
      this.$axios
        .get(url, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.sub_rep = response.data.sub_rep;
          this.name = response.data.sub_rep.name;
          this.group = response.data.group;
          this.group_id = response.data.sub_rep.group_id;
          this.department_id = response.data.sub_rep.department_id;
          this.grade_id = response.data.sub_rep.grade_id;
          this.student_id = response.data.sub_rep.student_id;
          this.email = response.data.sub_rep.email;
          this.tel = response.data.sub_rep.tel;
          this.grade = response.data.grade;
          this.department = response.data.department;
        });
    },
    edit_dialog_open: function () {
      this.$axios
        .get("/groups", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.group_list = response.data;
        });
      this.edit_dialog = true;
    },
    edit: function () {
      const edit_url =
        "sub_reps/" +
        this.sub_rep.id +
        "?group_id=" +
        this.group_id +
        "&name=" +
        this.name +
        "&department_id=" +
        this.department_id +
        "&grade_id=" +
        this.grade_id +
        "&tel=" +
        this.tel +
        "&email=" +
        this.email +
        "&student_id=" +
        this.student_id;
      this.$axios
        .put(edit_url, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.reload();
          this.edit_dialog = false;
          this.success_snackbar = true;
        });
    },
    delete_yes: function () {
      const url = "/sub_reps/" + this.$route.params.id;
      this.$axios.delete(url);
      this.$router.push("/sub_reps");
    },
  },
};
</script>
