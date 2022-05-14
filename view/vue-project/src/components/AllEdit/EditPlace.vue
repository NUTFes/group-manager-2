<template>
  <transition name="fade" appear>
    <div class="add-modal">
        <div class="add-modal_box">
          <div id="btnContainer">
            <button v-on:click="$emit('closeEditPlace')">✖</button>
          </div>
          <h1>会場申請</h1>
          <div>第1希望</div>
            <select v-model="first" @change="validationFirst" id="first">
              <option
                v-for="list in placeList"
                :value="list.id"
                :key="list.id"
              >
                {{ list.name }}
              </option>
            </select>
            <div>第2希望</div>
            <select v-model="second" @change="validationSecond" id="second">
              <option
                v-for="list in placeList"
                :value="list.id"
                :key="list.id"
              >
                {{ list.name }}
              </option>
            </select>
            <div>第3希望</div>
            <select v-model="third" @change="validationThird" id="third">
              <option
                v-for="list in placeList"
                :value="list.id"
                :key="list.id"
              >
                {{ list.name }}
              </option>
            </select>
            <div>備考</div>
            <input type="text" v-model="remark">
          <span style="display:flex;">
            <button id="btn" type="button" @click="reset">リセット</button>
            <button id="btn" type="button" @click="register">✓登録</button>
          </span>
      </div>
    </div>
  </transition>
</template>

<script>
import axios from "axios";
export default {
  props: {
    groupId: Number,
    first: String,
    second: String,
    third: String,
    remark: String
  },
  data() {
    return {
      placeList: [],
      resultFirst: false,
      resultSecond: false,
      resultThird: false,
    };
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
    reset: function() {
      this.first = [],
      this.second = [],
      this.third = [],
      this.remark = []
    },
    register: function () {
      if (this.resultFirst && this.resultSecond && this.resultThird && this.first!=this.second && this.first!=this.third && this.second!=this.third) {
        const url =
          process.env.VUE_APP_URL +
          "/place_orders" + "/" + this.groupId + "?" +
          "first=" + this.first +
          "&second=" + this.second +
          "&third=" + this.third +
          "&remark=" + this.remark;
        axios.put(url).then(
          (response) => {
            console.log("response:", response);
            this.$emit("closeEditPlace");
          },
          (error) => {
            return error;
          });
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
};
</script>

<style scoped>
  #btn{
    background: #032030;
    color: white;
    font-size: 15px;
    font-weight: bold;
    cursor: pointer;
    width: 30%;
    height: 30px;
    display: block;
    margin-right: 10%;
    margin-left: 10%;
    margin-top: 5%;
    margin-bottom: 5%;
}
  #btn:hover {
    box-shadow: -2px -2px 5px #FFF, 2px 2px 5px #BABECC;
    background-image: linear-gradient(90deg, rgba(247, 93, 139, 1), rgba(254, 220, 64, 1));
    border: white;
  }
  #btn:active{
    box-shadow: inset 1px 1px 2px #BABECC, inset -1px -1px 2px #FFF;
  }
  #btnContainer {
    display: flex;
    justify-content: end;
    width: 100%;
    margin-bottom: -1.5rem;
    z-index: 0;
  }
  input{
    border: 1px solid silver;
    width: 100%;
  }
  select{
    border: 1px solid silver;
    width: 100%;
  }
  .add-modal_box {
    display: flex;
    padding: 10px 10px;
    margin: 0 25%;
    justify-content: center;
    flex-flow: column;
    background-color: #DADADA;
    border-radius: 10px;
    margin: 0 30%;
  }
  .add-modal {
    top: 0;
    left: 0;
    position: fixed;
    padding: 100px;
    height: 100%;
    width: 100%;
    z-index: 11;
    background-color: rgba(51, 51, 51, 0.3);
    overflow: auto;
  }
</style>