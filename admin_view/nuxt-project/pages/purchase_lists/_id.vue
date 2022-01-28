<template>
  <div class="main-content">
    <SubHeader v-bind:pageTitle="purchaseList.purchase_list.items" pageSubTitle="購入食品申請一覧">
      <CommonButton iconName="edit"> 編集 </CommonButton>
      <CommonButton iconName="delete"> 削除 </CommonButton>
    </SubHeader>
    <Row>
      <Card padding="40px 150px" gap="20px">
        <Row justify="start">
          <h4>基本情報</h4>
        </Row>
        <VerticalTable>
            <tr>
              <th>ID</th><td>{{ purchaseList.purchase_list.id }}</td>
            </tr>
            <tr>
              <th>参加団体</th><td>{{ purchaseList.group.name }}</td>
            </tr>
            <tr>
              <th>販売食品</th><td>{{ purchaseList.purchase_list_info.food_product }}</td>
            </tr>
            <tr>
              <th>購入品</th><td>{{ purchaseList.purchase_list.items }}</td>
            </tr>
            <tr>
              <th>なまもの</th><td>{{ purchaseList.purchase_list.is_fresh }}</td>
            </tr>
            <tr>
              <th>購入店</th><td>{{ purchaseList.purchase_list_info.shop }}</td>
            </tr>
            <tr>
              <th>仕入れ日</th><td>{{ purchaseList.purchase_list_info.date }} - {{ purchaseList.purchase_list_info.day }} - {{ purchaseList.purchase_list.days_num }}</td>
            </tr>
            <tr>
              <th>登録日時</th><td>{{ purchaseList.purchase_list.created_at | formatDate }}</td>
            </tr>
            <tr>
              <th>編集日時</th><td>{{ purchaseList.purchase_list.updated_at | formatDate }}</td>
            </tr>
          </VerticalTable>
      </Card>
    </Row>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  watchQuery: ["page"],
  data() {
    return {
      headers: [
        "ID",
        "参加団体",
        "販売食品",
        "購入品",
        "なまもの",
        "購入店",
        "仕入れ日",
        "登録日時",
        "編集日時",
      ],
    };
  },
  async asyncData({ $axios, route}){
    const routeId = route.path.replace("/purchase_lists/", "");
    const url = "/api/v1/get_purchase_list_show_for_admin_view/" + routeId;
    const response = await $axios.$get(url);
    return {
      purchaseList: response.data,
      route: url,
    }
  },
  computed: {
    ...mapState({
      selfRoleId: (state) => state.users.role,
    }),
  },
  methods: {
    async reload() {
      const url = "api/v1/get_purchase_list/" + this.$route.params.id;
      await this.$axios
        .get(url, {
          headers: { "Content-Type": "application/json" },
        })
        .then((response) => {
          console.log(response.data.purchase_list);
          this.purchase = response.data.purchase_list;
          this.food_product = response.data.food_product;
          this.food_product_id = this.purchase.food_product_id;
          this.group = response.data.group;
          this.group_id = response.data.group_id;
          this.shop = response.data.shop;
          this.shop_id = this.purchase.shop_id;
          this.fes_date = response.data.fes_date;
          this.fes_date_id = this.purchase.fes_date_id;
          this.is_fresh = this.purchase.is_fresh;
          this.items = this.purchase.items;
        });
    },
    delete_yes() {
      const url = "/purchase_lists/" + this.$route.params.id;
      this.$axios.delete(url);
      this.$router.push("/purchase_lists");
    },
    async edit() {
      const edit_url =
        "/purchase_lists/" +
        this.purchase.id +
        "?group_id=" +
        this.group_id +
        "&food_product_id=" +
        this.food_product_id +
        "&shop_id=" +
        this.shop_id +
        "&fes_date_id" +
        this.fes_date_id +
        "&is_fresh=" +
        this.is_fresh +
        "&items=" +
        this.items;
      await this.$axios.put(edit_url, {
        headers: { "Content-Type": "application/json" },
      });
      await this.reload();

      this.dialog = false;
    },
    async openModal() {
      await this.$axios
        .get("/groups", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.groupList = response.data;
        });

        await this.changeGroupFoodProductList();

        this.dialog = true;
    },
    changeGroupFoodProductList() {
      this.foodProductList = [];
      const foodProductUrl = "/api/v1/group_food_products/" + this.group_id;
      this.$axios
        .get(foodProductUrl, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then(
          (response) => {
            response.data.forEach((foodProduct) => {
              this.foodProductList.push(foodProduct);
            });
          },
          (error) => {
            console.error(error);
            return error;
          }
        );
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
