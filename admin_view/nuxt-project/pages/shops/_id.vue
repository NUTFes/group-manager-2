<template>
  <div class="main-content">
    <SubHeader v-bind:pageTitle="shop.name" pageSubTitle="店一覧">
      <CommonButton v-if="this.$role(this.roleID).shops.update" iconName="edit" :on_click="openEditModal">
        編集
      </CommonButton>
      <CommonButton v-if="this.$role(this.roleID).shops.delete" iconName="delete" :on_click="openDeleteModal">
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
              <td>{{ shop.id }}</td>
            </tr>
            <tr>
              <th>名前</th>
              <td>{{ shop.name }}</td>
            </tr>
            <tr>
              <th>電話番号</th>
              <td>{{ shop.tel }}</td>
            </tr>
            <tr>
              <th>開店時間</th>
              <td>{{ shop.opening_hours }}</td>
            </tr>
            <tr>
              <th>住所</th>
              <td>{{ shop.address }}</td>
            </tr>
            <tr>
              <th>登録日時</th>
              <td>{{ shop.created_at | formatDate }}</td>
            </tr>
            <tr>
              <th>編集日時</th>
              <td>{{ shop.updated_at | formatDate }}</td>
            </tr>
          </VerticalTable>
        </Row>
      </Card>
    </Row>

    <EditModal
      @close="closeEditModal"
      v-if="isOpenEditModal"
      title="店の編集"
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
        <CommonButton iconName="edit" :on_click="edit">登録</CommonButton>
      </template>
    </EditModal>

    <DeleteModal
      @close="closeDeleteModal"
      v-if="isOpenDeleteModal"
      title="店の削除"
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
  computed: {
    ...mapState({
      selfRoleId: (state) => state.users.role,
    }),
  },
  data() {
    return {
      isOpenEditModal: false,
      isOpenDeleteModal: false,
      isOpenSnackBar: false,
      name: "",
      tel: "",
      openingHours: "",
      address: "",
      enableSunny: null,
      enableRainy: null,
    };
  },
  async asyncData({ $axios, route }) {
    const routeId = route.path.replace("/shops/", "");
    const shopUrl = "/shops/" + routeId;
    const shopRes = await $axios.$get(shopUrl);
    return {
      shop: shopRes.data,
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
      this.name = this.shop.name;
      this.tel = this.shop.tel;
      this.openingHours = this.shop.opening_hours;
      this.address = this.shop.address;
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
      const url = "/shops/" + id;
      const res = await this.$axios.$get(url);
      this.shop = res.data;
    },
    async edit() {
      const url =
        "/shops/" + this.routeId +
        "?name=" +
        this.name +
        "&tel=" +
        this.tel +
        "&opening_hours=" +
        this.openingHours +
        "&address=" +
        this.address

      await this.$axios.$put(url).then((response) => {
        this.openSnackBar(response.data.name + "を編集しました");
        this.name = "";
        this.tel = "";
        this.openingHours = "";
        this.address = "";
        this.reload(response.data.id);
        this.closeEditModal();
      });
    },
    async destroy() {
      const url = "/shops/" + this.routeId;
      await this.$axios.$delete(url);
      this.$router.push("/shops");
    },
  },
};
</script>
