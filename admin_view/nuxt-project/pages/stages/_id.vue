<template>
  <div class="main-content">
    <SubHeader
      v-bind:pageTitle="stage.name"
      pageSubTitle="ステージ一覧"
    >
      <CommonButton iconName="edit"> 編集 </CommonButton>
      <CommonButton iconName="edit"> 削除 </CommonButton>
    </SubHeader>
    <Row>
      <Card padding="40px 150px" gap="20px">
        <Row justify="start">
          <h4>基本情報</h4>
          <VerticalTable>
            <tr>
              <th>ID</th><td>{{ stage.id }}</td>
            </tr>
            <tr>
              <th>名前</th><td>{{ stage.name }}</td>
            </tr>
            <tr>
              <th>晴れ</th><td>{{ stage.enable_sunny }}</td>
            </tr>
            <tr>
              <th>雨</th><td>{{ stage.enable_rainy }}</td>
            </tr>
            <tr>
              <th>登録日時</th><td>{{ stage.created_at | formatDate }}</td>
            </tr>
            <tr>
              <th>編集日時</th><td>{{ stage.updated_at | formatDate }}</td>
            </tr>
          </VerticalTable>
        </Row>
      </Card>
    </Row>
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
        "名前",
        "晴れ",
        "雨",
        "登録日時",
        "編集日時"
      ]
    };
  },
  async asyncData({ $axios, route }) {
    const routeId = route.path.replace("/stages/", "");
    const stageUrl = "/stages/" + routeId;
    const stageRes = await $axios.$get(stageUrl);
    return {
      stage: stageRes.data,
    };
  },
  computed: {
    ...mapState({
      selfRoleId: (state) => state.users.role,
    }),
  },
  methods: {
    reload: function () {
      console.log("reload");
      const url = "/stages/" + this.$route.params.id;
      this.$axios
        .get(url, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.stage = response.data;
          this.name = response.data.name;
          this.id = response.data.id;
          this.enable_sunny = response.data.enable_sunny;
          this.enable_rainy = response.data.enable_rainy;
        });
    },
    edit_dialog_open: function () {
      this.edit_dialog = true;
    },
    edit: function () {
      const edit_url =
        "/stages/" +
        this.id +
        "?name=" +
        this.name +
        "&enable_sunny=" +
        this.enable_sunny +
        "&enable_rainy=" +
        this.enable_rainy;
      console.log(edit_url);
      this.$axios
        .put(edit_url, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log(response);
          this.reload();
          this.edit_dialog = false;
          this.success_snackbar = true;
        });
    },
    delete_yes: function () {
      const url = "/stages/" + this.$route.params.id;
      this.$axios.delete(url);
      this.$router.push("/stages");
    },
  },
};
</script>
