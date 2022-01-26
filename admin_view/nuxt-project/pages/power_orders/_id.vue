<template>
	<div class="main-content">
		<SubHeader v-bind:pageTitle="タイトル" pageSubTitle="電力申請一覧">
			<CommonButton iconName="edit"> 編集 </CommonButton>
			<CommonButton iconName="delete"> 削除 </CommonButton>
		</SubHeader>
		{{ powerOrder }}
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
							<td>{{ powerOrder.power_order.id }}</td>
							<td>{{ powerOrder.group.name }}</td>
							<td>{{ powerOrder.power_order.item }}</td>
							<td>{{ powerOrder.power_order.power }}</td>
							<td>{{ powerOrder.power_order.manufacturer }}</td>
							<td>{{ powerOrder.power_order.model }}</td>
							<td>{{ powerOrder.power_order.item_url }}</td>
							<td>{{ powerOrder.power_order.created_at | formatDate }}</td>
							<td>{{ powerOrder.power_order.updated_at | formatDate }}</td>
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
watchQuery: ["page"],
	data() {
			return {
				headers: [
					"ID",
					"参加団体",
					"製品",
					"電力 [w]",
					"メーカー",
					"型番",
					"製品URL",
					"登録日時",
					"編集日時"
				]
			};
	},
	computed: {
			...mapState({
					selfRoleId: (state) => state.users.role,
			}),
	},
	async asyncData({ $axios, route}){
		const routeId = route.path.replace("/power_orders/", "");
		const url = "/api/v1/get_power_order_show_for_admin_view/" + routeId;
		const response = await $axios.$get(url);
		return {
			powerOrder: response.data,
			route: url,
		}
	},
	methods: {
			reload: function () {
					const url = "/api/v1/get_power_order/" + this.$route.params.id;
					this.$axios
							.get(url, {
							headers: {
									"Content-Type": "application/json",
							},
					})
							.then((response) => {
							this.power_order = response.data.power_order;
							this.group = response.data.group;
							this.group_id = response.data.power_order.group_id;
							this.item = response.data.power_order.item;
							this.power = response.data.power_order.power;
							this.manufacturer = response.data.power_order.manufacturer;
							this.model = response.data.power_order.model;
							this.itemUrl = response.data.power_order.item_url;
					});
			},
			edit_dialog_open: function () {
					this.$axios
							.get("/groups", {
							headers: {
									"Content-Type": "application/json",
							},
					})
							.then((response) => {
							this.group_list = response.data;
					});
					this.edit_dialog = true;
			},
			edit: function () {
					const edit_url = "power_orders/" +
							this.power_order.id +
							"?group_id=" +
							this.group_id +
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
					this.$axios
							.put(edit_url, {
							headers: {
									"Content-Type": "application/json",
							},
					})
							.then((response) => {
							this.reload();
							this.edit_dialog = false;
							this.success_snackbar = true;
					});
			},
			delete_yes: function () {
					const url = "/power_orders/" + this.$route.params.id;
					this.$axios.delete(url);
					this.$router.push("/power_orders");
			},
	},
	components: { SubHeader, CommonButton }
};
</script>
