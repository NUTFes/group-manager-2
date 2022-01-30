<template>
  <div class="main-content">

    <SubHeader
      v-bind:pageTitle="placeOrder.group.name"
      pageSubTitle="会場申請一覧"
    >
      <CommonButton iconName="edit" :on_click="openEditModal"> 編集 </CommonButton>
      <CommonButton iconName="delete" :on_click="openDeleteModal"> 削除 </CommonButton>
    </SubHeader>

    <Row>
      <Card padding="40px 150px" gap="20px">
        <Row justify="start">
          <h4>基本情報</h4>

            <VerticalTable>
            <tr>
              <th>ID</th><td>{{ placeOrder.place_order.id }}</td>
            </tr>
            <tr>
              <th>団体名</th><td>{{ placeOrder.group.name }}</td>
            </tr>
            <tr>
              <th>第一希望</th><td>{{ placeOrder.place_order_name.first }}</td>
            </tr>
            <tr>
              <th>第二希望</th><td>{{ placeOrder.place_order_name.second }}</td>
            </tr>
            <tr>
              <th>第三希望</th><td>{{ placeOrder.place_order_name.third }}</td>
            </tr>
            <tr>
              <th>備考</th><td>{{ placeOrder.place_order.remark }}</td>
            </tr>
            <tr>
              <th>登録日時</th><td>{{ placeOrder.place_order.created_at | formatDate }}</td>
            </tr>
            <tr>
              <th>編集日時</th><td>{{ placeOrder.place_order.updated_at | formatDate }}</td>
            </tr>
          </VerticalTable>

        </Row>
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
        <CommonButton iconName="edit" :on_click="editGroup"
        >登録</CommonButton
      >
      </template>
    </EditModal>

    <DeleteModal
      @close="closeDeleteModal"
      v-if="isOpenDeleteModal"
      title="参加団体申請の削除"
    >
      <template v-slot:method>
        <YesButton iconName="delete" :on_click="deleteGroup">はい</YesButton>
        <NoButton iconName="close" :on_click="closeDeleteModal">いいえ</NoButton>
      </template>
    </DeleteModal>

  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      headers: [
        "ID",
        "参加団体",
        "第一希望",
        "第二希望",
        "第三希望",
        "備考",
        "登録日時",
        "編集日時",
      ],
      isOpenEditModal: false,
      isOpenDeleteModal: false,
    };
  },
  async asyncData({ $axios, route }) {
    const routeId = route.path.replace("/place_orders/", "");
    const url = "/api/v1/get_place_order_show_for_admin_view/" + routeId;
    const response = await $axios.$get(url);
    return {
      placeOrder: response.data,
      route: url,
    };
  },
  computed: {
    ...mapState({
      selfRoleId: (state) => state.users.role,
    }),
  },
  methods: {
    reload: function () {
      const url = "/api/v1/get_place_order/" + this.$route.params.id;
      this.$axios
        .get(url, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.place_order = response.data.place_order;
          this.power_orders = response.data.power_orders;
          this.total_power = response.data.total_power;
          this.group_id = response.data.place_order.group_id;
          this.group_name = response.data.group_name;
          this.first = response.data.first;
          this.second = response.data.second;
          this.third = response.data.third;
          this.first_id = response.data.place_order.first;
          this.second_id = response.data.place_order.second;
          this.third_id = response.data.place_order.third;
          this.remark = response.data.place_order.remark;
        });
    },
    edit_dialog_open: function () {
      this.$axios
        .get("/places", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.places = response.data;
        });
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
      const edit_url =
        "/place_orders/" +
        this.place_order.id +
        "?group_id=" +
        this.group_id +
        "&first=" +
        this.first_id +
        "&second=" +
        this.second_id +
        "&third=" +
        this.third_id +
        "&remark=" +
        this.remark;
      console.log(edit_url);
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
      const url = "/place_orders/" + this.$route.params.id;
      this.$axios.delete(url);
      this.$router.push("/place_orders");
    },
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
      const reUrl =  this.groupUrl
      const reGroupRes = await this.$axios.$get(reUrl);
      this.group = reGroupRes.data;
    },
    async editGroup() {
      console.log(this.group.group.id)
      const putGroupUrl = "/groups/" + this.group.group.id +
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
      console.log(putGroupUrl)

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
