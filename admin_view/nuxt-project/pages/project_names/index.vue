<template>
  <div class="main-content"  v-if="this.$role(roleID).project_names.read">
    <SubHeader pageTitle="企画名申請一覧">
      <CommonButton v-if="this.$role(roleID).project_names.create" iconName="add_circle" :on_click="openAddModal">
        追加
      </CommonButton>
    </SubHeader>
    <SubSubHeader>
      <SearchDropDown> All Years </SearchDropDown>
      <SearchDropDown> All Categories </SearchDropDown>
    </SubSubHeader>
    <Card width="100%"> </Card>
  </div>
  <h1 v-else>閲覧権限がありません</h1>

</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      groups: [],
      headers: [
        { text: "ID", value: "id" },
        { text: "企画名", value: "project_name" },
        // { text: '企画内容', value: 'activity' },
        { text: "日時", value: "created_at" },
        { text: "編集日時", value: "updated_at" },
      ],
    };
  },
  computed: {
    ...mapState({
      roleID: (state) => state.users.role,
    }),
  },
  mounted() {
    window.scrollTo(0, 0);
    
    this.$axios
      .get("groups", {
        headers: {
          "Content-Type": "application/json",
          "access-token": localStorage.getItem("access-token"),
          client: localStorage.getItem("client"),
          uid: localStorage.getItem("uid"),
        },
      })
      .then((response) => {
        this.groups = response.data;
      });
  },
};
</script>
