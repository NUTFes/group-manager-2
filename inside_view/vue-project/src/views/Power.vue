<template>
  <div>
    <h2>物品申請</h2>
    <button @click="signOut">ログアウト</button>
    <form>
      <h2>電力申請</h2>
      <p>製品名</p>
      <input v-model="product">
      <p>電力量</p>
      <input v-model="power">
      <p>メーカー</p>
      <input v-model="maker">
      <p>型番</p>
      <input v-model="modelNumber">
      <p>製品URL</p>
      <input v-model="url">
    </form>
    <button @click="register">登録</button>

  </div>
</template>

<script>
import axios from "axios";
export default{
    data(){
      return{
        product: [],
        power: [],
        maker: [],
        modelNumber:[],
        url: [],
        user: [],
        new_info: [],
      };
    },
  mounted() {
    const url = process.env.VUE_APP_URL + "/api/v1/users/show";
    axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          "access-token": localStorage.getItem("access-token"),
          client: localStorage.getItem("client"),
          uid: localStorage.getItem("uid"),
        },
      })
      .then((response) => {
        this.user = response.data.data;
      });

    const new_info_url = process.env.VUE_APP_URL + "/api/v1/users/show";
    axios
      .get(new_info_url, {
        headers: {
          "Content-Type": "application/json",
          "access-token": localStorage.getItem("access-token"),
          client: localStorage.getItem("client"),
          uid: localStorage.getItem("uid"),
        },
      })
      .then((response) => {
        console.log(response);
        this.new_info = response.data;
      });
  },
  methods: {
    signOut: function () {
      const url = process.env.VUE_APP_URL + "/api/auth/sign_out";
      axios
        .delete(url, {
          headers: {
            "Content-Type": "application/json",
            "access-token": localStorage.getItem("access-token"),
            client: localStorage.getItem("client"),
            uid: localStorage.getItem("uid"),
          },
        })
        .then(
          this.$router.push("/signin"),
          localStorage.removeItem("access-token"),
          localStorage.removeItem("client"),
          localStorage.removeItem("uid")
        );
    },
    register: function () {
      const post_url = process.env.VUE_APP_URL + "/power_orders";
      let powerParams = new URLSearchParams();
      powerParams.append("group_id", this.new_info.group.id);
      powerParams.append("item", this.product);
      powerParams.append("power", this.power);
      powerParams.append("manufacturer", this.maker);
      powerParams.append("model", this.modelNumber);
      powerParams.append("item_url", this.url);
      axios.post(post_url, powerParams).then(
        (response) => {
          console.log(response.data);
          this.$router.push("/place");
        },
        (error) => {
          return error;
        },
      );
    },
  }
}
</script>

<style  scoped>

</style>