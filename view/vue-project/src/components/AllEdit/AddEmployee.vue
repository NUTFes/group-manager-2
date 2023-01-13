<template>
  <transition name="fade" appear>
    <div class="add-modal">
      <div class="add-modal_box">
        <div id="btnContainer">
          <button v-on:click="$emit('closeAddEmployee')">✖</button>
        </div>
        <h1>従業員追加</h1>
        <div class="entry">氏名</div>
        <input type="text" v-model="name" id="name">
        <div class="entry">学籍番号</div>
        <input type="text" v-model="student_id" id="student_id">
        <span style="display:flex;">
          <button id="btn" type="button" @click="reset">リセット</button>
          <button id="btn" type="button" @click="register">✓追加</button>
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
      new_info: [],
      name: [],
      student_id: [],
      stool_test_id: [],
    };
  },
  methods: {
    reset: function() {
      this.name = [],
      this.student_id = []
    },
    register: function() {
      if (this.name.length > 0 && this.student_id.length > 0){
        const post_url = process.env.VUE_APP_URL + "/employees";
        axios.defaults.headers.common["Content-Type"] = "application/json";
        let params = new URLSearchParams();
        params.append("group_id", this.groupId);
        params.append("name", this.name);
        params.append("student_id", this.student_id);
        params.append("stool_test_id", 1);
        axios.post(post_url, params).then(
          (response) => {
            console.log(response);
            this.$emit("closeAddEmployee");
            this.$emit("reload");
          },
          (error) => {
            console.log(post_url)
            return error;
          });
      } else {
        if (this.name.length == 0) {
          const nameError = document.getElementById("name");
          nameError.style.border="2px solid red";
        } else {
          const nameError = document.getElementById("name");
          nameError.style.border="2px solid black";
        }
        if (this.student_id.length != 0) {
          const student_idError = document.getElementById("student_id");
          student_idError.style.border="2px solid red";
        } else {
          const student_idError = document.getElementById("student_id");
          student_idError.style.border="2px solid black";
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
    margin: 15% 10% 5% 10%;
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
    width: 80%;
    margin: 0% auto;
    border: 1px solid silver;
    border-top : solid 1px #717171;
    border-bottom : solid 1px #e0e0e0;
    border-radius: 5px;
    background-color: white;
  }
  h1 {
    margin: 5%;
  }
  .entry {
    margin: 3% 10% 0 10%;
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
