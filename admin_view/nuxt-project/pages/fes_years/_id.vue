<template>
  <div class="main-content">
    <SubHeader v-bind:pageTitle="fesYear.year_num" pageSubTitle="開催年一覧">
      <CommonButton v-if="this.$role(this.roleID).fes_years.update" iconName="edit" :on_click="openEditModal">
        編集
      </CommonButton>
      <CommonButton v-if="this.$role(this.roleID).fes_years.delete" iconName="delete" :on_click="openDeleteModal">
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
              <td>{{ fesYear.id }}</td>
            </tr>
            <tr>
              <th>開催年</th>
              <td>{{ fesYear.year_num }}</td>
            </tr>
            <tr>
              <th>登録日時</th>
              <td>{{ fesYear.created_at | formatDate }}</td>
            </tr>
            <tr>
              <th>編集日時</th>
              <td>{{ fesYear.updated_at | formatDate }}</td>
            </tr>
          </VerticalTable>
        </Row>
      </Card>
    </Row>

    <EditModal
      @close="closeEditModal"
      v-if="isOpenEditModal"
      title="参加団体申請の編集"
    >
      <template v-slot:form>
        <div>
          <h3>開催年</h3>
          <input
            v-model="year_num"
            type="number"
            placeholder="入力してください"
          />
        </div>
      </template>
      <template v-slot:method>
        <CommonButton iconName="edit" :on_click="edit">編集</CommonButton>
      </template>
    </EditModal>

    <DeleteModal
      @close="closeDeleteModal"
      v-if="isOpenDeleteModal"
      title="参加団体申請の削除"
    >
      <template v-slot:method>
        <YesButton iconName="delete" :on_click="destroy">はい</YesButton>
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
    };
  },
  async asyncData({ $axios, route }) {
    const routeId = route.path.replace("/fes_years/", "");
    const fesYearUrl = "/fes_years/" + routeId;
    const fesYearRes = await $axios.$get(fesYearUrl);
    return {
      fesYear: fesYearRes.data,
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
      this.year_num = this.fesYear.year_num;
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
      const url = "/fes_years/" + id;
      const res = await this.$axios.$get(url);
      this.fesYear = res.data;
    },
    async edit() {
      const url = "/fes_years/" + this.routeId + "?year_num=" + this.year_num;
      console.log(url);
      await this.$axios.$put(url).then(() => {
        this.openSnackBar("登録情報を編集しました");
        this.year_num = null;
        this.reload(this.routeId);
        this.closeEditModal();
      });
    },
    async destroy() {
      const delUrl = "/fes_years/" + this.routeId;
      await this.$axios.$delete(delUrl);
      this.$router.push("/fes_years");
    },
  },
};
</script>
