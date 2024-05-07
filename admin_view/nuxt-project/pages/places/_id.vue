<template>
  <div class="main-content">
    <SubHeader v-bind:pageTitle="place.name" pageSubTitle="会場一覧">
      <CommonButton v-if="this.$role(this.roleID).places.update" iconName="edit" :on_click="openEditModal">
        編集
      </CommonButton>
      <CommonButton v-if="this.$role(this.roleID).places.delete" iconName="delete" :on_click="openDeleteModal">
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
              <td>{{ place.id }}</td>
            </tr>
            <tr>
              <th>名前</th>
              <td>{{ place.name }}</td>
            </tr>
            <tr>
              <th>登録日時</th>
              <td>{{ place.created_at | formatDate }}</td>
            </tr>
            <tr>
              <th>編集日時</th>
              <td>{{ place.updated_at | formatDate }}</td>
            </tr>
          </VerticalTable>
        </Row>
      </Card>
    </Row>

    <EditModal
      @close="closeEditModal"
      v-if="isOpenEditModal"
      title="会場の編集"
    >
      <template v-slot:form>
        <div>
          <h3>会場名</h3>
          <input v-model="name" placeholder="入力してください" />
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
      name: "",
    };
  },
  computed: {
    ...mapState({
      roleID: (state) => state.users.role,
    }),
  },
  async asyncData({ $axios, route }) {
    const routeId = route.path.replace("/places/", "");
    const placeUrl = "/places/" + routeId;
    const placeRes = await $axios.$get(placeUrl);
    return {
      place: placeRes.data,
      routeId: routeId,
    };
  },
  mounted() {
    window.scrollTo(0, 0);
  },
  methods: {
    openEditModal() {
      this.name = this.place.name
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
      const url = "/places/" + id;
      const res = await this.$axios.$get(url);
      this.place = res.data;
    },
    async edit() {
      const url =
        "/places/" + this.routeId +
        "?name=" +
        this.name

      await this.$axios.$put(url).then((res) => {
        this.openSnackBar(this.name + "を編集しました");
        this.name = "";
        this.reload(res.data.id);
        this.closeEditModal();
      });
    },
    async destroy() {
      const delUrl = "/places/" + this.routeId;
      await this.$axios.$delete(delUrl);
      this.$router.push("/places");
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
