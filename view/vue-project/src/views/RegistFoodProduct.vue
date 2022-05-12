<template>
  <div id="app">
    <h1 class="tytle">販売食品申請フォーム</h1>
    <div class="Blank">
    <span>料理名</span>
    <input type="text" v-model="name" id="name">
    </div>
    <div class="Blank">
    <span>料理の有無</span>
      <select v-model="isCooking" @change="validationCook" id="cook">
        <option
          v-for="list in isCookingList"
          :value="list.value"
          :key="list.value"
        >
          {{ list.label }}
        </option>
      </select>
    </div>
    <div class="Blank">
    <span>仕込み個数（一日目）</span>
    <input type="text" v-model="firstNum" @change="validationFirst" id="first">
    </div>
    <div class="Blank">
    <span>仕込み個数（二日目）</span>
    <input type="text" v-model="secondNum" @change="validationSecond" id="second">
    </div>
    <div class="Blank">
      <router-link to="/mypage"><button style="margin-left:8%;">←戻る</button></router-link>
      <button @click="register" style="margin-left:15%;">登録する→</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      resultFirst: false,
      resultSecond: false,
      resultCook: false,
      new_info: [],
      name: [],
      isCooking: [],
      firstNum: [],
      secondNum: [],
      isCookingList: [
        { label: "する", value: true },
        { label: "しない", value: false },
      ],
    };
  },
  methods: {
    validationCook: function() {
      if (this.isCooking==true ||this.isCooking==false) {
        this.resultCook = true;
      } else {
        this.resultCook = false;
      }
      return this.resultCook
    },
    validationFirst: function() {
      const pattern = /[0-9０-９]/;
      if (pattern.test(this.firstNum)==true) {
        this.resultFirst = true;
      } else {
        this.resultFirst = false;
      }
      return this.resultFirst
    },
    validationSecond: function() {
      const pattern = /[0-9０-９]/;
      if (pattern.test(this.secondNum)==true) {
        this.resultSecond = true;
      } else {
        this.resultSecond = false;
      }
      return this.resultSecond
    },
    register: function () {
      if (this.name.length > 0 && this.resultCook && this.resultFirst && this.resultSecond) {
        axios.defaults.headers.common["Content-Type"] = "application/json";
        let params = new URLSearchParams();
        params.append("group_id", this.new_info.group.id);
        params.append("name", this.name);
        params.append("is_cooking", this.isCooking);
        params.append("first_day_num", this.firstNum);
        params.append("second_day_num", this.secondNum);
        axios
          .post(process.env.VUE_APP_URL + "/food_products", params)
          .then((response) => {
            console.log(response);
            this.$router.push("mypage");
            this.name = [];
            this.isCooking = [];
            this.firstNum = [];
            this.secondNum = [];
          });
      } else {
        if (this.name.length == 0) {
          const nameError = document.getElementById("name");
          nameError.style.border="2px solid red";
        } else {
          const nameError = document.getElementById("name");
          nameError.style.border="2px solid black";
        }
        if (this.resultCook==false) {
          const cookError = document.getElementById("cook");
          cookError.style.border="2px solid red";
        } else {
          const cookError = document.getElementById("cook");
          cookError.style.border="2px solid black";
        }
        if (this.resultFirst==false) {
          const firstError = document.getElementById("first");
          firstError.style.border="2px solid red";
        } else {
          const firstError = document.getElementById("first");
          firstError.style.border="2px solid black";
        }
        if (this.resultSecond==false) {
          const secondError = document.getElementById("second");
          secondError.style.border="2px solid red";
        } else {
          const secondError = document.getElementById("second");
          secondError.style.border="2px solid black";
        }
      }
    },
  },
  mounted() {
    // 直リンク対策
    if (this.$store.state.registFoodProductPermission == false) {
      this.$router.push("/mypage");
    }
    const new_info =
    process.env.VUE_APP_URL + "/api/v1/current_user/current_regist_info";
    axios
      .get(new_info, {
        headers: {
          "Content-Type": "application/json",
          "access-token": localStorage.getItem("access-token"),
          client: localStorage.getItem("client"),
          uid: localStorage.getItem("uid"),
        },
      })
      .then((response) => {
        console.log(response);
        this.new_info = response.data.data[0];
      });
  },
}
</script>

<style scoped>
  #app{
    margin: 1%;
  }
  span {
    display: inline-block;
    width: 100px;
    padding-right: 10px;
  }
  .tytle{
    text-align:center;
    padding:1%;
  }
  .Blank{
    text-align: center;
    margin:1%;
  }
  select,input{
    text-align: center;
    width: 30%;
    height:40px;
    border-radius: 7px;
    box-shadow: inset 2px 2px 5px #BABECC, inset -5px -5px 10px #FFF;
    font-size: 25px;
  }
  select,input:required{
    border: 2px solid red;
  }
  select,input:invalid{
    border: 2px solid red;
  }
  select,input:valid{
    border: 2px solid black;
  }
  button{
  color: black;
  font-weight: bold;
  border: solid 2px;
  border-radius: 10px;
  cursor: pointer;
  margin: 1%;
  padding:1%;
  }
  button:hover {
    box-shadow: -2px -2px 5px #FFF, 2px 2px 5px #BABECC;
    background-image: linear-gradient(90deg, rgba(247, 93, 139, 1), rgba(254, 220, 64, 1));
    border: white;
  }
  button:active{
    box-shadow: inset 1px 1px 2px #BABECC, inset -1px -1px 2px #FFF;
  }
</style>