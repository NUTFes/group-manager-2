<template>
  <div class="main-content">
    <SubHeader
      v-bind:pageTitle="cooking_process_order.group.name"
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
              <td>{{ cooking_process_order.group.id }}</td>
            </tr>
            <tr>
              <th colspan="2">参加団体</th>
              <td>{{ cooking_process_order.group.name }}</td>
            </tr>
            <tr>
              <th rowspan="2">営業前</th>
              <th>調理場</th>
              <td>
                <div
                  v-if="cooking_process_order.cooking_process_order === null"
                >
                  未登録
                </div>
                <div v-else>
                  {{
                    cooking_process_order.cooking_process_order.pre_open_kitchen
                  }}
                </div>
              </td>
            </tr>
            <tr>
              <th>テント内</th>
              <td>
                <div
                  v-if="cooking_process_order.cooking_process_order === null"
                >
                  未登録
                </div>
                <div v-else>
                  {{
                    cooking_process_order.cooking_process_order.pre_open_tent
                  }}
                </div>
              </td>
            </tr>
            <tr>
              <th rowspan="2">営業中</th>
              <th>調理場</th>
              <td>
                <div
                  v-if="cooking_process_order.cooking_process_order === null"
                >
                  未登録
                </div>
                <div v-else>
                  {{
                    cooking_process_order.cooking_process_order
                      .during_open_kitchen
                  }}
                </div>
              </td>
            </tr>
            <tr>
              <th>テント内</th>
              <td>
                <div
                  v-if="cooking_process_order.cooking_process_order === null"
                >
                  未登録
                </div>
                <div v-else>
                  {{
                    cooking_process_order.cooking_process_order.during_open_tent
                  }}
                </div>
              </td>
            </tr>
            <tr>
              <th colspan="2">登録日時</th>
              <td>
                <div
                  v-if="cooking_process_order.cooking_process_order === null"
                >
                  未登録
                </div>
                <div v-else>
                  {{
                    cooking_process_order.cooking_process_order.created_at
                      | formatDate
                  }}
                </div>
              </td>
            </tr>
            <tr>
              <th colspan="2">編集日時</th>
              <td>
                <div
                  v-if="cooking_process_order.cooking_process_order === null"
                >
                  未登録
                </div>
                <div v-else>
                  {{
                    cooking_process_order.cooking_process_order.updated_at
                      | formatDate
                  }}
                </div>
              </td>
            </tr>
          </VerticalTable>
        </Row>
      </Card>
    </Row>

    <EditModal
      @close="closeEditModal"
      v-if="isOpenEditModal"
      title="調理工程申請の編集"
    >
      <template v-slot:form>
        <div>
          <h3>営業前：調理場</h3>
          <input v-model="pre_open_kitchen" placeholder="入力してください" />
        </div>
        <div>
          <h3>営業前：テント内</h3>
          <input v-model="pre_open_tent" placeholder="入力してください" />
        </div>
        <div>
          <h3>営業中：調理場</h3>
          <input v-model="during_open_kitchen" placeholder="入力してください" />
        </div>
        <div>
          <h3>営業中：テント内</h3>
          <input v-model="during_open_tent" placeholder="入力してください" />
        </div>
      </template>
      <template v-slot:method>
        <CommonButton iconName="edit" :on_click="edit">登録</CommonButton>
      </template>
    </EditModal>

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
      groups: [],
      isOpenEditModal: false,
      isOpenDeleteModal: false,
      isOpenSnackBar: false,
      snackMessage: null,
      group_id: null,
      routeId: null,
    };
  },
  computed: {
    ...mapState({
      roleID: (state) => state.users.role,
    }),
  },
  async asyncData({ $axios, route }) {
    const routeId = route.path.replace("/cooking_process_order", "");
    const url = "/api/v1/get_cooking_process_order_for_admin_view/" + routeId;
    const res = await $axios.$get(url);
    return {
      cooking_process_order: res.data[0],
      route: url,
    };
  },
  methods: {
    openEditModal() {
      if (this.cooking_process_order.cooking_process_order) {
        this.group_id = this.cooking_process_order.group.id;
        this.pre_open_kitchen =
          this.cooking_process_order.cooking_process_order.pre_open_kitchen;
        this.pre_open_tent =
          this.cooking_process_order.cooking_process_order.pre_open_tent;
        this.during_open_kitchen =
          this.cooking_process_order.cooking_process_order.during_open_kitchen;
        this.during_open_tent =
          this.cooking_process_order.cooking_process_order.during_open_tent;
        this.isOpenEditModal = true;
      } else {
        this.group_id = this.cooking_process_order.group.id;
        this.pre_open_kitchen = null;
        this.pre_open_tent = null;
        this.during_open_kitchen = null;
        this.during_open_tent = null;
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
      const url = "/api/v1/get_cooking_process_order_for_admin_view/" + id;
      const res = await this.$axios.$get(url);
      this.cooking_process_order = res.data[0];
    },
    async edit() {
      if (
        !this.pre_open_kitchen ||
        !this.pre_open_tent ||
        !this.during_open_kitchen ||
        !this.during_open_tent
      ) {
        this.openSnackBar("調理工程申請を全て入力してください");
        return;
      }
      const cookingProcessOrderData = {
        pre_open_kitchen: this.pre_open_kitchen,
        pre_open_tent: this.pre_open_tent,
        during_open_kitchen: this.during_open_kitchen,
        during_open_tent: this.during_open_tent,
      };
      if (this.cooking_process_order.cooking_process_order) {
        // 既存の調理工程を編集
        const editUrl = `/cooking_process_orders/${this.cooking_process_order.cooking_process_order.id}?group_id=${this.group_id}`;
        try {
          const response = await this.$axios.$put(
            editUrl,
            cookingProcessOrderData
          );
          this.openSnackBar("調理工程を編集しました");
          this.reload(response.data.group_id);
          this.closeEditModal();
        } catch (error) {
          this.openSnackBar(
            "エラーが発生しました: " + error.response.data.message
          );
        }
      } else {
        // 新しい調理工程を登録
        const postUrl = `/cooking_process_orders?group_id=${this.group_id}`;
        try {
          const response = await this.$axios.$post(
            postUrl,
            cookingProcessOrderData
          );
          this.openSnackBar("調理工程を登録しました");
          this.reload(response.data.group_id);
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
</style>
