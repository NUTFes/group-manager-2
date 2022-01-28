<template>
  <div class="main-content">
    <SubHeader pageTitle="企画名申請一覧">
      <CommonButton iconName="add_circle"> 追加 </CommonButton>
    </SubHeader>
    <SubSubHeader>
      <SearchDropDown> All Years </SearchDropDown>
      <SearchDropDown> All Categories </SearchDropDown>
    </SubSubHeader>
    <Card width="100%"> </Card>
  </div>
</template>

<script>
import Header from "~/components/Header.vue";
import Menu from "~/components/Menu.vue";
export default {
  components: {
    Header,
    Menu,
  },
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
  mounted() {
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
