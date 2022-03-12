<template>
  <div class="main-content">
    <SubHeader pageTitle="ユーザー一覧">
    </SubHeader>

    <SubSubHeader>
      <template v-slot:refinement>
        <SearchDropDown
          :nameList="roles"
          :on_click="refinementUsers"
          value="name"
        >
          {{ refRole }}
        </SearchDropDown>
      </template>
      <template v-slot:search>
        <SearchBar>
          <input
            v-model="searchText"
            @keypress.enter="searchUsers"
            type="text"
            size="25"
            placeholder="search"
          />
        </SearchBar>
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
            v-for="(user, index) in users"
            @click="
              () =>
                $router.push({
                  path: `/users/` + user.user.id,
                })
            "
            :key="index"
          >
            <td>{{ user.user.id }}</td>
            <td>{{ user.user.name }}</td>
            <td>{{ user.role.name }}</td>
            <td>{{ user.user.created_at | formatDate }}</td>
            <td>{{ user.user.updated_at | formatDate }}</td>
          </tr>
        </template>
      </Table>
    </Card>

  </div>
</template>

<script>
export default {
  watchQuery: ["page"],
  data() {
    return {
      headers: ["ID", "名前", "権限", "日時", "編集日時"],
      roles: [
        { id: 1, name: "developer" },
        { id: 2, name: "manager" },
        { id: 3, name: "user" },
      ],
      refRole: "Role",
      refRoleID: 0,
      searchText: "",
      users: [],
    };
  },
  async asyncData({ $axios }) {
    const url = "/api/v1/get_user_index_for_admin_view";
    const userRes = await $axios.$get(url);
    const yearsUrl = "/fes_years";
    const yearsRes = await $axios.$get(yearsUrl);
    return {
      users: userRes.data,
      yearList: yearsRes.data,
    };
  },
  methods: {
    async refinementUsers(item_id, name_list) {
      this.refRoleID = item_id
      if (item_id == 0){
        this.refRole = "ALL";
      } else {
        this.refRole = name_list[item_id - 1].name;
      }
      this.users = [];
      const refUrl = "/api/v1/get_refinement_users?role_id=" + this.refRoleID;
      const refRes = await this.$axios.$post(refUrl);
      for (const res of refRes.data){
        this.users.push(res)
      }
    },
    async searchUsers(){
      this.users = []
      const searchUrl = "/api/v1/get_search_users?word=" + this.searchText;
      const refRes = await this.$axios.$post(searchUrl);
      for (const res of refRes.data) {
        this.users.push(res);
      }
    },
  },
};
</script>

<style>
.card {
  padding-left: 1%;
  padding-right: 5%;
}
</style>
