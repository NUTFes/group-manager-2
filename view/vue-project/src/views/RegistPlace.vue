<template>
  <div id="app">
    <h1 class="tytle">会場申請フォーム</h1>
    <div class="Blank">
      <span>第1希望</span>
      <select v-model="first" @change="validationFirst" id="first">
        <option
          v-for="list in placeList"
          :value="list.id"
          :key="list.id"
        >
          {{ list.name }}
        </option>
      </select>
    </div>
    <div class="Blank">
      <span>第2希望</span>
      <select v-model="second" @change="validationSecond" id="second">
        <option
          v-for="list in placeList"
          :value="list.id"
          :key="list.id"
        >
          {{ list.name }}
        </option>
      </select>
    </div>
    <div class="Blank">
      <span>第3希望</span>
      <select v-model="third" @change="validationThird" id="third">
        <option
          v-for="list in placeList"
          :value="list.id"
          :key="list.id"
        >
          {{ list.name }}
        </option>
      </select>
    </div>
    <div class="Blank">
      <span>備考</span>
      <input type="text" placeholder="要望" v-model="remark" />
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
      resultThird: false,
      new_info: [],
      first: [],
      second: [],
      third: [],
      remark: [],
      placeList: [],
    };
  },
  mounted() {
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
  computed: {
    validationFirst() {
      if (this.first != 0) {
        this.onFirstValidation();
      } else {
        this.offFirstValidation();
      }
      return this.resultFirst
    },
    validationSecond() {
      if (this.second != 0) {
        this.onSecondValidation();
      } else {
        this.offSecondValidation();
      }
      return this.resultSecond
    },
    validationThird() {
      if (this.third != 0) {
        this.onThirdValidation();
      } else {
        this.offThirdValidation();
      }
      return this.resultThird
    },
  },
  methods: {
    onFirstValidation: function() {
      this.resultFirst = true;
    },
    offFirstValidation: function() {
      this.resultFirst = false;
    },
    onSecondValidation: function() {
      this.resultSecond = true;
    },
    offSecondValidation: function() {
      this.resultSecond = false;
    },
    onThirdValidation: function() {
      this.resultThird = true;
    },
    offThirdValidation: function() {
      this.resultThird = false;
    },
    register: function () {
      if (this.resultFirst && this.resultSecond && this.resultThird && this.first!=this.second && this.first!=this.third && this.second!=this.third) {
        const placeUrl = process.env.VUE_APP_URL + "/place_orders";
        let placeParams = new URLSearchParams();
        placeParams.append("group_id", this.new_info.group.id);
        placeParams.append("first", this.first);
        placeParams.append("second", this.second);
        placeParams.append("third", this.third);
        placeParams.append("remark", this.remark);
        axios.post(placeUrl, placeParams).then(
          (response) => {
            console.log(response.data);
            this.$router.push("mypage");
          },
          (error) => {
            return error;
          }
        );
      } else {
        if (this.resultFirst==false || this.first==this.second || this.first==this.third) {
          const firstError = document.getElementById("first");
          firstError.style.border="2px solid red";
        } else {
          const firstError = document.getElementById("first");
          firstError.style.border="2px solid black";
        }
        if (this.resultSecond==false || this.second==this.first || this.second==this.third) {
          const secondError = document.getElementById("second");
          secondError.style.border="2px solid red";
        } else {
          const secondError = document.getElementById("second");
          secondError.style.border="2px solid black";
        }
        if (this.resultThird==false || this.third==this.first || this.third==this.second) {
          const thirdError = document.getElementById("third");
          thirdError.style.border="2px solid red";
        } else {
          const thirdError = document.getElementById("third");
          thirdError.style.border="2px solid black";
        }
      }
    },
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