<template>
  <div>
    <router-link to="/mypage" style="text-decoration: none"><span class="regist-back-link">マイページに戻る</span></router-link>
    <div class="regist-title">会場の登録</div>
    <div class="regist-card">
      <div class="regist-card-content">
        <div class="regist-card-content-question">
          <div class="regist-card-content-question-label">第1希望</div>
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
        <div class="regist-card-content-question">
          <div class="regist-card-content-question-label">第2希望</div>
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
        <div class="regist-card-content-question">
          <div class="regist-card-content-question-label">第3希望</div>
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
        <div class="regist-card-content-question">
          <div class="regist-card-content-question-label">備考</div>
          <input type="text" placeholder="要望" v-model="remark" />
        </div>
      </div>
    </div>
    <div class="regist-button">
      <button @click="register" class="regist-submit-button">登録する→</button>
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
  select, input{
    text-align: left;
    padding: 1%;
    height: 50px;
    width: 800px;
    border-radius: 7px;
    font-size: 18px;
    vertical-align: top;
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
</style>