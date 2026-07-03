<template>
  <div class="main-content" v-if="this.$role(roleID).places.read">
    <SubHeader pageTitle="エリア一覧">
      <CommonButton v-if="this.$role(roleID).places.create" iconName="add_circle" :on_click="openAddModal">
        追加
      </CommonButton>
    </SubHeader>

    <Card width="100%">
      <Table>
        <template v-slot:table-header>
          <th v-for="(header, index) in headers" :key="index">
            {{ header }}
          </th>
        </template>
        <template v-slot:table-body>
          <tr
            v-for="(category, index) in formattedPlaceCategories"
            :key="index"
            @click="
              () => {
                if (category.id !== '—') {
                  $router.push({ path: `/place_categories/` + category.id });
                }
              }
            "
          >
            <td>{{ category.id }}</td>
            <td>{{ category.formattedName }}</td>
            <td>{{ category.childrenCount }}</td>
            <td>{{ category.stockerPlacesCount }}</td>
          </tr>
        </template>
      </Table>
    </Card>

    <AddModal
      @close="closeAddModal"
      v-if="isOpenAddModal"
      title="エリアの追加"
    >
      <template v-slot:form>
        <div>
          <h3>エリア名</h3>
          <input v-model="name" placeholder="入力してください" />
        </div>
        <div>
          <h3>所属エリア</h3>
          <select v-model="parentId">
            <option value="">未指定（所属エリアなし）</option>
            <option
              v-for="category in selectableCategories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.formattedName }}
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
    <SnackBar
      v-if="isOpenSnackBar"
      @close="closeSnackBar"
    >
      {{ message }}
    </SnackBar>
  </div>
  <h1 v-else>閲覧権限がありません</h1>
</template>

<script>
import { mapState } from "vuex";
import { getChildrenIds, getFormattedName, getSortKey } from "../../utils/place_category_utils";
export default {
  watchQuery: ["page"],
  data() {
    return {
      placeCategories: [],
      stockerPlaces: [],
      headers: ["ID", "エリア名", "サブエリア数", "エリア内の保管場所数"],
      isOpenAddModal: false,
      isOpenSnackBar: false,
      name: "",
      parentId: "",
      message: "",
    };
  },
  async asyncData({ $axios }) {
    const url = "/place_categories";
    const res = await $axios.$get(url);
    const spRes = await $axios.$get("/stocker_places");
    return {
      placeCategories: res.data,
      stockerPlaces: spRes.data,
    };
  },
  computed: {
    ...mapState({
      roleID: (state) => state.users.role,
    }),
    formattedPlaceCategories() {
      let categories = this.placeCategories.map((category) => {
        const parent = this.placeCategories.find((p) => p.id === category.parent_id);
        const childrenCount = getChildrenIds(category.id, this.placeCategories).length;
        const stockerPlacesCount = this.stockerPlaces.filter((sp) => sp.place_category_id === category.id).length;
        return {
          ...category,
          formattedName: getFormattedName(category, this.placeCategories),
          sortKey: getSortKey(category, this.placeCategories),
          parentName: parent ? parent.name : "未指定",
          childrenCount,
          stockerPlacesCount,
        };
      });
      categories.sort((a, b) => a.sortKey.localeCompare(b.sortKey));
      const unassignedStockerPlacesCount = this.stockerPlaces.filter(sp => !sp.place_category_id).length;
      categories.push({
        id: "—",
        name: "未指定",
        formattedName: "未指定",
        parentName: "—",
        childrenCount: "—",
        stockerPlacesCount: unassignedStockerPlacesCount,
      });
      return categories;
    },
    selectableCategories() {
      // In AddModal, all categories are selectable as parent (except itself, but it doesn't exist yet)
      return this.placeCategories.map(category => ({
        ...category,
        formattedName: getFormattedName(category, this.placeCategories),
        sortKey: getSortKey(category, this.placeCategories)
      })).sort((a, b) => a.sortKey.localeCompare(b.sortKey));
    },
  },
  mounted() {
    window.addEventListener('scroll', this.saveScrollPosition);
    this.$nextTick(() => {
      window.scrollTo(0, parseInt(localStorage.getItem('scrollPosition-' + this.$route.path)) || 0)
    });
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.saveScrollPosition);
  },
  methods: {
    saveScrollPosition() {
      localStorage.setItem('scrollPosition-' + this.$route.path, window.scrollY);
    },
    openAddModal() {
      this.isOpenAddModal = true;
    },
    closeAddModal() {
      this.isOpenAddModal = false;
    },
    openSnackBar(message) {
      this.message = message;
      this.isOpenSnackBar = true;
      setTimeout(this.closeSnackBar, 2000);
    },
    closeSnackBar() {
      this.isOpenSnackBar = false;
    },
    reload(id) {
      const url = "/place_categories/" + id;
      this.$axios.$get(url).then((response) => {
        this.placeCategories.push(response.data);
      }).catch((error) => {
        this.openSnackBar("データの再読み込みに失敗しました");
      });
    },
    async submit() {
      const url = "/place_categories";
      let params = new URLSearchParams();
      params.append("name", this.name);
      if (this.parentId !== "") {
        params.append("parent_id", this.parentId);
      }

      this.$axios.$post(url, params).then((response) => {
        this.openSnackBar(response.data.name + "を追加しました");
        this.name = "";
        this.parentId = "";
        this.reload(response.data.id);
        this.closeAddModal();
      }).catch((error) => {
        this.openSnackBar("追加に失敗しました");
      });
    },
  },
};
</script>
