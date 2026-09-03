<template>
  <div class="main-content">
    <SubHeader
      v-bind:pageTitle="venue_map.group.name"
      pageSubTitle="模擬店平面図申請一覧"
    >
      <CommonButton
        v-if="this.$role(this.roleID).venue_maps.update"
        iconName="edit"
        :on_click="openEditModal"
      >
        編集
      </CommonButton>
      <CommonButton
        v-if="this.$role(this.roleID).venue_maps.delete"
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
              <td>{{ venue_map.group.id }}</td>
            </tr>
            <tr>
              <th>参加団体</th>
              <td>{{ venue_map.group.name }}</td>
            </tr>
            <tr>
              <th>模擬店平面図</th>
              <td>
                <div v-if="venue_map.venue_map === null">未登録</div>
                <div v-else>
                  <img
                    :src="venue_map.venue_map.picture_path"
                    referrerpolicy="no-referrer"
                    style="width: 40%; height: 40%"
                  />
                </div>
              </td>
            </tr>
            <tr>
              <th>登録日時</th>
              <td>
                <div v-if="venue_map.venue_map === null">未登録</div>
                <div v-else>
                  {{ venue_map.venue_map.created_at | formatDate }}
                </div>
              </td>
            </tr>
            <tr>
              <th>編集日時</th>
              <td>
                <div v-if="venue_map.venue_map === null">未登録</div>
                <div v-else>
                  {{ venue_map.venue_map.updated_at | formatDate }}
                </div>
              </td>
            </tr>
          </VerticalTable>
        </Row>
      </Card>
    </Row>

    <EditModalsVenueMapEditModal
      v-if="isOpenEditModal"
      :venue-map="venue_map"
      @close="closeEditModal"
      @saved="reload"
    />

    <DeleteModal
      @close="closeDeleteModal"
      v-if="isOpenDeleteModal"
      title="模擬店平面図の削除"
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
      isOpenEditModal: false,
      isOpenDeleteModal: false,
      isOpenSnackBar: false,
      snackMessage: null,
      group_id: null,
      buttonState: "登録",
      isPush: { disabled: false },
      isInvalidFile: false,
      isFile: false,
      isFileCheck: false,
      isFileSizeCheck: false,
    };
  },
  computed: {
    ...mapState({
      roleID: (state) => state.users.role,
    }),
  },
  async asyncData({ $axios, route }) {
    const routeId = route.path.replace("/venue_maps/", "");
    const url = "/api/v1/get_venue_map_for_admin_view/" + routeId;
    const res = await $axios.$get(url);
    return {
      venue_map: res.data[0],
      route: url,
    };
  },
  methods: {
    openEditModal() {
      this.isOpenEditModal = true;
    },
    closeEditModal() {
      this.isOpenEditModal = false;
    },
    openDeleteModal() {
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
      const url = "/api/v1/get_venue_map_for_admin_view/" + id;
      const res = await this.$axios.$get(url);
      this.venue_map = res.data[0];
    },
    async destroy() {
      const delUrl = "/venue_maps/" + this.venue_map.venue_map.id;
      await this.$axios.$delete(delUrl);
      this.$router.push("/venue_maps");
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

<style>
.common-button[disabled] {
  pointer-events: none;
  opacity: 0.6;
}
</style>
