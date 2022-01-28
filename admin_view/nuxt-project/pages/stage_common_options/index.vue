<template>
  <div class="main-content">
    <SubHeader pageTitle="ステージオプション申請一覧">
      <CommonButton iconName="add_circle" :on_click="openModal">
        追加
      </CommonButton>
      <CommonButton iconName="file_download" :on_click="downloadCSV">
        CSVダウンロード
      </CommonButton>
    </SubHeader>
    <Card width="100%">
      <Table>
        <template v-slot:table-header>
          <th v-for="(header, index) in headers" v-bind:key="index">
            {{ header }}
          </th>
        </template>
        <template v-slot:table-body>
          <tr
            v-for="(stageCommonOption, index) in stageCommonOption"
            @click="
            () =>
            $router.push({
              path:
              `/stage_common_options/` +
              stageCommonOption.stage_common_option.id,
            })
            "
            :key="index"
          >
            <td>{{ stageCommonOption.stage_common_option.id }}</td>
            <td>{{ stageCommonOption.group.name }}</td>
            <td>{{ stageCommonOption.stage_common_option.own_equipment }}</td>
            <td>{{ stageCommonOption.stage_common_option.bgm }}</td>
            <td>
              {{ stageCommonOption.stage_common_option.camera_permission }}
            </td>
            <td>{{ stageCommonOption.stage_common_option.loud_sound }}</td>
            <td>
              {{
                stageCommonOption.stage_common_option.created_at | formatDate
              }}
            </td>
            <td>
              {{
                stageCommonOption.stage_common_option.updated_at | formatDate
              }}
            </td>
          </tr>
        </template>
      </Table>
    </Card>
  </div>
</template>

<script>
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
        "登録日時",
        "編集日時",
      ],
    };
  },
  async asyncData({ $axios }) {
    const url = "/api/v1/get_stage_common_option_index_for_admin_view";
    const stageCommonOptionRes = await $axios.$get(url);
    const yearsUrl = "/fes_years";
    const yearsRes = await $axios.$get(yearsUrl);
    return {
      stageCommonOption: stageCommonOptionRes.data,
      yearList: yearsRes.data,
    };
  },
  methods: {
    reload: function () {
      this.$axios
        .get("/api/v1/get_stage_common_options_with_group", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.stage_common_options = response.data;
        });
    },
    register: function () {
      this.$axios.defaults.headers.common["Content-Type"] = "application/json";
      var params = new URLSearchParams();
      params.append("group_id", this.Group);
      params.append("own_equipment", this.ownEquipment);
      params.append("bgm", this.Bgm);
      params.append("camera_permission", this.cameraPermission);
      params.append("loud_sound", this.loudSound);
      params.append("stage_content", this.stageContent);
      this.$axios.post("/stage_common_options", params).then((response) => {
        console.log(response);
        this.dialog = false;
        this.reload();
        this.Group = "";
        this.ownEquipment = "";
        this.Bgm = "";
        this.cameraPermission = "";
        this.loudSound = "";
        this.stageContent = "";
      });
    },
    async downloadCSV() {
      const url = "http://localhost:3000" + "/api/v1/get_stage_common_options_csv/" + 1;
      window.open(
        url,
        "ステージオプション申請_CSV"
      );
    },
  },
};
</script>
