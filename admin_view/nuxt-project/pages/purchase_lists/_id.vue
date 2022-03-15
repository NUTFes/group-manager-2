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
      title="参加団体申請の編集"
    >
      <template v-slot:form>
        <div>
          <h3>団体名</h3>
          <input v-model="groupName" placeholder="入力してください" />
        </div>
        <div>
          <h3>カテゴリー</h3>
          <select v-model="groupCategoryId">
            <option disabled value="">選択してください</option>
            <option
              v-for="category in groupCategories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
        </div>
        <div>
          <h3>企画名</h3>
          <input v-model="projectName" placeholder="入力してください" />
        </div>
        <div>
          <h3>活動内容</h3>
          <textarea v-model="activity" placeholder="入力してください" />
        </div>
        <div>
          <h3>開催年</h3>
          <select v-model="fesYearId">
            <option disabled value="">選択してください</option>
            <option v-for="year in yearList" :key="year.id" :value="year.id">
              {{ year.year_num }}
            </option>
          </select>
        </div>
      </template>
      <template v-slot:method>
        <CommonButton iconName="edit" :on_click="editGroup">登録</CommonButton>
      </template>
    </EditModal>

    <DeleteModal
      @close="closeDeleteModal"
      v-if="isOpenDeleteModal"
      title="参加団体申請の削除"
    >
      <template v-slot:method>
        <YesButton iconName="delete" :on_click="deleteGroup">はい</YesButton>
        <NoButton iconName="close" :on_click="closeDeleteModal"
          >いいえ</NoButton
        >
      </template>
    </DeleteModal>
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
    };
  },
  async asyncData({ $axios, route }) {
    const routeId = route.path.replace("/purchase_lists/", "");
    const url = "/api/v1/get_purchase_list_show_for_admin_view/" + routeId;
    const response = await $axios.$get(url);
    return {
      purchaseList: response.data,
      route: url,
    };
  },
  computed: {
    ...mapState({
      roleID: (state) => state.users.role,
    }),
  },
  methods: {
    openEditModal() {
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
    async reload() {
      const reUrl = this.groupUrl;
      const reGroupRes = await this.$axios.$get(reUrl);
      this.group = reGroupRes.data;
    },
    async editGroup() {
      console.log(this.group.group.id);
      const putGroupUrl =
        "/groups/" +
        this.group.group.id +
        "?name=" +
        this.groupName +
        "&project_name=" +
        this.projectName +
        "&group_category_id=" +
        this.groupCategoryId +
        "&activity=" +
        this.activity +
        "&fes_year_id=" +
        this.fesYearId;
      console.log(putGroupUrl);

      await this.$axios.$put(putGroupUrl).then((response) => {
        this.groupName = "";
        this.projectName = "";
        this.activity = "";
        this.groupCategoryId = "";
        this.fesYearId = "";
        this.reload();
        this.closeEditModal();
      });
    },
    async deleteGroup() {
      const delUrl = "/groups/" + this.$route.params.id;
      const delRes = await this.$axios.$delete(delUrl);
      this.$router.push("/groups");
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
