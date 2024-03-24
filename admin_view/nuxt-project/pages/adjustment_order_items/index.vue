<template>
  <div class="main-content">
    <SubHeader pageTitle="物品申請数調整" />
    <Row wrap="nowrap" align="start">
      <Column width="40%" height="800px">
        <Card width="100%" style="overflow: scroll">
          <SubHeader pageTitle="物品総数" />
          <Table>
            <template v-slot:table-header>
              <th v-for="(header, index) in itemHeaders" v-bind:key="index">
                {{ header }}
              </th>
            </template>
            <template v-slot:table-body>
              <tr
                v-for="(stocker_place, index) in stockerPlaces"
                :key="index"
              >
                <td>{{ stocker_place.itemName }}</td>
                <td>{{ stocker_place.requestedAmount }}</td>
                <td>{{ stocker_place.stockAmount }}</td>
                <td :class="{ 'warning': calculateDifference(stocker_place) < 0 }">
                  {{ calculateDifference(stocker_place) }}
                </td>
              </tr>
            </template>
          </Table>
        </Card>
      </Column>
      <Column width="60%" height="800px">
        <Card width="100%" style="overflow: scroll">
          <SubHeader pageTitle="物品申請一覧" />
          <div class="search-dropdowns">
            <SearchDropDown
              :nameList="yearList"
              :on_click="refinementGroups"
              value="year_num"
            >
              団体名
            </SearchDropDown>
            <SearchDropDown
              :nameList="groupCategories"
              :on_click="refinementGroups"
              value="name"
            >
              物品名
            </SearchDropDown>
          </div>

          <Table>
            <template v-slot:table-header>
              <th v-for="(header, index) in groupHeaders" v-bind:key="index">
                {{ header }}
              </th>
            </template>
            <template v-slot:table-body>
              <tr
                v-for="(stocker_place, index) in stockerPlaces"
                :key="index"
                @click="openModal(stocker_place)"
              >
                <td>{{ stocker_place.groupName }}</td>
                <td>{{ stocker_place.itemName }}</td>
                <td>{{ stocker_place.requestedAmount }}</td>
                <td>
                  <Button
                    iconName="delete"
                    @click.stop="deleteItem(stocker_place.id)"
                  >
                    削除
                  </Button>
                </td>
              </tr>
            </template>
          </Table>
        </Card>
      </Column>
    </Row>

    <AddModal @close="closeModal" v-if="isModalOpen" title="物品申請数調整">
      <template v-slot:form>
        <div>
          <h3>団体名</h3>
          <input v-model="groupName" placeholder="入力してください" />
        </div>
        <div>
          <h3>物品名</h3>
          <input v-model="itemName" placeholder="入力してください" />
        </div>
        <div>
          <h3>申請数</h3>
          <input
            v-model="requestedAmount"
            type="number"
            placeholder="入力してください"
          />
        </div>
      </template>
      <template v-slot:method>
        <CommonButton iconName="add_circle" :on_click="submitItem"
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
      stockerPlaces: [
        {
          id: 1,
          groupName: "団体A",
          itemName: "テント",
          requestedAmount: 10,
          stockAmount: 5,
        },
        {
          id: 2,
          groupName: "団体B",
          itemName: "テーブル",
          requestedAmount: 5,
          stockAmount: 10,
        },
      ],
      itemHeaders: ["物品名", "申請数", "在庫総数", "差分"],
      groupHeaders: ["団体名", "物品名", "申請数", ""],
      stocker_place: [],
      roomName: [],
      roomNameList: [],
      stockItemStatus: [],
      assignItemStatus: [],
      isModalOpen: false,
      groupName: "",
      itemName: "",
      requestedAmount: null,
      warningStatus: {},
    };
  },

  // async asyncData({ $axios }) {
  //   const stockerPlacesUrl = "/stocker_places";
  //   const stockerPlacesRes = await $axios.$get(stockerPlacesUrl);
  //   return {
  //     stockerPlaces: stockerPlacesRes.data,
  //   };
  // },
  // computed: {
  //   ...mapState({
  //     roleID: (state) => state.users.role,
  //   }),
  // },
  methods: {
    calculateDifference(stocker_place) {
      return stocker_place.requestedAmount - stocker_place.stockAmount;
    },
    setWarningStatus(index) {
      const difference = this.calculateDifference(this.stockerPlaces[index]);
      this.$set(this.warningStatus, index, difference < 0);
    },
    openModal(stocker_place) {
      this.groupName = stocker_place.groupName || "";
      this.itemName = stocker_place.itemName || "";
      this.requestedAmount = stocker_place.requestedAmount || null;
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    submitItem() {
      const url = "/path/to/your/api";
      const payload = {
        groupName: this.groupName,
        itemName: this.itemName,
        requestedAmount: this.requestedAmount,
      };
      this.$axios
        .$post(url, payload)
        .then(() => {
          this.closeModal();
        })
        .catch((error) => {
          console.error("エラー発生:", error);
        });
    },
    reload(id) {
      const url = "/stocker_places/" + id;
      this.$axios
        .$get(url)
        .then((response) => {
          this.stocker_place.data.push(response.data);
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
      console.log(this.stocker_place);
    },
  },
};
</script>

<style>
.search-dropdowns {
  display: flex;
  justify-content: flex-start;
  gap: 20px;
  width: 100%;
  align-items: start;
  padding-bottom: 20px;
}
.warning {
  text-align: center;
  vertical-align: middle;
  padding: 25px;
  background-color: #ffac5d; 
}
.normal-table td.warning:hover {
  background-color: #ffac5d !important;
  background: none;
  -webkit-background-clip: initial !important;
  -webkit-text-fill-color: black !important;
}
</style>