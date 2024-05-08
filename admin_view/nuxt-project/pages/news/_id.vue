<template>
  <div class="main-content">
    <SubHeader v-bind:pageTitle="news.title" pageSubTitle="お知らせ一覧">
      <CommonButton v-if="this.$role(this.roleID).news.update" iconName="edit" :on_click="openEditModal">
        編集
      </CommonButton>
      <CommonButton v-if="this.$role(this.roleID).news.delete" iconName="delete" :on_click="openDeleteModal">
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
              <td>{{ news.id }}</td>
            </tr>
            <tr>
              <th>タイトル</th>
              <td>{{ news.title }}</td>
            </tr>
            <tr>
              <th>内容</th>
              <td>{{ news.body }}</td>
            </tr>
            <tr>
              <th>登録日時</th>
              <td>{{ news.created_at | formatDate }}</td>
            </tr>
            <tr>
              <th>編集日時</th>
              <td>{{ news.updated_at | formatDate }}</td>
            </tr>
          </VerticalTable>
        </Row>
      </Card>
    </Row>

    <EditModal
      @close="closeEditModal"
      v-if="isOpenEditModal"
      title="お知らせの編集"
    >
      <template v-slot:form>
        <div>
          <h3>タイトル</h3>
          <input v-model="title" placeholder="入力してください" />
        </div>
        <div>
          <h3>内容</h3>
          <textarea v-model="body" placeholder="入力してください" />
        </div>
      </template>
      <template v-slot:method>
        <CommonButton iconName="edit" :on_click="edit"
          >編集</CommonButton
        >
      </template>
    </EditModal>

    <DeleteModal
      @close="closeDeleteModal"
      v-if="isOpenDeleteModal"
      title="お知らせの削除"
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
  data() {
    return {
      isOpenEditModal: false,
      isOpenDeleteModal: false,
      isOpenSnackBar: false,
      title: "",
      body: "",
    };
  },
  async asyncData({ $axios, route }) {
    const routeId = route.path.replace("/news/", "");
    const newsUrl = "/news/" + routeId;
    const newsRes = await $axios.$get(newsUrl);
    return {
      news: newsRes.data,
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
      this.title = this.news.title;
      this.body = this.news.body;
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
      const url = "/news/" + this.routeId;
      const res = await this.$axios.$get(url);
      this.news = res.data
    },
    async edit() {
      const url =
        "/news/" +
        this.routeId +
        "?title=" +
        this.title +
        "&body=" +
        this.body

      await this.$axios.$put(url).then(() => {
        this.reload();
        this.title = "";
        this.body = "";
        this.closeEditModal();
        this.openSnackBar("お知らせを編集しました")
      });
    },
    async destroy() {
      const delUrl = "/news/" + this.routeId;
      await this.$axios.$delete(delUrl);
        this.openSnackBar("お知らせを削除しました")
      this.$router.push("/news");
    },
  },
};
</script>
