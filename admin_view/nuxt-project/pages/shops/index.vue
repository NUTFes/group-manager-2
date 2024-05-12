<template>
  <div class="main-content" v-if="this.$role(roleID).shops.read">
    <SubHeader pageTitle="店一覧">
      <CommonButton v-if="this.$role(roleID).shops.create" iconName="add_circle" :on_click="openAddModal">
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
            v-for="(shop, index) in shops"
            :key="index"
            @click="
              () =>
                $router.push({
                  path: `/shops/` + shop.id,
                })
            "
          >
            <td>{{ shop.id }}</td>
            <td>{{ shop.name }}</td>
            <td>{{ shop.tel }}</td>
            <td>{{ shop.opening_hours }}</td>
            <td>{{ shop.address }}</td>
          </tr>
        </template>
      </Table>
    </Card>

    <AddModal
      @close="closeAddModal"
      v-if="isOpenAddModal"
      title="店の追加"
    >
      <template v-slot:form>
        <div>
          <h3>名前</h3>
          <input v-model="name" placeholder="入力してください" />
        </div>
        <div>
          <h3>電話番号</h3>
          <input v-model="tel" placeholder="入力してください" />
        </div>
        <div>
          <h3>開店時間</h3>
          <input v-model="openingHours" placeholder="入力してください" />
        </div>
        <div>
          <h3>住所</h3>
          <input v-model="address" placeholder="入力してください" />
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
      headers: ["ID", "名前", "電話番号", "開店時間", "住所"],
      isOpenAddModal: false,
      isOpenSnackBar: false,
      name: "",
      tel: "",
      openingHours: "",
      address: "",
      enableSunny: null,
      enableRainy: null,
    };
  },
  async asyncData({ $axios }) {
    const shopUrl = "/shops";
    const shopsRes = await $axios.$get(shopUrl);
    return {
      shops: shopsRes.data,
    };
  },
  computed: {
    ...mapState({
      selfRoleId: (state) => state.users.role,
    }),
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
      const url = "/shops/" + id;
      this.$axios.$get(url).then((response) => {
        this.shops.push(response.data);
      });
    },
    async submit() {
      const url =
        "/shops/" +
        "?name=" +
        this.name +
        "&tel=" +
        this.tel +
        "&opening_hours=" +
        this.openingHours +
        "&address=" +
        this.address

      this.$axios.$post(url).then((response) => {
        this.openSnackBar(response.data.name + "を追加しました");
        this.name = "";
        this.tel = "";
        this.openingHours = "";
        this.address = "";
        this.reload(response.data.id);
        this.closeAddModal();
      });
    },
  },
};
</script>
