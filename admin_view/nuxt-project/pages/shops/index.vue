<template>
  <div class="main-content">
    <SubHeader pageTitle="店一覧">
      <CommonButton iconName="add_circle" :on_click="openAddModal">
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
            v-for="(shop, index) in shops"
            :key="index"
            @click="
              () =>
                $router.push({
                  path: `/shops/` + shop.id,
                })
            "
          >
            <td>{{ shop.id }}</td>
            <td>{{ shop.name }}</td>
            <td>{{ shop.tel }}</td>
            <td>{{ shop.created_at | formatDate }}</td>
            <td>{{ shop.updated_at | formatDate }}</td>
          </tr>
        </template>
      </Table>
    </Card>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  watchQuery: ["page"],
  data() {
    return {
      headers: [
        "ID",
        "名前",
        "電話番号",
        "登録日時",
        "編集日時"
      ],
    };
  },
  async asyncData({ $axios }) {
    const shopUrl = "/shops"
    const shopsRes = await $axios.$get(shopUrl);
    return {
      shops: shopsRes.data,
    };
  },
  computed: {
    ...mapState({
      selfRoleId: (state) => state.users.role,
    }),
  },
  methods: {
    reload: function () {
      this.$axios
        .get("/shops", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.shops = response.data;
        });
    },

    register: function () {
      this.$axios.defaults.headers.common["Content-Type"] = "application/json";
      var params = new URLSearchParams();
      params.append("name", this.name);
      params.append("tel", this.tel);
      params.append("opening_hours", this.opening_hours);
      params.append("address", this.address);
      this.$axios.post("/shops", params).then((response) => {
        console.log(response);
        this.dialog = false;
        this.reload();
        this.name = "";
        this.tel = "";
        this.opening_hours = "";
        this.address = "";
      });
    },
  },
};
</script>
<<<<<<< HEAD

<style>
.card {
  padding-left: 1%;
  padding-right: 5%;
}
</style>
======= >>>>>>> 3f172cd76df3dbaed33f2d88ac0196b12970257b
