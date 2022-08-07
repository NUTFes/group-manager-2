<template>
  <div class="main-content">
    <SubHeader pageTitle="ダッシュボード" />
		{{ dashboard_data }}
    <Row>
      <Card>
        <Row justify="start">
          <h4>参加団体</h4>
        </Row>
        <hr />
        <Chart1 :styles="myStyles" />
      </Card>
      <UsersCard v-bind:dashboardData="dashboard_data" />
    </Row>
    <Row>
      <Card width="300px" gap="20px">
        <Row justify="start">
          <h4>物品割り当て</h4>
        </Row>
        <hr />
        <Row>
          <Card width="" height="" padding="0" flexGrow="0" border="0px">
            <p>在庫</p>
            <Chart2 :styles="myStyles" />
          </Card>
          <Card width="" height="" padding="0" flexGrow="0" border="0px">
            <p>割り当て済み</p>
            <Chart3 :styles="myStyles" />
          </Card>
        </Row>
      </Card>
    </Row>
  </div>
</template>

<script>
import axios from "axios";
import Chart1 from "./Chart_Group";
import Chart2 from "./Chart_Stock";
import Chart3 from "./Chart_Assign";
import Update from "../components/Update.vue";

export default {
  watchQuery: ["page"],
  components: {
    Chart1,
    Chart2,
    Chart3,
    Update,
  },
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
      height: 100,
    };
  },
  async asyncData({ $axios }) {
    const url = "/api/v1/dashboard";
    const response = await $axios.$get(url);
    return {
      dashboard_data: response,
    };
  },
  computed: {
    myStyles() {
      return {
        height: "300px",
        width: "400px",
        position: "relative",
      };
    },
  },
};
</script>
