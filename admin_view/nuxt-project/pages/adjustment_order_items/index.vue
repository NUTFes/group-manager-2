<template>
  <div class="main-content"  v-if="this.$role(roleID).stocker_places.read">
    <SubHeader pageTitle="物品申請数調整">
      <CommonButton v-if="this.$role(roleID).stocker_places.create" iconName="add_circle" :on_click="openAddModal">
        追加
      </CommonButton>
    </SubHeader>

    <SubSubHeader>
      <template v-slot:refinement>
        <SearchDropDown
          :nameList="yearList"
          :on_click="refinementGroups"
          value="year_num"
        >
          {{ refYears }}
        </SearchDropDown>
        <SearchDropDown
          :nameList="groupCategories"
          :on_click="refinementGroups"
          value="name"
        >
          {{ refGroupCategories }}
        </SearchDropDown>
      </template>
    </SubSubHeader>

    <Row wrap="nowrap" align="start">
      <Column width="50%" height="800px">
        <Card width="100%" style="overflow: scroll">
          <Table>
            <template v-slot:table-header>
              <th v-for="(header, index) in itemHeaders" v-bind:key="index">
                {{ header }}
              </th>
            </template>
            <template v-slot:table-body>
              <tr v-for="(stocker_place, index) in stockerPlaces">
                <td>{{ stocker_place.id }}</td>
                <td>{{  }}</td>
                <td>{{  }}</td>
                <td>{{  }}</td>
              </tr>
            </template>
          </Table>
        </Card>
      </Column>
      <Column width="50%" height="800px">
        <Card width="100%" style="overflow: scroll">
          <Table>
            <template v-slot:table-header>
              <th v-for="(header, index) in groupHeaders" v-bind:key="index">
                {{ header }}
              </th>
            </template>
            <template v-slot:table-body>
              <tr v-for="(stocker_place, index) in stockerPlaces">
                <td>{{ stocker_place.id }}</td>
                <td>{{  }}</td>
                <td>{{  }}</td>
                <td>{{  }}</td>
                <td>{{  }}</td>
              </tr>
            </template>
          </Table>
        </Card>
      </Column>
    </Row>

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
      </template>
      <template v-slot:method>
        <CommonButton iconName="add_circle" :on_click="submit"
          >登録</CommonButton
        >
      </template>
    </AddModal>
  </div>
  <h1 v-else>閲覧権限がありません</h1>
</template>

<script>
import { mapState } from "vuex";
export default {
  watchQuery: ["page"],
  data() {
      return {
          itemHeaders: [
              "ID",
              "物品",
              "申請数",
              "在庫数",
              "差分",
          ],
          groupHeaders: [
              "ID",
              "団体名",
              "物品",
              "個数",
              "",
          ],
          isOpenAddModal: false,
          stocker_place: [],
          roomName: [],
          roomNameList: [],
          stockItemStatus: [],
          assignItemStatus: [],
      };
  },

	async asyncData({ $axios }) {
		const stockerPlacesUrl = "/stocker_places";
		const stockerPlacesRes = await $axios.$get(stockerPlacesUrl);
		return {
			stockerPlaces: stockerPlacesRes.data
		}
	},
  computed: {
    ...mapState({
      roleID: (state) => state.users.role,
    }),
  },
  mounted() {
    window.scrollTo(0, 0);
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
      const url = "/stocker_places/" + id;
      this.$axios.$get(url).then((response) => {
        this.stocker_place.data.push(response.data);
        console.log(response)
      })
      .catch(error =>
      {
        console.log(error)
      })
      ;
      console.log(this.stocker_place)
    },
    async submit() {
      const url =
        "/stocker_places/" +
        "?name=" +
        this.roomName +
        "&stock_item_status=1&assign_item_status=1";

      this.$axios.$post(url).then((response) => {
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