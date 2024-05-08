<template>
  <div class="main-content">
    <SubHeader
      v-bind:pageTitle="powerOrder.power_order.item"
      pageSubTitle="電力申請一覧"
    >
      <CommonButton v-if="this.$role(this.roleID).power_orders.update" iconName="edit" :on_click="openEditModal">
        編集
      </CommonButton>
      <CommonButton v-if="this.$role(this.roleID).power_orders.delete" iconName="delete" :on_click="openDeleteModal">
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
            <td>{{ powerOrder.power_order.id }}</td>
          </tr>
          <tr>
            <th>団体</th>
            <td>{{ powerOrder.group.id }}：{{ powerOrder.group.name }}</td>
          </tr>
          <tr>
            <th>委員</th>
            <td>{{ powerOrder.group.committee }}</td>
          </tr>
          <tr>
            <th>製品名</th>
            <td>{{ powerOrder.power_order.item }}</td>
          </tr>
          <tr>
            <th>電力 [w]</th>
            <td>{{ powerOrder.power_order.power }}</td>
          </tr>
          <tr>
            <th>メーカー</th>
            <td>{{ powerOrder.power_order.manufacturer }}</td>
          </tr>
          <tr>
            <th>型番</th>
            <td>{{ powerOrder.power_order.model }}</td>
          </tr>
          <tr>
            <th>製品URL</th>
            <td>{{ powerOrder.power_order.item_url }}</td>
          </tr>
          <tr>
            <th>登録日時</th>
            <td>{{ powerOrder.power_order.created_at | formatDate }}</td>
          </tr>
          <tr>
            <th>編集日時</th>
            <td>{{ powerOrder.power_order.updated_at | formatDate }}</td>
          </tr>
        </VerticalTable>
      </Card>
    </Row>

    <EditModal
      @close="closeEditModal"
      v-if="isOpenEditModal"
      title="電力申請の編集"
    >
      <template v-slot:form>
        <div>
          <h3>製品</h3>
          <input v-model="item" placeholder="入力してください" />
        </div>
        <div>
          <h3>電力</h3>
          <input v-model="power" type="number" placeholder="入力してください" />
        </div>
        <div>
          <h3>メーカー</h3>
          <input v-model="manufacturer" placeholder="入力してください" />
        </div>
        <div>
          <h3>型番</h3>
          <input v-model="model" placeholder="入力してください" />
        </div>
        <div>
          <h3>製品URL</h3>
          <input v-model="itemUrl" placeholder="入力してください" />
        </div>
      </template>
      <template v-slot:method>
        <CommonButton iconName="edit" :on_click="edit">登録</CommonButton>
      </template>
    </EditModal>

    <DeleteModal
      @close="closeDeleteModal"
      v-if="isOpenDeleteModal"
      title="電力申請の削除"
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
      groupID: null,
      item: null,
      power: 0,
      manufacturer: null,
      model: null,
      itemUrl: null,
      isOpenSnackBar: false,
    };
  },
  async asyncData({ $axios, route }) {
    const routeId = route.path.replace("/power_orders/", "");
    const url = "/api/v1/get_power_order_show_for_admin_view/" + routeId;
    const response = await $axios.$get(url);
    return {
      powerOrder: response.data,
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
      this.item = this.powerOrder.power_order.item;
      this.power = this.powerOrder.power_order.power;
      this.manufacturer = this.powerOrder.power_order.manufacturer;
      this.model = this.powerOrder.power_order.model;
      this.itemUrl = this.powerOrder.power_order.item_url;
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
    async reload() {
      const url = "/api/v1/get_power_order_show_for_admin_view/" + this.routeId;
      const res = await this.$axios.$get(url);
      this.powerOrder = res.data;
    },
    async edit() {
      const url =
        "/power_orders/" +
        this.routeId +
        "?group_id=" +
        this.powerOrder.power_order.group_id +
        "&item=" +
        this.item +
        "&power=" +
        this.power +
        "&manufacturer=" +
        this.manufacturer +
        "&model=" +
        this.model +
        "&item_url=" +
        this.itemUrl;
      console.log(url);

      await this.$axios.$put(url).then(() => {
        this.openSnackBar(this.item + "を編集しました");
        this.reload();
        this.closeEditModal();
      });
    },
    async destroy() {
      const delUrl = "/power_orders/" + this.routeId;
      await this.$axios.$delete(delUrl);
      this.$router.push("/power_orders");
    },
  },
};
</script>
