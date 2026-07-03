<template>
  <div class="main-content" v-if="this.$role(roleID).places.read">
    <SubHeader :pageTitle="placeCategory.name" pageSubTitle="エリア一覧">
      <CommonButton v-if="this.$role(roleID).places.update" iconName="edit" :on_click="openEditModal">
        編集
      </CommonButton>
      <CommonButton v-if="this.$role(roleID).places.delete" iconName="delete" :on_click="openDeleteModal">
        削除
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
          <tr>
            <td>ID</td>
            <td>{{ placeCategory.id }}</td>
          </tr>
          <tr>
            <td>エリア名</td>
            <td>{{ formattedName }}</td>
          </tr>
          <tr>
            <td>所属エリア</td>
            <td>{{ parentName }}</td>
          </tr>
          <tr>
            <td>作成日時</td>
            <td>{{ placeCategory.created_at | formatDate }}</td>
          </tr>
          <tr>
            <td>編集日時</td>
            <td>{{ placeCategory.updated_at | formatDate }}</td>
          </tr>
          <tr>
            <td>サブエリア</td>
            <td class="text-left">
              <ul class="in-table-list">
                <li v-for="child in children" :key="child.id">
                  <nuxt-link :to="`/place_categories/${child.id}`">{{ child.name }}</nuxt-link>
                </li>
                <li v-if="children.length === 0">なし</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td>エリア内の保管場所</td>
            <td class="text-left">
              <ul class="in-table-tree">
                <AreaTreeNode 
                  :category="placeCategory"
                  :allCategories="placeCategories"
                  :allStockerPlaces="stockerPlaces"
                />
              </ul>
            </td>
          </tr>
        </template>
      </Table>
    </Card>

    <!-- 編集モーダル -->
    <EditModal
      @close="closeEditModal"
      v-if="isOpenEditModal"
      title="エリアの編集"
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
        <CommonButton iconName="edit" :on_click="edit">保存</CommonButton>
      </template>
    </EditModal>

    <!-- 削除確認モーダル -->
    <DeleteModal
      @close="closeDeleteModal"
      v-if="isOpenDeleteModal"
      title="エリアの削除"
    >
      <template v-slot:method>
        <CommonButton iconName="delete" :on_click="destroy">削除</CommonButton>
      </template>
    </DeleteModal>

    <SnackBar v-if="isOpenSnackBar" @close="closeSnackBar">
      {{ message }}
    </SnackBar>
  </div>
  <h1 v-else>閲覧権限がありません</h1>
</template>

<script>
import { mapState } from "vuex";
import AreaTreeNode from "../../components/AreaTreeNode.vue";
import { getDescendantIds, getFormattedName, getSortKey } from "../../utils/place_category_utils";
export default {
  components: {
    AreaTreeNode
  },
  data() {
    return {
      placeCategory: [],
      placeCategories: [],
      stockerPlaces: [],
      headers: ["項目", "値"],
      isOpenEditModal: false,
      isOpenDeleteModal: false,
      isOpenSnackBar: false,
      name: "",
      parentId: "",
      message: "",
    };
  },
  async asyncData({ $axios, route }) {
    const url = "/place_categories/" + route.params.id;
    const res = await $axios.$get(url);
    const catsRes = await $axios.$get("/place_categories");
    const spRes = await $axios.$get("/stocker_places");
    return {
      placeCategory: res.data,
      placeCategories: catsRes.data,
      stockerPlaces: spRes.data,
      name: res.data.name,
      parentId: res.data.parent_id || "",
    };
  },
  computed: {
    ...mapState({
      roleID: (state) => state.users.role,
    }),
    children() {
      return this.placeCategories.filter(c => c.parent_id === this.placeCategory.id);
    },
    directStockerPlaces() {
      return this.stockerPlaces.filter(sp => sp.place_category_id === this.placeCategory.id);
    },
    parentName() {
      if (!this.placeCategory.parent_id) return "未指定";

      const parent = this.placeCategories.find(p => p.id === this.placeCategory.parent_id);
      return parent ? getFormattedName(parent, this.placeCategories) : "未指定";
    },
    formattedName() {
      return getFormattedName(this.placeCategory, this.placeCategories);
    },
    selectableCategories() {
      const descendantIds = getDescendantIds(this.placeCategory.id, this.placeCategories);
      return this.placeCategories
        .filter(category => category.id !== this.placeCategory.id && !descendantIds.includes(category.id))
        .map(category => ({
          ...category,
          formattedName: getFormattedName(category, this.placeCategories),
          sortKey: getSortKey(category, this.placeCategories)
        }))
        .sort((a, b) => a.sortKey.localeCompare(b.sortKey));
    }
  },
  methods: {
    getStockerPlacesFor(id) {
      return this.stockerPlaces.filter(sp => sp.place_category_id === id);
    },

    openEditModal() {
      this.isOpenEditModal = true;
    },

    closeEditModal() {
      this.isOpenEditModal = false;
    },

    openDeleteModal() {
      if (this.children.length > 0) {
        this.openSnackBar("サブエリアが存在するため削除できません。先にサブエリアを別の所属エリアに移動するか、削除してください。");
        return;
      }
      this.isOpenDeleteModal = true;
    },

    closeDeleteModal() {
      this.isOpenDeleteModal = false;
    },

    openSnackBar(message) {
      this.message = message;
      this.isOpenSnackBar = true;
      setTimeout(this.closeSnackBar, 3000);
    },

    closeSnackBar() {
      this.isOpenSnackBar = false;
    },

    async reload() {
      const url = "/place_categories/" + this.$route.params.id;
      const res = await this.$axios.$get(url);
      this.placeCategory = res.data;
      this.name = res.data.name;
      this.parentId = res.data.parent_id || "";
      const catsRes = await this.$axios.$get("/place_categories");
      this.placeCategories = catsRes.data;
      const spRes = await this.$axios.$get("/stocker_places");
      this.stockerPlaces = spRes.data;
    },

    async edit() {
      const url = "/place_categories/" + this.$route.params.id;
      let params = new URLSearchParams();
      params.append("name", this.name);
      if (this.parentId !== "") {
        params.append("parent_id", this.parentId);
      } else {
        params.append("parent_id", ""); // clear parent_id
      }
      this.$axios
        .$put(url, params)
        .then((response) => {
          this.openSnackBar(this.name + "を編集しました");
          this.reload();
          this.closeEditModal();
        })
        .catch((error) => {
          this.openSnackBar("編集に失敗しました");
        });
    },

    async destroy() {
      const url = "/place_categories/" + this.$route.params.id;
      this.$axios
        .$delete(url)
        .then((response) => {
          this.$router.push("/place_categories");
        })
        .catch((error) => {
          this.closeDeleteModal();
          let msg = "削除に失敗しました";
          if (error.response && error.response.data && error.response.data.status && error.response.data.status.option) {
            msg = error.response.data.status.option;
            if (msg.includes("Cannot delete record because dependent children exist")) {
              msg = "サブエリアが存在するため削除できません。先にサブエリアを別の所属エリアに移動するか、削除してください。";
            }
          }
          this.openSnackBar(msg);
        });
    },
  },
};
</script>

<style scoped>
.in-table-list {
  margin: 0 0 0 20px;
  padding: 0;
  list-style-type: disc;
}
.in-table-list li {
  margin-bottom: 2px;
}
.in-table-list a {
  color: #1976d2;
  text-decoration: underline;
}
.in-table-tree {
  margin: 0;
  padding-left: 20px;
  color: inherit;
  list-style-type: disc;
}
.in-table-tree ul {
  margin: 0;
  padding-left: 20px;
  list-style-type: disc;
}
.in-table-tree li {
  margin: 4px 0;
}
.text-left {
  text-align: left !important;
}
</style>
