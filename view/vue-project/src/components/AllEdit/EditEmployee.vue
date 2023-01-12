<template>
  <transition name="fade" appear>
    <div class="add-modal">
      <div class="add-modal_box">
        <div id="btnContainer">
          <button v-on:click="$emit('closeEditEmployee')">✖</button>
        </div>
        <h1>従業員編集</h1>
        <h1 class="tytle">従業員編集</h1>
        <div>氏名</div>
        <input type="text" v-model="name">
        <div>学籍番号</div>
        <input type="text" v-model="student_id">
        <span style="display:flex;">
          <button id="btn" type="button" @click="reset">リセット</button>
          <button id="btn" type="button" @click="register">✓編集</button>
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
    name: String,
    studentId: Number,
  },
  data() {
    return {
      employeeList: [],
      resultStudentId: [],
      resultName: [],
    };
  },
  computed: {
    validationItem(){
      const pattern = /[0-9０-９]/;
      if (pattern.test(this.num)==true) {
        this.onNumValidation();
      } else {
        this.offNumValidation();
      }
      return this.resultNum
    },
  },
  mounted() {
    const employeeUrl = process.env.VUE_APP_URL + "/employees";
    axios
      .get(employeeUrl, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.employee_list = response.data;
      });
  },
  methods: {
    reset: function() {
      this.name = [],
      this.studentId = []
    },
    // onNumValidation: function() {
    //   this.resultNum = true;
    // },
    // offNumValidation: function() {
    //   this.resultNum = false;
    // },
    register: function () {
      if (this.name > 0 && this.studentId > 0){
        const url = process.env.VUE_APP_URL + "/employees" + "/" +
        this.id + "?group_id=" + this.groupId +
        "&name=" + this.name +
        "&student_id=" + this.studentId +
        "&stool_test_id=" + 1;
        axios.put(url).then(
          (response) => {
            console.log(response.status);
            this.$emit("closeEditEmployee");
            this.$emit("reload");
          },
          (error) => {
            return error;
          }
        );
      } else {
        if (this.name.length == 0) {
          const nameError = document.getElementById("name");
          nameError.style.border = "2px solid red";
        } else {
          const nameError = document.getElementById("name");
          nameError.style.border = "2px solid black";
        }
        if (this.studentId.length != 8) {
          const studentIdError = document.getElementById("student_id");
          studentIdError.style.border = "2px solid red";
        } else {
          const studentIdError = document.getElementById("student_id");
          studentIdError.style.border = "2px solid black";
        }
      }
    },
  },
};
</script>

<style scoped>
  #card{
    margin-right: 15%;
    margin-left: 15%;
  }
  input {
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
