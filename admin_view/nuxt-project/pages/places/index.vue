<template>
  <div class="main-content">
    <SubHeader pageTitle="会場一覧">
      <CommonButton v-if="this.$role(this.roleID).place.create" iconName="add_circle" :on_click="openAddModal">
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
            v-for="(place, index) in places"
            :key="index"
            @click="
              () =>
                $router.push({
                  path: `/places/` + place.id,
                })
            "
          >
            <td>{{ place.id }}</td>
            <td>{{ place.name }}</td>
            <td>{{ place.created_at | formatDate }}</td>
            <td>{{ place.updated_at | formatDate }}</td>
          </tr>
        </template>
      </Table>
    </Card>

    <AddModal
      @close="closeAddModal"
      v-if="isOpenAddModal"
      title="会場の追加"
    >
      <template v-slot:form>
        <div>
          <h3>会場名</h3>
          <input v-model="name" placeholder="入力してください" />
        </div>
      </template>
      <template v-slot:method>
        <CommonButton iconName="add_circle" :on_click="submit"
          >登録</CommonButton
        >
      </template>
    </AddModal>
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
      places: [],
      dialog: false,
      headers: ["ID", "名前", "登録日時", "編集日時"],
      isOpenAddModal: false,
      isOpenSnackBar: false,
      name: "",
      roleID: 2, // ここをvuexでとってきてログインユーザーのroleで変化させる
    };
  },
  async asyncData({ $axios }) {
    const placeUrl = "/places";
    const placesRes = await $axios.$get(placeUrl);
    return {
      places: placesRes.data,
    };
  },
  computed: {
    ...mapState({
      selfRoleId: (state) => state.users.role,
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
      this.message = message;
      this.isOpenSnackBar = true;
      setTimeout(this.closeSnackBar, 2000);
    },
    closeSnackBar() {
      this.isOpenSnackBar = false;
    },
    reload(id) {
      const url = "/places/" + id;
      this.$axios.$get(url).then((response) => {
        this.places.push(response.data);
      });
    },
    async submit() {
      const url =
        "/places/" +
        "?name=" +
        this.name

      this.$axios.$post(url).then((response) => {
        this.openSnackBar(response.data.name + "を追加しました");
        this.name = "";
        this.reload(response.data.id);
        this.closeAddModal();
      });
    },
  },
};
</script>
