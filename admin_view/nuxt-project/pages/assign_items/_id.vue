<template>
  <div>
    <SubHeader pageSubTitle="物品申請" pageTitle="物品申請割り当てページ">
      <CommonButton iconName="edit" :on_click="openPlaceEditModal">
        編集
      </CommonButton>
      <CommonButton iconName="delete" :on_click="openPlaceDeleteModal">
        削除
      </CommonButton>
    </SubHeader>
    <br />
    <Row wrap="nowrap" align="start">
      <Column width="100%">
        <Card width="50%">
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
            </template>
            <template v-slot:table-body>
              <tr
                v-for="(list, index) in stockerItems"
                :key="index"
                @click="
                  () =>
                    $router.push({
                      path: '/stocker_items/' + list.stocker_item.id
                    })
                
                "
              >
                <td>{{ list.rental_item_id }}</td>
                <td>{{ list.num }}</td>
                <td><CommonButton iconName="edit" :on_click="openItemEditModal">編集</CommonButton></td>
                <td><CommonButton iconName="delete" :on_click="openItemDeleteModal">削除</CommonButton></td>
              </tr>
            </template>
          </Table>
        </Card>
        <Card width="50%">
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
                v-for="(list, index) in edited_assign_item"
                :key="index"
              >
                <td>{{ list.id }}</td>  
                <td>{{ list.name }}</td>  
                <td>{{ list.item }}</td>  
                <td>{{ list.num }}</td>  
                <td><CommonButton iconName="edit" :on_click="openAssignEditModal">編集</CommonButton></td>
                <td><CommonButton iconName="delete" :on_click="openAssignDeleteModal">削除</CommonButton></td>  
            </tr>
            </template>
          </Table>
        </Card>
        <Row>
          <SelectBox
            :nameList="status_name"
            on_click="reload"
            value="name"
            initialValue="完了"
          >
            {{ refRole }}
          </SelectBox>
          <SelectBox
            :nameList="status_name"
            value="name"
            initialValue="未登録"
          >
            {{ refRole }}
          </SelectBox>
        </Row>
      </Column>
      <Column width="50%">
        <Card width="50%">
          <SubHeader pageTitle="その他データ">
            <CommonButton>
              追加
            </CommonButton>
          </SubHeader>
          <Table>
            <template v-slot:table-header>
              <th v-for="(header, index) in stocker_headers" v-bind:key="index">
                {{ header }}
              </th>
            </template>
            <template v-slot:table-body>
              <tr
                v-for="(list, index) in stocker_place.data"
                :key="index"
              >
                <td>{{ list.id }}</td>
                <td>{{ list.name }}</td>
                <td>{{ list.stock_item_status === 1 ? "未登録" : stocker_place.stock_item_status === 2 ? "登録中" : "登録完了" }}</td>
                <td>{{ list.assign_item_status === 1 ? "未登録" : stocker_place.stock_item_status === 2 ? "登録中" : "登録完了" }}</td>
              </tr>
            </template>
          </Table>
        </Card>
      </Column>
    </Row>

    <AddModal
      @close="closeItemAddModal"
      v-if="isOpenItemAddModal"
      title="在庫物品の追加"
    >
      <template v-slot:form>
        <div>
          <h3>物品名</h3>
          <select v-model="items">
            <option
              v-for="i in items"
              :key="i.id"
              :value="i.id"
            >
            {{ i.name }}
            </option>
          </select>
        </div>
        <div>
          <h3>個数</h3>
          <input v-modal="itemNum" placeholder="入力してください" />
        </div>
      </template>
      <template v-slot:method>
        <CommonButton iconName="add_circle" :on_click="submit">登録</CommonButton>
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
          <select v-model="appGroup">
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
          <h3>物品名</h3>
          <select v-model="items">
            <option
              v-for="i in items"
              :key="i.id"
              :value="i.id"
            >
            {{ i.name }}
            </option>
          </select>
        </div>
        <div>
          <h3>個数</h3>
          <input v-modal="itemNum" placeholder="入力してください" />
        </div>
      </template>
      <template v-slot:method>
        <CommonButton iconName="add_circle" :on_click="submit">登録</CommonButton>
      </template>
    </AddModal>

    <EditModal
      @close="closePlaceEditModal"
      v-if="isOpenPlaceEditModal"
      title="在庫場所編集"
    >
      <template v-slot:form>
        <div>
          <h3>在庫場所</h3>
          <textarea v-modal="stockerPlace" placeholder="入力してください" />
        </div>
      </template>
      <template v-slot:method>
        <CommonButton iconName="edit" :on_click="edit">編集</CommonButton>
      </template>
    </EditModal>
    
    <EditModal
      @close="closeItemEditModal"
      v-if="isOpenItemEditModal"
      title="在庫物品編集"
    >
      <template v-slot:form>
        <div>
          <h3>物品名</h3>
          <select v-model="items">
            <option
              v-for="i in items"
              :key="i.id"
              :value="i.id"
            >
            {{ i.name }}
            </option>
          </select>
        </div>
        <div>
          <h3>個数</h3>
          <input v-modal="itemNum" placeholder="入力してください" />
        </div>
      </template>
      <template v-slot:method>
        <CommonButton iconName="edit" :on_click="edit">編集</CommonButton>
      </template>
    </EditModal>
     
    <EditModal
      @close="closeAssignEditModal"
      v-if="isOpenAssignEditModal"
      title="割当編集"
    >
      <template v-slot:form>
        <div>
          <h3>団体名</h3>
          <select v-model="appGroup">
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
          <h3>物品名</h3>
          <select v-model="items">
            <option
              v-for="i in items"
              :key="i.id"
              :value="i.id"
            >
            {{ i.name }}
            </option>
          </select>
        </div>
        <div>
          <h3>個数</h3>
          <input v-modal="itemNum" placeholder="入力してください" />
        </div>
      </template>
      <template v-slot:method>
        <CommonButton iconName="edit" :on_click="edit">編集</CommonButton>
      </template>
    </EditModal>
    
    <DeleteModal
      @close="closePlaceDeleteModal"
      v-if="isOpenPlaceDeleteModal"
      title="在庫場所の削除"
    >
      <template v-slot:method>
        <YesButton iconName="delete" :on_click="destroy">はい</YesButton>
        <NoButton iconName="close" :on_click="closeDeleteModal"
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
        <YesButton iconName="delete" :on_click="destroy">はい</YesButton>
        <NoButton iconName="close" :on_click="closeDeleteModal"
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
        <YesButton iconName="delete" :on_click="destroy">はい</YesButton>
        <NoButton iconName="close" :on_click="closeDeleteModal"
          >いいえ</NoButton
        >
      </template>
    </DeleteModal> 

  </div>
</template>

<script>
import ItemOrders from "~/components/ItemOrders.vue";
import InTableButton from '../../components/InTableButton.vue';
import EditModal from "../../components/EditModal.vue";
export default {
  watchQuery: ["page"],
  components: {
    ItemOrders,
    InTableButton,
    EditModal
},
  data() {
    return {
      rental_item: [],
      rental_headers: [
        "物品名",
        "個数",
      ],
      stocker_place: [],
      stocker_headers: [
        "団体名",
        "物品",
        "個数",
      ],
      assignStatus: [
        { id: 1, name: "未登録" },
        { id: 2, name: "登録中" },
        { id: 3, name: "登録完了" },
      ],
      items: [
        { id: 1, name: "机" },
        { id: 2, name: "長机" },
        { id: 3, name: "木の椅子" },
        { id: 4, name: "パイプの椅子" },
        { id: 5, name: "テント" },
        { id: 6, name: "パーテーション"},
        { id: 7, name: "掲示板"},
        { id: 8, name: "暗幕"},
        { id: 9, name: "椅子"},
        { id: 10, name: "テント"},
        { id: 11, name: "パーテーション足"},
      ],
      isOpenItemAddModal: false,
      isOpenAssignAddModal: false,
      isOpenPlaceEditModal: false,
      isOpenItemEditModal: false,
      isOpenAssignEditModal: false,
      isOpenPlaceDeleteModal: false,
      isOpenItemDeleteModal: false,
      isOpenAssignDeleteModal: false,
      stockerItems: [],
      stockerPlace: [],
      itemName: [],
      group_name: [],
      item: [],
      num: [],
      groups: [],
      group_id: [],
      rental_item: [],
      assign_num: [],
      assign_items: [],
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
      edited_stocker_item: {
        id: "",
        item: "",
        num: "",
      },
      edited_assign_item: {
        id: "",
        group: "",
        item: "",
        num: "",
      },
      status_name: [
        { id: 1, name: "未着手" },
        { id: 2, name: "入力中" },
        { id: 3, name: "完了" },
      ],
      rules: {
        required: (value) => !!value || "入力してください",
      },
    };
  },
  mounted() {
    console.log("aaaa")
    // axios
    this.$axios
      .get("stocker_places/", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.stocker_place = response.data;
        consple.log(response)
      });
    this.$axios
      .get("rental_items/", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.rental_item = response.data;
        consple.log(response)
      });
    this.$axios
      .get("groups/", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.group = response.data;
        consple.log(response)
      });
  },

  methods: {
    openItemAddModal() {
      this.isOpenItemAddModal = false;
      this.isOpenItemAddModal = true;
    },
    closeItemAddModal() {
      this.isOpenItemAddModal = false;
    },
    openAssignAddModal() {
      this.isOpenAssignAddModal = false;
      this.isOpenAssignAddModal = true;
    },
    closeAssignAddModal() {
      this.isOpenAssignAddModal = false;
    },
    openPlaceEditModal() {
      this.isOpenPlaceEditModal = false;
      this.isOpenPlaceEditModal = true;
    },
    closePlaceEditModal() {
      this.isOpenPlaceEditModal = false;
    },
    openItemEditModal() {
      this.isOpenItemEditModal = false;
      this.isOpenItemEditModal = true;
    },
    closeItemEditModal() {
      this.isOpenItemEditModal = false;
    },
    openAssignEditModal() {
      this.isOpenAssignEditModal = false;
      this.isOpenAssignEditModal = true;
    },
    closeAssignEditModal() {
      this.isOpenAssignEditModal =false;
    },
    openPlaceDeleteModal() {
      this.isOpenPlaceDeleteModal = false;
      this.isOpenPlaceDeleteModal = true;
    },
    closePlaceDeleteModal() {
      this.isOpenPlaceDeleteModal = false;
    },
    openItemDeleteModal() {
      this.isOpenItemDeleteModal = false;
      this.isOpenItemDeleteModal = true;
    },
    closeItemDeleteModal() {
      this.isOpenItemDeleteModal = false;
    },
    openAssignDeleteModal() {
      this.isOpenAssignDeleteModal = false;
      this.isOpenAssignDeleteModal = true;
    },
    closeAssignDeleteModal() {
      this.isOpenAssignDeleteModal = false;
    },
    get_items: function () {
      this.$axios
        .get("api/v1/get_item_name", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.item_name = response.data;
        });
    },
    get_groups: function () {
      this.$axios
        .get("api/v1/get_group_name", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.group_name = response.data;
        });
    },
    open_stocker: function () {
      this.stocker_dialog = true;
      this.get_items();
    },
    open_assign: function () {
      this.assign_dialog = true;
      this.get_items();
      this.get_groups();
    },
    stocker_reload: function () {
      this.$axios
        .get(
          "api/v1/get_stocker_item_for_stocker_place/" + this.$route.params.id,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          this.stocker_items = response.data;
        });
    },
    stocker_place_reload: function () {
      this.$axios
        .get("stocker_places/" + this.$route.params.id, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.stocker_place = response.data;
          this.stock_item_status = response.data.stock_item_status;
          this.assign_item_status = response.data.assign_item_status;
        });
    },
    assign_reload: function () {
      this.$axios
        .get(
          "api/v1/get_assign_rental_item_for_stocker_place/" +
            this.$route.params.id,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          this.assign_items = response.data;
        });
    },
    submit: function () {
      this.$axios.defaults.headers.common["Content-Type"] = "application/json";
      let params = new URLSearchParams();
      params.append("rental_item_id", this.item);
      params.append("stocker_place_id", this.$route.params.id);
      params.append("fes_year_id", 1);
      params.append("num", this.num);
      this.$axios.post("/stocker_items", params).then(
        (response) => {
          console.log("response:", response);
          this.stocker_dialog = false;
          this.stocker_reload();
          this.item = [];
          this.num = [];
        },
        (error) => {
          console.log("登録できませんでした");
          return error;
        }
      );
    },

    // 物品の割り当て
    assign: function () {
      this.$axios.defaults.headers.common["Content-Type"] = "application/json";
      let params = new URLSearchParams();
      params.append("group_id", this.group_id);
      params.append("rental_item_id", this.rental_item);
      params.append("num", this.assign_num);
      params.append("stocker_place_id", this.$route.params.id);
      this.$axios.post("/assign_rental_items", params).then(
        (response) => {
          console.log("response:", response);
          this.assign_dialog = false;
          this.group_id = [];
          this.rental_item = [];
          this.assign_num = [];
          this.assign_reload();
        },
        (error) => {
          console.log("登録できませんでした");
          return error;
        }
      );
    },
    // 在庫物品の編集ダイアログを表示
    open_edit_stocker_item: function (item) {
      this.get_items();
      this.edited_stocker_item.id = item.id;
      this.edited_stocker_item.num = item.num;
      for (var i = 0; i < this.item_name.length; i++) {
        if (this.item_name[i].name === item.item) {
          this.edited_stocker_item.item = this.item_name[i].id;
        }
      }
      this.stocker_edit_dialog = true;
    },
    // 在庫物品の編集
    edit_stocker_item: function () {
      const edit_url =
        "/stocker_items/" +
        this.edited_stocker_item.id +
        "?rental_item_id=" +
        this.edited_stocker_item.item +
        "&stocker_place_id=" +
        this.stocker_place.id +
        "&fes_year_id=1&num=" +
        this.edited_stocker_item.num;
      this.$axios
        .put(edit_url, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log(response);
          this.stocker_edit_dialog = false;
          this.stocker_reload();
        });
    },
    // 在庫物品の削除
    delete_stocker_item: function (item) {
      console.log(item.id);
      const delete_url = "/stocker_items/" + item.id;
      this.$axios
        .delete(delete_url, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log(response);
          this.stocker_reload();
        });
    },
    // 割り当て物品の編集のダイアログの表示
    open_edit_assign_item: function (item) {
      this.get_items();
      for (var i = 0; i < this.item_name.length; i++) {
        if (this.item_name[i].name === item.item) {
          this.edited_assign_item.item = this.item_name[i].id;
        }
      }
      this.get_groups();
      for (var i = 0; i < this.group_name.length; i++) {
        if (this.group_name[i].name === item.group) {
          this.edited_assign_item.group = this.group_name[i].id;
        }
      }
      this.edited_assign_item.id = item.id;
      this.edited_assign_item.num = item.num;
      this.assign_edit_dialog = true;
    },
    // 物品割り当ての編集
    edit_assign_item: function () {
      const edit_url =
        "/assign_rental_items/" +
        this.edited_assign_item.id +
        "?group_id=" +
        this.edited_assign_item.group +
        "&rental_item_id=" +
        this.edited_assign_item.item +
        "&num=" +
        this.edited_assign_item.num +
        "&stocker_place_id=" +
        this.stocker_place.id;
      this.$axios
        .put(edit_url, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log(response);
          this.assign_edit_dialog = false;
          this.assign_reload();
        });
    },
    // 物品割り当ての削除
    delete_assign_item: function (item) {
      const delete_url = "/assign_rental_items/" + item.id;
      this.$axios
        .delete(delete_url, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log(response);
          this.assign_reload();
        });
    },
    // 在庫ステータス更新
    update_stock_status: function () {
      const update_stock_url =
        "/stocker_places/" +
        this.stocker_place.id +
        "?stock_item_status=" +
        this.stock_item_status;
      this.$axios
        .put(update_stock_url, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log(response);
          this.stocker_place_reload();
          this.stock_item_status_dialog = false;
        });
    },
    // 割り当てステータス更新
    update_assign_status: function () {
      const update_assign_url =
        "/stocker_places/" +
        this.stocker_place.id +
        "?assign_item_status=" +
        this.assign_item_status;
      this.$axios
        .put(update_assign_url, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log(response);
          this.stocker_place_reload();
          this.assign_item_status_dialog = false;
        });
    },
  },
};
</script>
