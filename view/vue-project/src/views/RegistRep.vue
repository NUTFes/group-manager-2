<template>
  <div>
    <div class="regist-title">新規ユーザー登録</div>
    <div class="regist-card">
      <div class="regist-card-content">
        <div class="regist-card-content-question">
          <div class="regist-card-content-question-label">名前</div>
          <input
            id="name"
            type="text"
            v-model="name"
            @change="validationName"
          />
        </div>
        <div class="regist-card-content-question">
          <div class="regist-card-content-question-label">学籍番号</div>
          <input
            id="studentId"
            v-model="student_id"
            maxlength="8"
            @change="validationStudentId"
          />
        </div>
        <div class="regist-card-content-question">
          <div class="regist-card-content-question-label">学科</div>
          <select
            v-model="department_id"
            @change="validationGrade"
            id="department"
          >
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
            <option v-for="item in gradeList" :value="item.id" :key="item.id">
              {{ item.name }}
            </option>
          </select>
        </div>
        <div class="regist-card-content-question">
          <div class="regist-card-content-question-label">電話番号</div>
          <input
            id="tel"
            v-model="tel"
            maxlength="11"
            placeholder="ハイフンなし"
            @change="validationTel"
          />
        </div>
        <div class="regist-card-content-question">
          <div class="regist-card-content-question-label">メールアドレス</div>
          <input
            id="email"
            v-model="email"
            placeholder="～@～.～"
            @change="validationEmail"
          />
        </div>
        <div class="regist-card-content-question">
          <div class="regist-card-content-question-label">パスワード</div>
          <input id="password" v-model="password" type="password" />
        </div>
        <div class="regist-card-content-question">
          <div class="regist-card-content-question-label">パスワード確認</div>
          <input
            id="passwordConfirmation"
            v-model="passwordConfirmation"
            type="password"
            placeholder="パスワード再入力"
          />
        </div>
        <div style="text-align:right; color:red; font-size: 24px; margin-right: 30px">{{ errorMessage }}</div>
      </div>
    </div>
    <div class="regist-button">
      <button @click="register" class="regist-submit-button">登録する</button>
    </div>
  </div>
</template>

<script>
import departmentList from "../plugins/department";
import gradeList from "../plugins/grade";
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
      user: [],
      name: [],
      student_id: [],
      department_id: [],
      grade_id: [],
      tel: [],
      email: [],
      user_id: null,
      departmentList: departmentList,
      gradeList: gradeList,
      errorMessage: null,
      isRegistGroup: null,
    };
  },
  mounted() {
    // 直リンク対策
    if (this.$store.state.registRepPermission) {
      console.log("login");
    } else {
      console.log("reject");
      this.$router.push("/");
    }
    // 制御
    const settingurl = process.env.VUE_APP_URL + "/user_page_settings";
    axios
      .get(settingurl, {
        headers: {
          "Content-Type": "application/json",
          "access-token": localStorage.getItem("access-token"),
          client: localStorage.getItem("client"),
        },
      })
      .then((response) => {
        this.isRegistGroup = response.data.data[0].is_regist_group;
      });
  },
  computed: {
    validationName() {
      if (this.name.length) {
        this.onNameValidation();
      } else {
        this.offNameValidation();
      }
      return this.resultName;
    },
    validationStudentId() {
      const pattern = /[0-9０-９]{8}/;
      if (pattern.test(this.student_id) == true) {
        this.onStuentIdValidation();
      } else {
        this.offStudentIdValidation();
      }
      return this.resultStudentId;
    },
    validationDepartment() {
      if (this.department_id != 0) {
        this.onDepartmentValidation();
      } else {
        this.offDepartmentValidation();
      }
      return this.resultDepartment;
    },
    validationGrade() {
      if (this.grade_id != 0) {
        this.onGradeValidation();
      } else {
        this.offGradeValidation();
      }
      return this.resultGrade;
    },
    validationTel() {
      const pattern = /[0-9０-９]{10,11}/;
      if (pattern.test(this.tel) == true) {
        this.onTelValidation();
      } else {
        this.offTelValidation();
      }
      return this.resultTel;
    },
    validationEmail() {
      const pattern =
        /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/;
      if (pattern.test(this.email) == true) {
        this.onEmailValidation();
      } else {
        this.offEmailValidation();
      }
      return this.resultEmail;
    },
  },
  methods: {
    onNameValidation: function () {
      this.resultName = true;
    },
    offNameValidation: function () {
      this.resultName = false;
    },
    onStuentIdValidation: function () {
      this.resultStudentId = true;
    },
    offStudentIdValidation: function () {
      this.resultStudentId = false;
    },
    onDepartmentValidation: function () {
      this.resultDepartment = true;
    },
    offDepartmentValidation: function () {
      this.resultDepartment = false;
    },
    onGradeValidation: function () {
      this.resultGrade = true;
    },
    offGradeValidation: function () {
      this.resultGrade = false;
    },
    onTelValidation: function () {
      this.resultTel = true;
    },
    offTelValidation: function () {
      this.resultTel = false;
    },
    onEmailValidation: function () {
      this.resultEmail = true;
    },
    offEmailValidation: function () {
      this.resultEmail = false;
    },
    register: function () {
      if (
        this.resultName &&
        this.resultDepartment &&
        this.resultGrade &&
        this.resultEmail &&
        this.resultTel &&
        this.resultStudentId &&
        this.password.length != 0 &&
        this.passwordConfirmation.length != 0
      ) {
        // ユーザー新規登録
        const authUrl = process.env.VUE_APP_URL + "/api/auth";
        let authParams = new URLSearchParams();
        console.log(
          this.name,
          this.email,
          this.password,
          this.passwordConfirmation
        );
        authParams.append("name", this.name);
        authParams.append("email", this.email);
        authParams.append("role_id", 3);
        authParams.append("password", this.password);
        authParams.append("password_confirmation", this.passwordConfirmation);
        axios.defaults.headers.common["Content-Type"] = "application/json";
        axios.post(authUrl, authParams).then((response) => {
          localStorage.setItem(
            "access-token",
            response.headers["access-token"]
          );
          localStorage.setItem("client", response.headers["client"]);
          localStorage.setItem("uid", response.headers["uid"]);
          localStorage.setItem("token-type", response.headers["token-type"]);
          localStorage.setItem("user_id", response.data.data.id);
          this.user_id = response.data.data.id;
          const url = process.env.VUE_APP_URL + "/user_details";
          let params = new URLSearchParams();
          params.append("student_id", this.student_id);
          params.append("tel", this.tel);
          params.append("department_id", this.department_id);
          params.append("grade_id", this.grade_id);
          params.append("user_id", this.user_id);
          axios.defaults.headers.common["Content-Type"] = "application/json";
          axios.post(url, params).then(
            () => {
              if (this.isRegistGroup === true) {
                this.$store.commit("acceptRegistGroupPermission");
                this.$store.commit("acceptMypagePermission");
                this.$router.push("regist_group");
              } else {
                this.$store.commit("acceptRegistGroupPermission");
                this.$store.commit("acceptMypagePermission");
                this.$router.push("mypage");
              }
            },
            (error) => {
              this.errorMessage = "ユーザー詳細の登録に失敗しました";
              return error;
            }
          );
        },
        (error) => {
          this.errorMessage = "ユーザーの登録に失敗しました";
          return error;
        });
      } else {
        this.errorMessage = "ユーザーの登録に失敗しました";
        if (this.resultName == false) {
          const nameError = document.getElementById("name");
          nameError.style.border = "2px solid red";
        } else {
          const nameError = document.getElementById("name");
          nameError.style.border = "2px solid black";
        }
        if (this.resultDepartment == false) {
          const departmentError = document.getElementById("department");
          departmentError.style.border = "2px solid red";
        } else {
          const departmentError = document.getElementById("department");
          departmentError.style.border = "2px solid black";
        }
        if (this.resultGrade == false) {
          const gradeError = document.getElementById("grade");
          gradeError.style.border = "2px solid red";
        } else {
          const gradeError = document.getElementById("grade");
          gradeError.style.border = "2px solid black";
        }
        if (this.resultEmail == false) {
          const emailError = document.getElementById("email");
          emailError.style.border = "2px solid red";
        } else {
          const emailError = document.getElementById("email");
          emailError.style.border = "2px solid black";
        }
        if (this.resultTel == false) {
          const telError = document.getElementById("tel");
          telError.style.border = "2px solid red";
        } else {
          const telError = document.getElementById("tel");
          telError.style.border = "2px solid black";
        }
        if (this.resultStudentId == false) {
          const studentIdError = document.getElementById("studentId");
          studentIdError.style.border = "2px solid red";
        } else {
          const studentIdError = document.getElementById("studentId");
          studentIdError.style.border = "2px solid black";
        }
      }
    },
  },
};
</script>

<style scoped>
select,
input {
  text-align: left;
  padding: 1%;
  height: 50px;
  width: 800px;
  border-radius: 7px;
  font-size: 18px;
  vertical-align: top;
}
select,
input:required {
  border: 2px solid red;
}
select,
input:invalid {
  border: 2px solid red;
}
select,
input:valid {
  border: 2px solid black;
}
</style>
