<template>
  <div class="main-content">
    <SubHeader
      v-if="cooking_process_order"
      v-bind:pageTitle="`${cooking_process_order.group.name} - ${cooking_process_order.food_product.name}`"
      pageSubTitle="調理工程申請一覧"
    >
      <CommonButton
        v-if="this.$role(this.roleID).cooking_process_orders.update"
        iconName="edit"
        :on_click="openEditModal"
      >
        編集
      </CommonButton>
      <CommonButton
        v-if="this.$role(this.roleID).cooking_process_orders.delete"
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
          <VerticalTable>
            <tr>
              <th colspan="2">ID</th>
              <td>{{ cooking_process_order.food_product.id }}</td>
            </tr>
            <tr>
              <th colspan="2">販売品名</th>
              <td>{{ cooking_process_order.food_product.name }}</td>
            </tr>
            <tr>
              <th colspan="2">参加団体</th>
              <td>{{ cooking_process_order.group.name }}</td>
            </tr>
            <tr>
              <th rowspan="2">調理場</th>
              <th>営業前</th>
              <td>
                <div v-if="cooking_process_order.cooking_process_order === null">
                  未登録
                </div>
                <div v-else>
                  {{ cooking_process_order.cooking_process_order.pre_open_kitchen ? '使用する' : '使用しない' }}
                </div>
              </td>
            </tr>
            <tr>
              <th>営業中</th>
              <td>
                <div v-if="cooking_process_order.cooking_process_order === null">
                  未登録
                </div>
                <div v-else>
                  {{ cooking_process_order.cooking_process_order.during_open_kitchen ? '使用する' : '使用しない' }}
                </div>
              </td>
            </tr>
            <tr>
              <th colspan="2">調理工程（原文）</th>
              <td>
                <div v-if="cooking_process_order.cooking_process_order === null">
                  未登録
                </div>
                <div v-else>
                  <div style="white-space: pre-line">
                    {{ cooking_process_order.cooking_process_order.tent }}
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th colspan="2">調理工程（日本語訳）</th>
              <td>
                <div v-if="cooking_process_order.cooking_process_order === null">
                  未登録
                </div>
                <div v-else>
                  <div style="white-space: pre-line">
                    {{ cooking_process_order.cooking_process_order.tent_ja }}
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th colspan="2">登録日時</th>
              <td>
                <div v-if="cooking_process_order.cooking_process_order === null">
                  未登録
                </div>
                <div v-else>
                  {{ cooking_process_order.cooking_process_order.created_at | formatDate }}
                </div>
              </td>
            </tr>
            <tr>
              <th colspan="2">編集日時</th>
              <td>
                <div v-if="cooking_process_order.cooking_process_order === null">
                  未登録
                </div>
                <div v-else>
                  {{ cooking_process_order.cooking_process_order.updated_at | formatDate }}
                </div>
              </td>
            </tr>
          </VerticalTable>
        </Row>
      </Card>
    </Row>

    <EditModalsCookingProcessOrderEditModal
      v-if="isOpenEditModal"
      :cooking-process-order="cooking_process_order"
      @close="closeEditModal"
      @saved="reload"
      @error="openSnackBar"
    />

    <DeleteModal
      @close="closeDeleteModal"
      v-if="isOpenDeleteModal"
      title="調理工程申請の削除"
    >
      <template v-slot:method>
        <YesButton iconName="delete" :on_click="destroy">はい</YesButton>
        <NoButton iconName="close" :on_click="closeDeleteModal"
          >いいえ</NoButton
        >
      </template>
    </DeleteModal>
    <SnackBar v-if="isOpenSnackBar" @close="closeSnackBar">
      {{ snackMessage }}
    </SnackBar>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  watchQuery: ["page"],
  data() {
    return {
      cooking_process_order: {},
      isOpenEditModal: false,
      isOpenDeleteModal: false,
      isOpenSnackBar: false,
      snackMessage: null,
      food_product_id: null,
      pre_open_kitchen: null,
      during_open_kitchen: null,
      tent: "",
    };
  },
  computed: {
    ...mapState({
      roleID: (state) => state.users.role,
    }),
  },
  async asyncData({ $axios, route }) {
    const foodProductId = route.params.id;
    const url = `/api/v1/get_cooking_process_order_by_food_product_id/${foodProductId}`;
    const res = await $axios.$get(url);
    return {
      cooking_process_order: res.data,
    };
  },
  methods: {
    openEditModal() {
      if (this.cooking_process_order.cooking_process_order) {
        this.food_product_id = this.cooking_process_order.food_product.id;
        this.pre_open_kitchen =
          this.cooking_process_order.cooking_process_order.pre_open_kitchen;
        this.during_open_kitchen =
          this.cooking_process_order.cooking_process_order.during_open_kitchen;
        this.tent =
          this.cooking_process_order.cooking_process_order.tent;
        this.isOpenEditModal = true;
      } else {
        this.food_product_id = this.cooking_process_order.food_product.id;
        this.pre_open_kitchen = null;
        this.during_open_kitchen = null;
        this.tent = null;
        this.isOpenEditModal = true;
      }
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
    openSnackBar(snackMessage) {
      this.snackMessage = snackMessage;
      this.isOpenSnackBar = true;
      setTimeout(this.closeSnackBar, 2000);
    },
    closeSnackBar() {
      this.isOpenSnackBar = false;
    },
    async reload(id) {
      const url = `/api/v1/get_cooking_process_order_by_food_product_id/${this.cooking_process_order.food_product.id}`;
      const res = await this.$axios.$get(url);
      this.cooking_process_order = res.data;
    },
    async edit() {
      if (
        this.pre_open_kitchen === null ||
        this.during_open_kitchen === null ||
        this.tent === ""
      ) {
        this.openSnackBar("調理工程申請を全て入力してください");
        return;
      }
      const cookingProcessOrderData = {
        food_product_id: this.food_product_id,
        pre_open_kitchen: this.pre_open_kitchen,
        during_open_kitchen: this.during_open_kitchen,
        tent: this.tent,
      };
      if (this.cooking_process_order.cooking_process_order) {
        // 既存の調理工程を編集
        const editUrl = `/cooking_process_orders/${this.cooking_process_order.cooking_process_order.id}`;
        try {
          const response = await this.$axios.$put(
            editUrl,
            { cooking_process_order: cookingProcessOrderData }
          );
          this.openSnackBar("調理工程を編集しました");
          this.reload();
          this.closeEditModal();
        } catch (error) {
          this.openSnackBar(
            "エラーが発生しました: " + error.response.data.message
          );
        }
      } else {
        // 新しい調理工程を登録
        const postUrl = `/cooking_process_orders`;
        try {
          const response = await this.$axios.$post(
            postUrl,
            { cooking_process_order: cookingProcessOrderData }
          );
          this.openSnackBar("調理工程を登録しました");
          this.reload();
          this.closeEditModal();
        } catch (error) {
          this.openSnackBar(
            "エラーが発生しました: " + error.response.data.message
          );
        };
      }
    },
    async destroy() {
      const delUrl =
        "/cooking_process_orders/" + this.cooking_process_order.cooking_process_order.id;
      await this.$axios.$delete(delUrl);
      this.$router.push("/cooking_process_order");
    },
  },
};
</script>

<style scoped>
td {
  width: 70%;
}
th {
  width: 15%;
}

.radio-group {
  display: flex;
  align-items: center;
  justify-content: left;
  flex-flow: row nowrap;
  width: 500px;
}
</style>
