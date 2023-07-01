<template>
  <div class="main-content">
    <SubHeader
      v-bind:pageTitle="groups.find((group) => group.id === announcement.group_id).name"
      pageSubTitle="会場アナウンス文申請一覧"
    >
      <CommonButton
        v-if="this.$role(this.roleID).announcements.update"
        iconName="edit"
        :on_click="openEditModal"
      >
        編集
      </CommonButton>
      <CommonButton
        v-if="this.$role(this.roleID).announcements.delete"
        iconName="delete"
        :on_click="openDeleteModal"
      >
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
              <td>{{ announcement.id }}</td>
            </tr>
            <tr>
              <th>参加団体</th>
              <td>{{ groups.find((group) => group.id === announcement.group_id).name }}</td>
            </tr>
            <tr>
              <th>会場アナウンス文</th>
              <td>
                <div v-if='announcement.message === ""'>未登録</div>
                <div v-else>{{ announcement.message }}</div>
              </td>
            </tr>
            <tr>
              <th>登録日時</th>
              <td>
                <div v-if='announcement.message === ""'>未登録</div>
                <div v-else>{{ announcement.created_at | formatDate }}</div>
              </td>
            </tr>
            <tr>
              <th>編集日時</th>
              <td>
                <div v-if='announcement.message === ""'>未登録</div>
                <div v-else>{{ announcement.updated_at | formatDate }}</div>
              </td>
            </tr>
          </VerticalTable>
        </Row>
      </Card>
    </Row>

    <EditModal
      @close="closeEditModal"
      v-if="isOpenEditModal"
      title="会場アナウンス文の編集"
    >
      <template v-slot:form>
        <div>
          <h3>団体名</h3>
          <select v-model="group_id">
            <option v-for="group in groups" :key="group.id" :value="group.id">
              {{ group.name }}
            </option>
          </select>
        </div>
        <div>
          <h3>会場アナウンス文</h3>
          <input v-model="message" placeholder="入力してください" />
        </div>
      </template>
      <template v-slot:method>
        <CommonButton iconName="edit" :on_click="edit">登録</CommonButton>
      </template>
    </EditModal>

    <DeleteModal
      @close="closeDeleteModal"
      v-if="isOpenDeleteModal"
      title="会場の削除"
    >
      <template v-slot:method>
        <YesButton iconName="delete" :on_click="destroy">はい</YesButton>
        <NoButton iconName="close" :on_click="closeDeleteModal"
          >いいえ</NoButton
        >
      </template>
    </DeleteModal>
    <SnackBar v-if="isOpenSnackBar" @close="closeSnackBar">
      {{ snackMessage }}
    </SnackBar>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  watchQuery: ["page"],
  data() {
    return {
      announcement: {},
      groups: [],
      isOpenEditModal: false,
      isOpenDeleteModal: false,
      isOpenSnackBar: false,
      message: "",
      snackMessage: "",
      group_id: 1,
      routeId: "",
    };
  },
  computed: {
    ...mapState({
      roleID: (state) => state.users.role,
    }),
  },
  async asyncData({ $axios, route }) {
    const routeId = route.params.id;
    const announcementUrl = "/announcements/" + routeId;
    const groupsUrl = "/groups";
    const announcementRes = await $axios.$get(announcementUrl);
    const groupsRes = await $axios.$get(groupsUrl);
    return {
      announcement: announcementRes.data,
      routeId: routeId,
      groups: groupsRes,
    };
  },
  methods: {
    openEditModal() {
      this.group_id = this.announcement.group_id;
      this.message = this.announcement.message;
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
      this.snackMessage = message;
      this.isOpenSnackBar = true;
      setTimeout(this.closeSnackBar, 2000);
    },
    closeSnackBar() {
      this.isOpenSnackBar = false;
    },
    async reload(id) {
      const url = "/announcements/" + id;
      const res = await this.$axios.$get(url);
      this.announcement = res.data;
    },
    async edit() {
      const url = "/announcements/" + this.routeId + "?message=" + this.message + "&group_id=" + this.group_id;

      await this.$axios.$put(url).then((res) => {
        this.openSnackBar("会場アナウンス文を編集しました");
        this.message = "";
        this.group_id = 1;
        this.reload(res.data.id);
        this.closeEditModal();
      });
    },
    async destroy() {
      const delUrl = "/announcements/" + this.routeId;
      await this.$axios.$delete(delUrl);
      this.$router.push("/announcement");
    },
  },
};
</script>

<style scoped>
td {
  width: 70%;
}
th {
  width: 30%;
}
</style>
