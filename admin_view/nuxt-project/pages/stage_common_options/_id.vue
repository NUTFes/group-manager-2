<template>
  <div class="main-content">
    <SubHeader
      v-bind:pageTitle="stageCommonOption.group.name"
      pageSubTitle="ステージオプション申請一覧"
    >
      <CommonButton iconName="edit"> 編集 </CommonButton>
      <CommonButton iconName="delete"> 削除 </CommonButton>
    </SubHeader>
    <Row>
      <Card padding="40px 150px" gap="20px">
        <Row justify="start">
          <h4>基本情報</h4>
        </Row>
        <VerticalTable>
            <tr>
              <th>ID</th><td>{{ stageCommonOption.stage_common_option.id }}</td>
            </tr>
            <tr>
              <th>参加団体</th><td>{{ stageCommonOption.group.name }}</td>
            </tr>
            <tr>
              <th>所持機器の使用 </th><td>{{ stageCommonOption.stage_common_option.own_equipment }}</td>
            </tr>
            <tr>
              <th>音楽の有無</th><td>{{ stageCommonOption.stage_common_option.bgm }}</td>
            </tr>
            <tr>
              <th>撮影許可</th><td>{{ stageCommonOption.stage_common_option.camera_permission }}</td>
            </tr>
            <tr>
              <th>大きな音</th><td>{{ stageCommonOption.stage_common_option.loud_sound }}</td>
            </tr>
            <tr>
              <th>ステージ内容</th><td>{{ stageCommonOption.stage_common_option.stage_content }}</td>
            </tr>
            <tr>
              <th>登録日時</th><td>{{ stageCommonOption.stage_common_option.created_at | formatDate }}</td>
            </tr>
            <tr>
              <th>編集日時</th><td>{{ stageCommonOption.stage_common_option.updated_at | formatDate }}</td>
            </tr>
        </VerticalTable>
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
        "参加団体",
        "所持機器の使用",
        "音楽をかける",
        "撮影許可",
        "大きな音",
        "ステージ内容",
        "登録日時",
        "編集日時",
      ],
    };
  },
  async asyncData({ $axios, route }) {
    const routeId = route.path.replace("/stage_common_options/", "");
    const url =
      "/api/v1/get_stage_common_option_show_for_admin_view/" + routeId;
    const response = await $axios.$get(url);
    return {
      stageCommonOption: response.data,
      route: url,
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
      const url =
        "/api/v1/get_stage_common_options_with_group/" + this.$route.params.id;
      this.$axios
        .get(url, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.data = response.data;
          this.stage_common_option = response.data.stage_common_option;
          this.id = response.data.stage_common_option.id;
          this.group = response.data.group;
          this.group_id = response.data.stage_common_option.group_id;
          this.own_equipment = response.data.stage_common_option.own_equipment;
          this.bgm = response.data.stage_common_option.bgm;
          this.loud_sound = response.data.stage_common_option.loud_sound;
          this.camera_permission =
            response.data.stage_common_option.camera_permission;
          this.stage_content = response.data.stage_common_option.stage_content;
          this.stage_common_option = response.data.stage_common_option;
        });
    },
    edit_dialog_open: function () {
      this.edit_dialog = true;
    },
    edit: function () {
      const edit_url =
        "/stage_common_options/" +
        this.id +
        "?group_id=" +
        this.group_id +
        "&own_equipment=" +
        this.own_equipment +
        "&bgm=" +
        this.bgm +
        "&camera_permission=" +
        this.camera_permission +
        "&loud_sound=" +
        this.loud_sound +
        "&stage_content=" +
        this.stage_content;
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
      const url = "/stage_common_options/" + this.$route.params.id;
      this.$axios.delete(url);
      this.$router.push("/stage_common_options");
    },
  },
};
</script>
