<template>
    <div id="card">
      <h3>登録フォーム</h3>
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
      <div>
        <button>←リセット</button>
        <button>登録する→</button>
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
</style>