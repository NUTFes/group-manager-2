<template>
  <transition name="fade" appear>
    <div class="add-modal">
        <div class="add-modal_box">
          <div id="btnContainer">
            <button v-on:click="$emit('closeEditSubRep')">✖</button>
          </div>
          <h1>副代表申請{{department_id}}</h1>
          <div class="entry">名前</div>
          <input type="text" v-model="name" id="name">
          <div class="entry">学科</div>
          <select v-model="department_id" id="department_id">
              <option
                v-for="item in departmentList"
                :value="item.id"
                :key="item.id"
              >
                {{ item.name }}
              </option>
            </select>
          <div class="entry">学年</div>
          <select v-model="grade_id" id="grade_id">
            <option
              v-for="item in gradeList"
              :value="item.id"
              :key="item.id"
            >
              {{ item.name }}
            </option>
          </select>
          <div class="entry">電話番号</div>
          <input type="text" maxlength="11" v-model="tel" id="tel" @change="validationTel">
          <div class="entry">メールアドレス</div>
          <input type="text" v-model="email" id="email" @change="validationEmail">
          <div class="entry">学生番号</div>
          <input type="text" maxlength="8" v-model="student_id" id="student_id" @change="validationStudentId">
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
import departmentList from "../../plugins/department";
import gradeList from "../../plugins/grade";
export default {
  props: {
    groupId: Number,
    name: String,
    department_id: Number,
    grade_id: Number,
    tel: String,
    email: String,
    student_id: String,
  },
  data() {
    return {
      departmentList: departmentList,
      gradeList: gradeList,
    };
  },
  methods: {
    reset: function() {
      this.name = [],
      this.department_id = [],
      this.grade_id = [],
      this.tel = [],
      this.email = [],
      this.student_id = []
    },
    onStuentIdValidation: function() {
      this.resultStudentId = true;
    },
    offStudentIdValidation: function() {
      this.resultStudentId = false;
    },
    onTelValidation: function() {
      this.resultTel = true;
    },
    offTelValidation: function() {
      this.resultTel = false;
    },
    onEmailValidation: function() {
      this.resultEmail = true;
    },
    offEmailValidation: function() {
      this.resultEmail = false;
    },
    register: function () {
      if (this.name.length > 0 && this.department_id != 0 && this.grade_id != 0 && this.resultEmail && this.resultTel && this.resultStudentId) {
        const url =
        process.env.VUE_APP_URL +
        "/sub_reps" + "/" + this.groupId + "?" +
        "name=" + this.name +
        "&department_id=" + this.department_id +
        "&grade_id=" + this.grade_id +
        "&tel=" + this.tel +
        "&email=" + this.email +
        "&student_id=" + this.student_id;
        axios.put(url).then(
          (response) => {
            console.log("response:", response);
            this.$emit("closeEditSubRep");
            this.$emit("reload");
          },
          (error) => {
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
        if (this.department_id == 0) {
          const departmentError = document.getElementById("department_id");
          departmentError.style.border="2px solid red";
        } else {
          const departmentError = document.getElementById("department_id");
          departmentError.style.border="2px solid black";
        }
        if (this.grade_id == 0) {
          const gradeError = document.getElementById("grade_id");
          gradeError.style.border="2px solid red";
        } else {
          const gradeError = document.getElementById("grade_id");
          gradeError.style.border="2px solid black";
        }
        if (this.resultEmail==false) {
          const emailError = document.getElementById("email");
          emailError.style.border="2px solid red";
        } else {
          const emailError = document.getElementById("email");
          emailError.style.border="2px solid black";
        }
        if (this.resultTel==false) {
          const telError = document.getElementById("tel");
          telError.style.border="2px solid red";
        } else {
          const telError = document.getElementById("tel");
          telError.style.border="2px solid black";
        }
        if (this.resultStudentId==false) {
          const studentIdError = document.getElementById("student_id");
          studentIdError.style.border="2px solid red";
        } else {
          const studentIdError = document.getElementById("student_id");
          studentIdError.style.border="2px solid black";
        }
      }
    },
  },
  computed: {
    validationStudentId(){
      const pattern = /[0-9０-９]{8}/;
      if (pattern.test(this.student_id)==true) {
        this.onStuentIdValidation();
      } else {
        this.offStudentIdValidation();
      }
      return this.resultStudentId
    },
    validationTel(){
      const pattern = /[0-9０-９]{10,11}/;
      if (pattern.test(this.tel)==true) {
        this.onTelValidation();
      } else {
        this.offTelValidation();
      }
      return this.resultTel
    },
    validationEmail(){
      const pattern = /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/;
      if (pattern.test(this.email)==true) {
        this.onEmailValidation();
      } else {
        this.offEmailValidation();
      }
      return this.resultEmail
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
    margin-top: 15%;
    margin-bottom: 5%;
    border-radius: 5px;
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
  select{
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
    margin-top: 3%;
    margin-left: 10%;
    margin-right: 10%;
  }
  .tuiki {
    margin-top: 3%;
    margin-left: 10%;
    margin-right: 10%;
    font-size: 12px;
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