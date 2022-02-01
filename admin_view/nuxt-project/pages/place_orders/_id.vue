<template>
  <div class="main-content">
    <SubHeader
      v-bind:pageTitle="placeOrder.group.name"
      pageSubTitle="会場申請一覧"
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

          <VerticalTable>
            <tr>
              <th>ID</th>
              <td>{{ placeOrder.place_order.id }}</td>
            </tr>
            <tr>
              <th>団体名</th>
              <td>{{ placeOrder.group.name }}</td>
            </tr>
            <tr>
              <th>第一希望</th>
              <td>{{ placeOrder.place_order_name.first }}</td>
            </tr>
            <tr>
              <th>第二希望</th>
              <td>{{ placeOrder.place_order_name.second }}</td>
            </tr>
            <tr>
              <th>第三希望</th>
              <td>{{ placeOrder.place_order_name.third }}</td>
            </tr>
            <tr>
              <th>備考</th>
              <td>{{ placeOrder.place_order.remark }}</td>
            </tr>
            <tr>
              <th>登録日時</th>
              <td>{{ placeOrder.place_order.created_at | formatDate }}</td>
            </tr>
            <tr>
              <th>編集日時</th>
              <td>{{ placeOrder.place_order.updated_at | formatDate }}</td>
            </tr>
          </VerticalTable>
        </Row>
      </Card>
    </Row>

{{ placeOrder }}

    <EditModal
      @close="closeEditModal"
      v-if="isOpenEditModal"
      title="会場申請の編集"
    >
      <template v-slot:form>
        <div>
          <h3>団体名</h3>
          <select v-model="groupID">
            <option disabled value="">選択してください</option>
            <option
              v-for="group in groupList"
              :key="group.id"
              :value="group.id"
            >
              {{ group.name }}
            </option>
          </select>
        </div>
        <div>
          <h3>第一希望</h3>
          <select v-model="firstPlaceOrder">
            <option disabled value="">選択してください</option>
            <option
              v-for="place in placeList"
              :key="place.id"
              :value="place.id"
            >
              {{ place.name }}
            </option>
          </select>
        </div>
        <div>
          <h3>第二希望</h3>
          <select v-model="secondPlaceOrder">
            <option disabled value="">選択してください</option>
            <option
              v-for="place in placeList"
              :key="place.id"
              :value="place.id"
            >
              {{ place.name }}
            </option>
          </select>
        </div>
        <div>
          <h3>第三希望</h3>
          <select v-model="thirdPlaceOrder">
            <option disabled value="">選択してください</option>
            <option
              v-for="place in placeList"
              :key="place.id"
              :value="place.id"
            >
              {{ place.name }}
            </option>
          </select>
        </div>
        <div>
          <h3>備考</h3>
          <textarea v-model="remark" placeholder="入力してください" />
        </div>
      </template>
      <template v-slot:method>
        <CommonButton iconName="edit" :on_click="edit">編集</CommonButton>
      </template>
    </EditModal>

    <DeleteModal
      @close="closeDeleteModal"
      v-if="isOpenDeleteModal"
      title="会場申請の削除"
    >
      <template v-slot:method>
        <YesButton iconName="delete" :on_click="destroy">はい</YesButton>
        <NoButton iconName="close" :on_click="closeDeleteModal"
          >いいえ</NoButton
        >
      </template>
    </DeleteModal>
  </div>
</template>

<script>
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
      firstPlaceOrder: null,
      secondPlaceOrder: null,
      thirdPlaceOrder: "",
      placeOrder: []
    };
  },
  async asyncData({ $axios, route }) {
    const routeId = route.path.replace("/place_orders/", "");
    const url = "/api/v1/get_place_order_show_for_admin_view/" + routeId;
    const response = await $axios.$get(url);
    return {
      placeOrder: response.data,
      routeId: routeId,
    };
  },
  methods: {
    edit (){
      const url = "/place_orders/" + this.routeId + "?group_id=" + this.groupID + "&first=" + this.firstPlaceOrder + "&second=" + this.secondPlaceOrder + "&third=" + this.thirdPlaceOrder + "&remark=" + this.remark
      this.$axios.$put(url).then((response) => {
        this.reload(response.data.id);
        this.closeEditModal()
      });
    },
    async reload (id) {
      const url = "/api/v1/get_place_order_show_for_admin_view/" + id;
      const resPlaceOrder = await this.$axios.$get(url);
      this.placeOrder = resPlaceOrder.data
    },
    async destroy() {
      const url = "/place_orders/" + this.routeId
      await this.$axios.$delete(url)
      this.$router.push("/place_orders");
    },
    async openEditModal() {
      const url = "/api/v1/get_groups_refinemented_by_current_fes_year"
      const resGroups = await this.$axios.$get(url)
      this.groupList = resGroups.data
      this.groupID = this.placeOrder.group.id
      const placesUrl = "/places"
      const resPlaces = await this.$axios.$get(placesUrl)
      this.placeList = resPlaces.data
      this.firstPlaceOrder = this.placeOrder.place_order.first
      this.secondPlaceOrder = this.placeOrder.place_order.second
      this.thirdPlaceOrder = this.placeOrder.place_order.third
      this.remark = this.placeOrder.place_order.remark
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
  },
};
</script>
