<template>
	<div class="main-content">
		<SubHeader pageTitle="会場申請一覧">
			<CommonButton iconName="add_circle" :on_click="openModal">
				追加
			</CommonButton>
		</SubHeader>
		<Card width="100%">
			<table>
				<thead>
					<th v-for="(header, index) in headers" :key="index">
						{{ header }}
					</th>
				</thead>
				<tbody>
					<tr
						v-for="(placeOrder, index) in placeOrders" :key="index"
						@click="() => $router.push({ path: `/place_orders/` + placeOrder.place_order.id })"
					>
					<td>{{ placeOrder.place_order.id }}</td>
					<td>{{ placeOrder.group.name }}</td>
					<td>{{ placeOrder.place_order_name.first }}</td>
					<td>{{ placeOrder.place_order_name.second }}</td>
					<td>{{ placeOrder.place_order_name.third }}</td>
					<td>{{ placeOrder.place_order.created_at | formatDate }}</td>
					<td>{{ placeOrder.place_order.updated_at | formatDate }}</td>
					</tr>
				</tbody>
			</table>
		</Card>
	</div>
</template>

<script>
export default {
	watchQuery: ["page"],
	data() {
			return {
				headers: [
					"ID",
					"参加団体",
					"第一希望",
					"第二希望",
					"第三希望",
					"登録日時",
					"編集日時",
				]
			};
	},
	async asyncData({ $axios }) {
		const url = "/api/v1/get_place_order_index_for_admin_view";
		const placeOrderRes = await $axios.$get(url);
		const yearUrl = "/fes_years";
		const yearRes = await $axios.$get(yearUrl);
		return {
			placeOrders: placeOrderRes.data,
			yearList: yearRes
		}
	},
	methods: {
			reload: function () {
					this.$axios
							.get("/api/v1/get_place_orders", {
							headers: {
									"Content-Type": "application/json",
							},
					})
							.then((response) => {
							this.place_orders = response.data;
					});
			},
			register: function () {
					this.$axios.defaults.headers.common["Content-Type"] = "application/json";
					var params = new URLSearchParams();
					params.append("group_id", this.Group);
					params.append("first", this.placeFirst);
					params.append("second", this.placeSecond);
					params.append("third", this.placeThird);
					this.$axios.post("/place_orders", params).then((response) => {
							console.log(response);
							this.dialog = false;
							this.reload();
							this.Group = "";
							this.placeFirst = "";
							this.placeSecond = "";
							this.placeThird = "";
					});
			},
	},
};
</script>
