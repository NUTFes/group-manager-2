<template>
  <div>
    <router-link to="/mypage" style="text-decoration: none"><span class="regist-back-link">マイページへ</span></router-link>
    <div class="regist-title">副代表者の登録</div>
    <div class="regist-card">
      <div class="regist-card">
        <div class="regist-card-content">
          <div class="regist-card-content-question">
            <div class="regist-card-content-question-label">名前</div>
            <input id="name" type="text" v-model="name" @change="validationName" />
          </div>
          <div class="regist-card-content-question">
            <div class="regist-card-content-question-label">学籍番号</div>
            <input id="studentId" maxlength="8" v-model="student_id" @change="validationStudentId" />
          </div>
          <div class="regist-card-content-question">
            <div class="regist-card-content-question-label">学科</div>
            <select v-model="department_id" @change="validationGrade" id="department">
              <option
                v-for="item in departmentList"
                :value="item.id"
                :key="item.id"
              >
                {{ item.name }}
              </option>
            </select>
          </div>
          <div class="regist-card-content-question">
            <div class="regist-card-content-question-label">学年</div>
            <select v-model="grade_id" @change="validationDepartment" id="grade">
              <option
                v-for="item in gradeList"
                :value="item.id"
                :key="item.id"
              >
                {{ item.name }}
              </option>
            </select>
          </div>
          <div class="regist-card-content-question">
            <div class="regist-card-content-question-label">電話番号</div>
            <input id="tel" maxlength="11" placeholder="ハイフンなし" v-model="tel" @change="validationTel" />
          </div>
          <div class="regist-card-content-question">
            <div class="regist-card-content-question-label">メールアドレス</div>
            <input id="email" type="text" v-model="email" placeholder="～@～.～" @change="validationEmail" />
          </div>
        </div>
      </div>
    </div>
    <div class="regist-button">
      <button @click="register" class="regist-submit-button">登録する</button>
    </div>
    <div v-if="this.$store.state.fromMypage == false" class="skip-button">
      <button @click="skip" class="regist-skip-button">スキップしてあとで登録する</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import departmentList from "../plugins/department";
import gradeList from "../plugins/grade";
export default {
  data() {
    return {
      resultName: false,
      resultStudentId: false,
      resultDepartment: false,
      resultGrade: false,
      resultTel: false,
      resultEmail: false,
      name: [],
      student_id: [],
      department_id: [],
      grade_id: [],
      tel: [],
      email: [],
      departmentList: departmentList,
      gradeList: gradeList,
    };
  },
  computed: {
    validationName(){
      if (this.name.length) {
        this.onNameValidation();
      } else {
        this.offNameValidation();
      }
      return this.resultName
    },
    validationStudentId(){
      const pattern = /[0-9０-９]{8}/;
      if (pattern.test(this.student_id)==true) {
        this.onStuentIdValidation();
      } else {
        this.offStudentIdValidation();
      }
      return this.resultStudentId
    },
    validationDepartment(){
      if (this.department_id != 0) {
        this.onDepartmentValidation();
      } else {
        this.offDepartmentValidation();
      }
      return this.resultDepartment
    },
    validationGrade(){
      if (this.grade_id != 0) {
        this.onGradeValidation();
      } else {
        this.offGradeValidation();
      }
      return this.resultGrade
    },
    validationTel(){
      const pattern = /[0-9０-９]{10}/;
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
  methods: {
    onNameValidation: function() {
      this.resultName = true;
    },
    offNameValidation: function() {
      this.resultName = false;
    },
    onStuentIdValidation: function() {
      this.resultStudentId = true;
    },
    offStudentIdValidation: function() {
      this.resultStudentId = false;
    },
    onDepartmentValidation: function() {
      this.resultDepartment = true;
    },
    offDepartmentValidation: function() {
      this.resultDepartment = false;
    },
    onGradeValidation: function() {
      this.resultGrade = true;
    },
    offGradeValidation: function() {
      this.resultGrade = false;
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
    skip: function() {
      if (localStorage.getItem("group_category_id") == 3){
        this.$store.commit("acceptRegistStageOrderSunnyPermission");
        this.$store.commit("rejectRegistSubRepPermission");
        this.$router.push("/regist_stage_sunny");
      } else {
        this.$store.commit("acceptRegistPlaceOrderPermission");
        this.$store.commit("rejectRegistSubRepPermission");
        this.$router.push("/regist_place");
      }
    },
    register: function () {
      if (this.resultName && this.resultDepartment && this.resultGrade && this.resultEmail && this.resultTel && this.resultStudentId) {
        axios.defaults.headers.common["Content-Type"] = "application/json";
        const subRepUrl = process.env.VUE_APP_URL + "/sub_reps";
        let subRepParams = new URLSearchParams();
        subRepParams.append("group_id", localStorage.getItem("group_id"));
        subRepParams.append("name", this.name);
        subRepParams.append("department_id", this.department_id);
        subRepParams.append("grade_id", this.grade_id);
        subRepParams.append("tel", this.tel);
        subRepParams.append("email", this.email);
        subRepParams.append("student_id", this.student_id);
        axios.post(subRepUrl, subRepParams).then(
          () => {
            if (this.$store.state.fromMypage == true) {
              this.$router.push("/mypage")
            } else {
              if (localStorage.getItem("group_category_id") == 3){
                this.$store.commit("acceptRegistStageOrderSunnyPermission");
                this.$store.commit("rejectRegistSubRepPermission");
                this.$router.push("/regist_stage_sunny");
              } else {
                this.$store.commit("acceptRegistPlaceOrderPermission");
                this.$store.commit("rejectRegistSubRepPermission");
                this.$router.push("/regist_place");
              }
            }
          },
          (error) => {
            return error;
          }
        );
      } else {
        if (this.resultName==false) {
          const nameError = document.getElementById("name");
          nameError.style.border="2px solid red";
        } else {
          const nameError = document.getElementById("name");
          nameError.style.border="2px solid black";
        }
        if (this.resultDepartment==false) {
          const departmentError = document.getElementById("department");
          departmentError.style.border="2px solid red";
        } else {
          const departmentError = document.getElementById("department");
          departmentError.style.border="2px solid black";
        }
        if (this.resultGrade==false) {
          const gradeError = document.getElementById("grade");
          gradeError.style.border="2px solid red";
        } else {
          const gradeError = document.getElementById("grade");
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
          const studentIdError = document.getElementById("studentId");
          studentIdError.style.border="2px solid red";
        } else {
          const studentIdError = document.getElementById("studentId");
          studentIdError.style.border="2px solid black";
        }
      }
    },
  },

  mounted() {
    // 直リンク対策
    if (this.$store.state.registSubRepPermission == false) {
      this.$router.push("/mypage");
    }
  }
};
</script>

<style scoped>
  select,input{
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