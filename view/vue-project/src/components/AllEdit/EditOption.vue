<template>
  <transition name="fade" appear>
    <div class="add-modal">
      <div class="add-modal_box">
        <div id="btnContainer">
          <button v-on:click="$emit('closeEditOption')">✖</button>
        </div>
        <h1>オプション申請</h1>
        <div>所持機器の利用</div>
        <select v-model="ownEquipment" @change="validationItem" id="item">
          <option
            v-for="list in itemsAvailable"
            :value="list.value"
            :key="list.value"
          >
            {{ list.label }}
          </option>
        </select>
        <div>音楽</div>
        <select v-model="bgm" @change="validationMusic" id="music">
          <option
            v-for="list in musicAvailable"
            :value="list.value"
            :key="list.value"
          >
            {{ list.label }}
          </option>
        </select>
        <div>撮影許可</div>
        <select v-model="cameraPermission" @change="validationPicture" id="picture">
          <option
            v-for="list in photoAvailable"
            :value="list.value"
            :key="list.value"
          >
            {{ list.label }}
          </option>
        </select>
        <div>騒音</div>
        <select v-model="loudSound" @change="validationNoise" id="noise">
          <option
            v-for="list in loudAble"
            :value="list.value"
            :key="list.value"
          >
            {{ list.label }}
          </option>
        </select>
        <div>ステージ内容</div>
        <input type="text" v-model="stageContent" id="content">
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
    id: Number,
    ownEquipment: Boolean,
    bgm: Boolean,
    cameraPermission: Boolean,
    loudSound: Boolean,
    stageContent: String,
  },
  data() {
    return {
      resultItem: true,
      resultMusic: true,
      resultPicture: true,
      resultNoise: true,
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
    }
  },
  methods: {
    validationItem: function() {
      if (this.ownEquipment==true || this.ownEquipment==false) {
        this.resultItem = true;
      } else {
        this.resultItem = false;
      }
      return this.resultItem
    },
    validationMusic: function() {
      if (this.bgm==true || this.bgm==false) {
        this.resultMusic = true;
      } else {
        this.resultMusic = false;
      }
      return this.resultMusic
    },
    validationPicture: function() {
      if (this.cameraPermission==true || this.cameraPermission==false) {
        this.resultPicture = true;
      } else {
        this.resultPicture = false;
      }
      return this.resultPicture
    },
    validationNoise: function() {
      if (this.loudSound==true || this.loudSound==false) {
        this.resultNoise = true;
      } else {
        this.resultNoise = false;
      }
      return this.resultNoise
    },
    register: function () {
      if (this.resultItem && this.resultMusic && this.resultPicture && this.resultNoise && this.stageContent.length > 0) {
        const url = process.env.VUE_APP_URL + "/stage_common_options" + "/" + this.id +
        "?group_id=" + this.groupId +
        "&own_equipment=" + this.ownEquipment +
        "&bgm=" + this.bgm +
        "&camera_permission=" + this.cameraPermission +
        "&loud_sound=" + this.loudSound +
        "&stage_content=" + this.stageContent;
        axios.defaults.headers.common["Content-Type"] = "application/json";
        axios.put(url).then(
          (response) => {
            console.log(response.status);
            this.$emit("closeEditOption");
            this.$emit("reload");
          },
          (error) => {
            return error;
          }
        );
      } else {
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
    reset: function() {
      this.ownEquipment = [],
      this.bgm = [],
      this.cameraPermission = [],
      this.loudSound = [],
      this.stageContent = []
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