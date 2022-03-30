<template>
  <div id="app">
    <h1 class="tytle">ステージオプション申請の登録</h1>
    <div class="Blank">
      <span>所持機器の利用</span>
      <select v-model="item" @change="validationItem" id="item">
        <option
          v-for="list in itemsAvailable"
          :value="list.value"
          :key="list.value"
        >
          {{ list.label }}
        </option>
      </select>
    </div>
    <div class="Blank">
      <span>音楽</span>
      <select v-model="music" @change="validationMusic" id="music">
        <option
          v-for="list in musicAvailable"
          :value="list.value"
          :key="list.value"
        >
          {{ list.label }}
        </option>
      </select>
    </div>
    <div class="Blank">
      <span>撮影許可</span>
      <select v-model="picture" @change="validationPicture" id="picture">
        <option
          v-for="list in photoAvailable"
          :value="list.value"
          :key="list.value"
        >
          {{ list.label }}
        </option>
      </select>
    </div>
    <div class="Blank">
      <span>騒音</span>
      <select v-model="noise" @change="validationNoise" id="noise">
        <option
          v-for="list in loudAble"
          :value="list.value"
          :key="list.value"
        >
          {{ list.label }}
        </option>
      </select>
    </div>
    <div class="Blank">
      <span>ステージ内容</span>
      <input type="text" v-model="stageContent" id="content">
    </div>
    <div  class="Blank">
      <router-link to="/mypage"><button style="margin-left:8%;">←戻る</button></router-link>
      <button @click="register" style="margin-left:15%;">登録する→</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "app",
  data() {
    return {
      resultItem: false,
      resultMusic: false,
      resultPicture: false,
      resultNoise: false,
      new_info: [],
      item: [],
      music: [],
      picture: [],
      noise: [],
      stageContent: [],
      itemsAvailable: [
        { label: "使用", value: true },
        { label: "使用しない", value: false },
      ],
      musicAvailable: [
        { label: "使用", value: true },
        { label: "使用しない", value: false },
      ],
      photoAvailable: [
        { label: "許可", value: true },
        { label: "許可しない", value: false },
      ],
      loudAble: [
        { label: "出す", value: true },
        { label: "出さない", value: false },
      ],
    };
  },

  methods: {
    validationItem: function() {
      if (this.item==true || this.item==false) {
        this.resultItem = true;
      } else {
        this.resultItem = false;
      }
      return this.resultItem
    },
    validationMusic: function() {
      if (this.music==true || this.music==false) {
        this.resultMusic = true;
      } else {
        this.resultMusic = false;
      }
      return this.resultMusic
    },
    validationPicture: function() {
      if (this.picture==true || this.picture==false) {
        this.resultPicture = true;
      } else {
        this.resultPicture = false;
      }
      return this.resultPicture
    },
    validationNoise: function() {
      if (this.noise==true || this.noise==false) {
        this.resultNoise = true;
      } else {
        this.resultNoise = false;
      }
      return this.resultNoise
    },
    register: function () {
      if (this.resultItem && this.resultMusic && this.resultPicture && this.resultNoise && this.stageContent.length > 0) {
        const url = process.env.VUE_APP_URL + "/stage_common_options";
        let params = new URLSearchParams();
        params.append("group_id", this.new_info.group.id);
        params.append("own_equipment", this.item);
        params.append("bgm", this.music);
        params.append("camera_permission", this.picture);
        params.append("loud_sound", this.noise);
        params.append("stage_content", this.stageContent);
        axios.defaults.headers.common["Content-Type"] = "application/json";
        axios.post(url, params).then(
          (response) => {
            console.log("aaaaaaaaaaaaaaaaaaaaaaaa", response);
            this.$router.push("mypage");
          },
          (error) => {
            console.log("登録できませんでした");
            return error;
          });
      } else {
        console.log("zzzzzzzzzzzzzzzz");
        if (this.resultItem==false) {
          const itemError = document.getElementById("item");
          itemError.style.border="2px solid red";
        } else {
          const itemError = document.getElementById("item");
          itemError.style.border="2px solid black";
        }
        if (this.resultMusic==false) {
          const musicError = document.getElementById("music");
          musicError.style.border="2px solid red";
        } else {
          const musicError = document.getElementById("music");
          musicError.style.border="2px solid black";
        }
        if (this.resultPicture==false) {
          const pictureError = document.getElementById("picture");
          pictureError.style.border="2px solid red";
        } else {
          const pictureError = document.getElementById("picture");
          pictureError.style.border="2px solid black";
        }
        if (this.resultNoise==false) {
          const noiseError = document.getElementById("noise");
          noiseError.style.border="2px solid red";
        } else {
          const noiseError = document.getElementById("noise");
          noiseError.style.border="2px solid black";
        }
        if (this.stageContent.length == 0) {
          const contentError = document.getElementById("content");
          contentError.style.border="2px solid red";
        } else {
          const contentError = document.getElementById("content");
          contentError.style.border="2px solid black";
        }
      }
    },
  },

  mounted() {
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
};
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