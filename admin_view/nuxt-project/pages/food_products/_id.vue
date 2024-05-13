<template>
  <div class="main-content">
    <SubHeader
      v-bind:pageTitle="foodProduct.food_product.name"
      pageSubTitle="販売品申請一覧"
    >
      <CommonButton
        v-if="this.$role(this.roleID).food_products.update"
        iconName="edit"
        :on_click="openEditModal"
      >
        編集
      </CommonButton>
      <CommonButton
        v-if="this.$role(this.roleID).food_products.delete"
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
            <td>{{ foodProduct.food_product.id }}</td>
          </tr>
          <tr>
            <th>団体名</th>
            <td>{{ foodProduct.group.name }}</td>
          </tr>
          <tr>
            <th>名前</th>
            <td>{{ foodProduct.food_product.name }}</td>
          </tr>
          <tr>
            <th>1日目の個数</th>
            <td>{{ foodProduct.food_product.first_day_num }}</td>
          </tr>
          <tr>
            <th>2日目の個数</th>
            <td>{{ foodProduct.food_product.second_day_num }}</td>
          </tr>
          <tr>
            <th>調理の有無</th>
            <td>
              <div v-if="foodProduct.food_product.is_cooking">○</div>
              <div v-else-if="!foodProduct.food_product.is_cooking">✖</div>
            </td>
          </tr>
          <tr>
            <th>登録日時</th>
            <td>{{ foodProduct.food_product.created_at | formatDate }}</td>
          </tr>
          <tr>
            <th>編集日時</th>
            <td>{{ foodProduct.food_product.updated_at | formatDate }}</td>
          </tr>
        </VerticalTable>
      </Card>
    </Row>

    <EditModal
      @close="closeEditModal"
      v-if="isOpenEditModal"
      title="販売品申請の編集"
    >
      <template v-slot:form>
        <div>
          <h3>食品名</h3>
          <input v-model="name" placeholder="入力してください" />
        </div>
        <div>
          <h3>調理するか</h3>
          <select v-model="isCooking">
            <option disabled value="">選択してください</option>
            <option
              v-for="isCook in isCookingList"
              :key="isCook.id"
              :value="isCook.value"
            >
              {{ isCook.text }}
            </option>
          </select>
        </div>
        <div>
          <h3>1日目の個数</h3>
          <input v-model="first" type="number" placeholder="入力してください" />
        </div>
        <div>
          <h3>2日目の個数</h3>
          <input
            v-model="second"
            type="number"
            placeholder="入力してください"
          />
        </div>
      </template>
      <template v-slot:method>
        <CommonButton iconName="edit" :on_click="edit">登録</CommonButton>
      </template>
    </EditModal>

    <DeleteModal
      @close="closeDeleteModal"
      v-if="isOpenDeleteModal"
      title="販売品申請の削除"
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
      isCookingList: [
        { id: 1, text: "調理あり", value: true },
        { id: 2, text: "調理なし", value: false },
      ],
      name: "",
      isCooking: null,
      first: null,
      second: null,
      isOpenSnackBar: false,
    };
  },
  async asyncData({ $axios, route }) {
    const routeId = route.path.replace("/food_products/", "");
    const url = "/api/v1/get_food_product_show_for_admin_view/" + routeId;
    const response = await $axios.$get(url);
    return {
      foodProduct: response.data,
      route: url,
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
      this.name = this.foodProduct.food_product.name;
      this.isCooking = this.foodProduct.food_product.is_cooking;
      this.first = this.foodProduct.food_product.first_day_num;
      this.second = this.foodProduct.food_product.second_day_num;
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
      const url = "/api/v1/get_food_product_show_for_admin_view/" + id;
      this.$axios.$get(url).then((response) => {
        this.foodProduct = response.data;
      });
    },
    async edit() {
      const url =
        "/food_products/" +
        this.foodProduct.food_product.id +
        "?group_id=" +
        this.foodProduct.food_product.group_id +
        "&name=" +
        this.name +
        "&is_cooking=" +
        this.isCooking +
        "&first_day_num=" +
        this.first +
        "&second_day_num=" +
        this.second;
      console.log(url);

      await this.$axios.$put(url).then((response) => {
        this.openSnackBar(this.name + "を編集しました");
        this.groupID = null;
        this.name = "";
        this.isCooking = null;
        this.first = null;
        this.second = null;
        this.reload(response.data.id);
        this.closeEditModal();
      });
    },
    async destroy() {
      const url = "/food_products/" + this.foodProduct.food_product.id;
      await this.$axios.$delete(url);
      this.$router.push("/food_products");
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
