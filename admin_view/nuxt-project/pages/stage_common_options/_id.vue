<template>
  <div class="main-content">
    <SubHeader
      v-bind:pageTitle="stageCommonOption.group.name"
      pageSubTitle="ステージオプション申請一覧"
    >
      <CommonButton v-if="this.$role(this.roleID).stage_common_options.update" iconName="edit" :on_click="openEditModal">
        編集
      </CommonButton>
      <CommonButton v-if="this.$role(this.roleID).stage_common_options.delete" iconName="delete" :on_click="openDeleteModal">
        削除
      </CommonButton>
    </SubHeader>
    <Row>
      <Card padding="40px 150px" gap="20px">
        <Row justify="start">
          <h4>基本情報</h4>
        </Row>
        <VerticalTable>
          <tr>
            <th>ID</th>
            <td>{{ stageCommonOption.stage_common_option.id }}</td>
          </tr>
          <tr>
            <th>参加団体</th>
            <td>{{ stageCommonOption.group.name }}</td>
          </tr>
          <tr>
            <th>所持機器の使用</th>
            <td>{{ stageCommonOption.stage_common_option.own_equipment }}</td>
          </tr>
          <tr>
            <th>音楽の有無</th>
            <td>{{ stageCommonOption.stage_common_option.bgm }}</td>
          </tr>
          <tr>
            <th>撮影許可</th>
            <td>
              {{ stageCommonOption.stage_common_option.camera_permission }}
            </td>
          </tr>
          <tr>
            <th>大きな音</th>
            <td>{{ stageCommonOption.stage_common_option.loud_sound }}</td>
          </tr>
          <tr>
            <th>登録日時</th>
            <td>
              {{
                stageCommonOption.stage_common_option.created_at | formatDate
              }}
            </td>
          </tr>
          <tr>
            <th>編集日時</th>
            <td>
              {{
                stageCommonOption.stage_common_option.updated_at | formatDate
              }}
            </td>
          </tr>
        </VerticalTable>
      </Card>
    </Row>

    <EditModal
      @close="closeEditModal"
      v-if="isOpenEditModal"
      title="ステージオプション申請の編集"
    >
      <template v-slot:form>
        <div>
          <h3>所持機器の使用</h3>
          <select v-model="ownEquipment">
            <option disabled value="">選択してください</option>
            <option
              v-for="item in isOwnEquipmentList"
              :key="item.id"
              :value="item.bool"
            >
              {{ item.value }}
            </option>
          </select>
        </div>
        <div>
          <h3>音楽をかける</h3>
          <select v-model="bgm">
            <option disabled value="">選択してください</option>
            <option v-for="item in isBgmList" :key="item.id" :value="item.bool">
              {{ item.value }}
            </option>
          </select>
        </div>
        <div>
          <h3>撮影許可</h3>
          <select v-model="cameraPermission">
            <option disabled value="">選択してください</option>
            <option
              v-for="item in isCameraPermissionList"
              :key="item.id"
              :value="item.bool"
            >
              {{ item.value }}
            </option>
          </select>
        </div>
        <div>
          <h3>騒音</h3>
          <select v-model="loudSound">
            <option disabled value="">選択してください</option>
            <option
              v-for="item in isLoudSoundList"
              :key="item.id"
              :value="item.bool"
            >
              {{ item.value }}
            </option>
          </select>
        </div>
      </template>
      <template v-slot:method>
        <CommonButton iconName="edit" :on_click="edit">登録</CommonButton>
      </template>
    </EditModal>

    <DeleteModal
      @close="closeDeleteModal"
      v-if="isOpenDeleteModal"
      title="参加団体申請の削除"
    >
      <template v-slot:method>
        <YesButton iconName="delete" :on_click="deleteData">はい</YesButton>
        <NoButton iconName="close" :on_click="closeDeleteModal"
          >いいえ</NoButton
        >
      </template>
    </DeleteModal>
    <SnackBar v-if="isOpenSnackBar" @close="closeSnackBar">
      {{ message }}
    </SnackBar>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  watchQuery: ["page"],
  data() {
    return {
      isOpenEditModal: false,
      isOpenDeleteModal: false,
      isOpenSnackBar: false,
      isOwnEquipmentList: [
        { id: 1, value: "使用する", bool: true },
        { id: 2, value: "使用しない", bool: false },
      ],
      isBgmList: [
        { id: 1, value: "かける", bool: true },
        { id: 2, value: "かけない", bool: false },
      ],
      isCameraPermissionList: [
        { id: 1, value: "許可", bool: true },
        { id: 2, value: "許可しない", bool: false },
      ],
      isLoudSoundList: [
        { id: 1, value: "出す", bool: true },
        { id: 2, value: "出さない", bool: false },
      ],
      //v-model
      appGroup: "",
      ownEquipment: "",
      bgm: "",
      cameraPermission: "",
      loudSound: "",
    };
  },
  async asyncData({ $axios, route }) {
    const routeId = route.path.replace("/stage_common_options/", "");

    const currentYearUrl = "/user_page_settings/1";
    const currentYearRes = await $axios.$get(currentYearUrl);

    const url =
      "/api/v1/get_stage_common_option_show_for_admin_view/" + routeId;
    const response = await $axios.$get(url);
    return {
      stageCommonOption: response.data,
      route: url,
      //v-model
      appGroup: response.data.group.id,
      ownEquipment: response.data.stage_common_option.own_equipment,
      bgm: response.data.stage_common_option.bgm,
      cameraPermission: response.data.stage_common_option.camera_permission,
      loudSound: response.data.stage_common_option.loud_sound,
    };
  },
  computed: {
    ...mapState({
      roleID: (state) => state.users.role,
    }),
  },
  mounted() {
    window.scrollTo(0, 0);
  },
  methods: {
    openEditModal() {
      this.isOpenEditModal = false;
      this.isOpenEditModal = true;
    },
    closeEditModal() {
      this.isOpenEditModal = false;
    },
    openDeleteModal() {
      this.isOpenDeleteModal = false;
      this.isOpenDeleteModal = true;
    },
    closeDeleteModal() {
      this.isOpenDeleteModal = false;
    },
    openSnackBar(message) {
      this.message = message;
      this.isOpenSnackBar = true;
      setTimeout(this.closeSnackBar, 2000);
    },
    closeSnackBar() {
      this.isOpenSnackBar = false;
    },
    async reload() {
      const reUrl = this.route;
      const reStageOptionRes = await this.$axios.$get(reUrl);
      this.stageCommonOption = reStageOptionRes.data;
    },
    async edit() {
      const putStageOptionUrl =
        "/stage_common_options/" +
        this.stageCommonOption.stage_common_option.id +
        "?group_id=" +
        this.appGroup +
        "&own_equipment=" +
        this.ownEquipment +
        "&bgm=" +
        this.bgm +
        "&camera_permission=" +
        this.cameraPermission +
        "&loud_sound=" +
        this.loudSound;
      console.log(putStageOptionUrl);

      await this.$axios.$put(putStageOptionUrl).then(() => {
        this.openSnackBar("申請を編集しました");
        this.reload();
        this.closeEditModal();
      });
    },
    async deleteData() {
      const delUrl = "/stage_common_options/" + this.$route.params.id;
      await this.$axios.$delete(delUrl);
      this.$router.push("/stage_common_options");
    },
  },
};
</script>
