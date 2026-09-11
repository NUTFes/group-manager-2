<template>
  <Card>
    <Row justify="start">
      <h4>ユーザー数</h4>
    </Row>
    <div class="users-card-content">
      <h1>{{ dashboardData.all_user_num }}</h1>
      <Row>
        <Tag primaryColor="#8FEE8D" secondaryColor="#E3D08A" width="auto"
          >{{ dashboardData.manager_num }} Managers</Tag
        >
        <Tag primaryColor="#ffce56" secondaryColor="#70FFDD"
          >{{ dashboardData.staff_num }} Staffs</Tag
        >
        <Tag primaryColor="#ffce56" secondaryColor="#d6ff33"
          >{{ dashboardData.user_num }} Users</Tag
        >
      </Row>
    </div>
    <hr />
  </Card>
</template>
<script>
import axios from "axios";
export default {
  watchQuery: ["page"],
  name: "CommonButton",
  props: {
    dashboardData: {
      type: Object,
      required: false,
    },
  },
};
</script>
<style>
.users-card-content {
  font-size: 60px;
  width: 400px;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  flex-flow: column;
  gap: 20px;
}
</style>
