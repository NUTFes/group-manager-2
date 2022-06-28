<template>
  <div class="main-content">
    <SubHeader pageTitle="在庫場所">
      <CommonButton iconName="add_circle" :on_click="openAddModal">
        追加   
      </CommonButton>
    </SubHeader>
    
    <Card width="100%">
      <Table>
        <template v-slot:table-header>
          <th v-for="(header, index) in headers" v-bind:key="index">
            {{ header }}
          </th>
        </template>
        <template v-slot:table-body>
          <tr
            v-for="(stocker_place, index) in stocker_place.data"
            :key="index"
            @click="() => $router.push({ path: `/assign_items/` + stocker_place.id })"
          >
            <td>{{ stocker_place.id }}</td>
            <td>{{ stocker_place.name }}</td>
            <td>{{ stocker_place.stock_item_status }}</td>
            <td>{{ stocker_place.assign_item_status }}</td>
          </tr>
        </template>
      </Table>
    </Card>

    <AddModal
      @close="closeAddModal"
      v-if="isOpenAddModal"
      title="在庫場所の追加"
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
              {{assignItemStatus.name}}
            </option>
          </select>
        </div>
      </template>  
      <template v-slot:method>
        <CommonButton iconName="add_circle" :on_click="submit"
          >登録</CommonButton
        >
      </template>
    </AddModal>
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
              "部屋名",
              "在庫登録",
              "割当",
          ],
          isOpenAddModal: false,
          stocker_place: [],
          roomName: [],
          roomNameList: [],
          stockItemStatus: [],
          assignItemStatus: [],
          stockItemStatusList: [
            { id: 1, name: "未登録" },
            { id: 2, name: "登録中" },
            { id: 3, name: "登録完了" },
          ],
          assignItemStatusList: [
            { id: 1, name: "未登録" },
            { id: 2, name: "登録中" },
            { id: 3, name: "登録完了" },
          ],
      };
  },

  mounted() {
    this.$axios
      .get("stocker_places/", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.stocker_place = response.data;
        // this.stock_item_status = response.data.stock_item_status;
        // this.assign_item_status = response.data.assign_item_status;
      });
  },
  computed: {
    ...mapState({
      roleID: (state) => state.users.role,
    }),
  },
  methods: {
    openAddModal() {
      this.isOpenAddModal = false;
      this.isOpenAddModal = true;
    },
    closeAddModal() {
      this.isOpenAddModal = false;
    },
    reload(id) {
      const url = "/assig_items/" + id;
      this.$axios.$get(url).then((response) => {
        this.stockdrPlaces.push(response.data);
      });
    },
    async submit() {
      const postUrl =
        "/stocker_places/" +
        "?name=" +
        this.roomName +
        "&stock_item_status=" +
        this.stockItemStatus +
        "&assign_item_status=" +
        this.assignItemStatus;
      console.log(postUrl);

      this.$axios.$post(postUrl).then((response) => {
        this.roomName = "";
        this.stockItemStatus = "";
        this.assignItemStatus = "";
        this.reload(response.data.id);
        this.closeAddModal();
      });
    },
  },
};
</script>