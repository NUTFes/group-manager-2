<template>
  <div class="main-content" v-if="this.$role(roleID).places.read">
    <SubHeader pageTitle="会場一覧">
      <CommonButton v-if="this.$role(roleID).places.create" iconName="add_circle" :on_click="openAddModal">
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
  <h1 v-else>閲覧権限がありません</h1>
</template>

<script>
import { mapState } from "vuex";
export default {
  watchQuery: ["page"],
  data() {
    return {
      places: [],
      dialog: false,
      headers: ["ID", "名前"],
      isOpenAddModal: false,
      isOpenSnackBar: false,
      name: "",
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
      roleID: (state) => state.users.role,
    }),
  },
  mounted() {
    window.addEventListener('scroll', this.saveScrollPosition);
    this.$nextTick(() => {
      window.scrollTo(0, parseInt(localStorage.getItem('scrollPosition-' + this.$route.path)))
    });
  },
  methods: {
    saveScrollPosition() {
      localStorage.setItem('scrollPosition-' + this.$route.path, window.scrollY);
    },
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
