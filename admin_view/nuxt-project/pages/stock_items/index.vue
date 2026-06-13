<template>
  <div class="main-content" v-if="this.$role(roleID).stocker_places.read">
    <SubHeader pageTitle="在庫場所">
      <CommonButton v-if="this.$role(roleID).stocker_places.create" iconName="add_circle" :on_click="openAddModal">
        追加
      </CommonButton>
    </SubHeader>

    <SubSubHeader>
      <template v-slot:refinement>
        <SearchDropDown
          :nameList="filterPlaceCategories"
          :on_click="refinementStockerPlaces"
          value="formattedName"
        >
          {{ refPlaceCategory }}
        </SearchDropDown>
      </template>
    </SubSubHeader>

    <Card width="100%">
      <Table>
        <template v-slot:table-header>
          <th v-for="(header, index) in headers" v-bind:key="index">
            {{ header }}
          </th>
        </template>
        <template v-slot:table-body>
          <tr
            v-for="(stocker_place, index) in stockerPlaces"
            @click="() => $router.push({ path: `/stock_items/` + stocker_place.id})"
            :key="index"
          >
            <td>{{ stocker_place.id }}</td>
            <td>{{ stocker_place.name }}</td>
            <td>{{ formattedCategoryName(stocker_place.place_category_id) }}</td>
            <td>{{ stocker_place.stock_item_status === 1 ? "未登録" : stocker_place.stock_item_status === 2 ? "登録中" : "登録完了" }}</td>
            <td>{{ stocker_place.assign_item_status === 1 ? "未登録" : stocker_place.assign_item_status === 2 ? "登録中" : "登録完了" }}</td>
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
          <h3>エリア</h3>
          <select v-model="placeCategoryId">
            <option value="">未指定</option>
            <option
              v-for="placeCategory in formattedPlaceCategories"
              :key="placeCategory.id"
              :value="placeCategory.id"
            >
              {{ placeCategory.formattedName }}
            </option>
          </select>
        </div>
        <!-- <div>
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
        </div> -->
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
import { getFormattedName, getSortKey } from "../../utils/place_category_utils";
export default {
  watchQuery: ["page"],
  data() {
      return {
          headers: [
              "ID",
              "部屋名",
              "エリア",
              "在庫登録",
              "割当",
          ],
          isOpenAddModal: false,
          stocker_place: [],
          roomName: [],
          roomNameList: [],
          placeCategories: [],
          allStockerPlaces: [],
          refPlaceCategory: "Area: ALL",
          refPlaceCategoryId: 0,
          placeCategoryId: null,
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

	async asyncData({ $axios }) {
		const stockerPlacesUrl = "/stocker_places";
		const stockerPlacesRes = await $axios.$get(stockerPlacesUrl);
		const placeCategoriesUrl = "/place_categories";
		const placeCategoriesRes = await $axios.$get(placeCategoriesUrl);
		return {
			allStockerPlaces: stockerPlacesRes.data,
			stockerPlaces: stockerPlacesRes.data,
			placeCategories: placeCategoriesRes.data
		}
	},
  computed: {
    ...mapState({
      roleID: (state) => state.users.role,
    }),
    formattedPlaceCategories() {
      if (!this.placeCategories) return [];
      let categories = this.placeCategories.map(cat => {
        return {
          ...cat,
          formattedName: getFormattedName(cat, this.placeCategories),
          sortKey: getSortKey(cat, this.placeCategories)
        };
      });
      categories.sort((a, b) => a.sortKey.localeCompare(b.sortKey));
      return categories;
    },
    filterPlaceCategories() {
      return [
        { id: -1, formattedName: "未指定" },
        ...this.formattedPlaceCategories
      ];
    }
  },
  mounted() {
    window.addEventListener('scroll', this.saveScrollPosition);
    this.$nextTick(() => {
      window.scrollTo(0, parseInt(localStorage.getItem('scrollPosition-' + this.$route.path)))
    });
  },
  methods: {
    saveScrollPosition() {
      localStorage.setItem('scrollPosition-' + this.$route.path, window.scrollY);
    },
    openAddModal() {
      this.placeCategoryId = null;
      this.isOpenAddModal = false;
      this.isOpenAddModal = true;
    },
    closeAddModal() {
      this.isOpenAddModal = false;
    },
    reload(id) {
      const url = "/stocker_places/" + id;
      this.$axios.$get(url).then((response) => {
        this.allStockerPlaces.push(response.data);
        this.refinementStockerPlaces(this.refPlaceCategoryId, this.formattedPlaceCategories);
        console.log(response)
      })
      .catch(error =>
      {
        console.log(error)
      })
      ;
    },
    async submit() {
      const url =
        "/stocker_places/" +
        "?name=" +
        this.roomName +
        "&stock_item_status=1&assign_item_status=1" +
        (this.placeCategoryId ? "&place_category_id=" + this.placeCategoryId : "");

      this.$axios.$post(url).then((response) => {
        this.roomName = "";
        this.stockItemStatus = "";
        this.assignItemStatus = "";
        this.reload(response.data.id);
        this.closeAddModal();
      });
    },
    refinementStockerPlaces(item_id, name_list) {
      this.refPlaceCategoryId = item_id;
      if (item_id === 0) {
        this.refPlaceCategory = "Area: ALL";
        this.stockerPlaces = this.allStockerPlaces;
      } else if (item_id === -1) {
        this.refPlaceCategory = "未指定";
        this.stockerPlaces = this.allStockerPlaces.filter(p => !p.place_category_id);
      } else {
        const cat = name_list.find(n => n.id === item_id);
        this.refPlaceCategory = cat ? cat.formattedName : "ALL";
        this.stockerPlaces = this.allStockerPlaces.filter(p => {
          if (p.place_category_id === item_id) return true;
          const pCat = name_list.find(n => n.id === p.place_category_id);
          return pCat && pCat.parent_id === item_id;
        });
      }
    },
    formattedCategoryName(id) {
      if (!id) return "未指定";
      const cat = this.formattedPlaceCategories.find(c => c.id === id);
      return cat ? cat.formattedName : "未指定";
    },
  },
};
</script>
