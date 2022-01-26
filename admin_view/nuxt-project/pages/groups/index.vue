<template>
  <div class="main-content">
    <SubHeader pageTitle="参加団体申請一覧">
      <CommonButton iconName="add_circle" :on_click="openModal">
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
      :submitGroup="submitGroup"
      :year_list="year_list"
      :groupCategories="groupCategories"
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
      value: '',
      groups: [],
      group_categories: [],
      category: [],
      fes_years: [],
      years: [],
      groupName: '',
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
    const url = "/api/v1/get_group_index_for_admin_view";
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
      const refRes = this.$axios.$post(refUrl);
      console.log(refUrl);
      console.log(refRes);
    },
    openModal() {
      this.isOpenAddModal = false;
      this.isOpenAddModal = true;
    },
    closeModal() {
      this.isOpenAddModal = false;
    },
    submitGroup() {
      console.log(searchText);
      this.$axios.defaults.headers.common["Content-Type"] = "application/json";
      let params = new URLSearchParams();
      params.append("user_id", this.user.id);
      params.append("name", this.groupName);
      params.append("project_name", this.projectName);
      params.append("activity", this.activity);
      params.append("group_category_id", this.groupCategoryId);
      params.append("fes_year_id", this.fesYearId);
      console.log(params)
      this.$axios.post("/groups", params).then((response) => {
        console.log(response);
        $emit("close");
        console.log("*****************************:");
        //this.reload();
        this.groupName = "";
        this.projectName = "";
        this.activity = "";
        this.groupCategoryId = "";
        this.fesYearId = "";
      });
    },
  },
};
</script>
