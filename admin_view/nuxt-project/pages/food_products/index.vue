<template>
  <div class="main-content">
    <SubHeader pageTitle="販売食品申請一覧">
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
            v-for="(foodProduct, index) in foodProducts"
            @click="
              () =>
                $router.push({
                  path: `/food_products/` + foodProduct.food_product.id,
                })
            "
            :key="index"
          >
            <td>{{ foodProduct.food_product.id }}</td>
            <td>{{ foodProduct.group.name }}</td>
            <td>{{ foodProduct.food_product.name }}</td>
            <td>{{ foodProduct.food_product.first_day_num }}</td>
            <td>{{ foodProduct.food_product.second_day_num }}</td>
            <td>{{ foodProduct.food_product.is_cooking }}</td>
            <td>{{ foodProduct.food_product.created_at | formatDate }}</td>
            <td>{{ foodProduct.food_product.updated_at | formatDate }}</td>
          </tr>
        </tbody>
      </table>
    </Card>
  </div>
</template>

<script>
export default {
  watchQuery: ["page"],
  data() {
    return {
      headers: [
        "ID",
        "参加団体",
        "名前",
        "1日目の個数",
        "2日目の個数",
        "調理の有無",
        "日時",
        "編集日時",
      ],
    };
  },
  async asyncData({ $axios }) {
    const url = "/api/v1/get_food_product_index_for_admin_view";
    const foodProductRes = await $axios.$get(url);
    const yearsUrl = "/fes_years";
    const yearsRes = await $axios.$get(yearsUrl);
    return {
      foodProducts: foodProductRes.data,
      yearList: yearsRes.data,
    };
  },
  methods: {
    reload: function () {
      this.$axios
        .get("/api/v1/get_food_products", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.food_products = response.data;
        });
    },
    register: function () {
      this.$axios.defaults.headers.common["Content-Type"] = "application/json";
      var params = new URLSearchParams();
      params.append("group_id", this.Group);
      params.append("name", this.productName);
      params.append("is_cooking", this.isCooking);
      params.append("first_day_num", this.firstDayNum);
      params.append("second_day_num", this.secondDayNum);
      this.$axios.post("/food_products", params).then((response) => {
        console.log(response);
        this.dialog = false;
        this.reload();
        this.Group = "";
        this.productName = "";
        this.isCooking = "";
        this.firstDayNum = "";
        this.secondDayNum = "";
      });
    },
  },
};
</script>
