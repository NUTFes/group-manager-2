<template>
  <div class="main-content">
    <SubHeader v-bind:pageTitle="stage.name" pageSubTitle="ステージ一覧">
      <CommonButton v-if="this.$role(this.roleID).stages.update" iconName="edit" :on_click="openEditModal">
        編集
      </CommonButton>
      <CommonButton v-if="this.$role(this.roleID).stages.delete" iconName="delete" :on_click="openDeleteModal">
        削除
      </CommonButton>
    </SubHeader>
    <Row>
      <Card padding="40px 150px" gap="20px">
        <Row justify="start">
          <h4>基本情報</h4>
          <VerticalTable>
            <tr>
              <th>ID</th>
              <td>{{ stage.id }}</td>
            </tr>
            <tr>
              <th>名前</th>
              <td>{{ stage.name }}</td>
            </tr>
            <tr>
              <th>晴れ</th>
              <td>{{ stage.enable_sunny }}</td>
            </tr>
            <tr>
              <th>雨</th>
              <td>{{ stage.enable_rainy }}</td>
            </tr>
            <tr>
              <th>登録日時</th>
              <td>{{ stage.created_at | formatDate }}</td>
            </tr>
            <tr>
              <th>編集日時</th>
              <td>{{ stage.updated_at | formatDate }}</td>
            </tr>
          </VerticalTable>
        </Row>
      </Card>
    </Row>

    <EditModal
      @close="closeEditModal"
      v-if="isOpenEditModal"
      title="ステージの編集"
    >
      <template v-slot:form>
        <div>
          <h3>ステージ名</h3>
          <input v-model="name" placeholder="入力してください" />
        </div>
        <div>
          <h3>晴れ</h3>
          <select v-model="enableSunny">
            <option disabled value="">選択してください</option>
            <option
              v-for="r in isUseList"
              :key="r"
              :value="r.value"
            >
              {{ r.text }}
            </option>
          </select>
        </div>
        <div>
          <h3>雨</h3>
          <select v-model="enableRainy">
            <option disabled value="">選択してください</option>
            <option
              v-for="r in isUseList"
              :key="r"
              :value="r.value"
            >
              {{ r.text }}
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
      title="ステージの削除"
    >
      <template v-slot:method>
        <YesButton iconName="delete" :on_click="destroy">はい</YesButton>
        <NoButton iconName="close" :on_click="closeDeleteModal"
          >いいえ</NoButton
        >
      </template>
    </DeleteModal>
    <SnackBar
      v-if="isOpenSnackBar"
      @close="closeSnackBar"
    >
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
      isUseList: [
        { text: "使用可能", value: true },
        { text: "使用不可能", value: false },
      ],
      name: "",
      enableSunny: null,
      enableRainy: null,
    };
  },
  async asyncData({ $axios, route }) {
    const routeId = route.path.replace("/stages/", "");
    const stageUrl = "/stages/" + routeId;
    const stageRes = await $axios.$get(stageUrl);
    return {
      stage: stageRes.data,
      routeId: routeId,
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
      this.name = this.stage.name
      this.enableSunny = this.stage.enable_sunny
      this.enableRainy = this.stage.enable_rainy
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
    async reload(id) {
      const url = "/stages/" + id;
      const res = await this.$axios.$get(url);
      this.stage = res.data;
    },
    async edit() {
      const url =
        "/stages/" + this.routeId +
        "?name=" +
        this.name +
        "&enable_sunny=" + this.enableSunny +
        "&enable_rainy=" + this.enableRainy

      await this.$axios.$put(url).then((res) => {
        this.openSnackBar(this.name + "を編集しました");
        this.name = "";
        this.enableSunny = null;
        this.enableRainy = null;
        this.reload(res.data.id);
        this.closeEditModal();
      });
    },
    async destroy() {
      const delUrl = "/stages/" + this.routeId;
      await this.$axios.$delete(delUrl);
      this.$router.push("/stages");
    },
  },
};
</script>
