<template>
  <div class="main-content">
    <Row>
      <Card>
        <h3>参加団体</h3>
        <hr />
        <Chart1 :styles="myStyles" />
      </Card>
      <Card>
        <h3>ユーザー数</h3>
        <hr />
        <Chart2 :styles="myStyles" />
      </Card>
    </Row>
    <Row>
      <Card width="300px" gap="20px">
        <h3>物品割り当て</h3>
        <hr />
        <Row>
          <Card width="" height="" padding="0" flexGrow="0">
            在庫
            <Chart2 :styles="myStyles" />
          </Card>
          <Card width="" height="" padding="0" flexGrow="0">
            割り当て済み
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
      dashboard_data: [],
      height: 100,
    };
  },
  mounted() {
    this.$axios
      .get("api/v1/users/get_user_detail", {
        headers: {
          "Content-Type": "application/json",
          "access-token": localStorage.getItem("access-token"),
          client: localStorage.getItem("client"),
          uid: localStorage.getItem("uid"),
        },
      })
      .then((response) => {
        this.user = response.data.user;
        this.role = response.data.role;
        this.grade = response.data.grade;
        this.department = response.data.department;
        this.student_id = response.data.student_id;
        this.tel = response.data.tel;
      });
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
  computed: {
    myStyles() {
      return {
        height: "250px",
        position: "relative",
      };
    },
  },
};
</script>
