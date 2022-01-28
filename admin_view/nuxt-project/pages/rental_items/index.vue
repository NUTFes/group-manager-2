<template>
  <div class="main-content">
    <SubHeader pageTitle="物品申請一覧">
      <CommonButton iconName="add_circle" :on_click="openModal">
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
            v-for="(rentalItem, index) in rentalItems"
            @click="
              () =>
                $router.push({
                  path: `/rental_items/` + rentalItem.id,
                })
            "
            :key="index"
          >
            <td>{{ rentalItem.id }}</td>
            <td>{{ rentalItem.name }}</td>
            <td>{{ rentalItem.is_rentable }}</td>
            <td>{{ rentalItem.created_at | formatDate }}</td>
            <td>{{ rentalItem.updated_at | formatDate }}</td>
          </tr>
        </template>
      </Table>
    </Card>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      headers: [
        "ID",
        "名前",
        "貸し出し",
        "登録日時",
        "編集日時"
      ]
    };
  },
  async asyncData({ $axios }) {
    const url = "/rental_items";
    const rentalItemsRes = await $axios.$get(url);
    const yearsUrl = "/fes_years";
    const yearsRes = await $axios.$get(yearsUrl);
    return {
      rentalItems: rentalItemsRes.data,
      yearList: yearsRes.data,
    };
  },
  compouted: {
    ...mapState({
      selfRoleId: (state) => state.users.role,
    }),
  },
  methods: {
    reload: function () {
      this.$axios
        .get("/rental_items", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.rental_items = response.data;
        });
    },
    register: function () {
      this.$axios.defaults.headers.common["Content-Type"] = "application/json";
      var params = new URLSearchParams();
      params.append("name", this.name);
      params.append("is_rentable", this.isRentable);
      console.log(params);
      this.$axios.post("/rental_items", params).then((response) => {
        console.log(response);
        this.dialog = false;
        this.reload();
        this.name = "";
        this.isRentable = "";
      });
    },
  },
};
</script>
