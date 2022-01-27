<template>
  <div class="main-content">
    <SubHeader pageTitle="ステージ一覧">
      <CommonButton iconName="add_circle" :on_click="openAddModal">
        追加
      </CommonButton>
    </SubHeader>

    <Card width="100%">
      <table>
        <thead>
          <th v-for="(header, index) in headers" :key="index">
            {{ header }}
          </th>
        </thead>
        <tbody>
          <tr
            v-for="(stage, index) in stages"
            :key="index"
            @click="
              () =>
                $router.push({
                  path: `/stages/` + stage.id,
                })
            "
          >
            <td>{{ stage.id }}</td>
            <td>{{ stage.name }}</td>
            <td>{{ stage.enable_sunny }}</td>
            <td>{{ stage.enable_rainy }}</td>
            <td>{{ stage.created_at | formatDate }}</td>
            <td>{{ stage.updated_at | formatDate }}</td>
          </tr>
        </tbody>
      </table>
    </Card>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  watchQuery: ["page"],
  data() {
    return {
      headers: [
        "ID",
        "晴れ",
        "雨",
        "登録日時",
        "編集日時"
      ]
    };
  },
  async asyncData({ $axios }) {
    const stageUrl = "/stages"
    const stagesRes = await $axios.$get(stageUrl);
    return {
      stages: stagesRes.data,
    };
  },
  computed: {
    ...mapState({
      selfRoleId: (state) => state.users.role,
    }),
  },
  methods: {
    reload: function () {
      this.$axios
        .get("/stages", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.stages = response.data;
        });
    },

    register: function () {
      this.$axios.defaults.headers.common["Content-Type"] = "application/json";
      var params = new URLSearchParams();
      params.append("name", this.name);
      params.append("enable_sunny", this.enable_Sunny);
      params.append("enable_rainy", this.enable_Rainy);
      this.$axios.post("/stages", params).then((response) => {
        console.log(response);
        this.dialog = false;
        this.reload();
        this.name = "";
        this.enable_Sunny = "";
        this.enable_Rainy = "";
      });
    },
  },
};
</script>
<<<<<<< HEAD

<style>
.card {
  padding-left: 1%;
  padding-right: 5%;
}
</style>
======= >>>>>>> 3f172cd76df3dbaed33f2d88ac0196b12970257b
