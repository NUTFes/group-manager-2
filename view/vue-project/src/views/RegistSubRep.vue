<template>
  <div>
    <router-link to="/mypage" style="text-decoration: none"><span class="regist-back-link">戻る</span></router-link>
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
                v-for="item in departments"
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
                v-for="item in grades"
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
  </div>
</template>

<script>
import axios from "axios";
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
      departments: [
        { name: "機械創造工学課程", id: 1 },
        { name: "電気電子情報工学課程", id: 2 },
        { name: "物質材料工学課程", id: 3 },
        { name: "環境社会基盤工学課程", id: 4 },
        { name: "生物機能工学課程", id: 5 },
        { name: "情報・経営システム工学課程", id: 6 },
        { name: "機械創造工学専攻", id: 7 },
        { name: "電気電子情報工学専攻", id: 8 },
        { name: "物質材料工学専攻", id: 9 },
        { name: "環境社会基盤工学専攻", id: 10 },
        { name: "生物機能工学専攻", id: 11 },
        { name: "情報・経営システム工学専攻", id: 12 },
        { name: "原子力システム安全工学専攻", id: 13 },
        { name: "システム安全専攻", id: 14 },
        { name: "技術科学イノベーション専攻", id: 15 },
        { name: "情報・制御工学専攻", id: 16 },
        { name: "材料工学専攻", id: 17 },
        { name: "エネルギー・環境工学専攻", id: 18 },
        { name: "生物統合工学専攻", id: 19 },
        { name: "その他", id: 20 },
      ],
      grades: [
        { name: "B1[学部1年]", id: 1 },
        { name: "B2[学部2年]", id: 2 },
        { name: "B3[学部3年]", id: 3 },
        { name: "B4[学部4年]", id: 4 },
        { name: "M1[修士1年]", id: 5 },
        { name: "M2[修士2年]", id: 6 },
        { name: "D1[博士1年]", id: 7 },
        { name: "D2[博士2年]", id: 8 },
        { name: "D3[博士3年]", id: 9 },
        { name: "GD1[イノベ1年]", id: 10 },
        { name: "GD2[イノベ2年]", id: 11 },
        { name: "GD3[イノベ3年]", id: 12 },
        { name: "GD4[イノベ4年]", id: 13 },
        { name: "GD5[イノベ5年]", id: 14 },
        { name: "その他", id: 15 },
      ],
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