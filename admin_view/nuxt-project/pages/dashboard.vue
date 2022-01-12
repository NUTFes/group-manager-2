<template>
  <div class="main-content">
    <Row>
      <Card width="500px">
        <Chart1 />
      </Card>
      <Card width="500px">
        <Chart2 />
      </Card>
      <Card width="500px">
        <Chart3 />
      </Card>
    </Row>
    <Row width="100%">
      <Row justify="start">
        <Card width="300px">a</Card>
        <Card width="300px">a</Card>
        <Card width="300px">a</Card>
        <Card width="300px">a</Card>
        <Card width="300px">a</Card>
        <Card width="300px">a</Card>
        <Card width="300px">a</Card>
        <Card width="300px">a</Card>
        <Card width="300px">a</Card>
      </Row>
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
};
</script>
