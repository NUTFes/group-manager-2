<template>
  <div>
    <h2>物品申請</h2>
    <p>登録数</p>
    <button @click="signOut">ログアウト</button>
    <form>
      <input type=number min="0" v-model="numberOfRegistrations">
      <br>
      <p>物品名</p>
      <br>
      <select  v-model="goodsName">
        <option
          v-for="list in itemList"
          :value="list.id"
          :key="list.id"
        >
          {{ list.name }}
        </option>
      </select>
      <p>数量</p>
      <input type=number min="0" v-model="number">
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
      <input v-model="urs">
      <h2>会場登録{{new_info}}</h2>
      <p>第一希望</p>
      <select  v-model="place1">
        <option
          v-for="list in placeList"
          :value="list.id"
          :key="list.id"
        >
          {{ list.name }}
        </option>
      </select>
      <p>第二希望</p>
      <select  v-model="place2">
        <option
          v-for="list in placeList"
          :value="list.id"
          :key="list.id"
        >
          {{ list.name }}
        </option>
      </select>
      <p>第三希望</p>
      <select  v-model="place3">
        <option
          v-for="list in placeList"
          :value="list.id"
          :key="list.id"
        >
          {{ list.name }}
        </option>
      </select>
      <p>備考</p>
      <input v-model="placeRemarks">
    </form>
    <br>
    <button @click="register">登録</button>

  </div>
</template>

<script>
import axios from "axios";
export default{
    data(){
      return{
        numberOfRegistrations: [],
        goodsName: [],
        number: [],
        product: [],
        power: [],
        maker: [],
        modelNumber:[],
        urs: [],
        place1: [],
        place2: [],
        place3: [],
        placeRemarks: [],
        new_info: [],
        placeList: [],
        itemList: [],
        user: [],
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
    const placeUrl = process.env.VUE_APP_URL + "/places";
    axios
      .get(placeUrl, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(
        (response) => {
          this.placeList = response.data.data;
        },
        (error) => {
          console.error(error);
          return error;
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
    const itemurl = process.env.VUE_APP_URL + "/rental_items";
    axios
      .get(itemurl, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.itemList = response.data.data;
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
      const placeUrl = process.env.VUE_APP_URL + "/place_orders";
      let placeParams = new URLSearchParams();
      placeParams.append("group_id", this.new_info.group.id);
      placeParams.append("first", this.place1);
      placeParams.append("second", this.place2);
      placeParams.append("third", this.place3);
      placeParams.append("remark", this.placeRemarks);
      axios.post(placeUrl, placeParams).then(
        (response) => {
          console.log(response.data);
          this.$router.push("/display");
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