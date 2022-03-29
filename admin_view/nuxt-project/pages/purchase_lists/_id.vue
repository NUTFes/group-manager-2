<template>
  <div class="main-content">
    <SubHeader
      v-bind:pageTitle="purchaseList.purchase_list.items"
      pageSubTitle="購入食品申請一覧"
    >
      <CommonButton v-if="this.$role(this.roleID).purchase_lists.update" iconName="edit" :on_click="openEditModal">
        編集
      </CommonButton>
      <CommonButton v-if="this.$role(this.roleID).purchase_lists.delete" iconName="delete" :on_click="openDeleteModal">
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
            <td>{{ purchaseList.purchase_list.id }}</td>
          </tr>
          <tr>
            <th>参加団体</th>
            <td>{{ purchaseList.group.name }}</td>
          </tr>
          <tr>
            <th>販売食品</th>
            <td>{{ purchaseList.purchase_list_info.food_product }}</td>
          </tr>
          <tr>
            <th>購入品</th>
            <td>{{ purchaseList.purchase_list.items }}</td>
          </tr>
          <tr>
            <th>なまもの</th>
            <td>{{ purchaseList.purchase_list.is_fresh }}</td>
          </tr>
          <tr>
            <th>購入店</th>
            <td>{{ purchaseList.purchase_list_info.shop }}</td>
          </tr>
          <tr>
            <th>仕入れ日</th>
            <td>
              {{ purchaseList.purchase_list_info.date }} -
              {{ purchaseList.purchase_list_info.day }} -
              {{ purchaseList.purchase_list.days_num }}
            </td>
          </tr>
          <tr>
            <th>登録日時</th>
            <td>{{ purchaseList.purchase_list.created_at | formatDate }}</td>
          </tr>
          <tr>
            <th>編集日時</th>
            <td>{{ purchaseList.purchase_list.updated_at | formatDate }}</td>
          </tr>
        </VerticalTable>
      </Card>
    </Row>

    <EditModal
      @close="closeEditModal"
      v-if="isOpenEditModal"
      title="購入品申請の編集"
    >
      <template v-slot:form>
        <div>
          <h3>品名</h3>
          <input v-model="items" placeholder="入力してください" />
        </div>
        <div>
          <h3>購入店</h3>
          <select v-model="shopID">
            <option disabled value="">選択してください</option>
            <option
              v-for="list in shopList"
              :key="list.id"
              :value="list.id"
            >
              {{ list.name }}
            </option>
          </select>
        </div>
        <div>
          <h3>購入日</h3>
          <select v-model="fesDateID">
            <option disabled value="">選択してください</option>
            <option
              v-for="list in fesDatesList"
              :key="list.id"
              :value="list.id"
            >
              {{ list.date }}
            </option>
          </select>
        </div>
        <div>
          <h3>なまものか</h3>
          <select v-model="isFresh">
            <option disabled value="">選択してください</option>
            <option
              v-for="list in isFreshList"
              :key="list.id"
              :value="list.value"
            >
              {{ list.text }}
            </option>
          </select>
        </div>
      </template>
      <template v-slot:method>
        <CommonButton iconName="edit" :on_click="edit">編集</CommonButton>
      </template>
    </EditModal>

    <DeleteModal
      @close="closeDeleteModal"
      v-if="isOpenDeleteModal"
      title="購入品申請の削除"
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
  data() {
    return {
      isOpenEditModal: false,
      isOpenDeleteModal: false,
      isOpenSnackBar: false,
      isFreshList: [
        { id: 1, text: "はい", value: true },
        { id: 2, text: "いいえ", value: false },
      ],
      items: null,
      shopID: null,
      fesDateID: null,
      isFresh: null,
      shopList: [],
      fesDatesList: [],
    };
  },
  async asyncData({ $axios, route }) {
    const routeId = route.path.replace("/purchase_lists/", "");
    const url = "/api/v1/get_purchase_list_show_for_admin_view/" + routeId;
    const response = await $axios.$get(url);
    return {
      purchaseList: response.data,
      route: url,
      routeId: routeId,
    };
  },
  computed: {
    ...mapState({
      roleID: (state) => state.users.role,
    }),
  },
  methods: {
    async openEditModal() {
      const shopUrl = "/shops";
      const resShops = await this.$axios.$get(shopUrl);
      this.shopList = resShops.data;
      const fesDatesListUrl = "/api/v1/get_current_fes_dates";
      const resFesDates = await this.$axios.$get(fesDatesListUrl);
      this.fesDatesList = resFesDates.data;
      this.items = this.purchaseList.purchase_list.items
      this.shopID = this.purchaseList.purchase_list.shop_id
      this.fesDateID = this.purchaseList.purchase_list.fes_date_id
      this.isFresh = this.purchaseList.purchase_list.is_fresh
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
      const url = "/api/v1/get_purchase_list_show_for_admin_view/" + id;
      const res = await this.$axios.$get(url);
      this.purchaseList = res.data;
    },
    async edit() {
      const url =
        "/purchase_lists/" + this.purchaseList.purchase_list.id +
        "?food_product_id=" + 
        this.purchaseList.purchase_list.food_product_id +
        "&shop_id=" +
        this.shopID +
        "&fes_date_id=" +
        this.fesDateID +
        "&items=" +
        this.items +
        "&is_fresh=" + 
        this.isFresh;

        console.log(url)

      await this.$axios.$put(url).then((response) => {
        this.openSnackBar(this.items + "を編集しました");
        this.items = null
        this.fesDateID = null
        this.shopID = null
        this.isFresh = null
        this.reload(response.data.id);
        this.closeEditModal();
      });
    },
    async destroy() {
      const url = "/purchase_lists/" + this.routeId;
      await this.$axios.$delete(url);
      this.$router.push("/purchase_lists");
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
