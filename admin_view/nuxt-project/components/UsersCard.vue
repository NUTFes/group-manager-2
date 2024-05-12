<template>
  <Card>
    <Row justify="start">
      <h4>ユーザー数</h4>
    </Row>
    <div class="users-card-content">
      <h1>{{ dashboardData.all_user_num }}</h1>
      <Row>
        <Tag primaryColor="#FF7070" secondaryColor="#E38AD5" 
          >{{ dashboardData.developer_num }} Developers</Tag
        >
        <Tag primaryColor="#8FEE8D" secondaryColor="#E3D08A" width = auto
          >{{ dashboardData.participant_num }} Participants</Tag
        >
        <Tag primaryColor="#9C8AE3" secondaryColor="#70FFDD" width = auto
          >{{ dashboardData.inventory_management_num }} Inventory_Managers</Tag
        >
        <Tag primaryColor="#ffce56" secondaryColor="#d6ff33" width = auto
          >{{ dashboardData.venue_power_num }} Venue_Power_Managers</Tag
        >
        <Tag primaryColor="#ffce56" secondaryColor="#d6ff33" width = auto
          >{{ dashboardData.sanitation_management_num }} Sanitation_Managers</Tag
        >
        <Tag primaryColor="#ffce56" secondaryColor="#d6ff33"
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
