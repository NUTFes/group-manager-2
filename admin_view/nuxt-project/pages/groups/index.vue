<template>
  <div class="main-content">
    <SubHeader pageTitle="参加団体申請一覧">
      <CommonButton iconName="add_circle" :on_click="open_add_dialog">
        追加
      </CommonButton>
    </SubHeader>
    <SubSubHeader>
      <SearchDropDown
        :nameList="year_list"
        :on_click="refinementGroups"
        value="year_num"
      >
        All Years
      </SearchDropDown>
      <SearchDropDown
        :nameList="groupCategories"
        :on_click="refinementGroups"
        value="name"
      >
        All Categories
      </SearchDropDown>
    </SubSubHeader>
    <Card width="100%">
      <table>
        <thead>
          <th v-for="(header, index) in headers" v-bind:key="index">
            {{ header }}
          </th>
        </thead>
        <tbody>
          <tr
            v-for="(group, index) in groups"
            @click="() => $router.push({ path: `/groups/` + group.group.id })"
          >
            <td>{{ group.group.id }}</td>
            <td>{{ group.group.name }}</td>
            <td>{{ group.group.project_name }}</td>
            <td>{{ group.group_category.name }}</td>
            <td>{{ group.fes_year.year_num }}</td>
            <td>{{ group.group.created_at | formatDate }}</td>
            <td>{{ group.group.updated_at | formatDate }}</td>
          </tr>
        </tbody>
      </table>
    </Card>
    <GroupAddModal
      @close="closeModal"
      v-if="isOpenAddModal"
      :year_list="year_list"
    />
  </div>
</template>

<script>
import GroupAddModal from "~/components/AddModals/GroupAddModal.vue";
export default {
  watchQuery: ["page"],
  components: {
    GroupAddModal,
  },
  data() {
    return {
      groups: [],
      group_categories: [],
      category: [],
      fes_years: [],
      years: [],
      groupName: [],
      projectName: [],
      activity: [],
      groupCategoryId: [],
      fesYearId: [],
      year_list: [],
      user: [],
      isOpenAddModal: false,
      groupCategories: [
        { id: 1, name: "模擬店(食品販売)" },
        { id: 2, name: "模擬店(物品販売)" },
        { id: 3, name: "ステージ企画" },
        { id: 4, name: "展示・体験" },
        { id: 5, name: "研究室公開" },
        { id: 6, name: "その他" },
      ],
      headers: [
        "ID",
        "グループ名",
        "企画名",
        "カテゴリ",
        "開催年",
        "日時",
        "編集日時",
      ],
    };
  },
  async asyncData({ $axios }) {
    const url = "/api/v1/get_group_with_categories_and_fes_years";
    const groupRes = await $axios.$get(url);
    const yearsUrl = "/fes_years";
    const yearsRes = await $axios.$get(yearsUrl);
    return {
      groups: groupRes.data,
      year_list: yearsRes.data,
    };
  },
  methods: {
    refinementGroups: function (id) {
      const refUrl = "/api/v1/get_refinement_groups?fes_year_id=" + id;
      const refRes = this.$axios.$get(refUrl);
      console.log(refUrl);
      console.log(refRes);
    },
    open_add_dialog: function () {
      const url = "/api/v1/current_user/show";
      this.$axios
        .get(url, {
          headers: {
            "Content-Type": "application/json",
            "access-token": localStorage.getItem("access-token"),
            client: localStorage.getItem("client"),
            uid: localStorage.getItem("uid"),
          },
        })
        .then(
          (response) => {
            this.user = response.data.data;
          },
          (error) => {
            console.error(error);
            return error;
          }
        );
      this.isOpenAddModal = false;
      this.isOpenAddModal = true;
    },
    closeModal() {
      this.isOpenAddModal = false;
    },
    reload: function () {
      this.$axios
        .get("/api/v1/get_groups", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.groups = response.data;
        });
    },
  },
};
</script>
