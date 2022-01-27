<template>
  <div class="main-content">
    <SubHeader pageTitle="ユーザー一覧">
      <CommonButton iconName="add_circle" :on_click="openModal">
        追加
      </CommonButton>
    </SubHeader>
    <Card width="100%">
      <table>
        <thead>
          <th v-for="(header, index) in headers" v-bind:key="index">
            {{ header }}
          </th>
        </thead>
        <tbody>
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
        </tbody>
      </table>
    </Card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        "ID",
        "名前",
        "権限",
        "日時",
        "編集日時",
      ],
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
    reload: function () {
      this.$axios
        .get("api/v1/users/index", {
          headers: {
            "Content-Type": "application/json",
            "access-token": localStorage.getItem("access-token"),
            client: localStorage.getItem("client"),
            uid: localStorage.getItem("uid"),
          },
        })
        .then((response) => {
          this.users = response.data;
        });
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
