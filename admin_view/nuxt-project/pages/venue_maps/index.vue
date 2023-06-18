<template>
    <div class="main-content">
      <SubHeader pageTitle="模擬店平面図申請一覧">
        <CommonButton
          v-if="this.$role(roleID).announcements.create"
          iconName="add_circle"
          :on_click="openAddModal"
        >
          追加
        </CommonButton>
      </SubHeader>
      <Card width="100%">
        <Table>
          <template v-slot:table-header>
            <th v-for="(header, index) in headers" :key="index">
              {{ header }}
            </th>
          </template>
          <template v-slot:table-body>
            <tr
              v-for="(venueMap, index) in venueMaps"
              :key="index"
              @click="
                () =>
                  $router.push({
                    path: `/venue_maps/` + venueMap.id,
                  })
              "
            >
              <td>{{ venueMap.id }}</td>
              <td>
                {{
                  groups.find((group) => group.id === venueMap.group_id).name
                }}
              </td>
              <td>
                <div v-if='venueMap.picture_path === null'>未登録</div>
                <div v-else>登録済み</div>
              </td>
            </tr>
          </template>
        </Table>
      </Card>

      <AddModal
        @close="closeAddModal"
        v-if="isOpenAddModal"
        title="模擬店配置図の登録"
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
            <h3>模擬店配置図</h3>
            <input v-model="message" placeholder="入力してください" />
          </div>
        </template>
        <template v-slot:method>
          <CommonButton iconName="add_circle" :on_click="submit"
            >登録</CommonButton
          >
        </template>
      </AddModal>
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
        venueMaps: [],
        groups: [],
        dialog: false,
        headers: ["ID", "団体名", "申請状況"],
        isOpenAddModal: false,
        isOpenSnackBar: false,
        message: "",
        snackMessage: "",
        group_id: 1,
      };
    },
    async asyncData({ $axios }) {
      const venueMapsUrl = "/venue_maps";
      const groupsUrl = "/groups";
      const venueMapsRes = await $axios.$get(venueMapsUrl);
      const groupsRes = await $axios.$get(groupsUrl);
      return {
        venueMaps: venueMapsRes.data,
        groups: groupsRes,
      };
    },
    computed: {
      ...mapState({
        roleID: (state) => state.users.role,
      }),
    },
    methods: {
      openAddModal() {
        this.isOpenAddModal = false;
        this.isOpenAddModal = true;
      },
      closeAddModal() {
        this.isOpenAddModal = false;
      },
      openSnackBar(message) {
        this.snackMessage = message;
        this.isOpenSnackBar = true;
        setTimeout(this.closeSnackBar, 2000);
      },
      closeSnackBar() {
        this.isOpenSnackBar = false;
      },
      reload(id) {
        const url = "/venue_maps/" + id;
        this.$axios.$get(url).then((response) => {
          this.announcements.push(response.data);
        });
      },
      async submit() {
        const url =
          "/venue_maps/" +
          "?group_id=" +
          this.group_id +
          "&message=" +
          this.message;

        this.$axios.$post(url).then((response) => {
          this.openSnackBar("模擬店配置図を登録しました");
          this.group_id = 1;
          this.message = "";
          this.reload(response.data.id);
          this.closeAddModal();
        });
      },
    },
  };
  </script>
