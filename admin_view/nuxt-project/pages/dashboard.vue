<template>
  <div class="main-content" v-if="this.$role(roleID).dashboard.read">
    <SubHeader pageTitle="ダッシュボード" />
    <Row>
      <Card width="300px" gap="10px">
        <Row justify="start">
          <h4>参加団体数</h4>
        </Row>
        <hr />
        <Row>
          <Card width="" height="" padding="0" flexGrow="0" border="0px">
            <GroupsCard
              v-bind:dashboardData="dashboard_data"
              :styles="myStyles"
            />
          </Card>
          <Card width="" height="" padding="0" flexGrow="0" border="0px">
            <Chart1 :styles="myStyles" />
          </Card>
        </Row>
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
  <h1 v-else>閲覧権限がありません</h1>
</template>

<script>
import axios from "axios";
import Chart1 from "./Chart_Group";
import Chart2 from "./Chart_Stock";
import Chart3 from "./Chart_Assign";
import Update from "../components/Update.vue";
import { mapState } from "vuex";

export default {
  watchQuery: ["page"],
  components: {
    Chart1,
    Chart2,
    Chart3,
    Update,
  },
  roles: [
    { id: 1, name: "manager" }, //　GM2メンバー,総務局長,総務副局長
    { id: 2, name: "staff" }, //総務局員
    { id: 3, name: "user" }, //参加団体,企画局員
  ],
  mounted() {
    window.addEventListener("scroll", this.saveScrollPosition);
    this.$nextTick(() => {
      window.scrollTo(
        0,
        parseInt(localStorage.getItem("scrollPosition-" + this.$route.path))
      );
    });
  },
  method: {
    saveScrollPosition() {
      localStorage.setItem(
        "scrollPosition-" + this.$route.path,
        window.scrollY
      );
    },
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
    ...mapState({
      roleID: (state) => state.users.role,
    }),
  },
};
</script>
