<template>
  <div class="main-content">
    <SubHeader pageTitle="会場アナウンス文申請一覧">
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
            v-for="(announcement, index) in announcements"
            :key="index"
            @click="
              () =>
                $router.push({
                  path: `/announcement/` + announcement.id,
                })
            "
          >
            <td>{{ announcement.id }}</td>
            <td>
              {{
                groups.find((group) => group.id === announcement.group_id)
              }}
            </td>
            <td>{{ announcement.message }}</td>
          </tr>
        </template>
      </Table>
    </Card>

    <AddModal
      @close="closeAddModal"
      v-if="isOpenAddModal"
      title="会場アナウンス文の登録"
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
      announcements: [],
      groups: [],
      dialog: false,
      headers: ["ID", "団体名", "会場アナウンス文"],
      isOpenAddModal: false,
      isOpenSnackBar: false,
      message: "",
      snackMessage: "",
      group_id: 1,
    };
  },
  async asyncData({ $axios }) {
    const announcementsUrl = "/announcements";
    const groupsUrl = "/groups";
    const announcementsRes = await $axios.get(announcementsUrl);
    const groupsRes = await $axios.get(groupsUrl);
    return {
      announcements: announcementsRes.data.data,
      groups: groupsRes.data,
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
      const url = "/announcements/" + id;
      this.$axios.get(url).then((response) => {
        this.announcements.push(response.data);
      });
    },
    async submit() {
      const url =
        "/announcements/" +
        "?group_id=" +
        this.group_id +
        "&message=" +
        this.message;

      this.$axios.$post(url).then((response) => {
        this.openSnackBar("会場アナウンス文を登録しました");
        this.group_id = 1;
        this.message = "";
        this.reload(response.data.id);
        this.closeAddModal();
      });
    },
  },
};
</script>
