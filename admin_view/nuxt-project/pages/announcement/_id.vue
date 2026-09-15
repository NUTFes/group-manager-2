<template>
  <div class="main-content">
    <SubHeader
      v-bind:pageTitle="announcement.group.name"
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
              <td>{{ announcement.group.id }}</td>
            </tr>
            <tr>
              <th>参加団体</th>
              <td>{{ announcement.group.name }}</td>
            </tr>
            <tr>
              <th>会場アナウンス文</th>
              <td>
                <div v-if='announcement.announcement === null'>未登録</div>
                <div v-else>{{ announcement.announcement.message }}</div>
              </td>
            </tr>
            <tr>
              <th>登録日時</th>
              <td>
                <div v-if='announcement.announcement === null'>未登録</div>
                <div v-else>{{ announcement.announcement.created_at | formatDate }}</div>
              </td>
            </tr>
            <tr>
              <th>編集日時</th>
              <td>
                <div v-if='announcement.announcement === null'>未登録</div>
                <div v-else>{{ announcement.announcement.updated_at | formatDate }}</div>
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
          <h3>会場アナウンス文</h3>
          <input v-model="message" placeholder="入力してください" />
        </div>
      </template>
      <template v-slot:method>
        <div v-if="isMessageOver" style="color: red;">アナウンス文は300字以内で入力してください。</div>
        <CommonButton iconName="edit" :on_click="edit" :disabled="isMessageOver">登録</CommonButton>
      </template>
    </EditModal>

    <DeleteModal
      @close="closeDeleteModal"
      v-if="isOpenDeleteModal"
      title="会場アナウンス文の削除"
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
      message: null,
      snackMessage: null,
      group_id: null,
      routeId: null,
    };
  },
  computed: {
    ...mapState({
      roleID: (state) => state.users.role,
    }),
    isMessageOver() {
      return this.message.length > 300;
    },
  },
  async asyncData({ $axios, route }) {
    const routeId = route.path.replace("/announcement/", "");
    const url = "/api/v1/get_announcement_for_admin_view/" + routeId;
    const res = await $axios.$get(url);
    return {
      announcement: res.data[0],
      route: url,
    };
  },
  mounted() {
    window.scrollTo(0, 0);
  },
  methods: {
    openEditModal() {
      if (this.announcement.announcement) {
        this.group_id = this.announcement.group.id;
        this.message = this.announcement.announcement.message;
        this.isOpenEditModal = true;
      } else {
        this.group_id = this.announcement.group.id;
        this.message = null;
        this.isOpenEditModal = true;
      }
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
    openSnackBar(snackMessage) {
      this.snackMessage = snackMessage;
      this.isOpenSnackBar = true;
      setTimeout(this.closeSnackBar, 2000);
    },
    closeSnackBar() {
      this.isOpenSnackBar = false;
    },
    async reload(id) {
      const url = "/api/v1/get_announcement_for_admin_view/" + id;
      const res = await this.$axios.$get(url);
      this.announcement = res.data[0];
    },
    async edit() {
      if (!this.message) {
        this.openSnackBar("会場アナウンス文を入力してください");
        return;
      }
      if (this.announcement.announcement) {
        const editUrl =
          "/announcements/" +
          this.announcement.announcement.id +
          "?group_id=" +
          this.group_id+
          "&message=" +
          this.message;

        await this.$axios.$put(editUrl).then((res) => {
          this.openSnackBar("会場アナウンス文を編集しました");
          this.group_id = null;
          this.message = null;
          this.reload(res.data.group_id);
          this.closeEditModal();
        });
      } else {
        const postAnnouncementUrl =
          "/announcements/" +
          "?group_id=" +
          this.group_id +
          "&message=" +
          this.message;

        await this.$axios.$post(postAnnouncementUrl).then((res) => {
          this.openSnackBar("会場アナウンス文を登録しました");
          this.group_id = null;
          this.message = null;
          this.reload(res.data.group_id);
          this.closeEditModal();
        });
      }
    },
    async destroy() {
      const delUrl = "/announcements/" + this.announcement.announcement.id;
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
