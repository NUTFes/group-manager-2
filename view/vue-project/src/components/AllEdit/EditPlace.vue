<template>
    <div id="card">
      <h3>会場申請</h3>
      <div class="Blank">
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
      <input type="text" v-model="remark" />
      <div style="display:flex;">
        <button id="btn" type="button" onclick="document.getElementById('editPlace').close()">閉じる</button>
      <button id="btn" type="button" onclick="document.getElementById('editPlace').close()">登録する</button>
    </div>
    </div>
    </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
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
  },
};
</script>

<style scoped>
  #card{
    margin-right: 15%;
    margin-left: 15%;
  }
  select, input {
    border: 2px solid black;
  }
  #btn{
    background: #032030;
    color: white;
    font-size: 15px;
    font-weight: bold;
    cursor: pointer;
    width: 80px;
    height: 30px;
    display: block;
    margin: 3% auto 3% auto;
  }
  #btn:hover {
    box-shadow: -2px -2px 5px #FFF, 2px 2px 5px #BABECC;
    background-image: linear-gradient(90deg, rgba(247, 93, 139, 1), rgba(254, 220, 64, 1));
    border: white;
  }
  #btn:active{
    box-shadow: inset 1px 1px 2px #BABECC, inset -1px -1px 2px #FFF;
  }
</style>