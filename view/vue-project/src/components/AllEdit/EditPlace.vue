<template>
  <transition name="fade" appear>
    <div class="add-modal">
        <div class="add-modal_box">
          <div id="btnContainer">
            <button v-on:click="$emit('closeEditPlace')">✖</button>
          </div>
          <h1>会場申請</h1>
          <div>第1希望</div>
            <select v-model="first">
              <option
                v-for="list in placeList"
                :value="list.id"
                :key="list.id"
              >
                {{ list.name }}
              </option>
            </select>
            <div>第2希望</div>
            <select v-model="second">
              <option
                v-for="list in placeList"
                :value="list.id"
                :key="list.id"
              >
                {{ list.name }}
              </option>
            </select>
            <div>第3希望</div>
            <select v-model="third">
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
  },
  data() {
    return {
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
          this.placeList = response.data;
        },
        (error) => {
          console.error(error);
          return error;
        });
  },
  methods: {
    reset: function() {
      this.first = [],
      this.second = [],
      this.third = [],
      this.remark = []
    },
    register: function () {
      const url =
        process.env.VUE_APP_URL +
        "/place_orders" +
        "/" +
        this.groupId +
        "?" +
        "first=" +
        this.first +
        "&second=" +
        this.second +
        "&third=" +
        this.third +
        "&remark=" +
        this.remark;
      axios.put(url).then(
        (response) => {
          console.log("response:", response);
          this.isDisplay = false;
          this.$emit("reload");
          this.$emit("openPlaceSnackbar");
        },
        (error) => {
          console.log("登録できませんでした");
          return error;
        });
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