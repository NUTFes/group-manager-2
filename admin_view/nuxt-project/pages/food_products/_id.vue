<template>
	<div class="main-content">
		<SubHeader v-bind:pageTitle="foodProduct.food_product.name" pageSubTitle="販売食品申請一覧">
			<CommonButton iconName="edit"> 編集 </CommonButton>
			<CommonButton iconName="delete"> 削除 </CommonButton>
		</SubHeader>
		<Row>
			<Card padding="40px 150px" gap="20px">
				<Row justify="start">
					<h4>基本情報</h4>
				</Row>
				<table class="vertical-table">
					<thead>
						<th v-for="(n, i) in headers" :key="i">
							{{ n }}
						</th>
					</thead>
					<tbody>
						<tr>
							<td>{{ foodProduct.food_product.id }}</td>
							<td>{{ foodProduct.group.name }}</td>
							<td>{{ foodProduct.food_product.name }}</td>
							<td>{{ foodProduct.food_product.first_day_num }}</td>
							<td>{{ foodProduct.food_product.second_day_num }}</td>
							<td>{{ foodProduct.food_product.is_cooking }}</td>
							<td>{{ foodProduct.food_product.created_at | formatDate }}</td>
							<td>{{ foodProduct.food_product.updated_at | formatDate }}</td>
						</tr>
					</tbody>
				</table>
			</Card>
		</Row>
	</div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      headers: [
        "ID",
        "group_id",
        "名前",
        "1日目の個数",
        "2日目の個数",
        "調理の有無",
        "日時",
        "編集日時",
      ],
    };
  },
	async asyncData({ $axios, route}){
		const routeId = route.path.replace("/food_products/", "");
		const url = "/api/v1/get_food_product_show_for_admin_view/" + routeId;
		const response = await $axios.$get(url);
		return {
			foodProduct: response.data,
			route: url,
		}
	},
  computed: {
    ...mapState({
      selfRoleId: (state) => state.users.role,
    }),
  },
  methods: {
    reload: function () {
      console.log("reload");
      const url = "/api/v1/get_food_product/" + this.$route.params.id;
      this.$axios
        .get(url, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.data = response.data;
          this.food_product = response.data.food_product;
          this.id = response.data.food_product.id;
          this.name = response.data.food_product.name;
          this.group = response.data.group;
          this.group_id = response.data.food_product.group_id;
          this.first_day_num = response.data.food_product.first_day_num;
          this.second_day_num = response.data.food_product.second_day_num;
          this.is_cooking = response.data.food_product.is_cooking;
        });
    },
    edit_dialog_open: function () {
      this.edit_dialog = true;
    },
    edit: function () {
      const edit_url =
        "/food_products/" +
        this.id +
        "?group_id=" +
        this.group_id +
        "&name=" +
        this.name +
        "&first_day_num=" +
        this.first_day_num +
        "&second_day_num=" +
        this.second_day_num +
        "&is_cooking=" +
        this.is_cooking;
      console.log(edit_url);
      this.$axios
        .put(edit_url, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log(response);
          this.reload();
          this.edit_dialog = false;
          this.success_snackbar = true;
        });
    },
    delete_yes: function () {
      const url = "/food_products/" + this.$route.params.id;
      this.$axios.delete(url);
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
