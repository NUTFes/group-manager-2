<template>
  <div class="main-content">
    <SubHeader
      v-bind:pageTitle="fireEquipmentOrder.name"
      pageSubTitle="火気使用申請一覧"
    >
      <CommonButton iconName="edit" :on_click="openEditModal">
        編集
      </CommonButton>
      <CommonButton iconName="delete" :on_click="openDeleteModal">
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
            <td>{{ fireEquipmentOrder.id }}</td>
          </tr>
          <tr>
            <th>団体</th>
            <td>{{ fireEquipmentOrder.group.name }}</td>
          </tr>
          <tr>
            <th>火気の名称</th>
            <td>{{ fireEquipmentOrder.name }}</td>
          </tr>
          <tr>
            <th>火気の台数</th>
            <td>{{ fireEquipmentOrder.quantity }}</td>
          </tr>
          <tr>
            <th>燃料</th>
            <td>{{ fireEquipmentOrder.fuel_japanese }}</td>
          </tr>
          <tr>
            <th>使用用途</th>
            <td>{{ fireEquipmentOrder.usage }}</td>
          </tr>
          <tr>
            <th>持ち帰り</th>
            <td>{{ fireEquipmentOrder.is_takeaway ? "はい" : "いいえ" }}</td>
          </tr>
          <tr>
            <th>備考</th>
            <td>{{ fireEquipmentOrder.remark }}</td>
          </tr>
          <tr>
            <th>登録日時</th>
            <td>{{ fireEquipmentOrder.created_at | formatDate }}</td>
          </tr>
          <tr>
            <th>編集日時</th>
            <td>{{ fireEquipmentOrder.updated_at | formatDate }}</td>
          </tr>
        </VerticalTable>
      </Card>
    </Row>

    <EditModal
      @close="closeEditModal"
      v-if="isOpenEditModal"
      title="火気使用申請の編集"
    >
      <template v-slot:form>
        <div>
          <h3>火気の名称</h3>
          <input v-model="name" placeholder="入力してください" />
        </div>
        <div>
          <h3>火気の台数</h3>
          <input
            v-model="quantity"
            type="number"
            placeholder="入力してください"
          />
        </div>
        <div>
          <h3>燃料</h3>
          <select v-model="fuel">
            <option value="">選択してください</option>
            <option value="gas_bottle">ガスボンベ</option>
            <option value="lp_gas">LPガス</option>
            <option value="charcoal">炭</option>
          </select>
        </div>
        <div>
          <h3>使用用途</h3>
          <input v-model="usage" placeholder="入力してください" />
        </div>
        <div>
          <h3>持ち帰り</h3>
          <input type="checkbox" v-model="isTakeaway" />
        </div>
        <div>
          <h3>備考</h3>
          <textarea v-model="remark" placeholder="入力してください"></textarea>
        </div>
      </template>
      <template v-slot:method>
        <CommonButton iconName="edit" :on_click="edit">登録</CommonButton>
      </template>
    </EditModal>

    <DeleteModal
      @close="closeDeleteModal"
      v-if="isOpenDeleteModal"
      title="火気使用申請の削除"
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
  data() {
    return {
      isOpenEditModal: false,
      isOpenDeleteModal: false,
      isOpenSnackBar: false,
      message: "",
      // form fields
      name: "",
      quantity: 1,
      fuel: "",
      usage: "",
      isTakeaway: false,
      remark: "",
    };
  },
  async asyncData({ $axios, route }) {
    const routeId = route.path.replace("/fire_equipment_orders/", "");
    const url = "/api/v1/fire_equipment_orders/" + routeId;
    const response = await $axios.$get(url);
    return {
      fireEquipmentOrder: response.data,
      routeId: routeId,
    };
  },
  computed: {
    ...mapState({
      roleID: (state) => state.users.role,
    }),
  },
  methods: {
    openEditModal() {
      this.name = this.fireEquipmentOrder.name;
      this.quantity = this.fireEquipmentOrder.quantity;
      this.fuel = this.fireEquipmentOrder.fuel;
      this.usage = this.fireEquipmentOrder.usage;
      this.isTakeaway = this.fireEquipmentOrder.is_takeaway;
      this.remark = this.fireEquipmentOrder.remark;
      this.isOpenEditModal = true;
    },
    closeEditModal() {
      this.isOpenEditModal = false;
    },
    openDeleteModal() {
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
      const url = "/api/v1/fire_equipment_orders/" + this.routeId;
      const response = await this.$axios.$get(url);
      this.fireEquipmentOrder = response.data;
    },
    async edit() {
      const url = "/api/v1/fire_equipment_orders/" + this.routeId;
      const params = {
        fire_equipment_order: {
          name: this.name,
          quantity: this.quantity,
          fuel: this.fuel,
          usage: this.usage,
          is_takeaway: this.isTakeaway,
          remark: this.remark,
        },
      };
      await this.$axios.$put(url, params).then(() => {
        this.openSnackBar("申請を編集しました");
        this.reload();
        this.closeEditModal();
      });
    },
    async destroy() {
      const url = "/api/v1/fire_equipment_orders/" + this.routeId;
      await this.$axios.$delete(url);
      this.$router.push("/fire_equipment_orders");
    },
  },
};
</script>
