<template>
  <transition name="fade" appear>
    <div class="add-modal">
      <div class="add-modal_box">
        <div id="btnContainer">
          <button v-on:click="$emit('closeDeleteEmployee')">✖</button>
        </div>
        <h1>従業員の削除</h1>
        <span style="display:flex;">
          <button id="btn" type="button" v-on:click="$emit('closeDeleteEmployee')">戻る</button>
          <button id="btn" type="button" @click="deleteEmployee">✓削除</button>
        </span>
      </div>
    </div>
  </transition>
</template>

<script>
import axios from "axios";
export default {
  props: {
    id: Number,
  },
  methods: {
    deleteEmployee() {
      const url =
        process.env.VUE_APP_URL + "/employees/" + this.id;
      axios.delete(url).then(
        (response) => {
          console.log(response.status);
          this.$emit("closeDeleteEmployee");
          this.$emit("reload");
        },
        (error) => {
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
