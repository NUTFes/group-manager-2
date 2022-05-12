<template>
  <div>
    <div class="regist-card">
      <div class="regist-card-content">
        <div class="regist-card-content-question">
          <div class="regist-card-content-question-label">使用電力物品名</div>
          <input type="text" v-model="item" id="item">
        </div>
        <div class="regist-card-content-question">
          <div class="regist-card-content-question-label">最大定格電力</div>
          <input type="text" v-model="power" @change="validationPower" id="power">
        </div>
        <div class="regist-card-content-question">
          <div class="regist-card-content-question-label">メーカー</div>
          <input type="text" v-model="manufacturer" id="manufacturer">
        </div>
        <div class="regist-card-content-question">
          <div class="regist-card-content-question-label">型番・モデル</div>
          <input type="text" v-model="model"  id="model">
        </div>
        <div class="regist-card-content-question">
          <div class="regist-card-content-question-label">商品URL</div>
          <input type="text" placeholder="URL" v-model="url" id="url">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      text: "",
      item: "",
      power: "",
      manufacturer: "",
      model: "",
      url: ""
    }
  },
  props: {
    groupID: Number
  },
  methods: {
    test: function() {
      let inputData = {
        "item": this.item,
        "power": this.power,
        "manufacturer": this.manufacturer,
        "model": this.model,
        "url": this.url
      };
      return inputData
    },
    reset: function() {
      this.item = "";
      this.power = "";
      this.manufacturer = "";
      this.model = "";
      this.url = "";
    }
  }
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
    border: 1px solid red;
  }
  select,input:invalid{
    border: 1px solid red;
  }
  select,input:valid{
    border: 1px solid #333333;
  }
</style>