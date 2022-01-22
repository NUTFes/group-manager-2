<template>
  <Card>
    <Row justify="start">
      <h4>ユーザー数</h4>
    </Row>
    <div class="users-card-content">
      <h1>{{ dashboard_data.all_user_num }}</h1>
      <Row>
        <Tag primaryColor="#FF7070" secondaryColor="#E38AD5"
          >{{ dashboard_data.developer_num }} Developers</Tag
        >
        <Tag primaryColor="#8FEE8D" secondaryColor="#E3D08A"
          >{{ dashboard_data.manager_num }} Managers</Tag
        >
        <Tag primaryColor="#9C8AE3" secondaryColor="#70FFDD"
          >{{ dashboard_data.user_num }} Users</Tag
        >
      </Row>
    </div>
    <hr />
  </Card>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      user: [],
      user_detail: [],
      role: [],
      grade: [],
      department: [],
      student_id: [],
      tel: [],
      rate: [],
      groups_length: [],
      dashboard_data: [],
    };
  },
  mounted() {
    this.$axios
      .get("api/v1/dashboard", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.dashboard_data = response.data;
      });
  },
};
</script>
<style>
.users-card-content {
  font-size: 60px;
  width: 400px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  flex-flow: column;
  gap: 20px;
}
</style>
