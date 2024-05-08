<template>
  <div class="main-content" v-if="this.$role(roleID).stocker_places.read">
    <SubHeader pageTitle="在庫場所">
      <CommonButton v-if="this.$role(roleID).stocker_places.create" iconName="add_circle" :on_click="openAddModal">
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
            v-for="(stocker_place, index) in stockerPlaces"
            @click="() => $router.push({ path: `/assign_items/` + stocker_place.id})"
            :key="index" 
          >
            <td>{{ stocker_place.id }}</td>
            <td>{{ stocker_place.name }}</td>
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