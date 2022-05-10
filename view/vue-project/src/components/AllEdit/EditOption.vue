<template>
  <transition name="fade" appear>
    <div class="add-modal">
      <div class="add-modal_box">
        <div id="btnContainer">
          <button v-on:click="$emit('closeEditOption')">✖</button>
        </div>
        <h1>オプション申請</h1>
        <div>所持機器の利用</div>
        <select v-model="item" @change="validationItem" id="item">
          <option
            v-for="list in itemsAvailable"
            :value="list.value"
            :key="list.value"
          >
            {{ list.label }}
          </option>
        </select>
        <div>音楽</div>
        <select v-model="music" @change="validationMusic" id="music">
          <option
            v-for="list in musicAvailable"
            :value="list.value"
            :key="list.value"
          >
            {{ list.label }}
          </option>
        </select>
        <div>撮影許可</div>
        <select v-model="picture" @change="validationPicture" id="picture">
          <option
            v-for="list in photoAvailable"
            :value="list.value"
            :key="list.value"
          >
            {{ list.label }}
          </option>
        </select>
        <div>騒音</div>
        <select v-model="noise" @change="validationNoise" id="noise">
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
          <button id="btn" type="button">✓登録</button>
        </span>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
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
    }
  },
  methods: {
    reset: function() {
      this.item = [],
      this.music = [],
      this.picture = [],
      this.noise = [],
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