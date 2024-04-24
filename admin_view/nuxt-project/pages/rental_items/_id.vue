<template>
  <div class="main-content">
    <SubHeader v-bind:pageTitle="rentalItem.name" pageSubTitle="物品一覧">
      <CommonButton
        v-if="this.$role(this.roleID).rental_items.update"
        iconName="edit"
        :on_click="openEditModal"
      >
        編集
      </CommonButton>
      <CommonButton
        v-if="this.$role(this.roleID).rental_items.delete"
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
        </Row>
        <VerticalTable>
          <tr>
            <th>ID</th>
            <td>{{ rentalItem.id }}</td>
          </tr>
          <tr>
            <th>名前</th>
            <td>{{ rentalItem.name }}</td>
          </tr>
          <tr>
            <th>屋内模擬店貸し出し</th>
            <td>{{ rentalItem.is_inside_shop_rentable }}</td>
          </tr>
          <tr>
            <th>屋外店貸し出し</th>
            <td>{{ rentalItem.is_outside_shop_rentable }}</td>
          </tr>
          <tr>
            <th>ステージ貸し出し</th>
            <td>{{ rentalItem.is_stage_rentable }}</td>
          </tr>
          <tr>
            <th>登録日時</th>
            <td>{{ rentalItem.created_at | formatDate }}</td>
          </tr>
          <tr>
            <th>編集日時</th>
            <td>{{ rentalItem.updated_at | formatDate }}</td>
          </tr>
        </VerticalTable>
      </Card>
    </Row>

    <EditModal
      @close="closeEditModal"
      v-if="isOpenEditModal"
      title="物品の編集"
    >
      <template v-slot:form>
        <div>
          <h3>物品名</h3>
          <input v-model="name" placeholder="入力してください" />
        </div>
        <div>
          <h3>屋内模擬店貸出可否</h3>
          <select v-model="isInsideShopRentable">
            <option disabled value="">選択してください</option>
            <option v-for="r in isRentableList" :key="r" :value="r.value">
              {{ r.text }}
            </option>
          </select>
        </div>
        <div>
          <h3>屋外模擬店貸出可否</h3>
          <select v-model="isOutsideShopRentable">
            <option disabled value="">選択してください</option>
            <option v-for="r in isRentableList" :key="r" :value="r.value">
              {{ r.text }}
            </option>
          </select>
        </div>
        <div>
          <h3>ステージ貸出可否</h3>
          <select v-model="isStageRentable">
            <option disabled value="">選択してください</option>
            <option v-for="r in isRentableList" :key="r" :value="r.value">
              {{ r.text }}
            </option>
          </select>
        </div>
      </template>
      <template v-slot:method>
        <CommonButton iconName="edit" :on_click="edit">登録</CommonButton>
      </template>
    </EditModal>

    <DeleteModal
      @close="closeDeleteModal"
      v-if="isOpenDeleteModal"
      title="物品の削除"
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
      isRentableList: [
        { text: "貸出可能", value: true },
        { text: "貸出不可能", value: false },
      ],
      isOpenSnackBar: false,
      name: "",
    };
  },
  async asyncData({ $axios, route }) {
    const routeId = route.path.replace("/rental_items/", "");
    const url = "/rental_items/" + routeId;
    const response = await $axios.$get(url);
    return {
      rentalItem: response.data,
      route: url,
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
      this.name = this.rentalItem.name;
      this.isInsideShopRentable = this.rentalItem.is_inside_shop_rentable;
      this.isOutsideShopRentable = this.rentalItem.is_outside_shop_rentable;
      this.isStageRentable = this.rentalItem.is_stage_rentable;
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
      const url = "/rental_items/" + id;
      const res = await this.$axios.$get(url);
      this.rentalItem = res.data;
    },
    async edit() {
      const url =
        "/rental_items/" +
        this.routeId +
        "?name=" +
        this.name +
        "&is_inside_shop_rentable=" +
        this.isInsideShopRentable +
        "&is_outside_shop_rentable=" +
        this.isOutsideShopRentable +
        "&is_stage_rentable=" +
        this.isStageRentable;

      console.log(url);

      await this.$axios.$put(url).then((response) => {
        this.openSnackBar(response.data.name + "を編集しました");
        this.name = "";
        this.isInsideShopRentable = "";
        this.isOutsideShopRentable = "";
        this.isStageRentable = "";
        this.reload(response.data.id);
        this.closeEditModal();
      });
    },
    async destroy() {
      const url = "/rental_items/" + this.routeId;
      const res = await this.$axios.$delete(url);
      this.$router.push("/rental_items");
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
