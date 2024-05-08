<template>
  <div class="main-content">
    <SubHeader
      v-bind:pageTitle="rentalOrder.group.name"
      pageSubTitle="物品申請一覧"
    >
      <CommonButton v-if="this.$role(this.roleID).rental_orders.update" iconName="edit" :on_click="openEditModal">
        編集
      </CommonButton>
      <CommonButton v-if="this.$role(this.roleID).rental_orders.delete" iconName="delete" :on_click="openDeleteModal">
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
            <td>{{ rentalOrder.rental_order.id }}</td>
          </tr>
          <tr>
            <th>団体</th>
            <td>{{ rentalOrder.group.id }}：{{ rentalOrder.group.name }}</td>
          </tr>
          <tr>
            <th>委員</th>
            <td>{{ rentalOrder.group.committee }}</td>
          </tr>
          <tr>
            <th>物品名</th>
            <td>{{ rentalOrder.rental_item.name }}</td>
          </tr>
          <tr>
            <th>個数</th>
            <td>{{ rentalOrder.rental_order.num }}</td>
          </tr>
          <tr>
            <th>登録日時</th>
            <td>{{ rentalOrder.rental_order.created_at | formatDate }}</td>
          </tr>
          <tr>
            <th>編集日時</th>
            <td>{{ rentalOrder.rental_order.updated_at | formatDate }}</td>
          </tr>
        </VerticalTable>
      </Card>
    </Row>

    <EditModal
      @close="closeEditModal"
      v-if="isOpenEditModal"
      title="物品申請の編集"
    >
      <template v-slot:form>
        <div>
          <h3>物品</h3>
          <select v-model="rentalItemID">
            <option disabled value="">選択してください</option>
            <option
              v-for="item in rentableItemList"
              :key="item.id"
              :value="item.id"
            >
              {{ item.name }}
            </option>
          </select>
        </div>
        <div>
          <h3>個数</h3>
          <input v-model="num" type="number" placeholder="入力してください" />
        </div>
      </template>
      <template v-slot:method>
        <CommonButton iconName="edit" :on_click="edit">編集</CommonButton>
      </template>
    </EditModal>

    <DeleteModal
      @close="closeDeleteModal"
      v-if="isOpenDeleteModal"
      title="物品申請の削除"
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
      rentalItemID: null,
      num: null,
      isOpenSnackBar: false,
    };
  },
  async asyncData({ $axios, route }) {
    const routeId = route.path.replace("/rental_orders/", "");
    const url = "/api/v1/get_rental_order_show_for_admin_view/" + routeId;
    const response = await $axios.$get(url);
    return {
      rentalOrder: response.data,
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
    async openEditModal() {
      this.rentalItemID = this.rentalOrder.rental_order.rental_item_id;
      this.num = this.rentalOrder.rental_order.num;
      const rentableItemsUrl = "/api/v1/get_all_rentable_items";
      const resRentableItems = await this.$axios.$get(rentableItemsUrl);
      this.rentableItemList = resRentableItems.data;
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
      const url = "/api/v1/get_rental_order_show_for_admin_view/" + id;
      this.$axios.$get(url).then((response) => {
        this.rentalOrder = response.data;
      });
    },
    async edit() {
      const url =
        "/rental_orders/" +
        this.routeId +
        "?group_id=" +
        this.rentalOrder.rental_order.group_id +
        "&rental_item_id=" +
        this.rentalItemID +
        "&num=" +
        this.num;
      console.log(url);

      await this.$axios.$put(url).then((response) => {
        this.openSnackBar("物品申請を編集しました");
        this.groupID = null;
        this.rentalItemID = null;
        this.num = null;
        this.reload(response.data.id);
        this.closeEditModal();
      });
    },
    async destroy() {
      const url = "/rental_orders/" + this.routeId;
      await this.$axios.$delete(url);
      this.$router.push("/rental_orders");
    },
  },
};
</script>
