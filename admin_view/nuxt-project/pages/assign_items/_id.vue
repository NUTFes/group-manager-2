<template>
  <div class="main-content">
    <SubHeader
      v-bind:pageTitle="placeName.name"
      pageSubTitle="物品申請"
    >
      <CommonButton iconName="edit" :on_click="openPlaceEditModal">
        編集
      </CommonButton>
      <CommonButton iconName="delete" :on_click="openPlaceDeleteModal">
        削除
      </CommonButton>
    </SubHeader>

    <Row wrap="nowrap" align="start">
      <Column width="100%">
        <Card width="100%">
          <SubHeader pageTitle="在庫物品">
            <CommonButton iconName="add_circle" :on_click="openItemAddModal">
              追加
            </CommonButton>
          </SubHeader>
          <Table>
            <template v-slot:table-header>
              <th v-for="(header, index) in rental_headers" v-bind:key="index">
                {{ header }}
              </th>
              <th>編集</th>
              <th>削除</th>
            </template>
            <template v-slot:table-body>
              <tr
                v-for="(stockerItem, index) in stockerItems"
                :key="index"
                @click="() => $router.push({ path: `/assign_items/` + id})"
              >
                <td>{{ stockerItem.rental_item.name }}</td>
                <td>{{ stockerItem.stocker_item.num }}</td>
                <td :class="{ warning: warningStatus[index], 'no-hover': warningStatus[index] }">
                    {{ calculateDifference(stockerItem, index) }}
                </td>
                <td><btn  @click="openItemEditModal(stockerItem.stocker_item.id, stockerItem.stocker_item.num)">編集</btn></td>
                <td><btn  @click="openItemDeleteModal(stockerItem.stocker_item.id)">削除</btn></td>
              </tr>
            </template>
          </Table>
        </Card>
        <Card width="100%">
          <SubHeader pageTitle="割り当て">
            <CommonButton iconName="add_circle" :on_click="openAssignAddModal">
              追加
            </CommonButton>
          </SubHeader>
          <Table>
            <template v-slot:table-header>
              <th v-for="(header, index) in stocker_headers" v-bind:key="index">
                {{ header }}
              </th>
              <th>編集</th>
              <th>削除</th>
            </template>
            <template v-slot:table-body>
              <tr
                v-for="(assignRentalItem, index) in assignRentalItems"
                :key="index"
                @click="() => $router.push({ path: '/assign_items/' + id})"
              >
                <td>{{ assignRentalItem.group.name}}</td>
                <td>{{ assignRentalItem.rental_item.name }}</td>
                <td>{{ assignRentalItem.assign_rental_item.num }}</td>
                <td><btn  @click="openAssignEditModal(assignRentalItem.assign_rental_item.id, assignRentalItem.assign_rental_item.num)">編集</btn></td>
                <td><btn  @click="openAssignDeleteModal(assignRentalItem.assign_rental_item.id)">削除</btn></td>
              </tr>
            </template>
          </Table>
        </Card>
      </Column>
      <!-- <Column width="50%">
        <Card width="50%">
          <SubHeader pageTitle="その他データ"></SubHeader>
          <Table>
            <template v-slot:table-header>
              <th v-for="(header, index) in stocker_headers" v-bind:key="index">
                {{ header }}
              </th>
            </template>
            <template v-slot:table-body>
              <tr
                v-for="(list, index) in stockerPlaces"
                :key="index"
              >
                <td>{{ list.id }}</td>
                <td>{{ list.name }}</td>
                <td>{{ list.stock_item_status === 1 ? "未登録" : list.stock_item_status === 2 ? "登録中" : "登録完了" }}</td>
                <td>{{ list.assign_item_status === 1 ? "未登録" : list.assign_item_status === 2 ? "登録中" : "登録完了" }}</td>
              </tr>
            </template>
          </Table>
        </Card>
      </Column> -->
    </Row>

    <AddModal
      @close="closeItemAddModal"
      v-if="isOpenItemAddModal"
      title="在庫物品の追加"
    >
      <template v-slot:form>
        <div>
          <h3>物品名</h3>
          <select v-model="stockerItemName">
            <option disabled value="">選択してください</option>
            <option
              v-for="i in allRentableItems"
              :key="i.id"
              :value="i.id"
            >
              {{ i.name }}
            </option>
          </select>
        </div>
        <div>
          <h3>個数</h3>
          <input v-model="stockerItemNum" type="number" placeholder="入力してください" />
        </div>
        <div>
          <h3>開催年</h3>
          <select v-model="itemFesYear">
            <option disabled value="">選択してください</option>
            <option
              v-for="year in itemYear"
              :key="year.id"
              :value="year.id"
            >
              {{ year.year_num }}
            </option>
          </select>
        </div>
      </template>
      <template v-slot:method>
        <CommonButton iconName="add_circle" :on_click="submitItem">登録</CommonButton>
      </template>
    </AddModal>

    <AddModal
      @close="closeAssignAddModal"
      v-if="isOpenAssignAddModal"
      title="割当の追加"
    >
      <template v-slot:form>
        <div>
          <h3>団体名</h3>
          <select v-model="assignGroup">
            <option disabled value="">選択してください</option>
            <option
              v-for="group in groups"
              :key="group.id"
              :value="group.id"
            >
              {{ group.name }}
            </option>
          </select>
        </div>
        <div>
          <h3>物品名</h3>
          <select v-model="assignItemName">
            <option disabled value="">選択してください</option>
            <option
              v-for="i in stockerItems"
              :key="i.rental_item.id"
              :value="i.rental_item.id"
            >
              {{ i.rental_item.name }}
            </option>
          </select>
        </div>
        <div>
          <h3>個数</h3>
          <input v-model="assignItemNum" type="number" placeholder="入力してください" />
        </div>
      </template>
      <template v-slot:method>
        <CommonButton iconName="add_circle" :on_click="submitAssign">登録</CommonButton>
      </template>
    </AddModal>

    <EditModal
      @close="closePlaceEditModal"
      v-if="isOpenPlaceEditModal"
      title="在庫場所編集"
    >
      <template v-slot:form>
        <div>
          <h3>部屋名</h3>
          <input v-model="roomName" placeholder="入力してください" />
        </div>
        <div>
          <h3>在庫登録</h3>
          <select v-model="stockItemStatus">
            <option disabled value="">選択してください</option>
            <option
              v-for="stockItemStatus in stockItemStatusList"
              :key="stockItemStatus.id"
              :value="stockItemStatus.id"
            >
              {{ stockItemStatus.name }}
            </option>
          </select>
        </div>
        <div>
          <h3>割当</h3>
          <select v-model="assignItemStatus">
            <option disabled value="">選択してください</option>
            <option
              v-for="assignItemStatus in assignItemStatusList"
              :key="assignItemStatus.id"
              :value="assignItemStatus.id"
            >
              {{ assignItemStatus.name }}
            </option>
          </select>
        </div>
      </template>
      <template v-slot:method>
        <CommonButton iconName="edit" :on_click="editPlace">編集</CommonButton>
      </template>
    </EditModal>

    <EditModal
      @close="closeItemEditModal"
      v-if="isOpenItemEditModal"
      title="在庫物品個数の編集"
    >
      <template v-slot:form>
        <div>
          <h3>個数</h3>
          <input v-model="stockerItemNum" type="number" placeholder="入力してください" />
        </div>
      </template>
      <template v-slot:method>
        <CommonButton iconName="edit" :on_click="editItem">編集</CommonButton>
      </template>
    </EditModal>

    <EditModal
      @close="closeAssignEditModal"
      v-if="isOpenAssignEditModal"
      title="割当個数の編集"
    >
      <template v-slot:form>
        <div>
          <h3>個数</h3>
          <input v-model="assignItemNum" type="number" placeholder="入力してください" />
        </div>
      </template>
      <template v-slot:method>
        <CommonButton iconName="edit" :on_click="editAssign">編集</CommonButton>
      </template>
    </EditModal>

    <DeleteModal
      @close="closePlaceDeleteModal"
      v-if="isOpenPlaceDeleteModal"
      title="在庫場所の削除"
    >
      <template v-slot:method>
        <YesButton iconName="delete" :on_click="deletePlace">はい</YesButton>
        <NoButton iconName="close" :on_click="closePlaceDeleteModal"
          >いいえ</NoButton
        >
      </template>
    </DeleteModal>

    <DeleteModal
      @close="closeItemDeleteModal"
      v-if="isOpenItemDeleteModal"
      title="在庫物品の削除"
    >
      <template v-slot:method>
        <YesButton iconName="delete" :on_click="deleteItem">はい</YesButton>
        <NoButton iconName="close" :on_click="closeItemDeleteModal"
          >いいえ</NoButton
        >
      </template>
    </DeleteModal>

    <DeleteModal
      @close="closeAssignDeleteModal"
      v-if="isOpenAssignDeleteModal"
      title="割当の削除"
    >
      <template v-slot:method>
        <YesButton iconName="delete" :on_click="deleteAssign">はい</YesButton>
        <NoButton iconName="close" :on_click="closeAssignDeleteModal"
          >いいえ</NoButton
        >
      </template>
    </DeleteModal>

  </div>
</template>

<style>
  .warning {
    text-align: center;
    vertical-align: middle;
    padding: 25px;
    background-color: #ffac5d; 
  }
  .normal-table td.warning:hover {
    background-color: #ffac5d !important;
    background: none;  /* 線形グラデーションを上書きして無効にします */
    -webkit-background-clip: initial !important;  /* デフォルトの状態に戻します */
    -webkit-text-fill-color: black !important;    /* テキストの色を黒に設定します */
  }
</style>

<script>
import axios from "axios";
import { mapState } from "vuex";
import moment from "moment";

export default {
  watchQuery: ["page"],
  data() {
    return {
      warningStatus: {},
      isWarning: false, 
      assignRentalItemId: null,
      stockerItemId: null,
      stockerItemDeleteId: null,
      assignRentalItemDeleteId: null,
      assignItemName: "",
      assignItemNum: null,
      stockerItemName: "",
      stockerItemNum: null,
      rentableItems: [],
      stockerItems: [],
      stockerPlaces: [],
      groups: [],
      assignGroup: "",
      assignRentalItems: [],
      itemYear: [],
      itemFesYear: "",
      itemStockerPlaceId: "",
			roomName: null,
      refRole: [],
      id: this.$route.params.id,
      rental_headers: [
        "物品名",
        "個数",
        "残数",
      ],
      stocker_headers: [
        "団体名",
        "物品",
        "個数",
      ],
      stockItemStatus: [],
      stockItemStatusList: [
        { id: 1, name: "未登録" },
        { id: 2, name: "登録中" },
        { id: 3, name: "登録完了" },
      ],
      assignItemStatus: [],
      assignItemStatusList: [
        { id: 1, name: "未登録" },
        { id: 2, name: "登録中" },
        { id: 3, name: "登録完了" },
      ],
      isOpenItemAddModal: false,
      isOpenAssignAddModal: false,
      isOpenPlaceEditModal: false,
      isOpenItemEditModal: false,
      isOpenAssignEditModal: false,
      isOpenPlaceDeleteModal: false,
      isOpenItemDeleteModal: false,
      isOpenAssignDeleteModal: false,
      roomName: [],
      stock_item_status: [],
      assign_item_status: [],
      stocker_items_headers: [
        { text: "物品", value: "item" },
        { text: "個数", value: "num" },
        { text: "編集/削除", value: "actions" },
      ],
      assign_items_headers: [
        { text: "ID", value: "id" },
        { text: "参加団体", value: "group" },
        { text: "物品", value: "item" },
        { text: "個数", value: "num" },
        { text: "編集/削除", value: "actions" },
      ],
      statusName: [
        { id: 1, name: "未着手" },
        { id: 2, name: "入力中" },
        { id: 3, name: "完了" },
      ],
      reRole: [],
      rules: {
        required: (value) => !!value || "入力してください",
      },
    };
  },

  //部屋ごとの物品、割当状況を出力
  async asyncData({ $axios, params}) {
    const stockerItemsUrl =
      "/api/v1/get_refinement_stocker_item?stocker_place_id=" +
      params.id;
    const stockerItemsRes = await $axios.$post(stockerItemsUrl);

    const assignRentalItemsUrl =
      "/api/v1/get_refinement_assign_rental_item?stocker_place_id=" +
      params.id;
    const assignRentalItemsRes = await $axios.$post(assignRentalItemsUrl);

    const stockerPlacesUrl = "/stocker_places";
    const stockerPlacesRes = await $axios.$get(stockerPlacesUrl)

    const groupsUrl = "/groups";
    const groupsRes = await $axios.$get(groupsUrl);

    const allRentableItemsUrl = "/api/v1/get_all_rentable_items";
    const allRentableItemsRes = await $axios.$get(allRentableItemsUrl);

    const insideRentableItemsUrl = "/api/v1/get_inside_shop_rentable_items";
    const insideRentableItemsRes = await $axios.$get(insideRentableItemsUrl);

    const outsideRentableItemsUrl = "/api/v1/get_outside_shop_rentable_items";
    const outsideRentableItemsRes = await $axios.$get(outsideRentableItemsUrl);

    const currentYearUrl = "/user_page_settings/1";
    const currentYearRes = await $axios.$get(currentYearUrl);
    const yearsUrl = "/fes_years";
    const yearsRes = await $axios.$get(yearsUrl);
    const currentYears = yearsRes.data.filter(function (element) {
      return element.id == currentYearRes.data.fes_year_id;
    });
    return {
      stockerPlaces: stockerPlacesRes.data,
      stockerItems: stockerItemsRes.data.stocker_items,
			placeName: stockerItemsRes.data.stocker_place,
      assignRentalItems: assignRentalItemsRes.data,
      groups: groupsRes,
      allRentableItems: allRentableItemsRes.data,
      insideRentableItems: insideRentableItemsRes.data,
      outsideRentableItems: outsideRentableItemsRes.data,
      itemYear: yearsRes.data,
      refYearID: currentYearRes.data.fes_year_id,
      refYears: currentYears[0].year_num,
    };
  },
  computed: {
      ...mapState({
      roleID: (state) => state.users.role,
    }),
  },

  methods: {
    calculateDifference(stockerItem, index) {
        const matchingAssignRentalItems = this.assignRentalItems.filter(
            item => item.rental_item.name === stockerItem.rental_item.name
        );
        let difference = stockerItem.stocker_item.num;
        if (matchingAssignRentalItems.length > 0) {
            const totalAssignedNum = matchingAssignRentalItems.reduce(
                (total, item) => total + item.assign_rental_item.num,
                0
            );
            difference = stockerItem.stocker_item.num - totalAssignedNum;
        }
        this.$set(this.warningStatus, index, difference < 0);
        return difference;
      },

    async editPlace() {
      const placeUrl =
        "/stocker_places/" +
        this.id +
        "?name=" +
        this.roomName +
        "&stock_item_status=" +
        this.stockItemStatus +
        "&assign_item_status=" +
        this.assignItemStatus;

      await this.$axios.$put(placeUrl).then((response) => {
        this.closePlaceEditModal();
        this.$router.push("/assign_items")
      })
      .catch(error => {
        console.log(error)
      });
    },

    async deletePlace() {
      const delPlaceUrl = "/stocker_places/" + this.id;
      const delPlaceRes = await this.$axios.$delete(delPlaceUrl);
      this.$router.push("/assign_items");
    },

    async submitItem() {
      const submitItemUrl =
        "/stocker_items/" +
        "?rental_item_id=" +
        this.stockerItemName +
        "&num=" +
        this.stockerItemNum +
        "&fes_year_id=" +
        this.itemFesYear +
        "&stocker_place_id=" +
        this.id;
      console.log(submitItemUrl)
      await this.$axios.$post(submitItemUrl).then((response) => {
        this.stockerItemName = "";
        this.itemFesYear = "";
        this.stockerItemNum = null;
        this.id;
        this.closeItemAddModal();
        location.reload();
      })
      .catch(error => {
        console.log(error)
      });
    },

    async editItem() {
      const itemUrl =
        "/stocker_items/" +
        this.stockerItemId +
        "?num=" +
        this.stockerItemNum +
        "&stocker_place_id=" +
        this.id;

      await this.$axios.$put(itemUrl).then((response) => {
          location.reload();
          this.closeItemEditModal();
      });
    },

    async deleteItem() {
      const delItemUrl = "/stocker_items/" + this.stockerItemDeleteId;
      const delItemRes = await this.$axios.$delete(delItemUrl).then((response) => {
        location.reload();
        this.closeItemEditModal();
      });
    },

    async submitAssign() {
      const assignUrl =
        "/assign_rental_items/" +
        "?group_id=" +
        this.assignGroup +
        "&rental_item_id=" +
        this.assignItemName +
        "&num=" +
        this.assignItemNum +
        "&stocker_place_id=" +
        this.id;
      await this.$axios.$post(assignUrl).then((response) => {
        this.assignGroup = "";
        this.assignItemName = "";
        this.assignItemNum = null;
        this.id;
        console.log(response.data);
        location.reload();
        this.closeAssignAddModal();
      })
      .catch(error => {
        console.log(error)
      });
    },

    async editAssign() {
      const assignUrl =
        "/assign_rental_items/" +
        this.assignRentalItemId +
        "?num=" +
        this.assignItemNum +
        "&stocker_place_id=" +
        this.id;
      await this.$axios.$put(assignUrl).then((response) => {
        location.reload();
        this.closeAssignEditModal();
      });
    },

    async deleteAssign() {
      const delAssignUrl = "/assign_rental_items/" + this.assignRentalItemDeleteId;
      const delAssignRes = await this.$axios.$delete(delAssignUrl);
      location.reload();
      this.closeAssignEditModal();
    },
    openItemAddModal() {
      this.isOpenItemAddModal = false;
      this.isOpenItemAddModal = true;
    },
    closeItemAddModal() {
      this.isOpenItemAddModal = false;
    },
    openAssignAddModal() {
			this.itemFesYear = this.refYearID
      this.isOpenAssignAddModal = false;
      this.isOpenAssignAddModal = true;
    },
    closeAssignAddModal() {
      this.isOpenAssignAddModal = false;
    },
    openPlaceEditModal() {
			this.roomName = this.placeName.name
			this.stockItemStatus = this.placeName.stock_item_status
			this.assignItemStatus = this.placeName.assign_item_status
      this.isOpenPlaceEditModal = false;
      this.isOpenPlaceEditModal = true;
    },
    closePlaceEditModal() {
      this.isOpenPlaceEditModal = false;
    },
    openItemEditModal(id, num) {
      this.stockerItemId = id;
      this.stockerItemNum = num;
      this.isOpenItemEditModal = false;
      this.isOpenItemEditModal = true;
    },
    closeItemEditModal() {
      this.isOpenItemEditModal = false;
    },
    openAssignEditModal(id, num) {
      this.assignRentalItemId = id;
      this.assignItemNum = num;
      this.isOpenAssignEditModal = false;
      this.isOpenAssignEditModal = true;
    },
    closeAssignEditModal() {
      this.isOpenAssignEditModal = false;
    },
    openPlaceDeleteModal() {
      this.isOpenPlaceDeleteModal = false;
      this.isOpenPlaceDeleteModal = true;
    },
    closePlaceDeleteModal() {
      this.isOpenPlaceDeleteModal = false;
    },
    openItemDeleteModal(id) {
      this.stockerItemDeleteId = id;
      this.isOpenItemDeleteModal = false;
      this.isOpenItemDeleteModal = true;
    },
    closeItemDeleteModal() {
      this.isOpenItemDeleteModal = false;
    },
    openAssignDeleteModal(id) {
      this.assignRentalItemDeleteId = id;
      this.isOpenAssignDeleteModal = false;
      this.isOpenAssignDeleteModal = true;
    },
    closeAssignDeleteModal() {
      this.isOpenAssignDeleteModal = false;
    },
  },
};
</script>
