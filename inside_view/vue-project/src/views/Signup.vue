<template>
  <div class="home">
    <h1>新規登録</h1>
    <a href="/signin">ログインはこちら</a>
    <form ref="form">
      <h3>
        <label >
          名前
          <br>
          <input
          id="name"
          ref="name"
          v-model="name"
          @change="validationName"
          required
          >
        </label>
      </h3>
      
      <h3>
        <label>
          メールアドレス
          <br>
          <input
          id="email"
          ref="email"
          v-model="email"
          type="email"
          @change="validationEmail"
          required
          >
        </label>
      </h3>
      
      <h3>
        <label>
          パスワード
          <br>
          <input
          id="password"
          placeholder="8文字以上"
          ref="password"
          v-model="password"
          type="password"
          minlength="8"
          @change="validationPass"
          required
          >
        </label>
      </h3>

      <h3>
        <label>
          パスワードの再入力
          <br>
          <input 
          id="password_confirmation"
          placeholder="8文字以上"
          ref="password_confirmation"
          v-model="password_confirmation"
          type="password"
          minlength="8"
          @change="validationPasswordConfirmation"
          required
          >
        </label>
      </h3>
      
    </form>
    <br>
    <button @click="Submit">登録</button>
  </div>
</template>

<script>
import axios from "axios";
export default{
  data(){
    return {
      name: [],
      email: [],
      password: [],
      password_confirmation: [],
      resultName: false,
      resultEmail: false,
      resultPass: false,
      resultPasswordConfirmation: false,
    }
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
    validationEmail(){
      const pattern = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      if (pattern.test(this.email)==true) {
        this.onEmailValidation();
      } else {
        this.offEmailValidation();
      }
      return this.resultEmail
    },
    validationPass(){
      const pattern = /[A-Za-z0-9]{8,}/;
      if (pattern.test(this.password)==true) {
        this.onPassValidation();
      } else {
        this.offPassValidation();
      }
      return this.resultPass
    },
    validationPasswordConfirmation(){
      if(this.password_confirmation == this.password) {
        this.onPasswordConfirmationValidation();
      } else {
        this.offPasswordConfirmationValidation();
      }
      return this.resultPasswordConfirmation
    },
  },
  methods: {
    onNameValidation: function() {
      this.resultName = true;
    },
    offNameValidation: function() {
      this.resultName = false;
    },
    onEmailValidation: function() {
      this.resultEmail = true;
    },
    offEmailValidation: function() {
      this.resultEmail = false;
    },
    onPassValidation: function() {
      this.resultPass = true;
    },
    offPassValidation: function() {
      this.resultPass = false;
    },
    onPasswordConfirmationValidation: function() {
      this.resultPasswordConfirmation = true;
    },
    offPasswordConfirmationValidation: function() {
      this.resultPasswordConfirmation = false;
    },
    Submit() {
      if (this.resultName && this.resultEmail && this.resultPass && this.resultPasswordConfirmation){
        const url = process.env.VUE_APP_URL + "/api/auth";
        var params = new URLSearchParams();
        params.append("name", this.name);
        params.append("email", this.email);
        params.append("role_id", 2); // デフォルトはmanager権限
        params.append("password", this.password);
        params.append("password_confirmation", this.password_confirmation);
        axios.defaults.headers.common["Content-Type"] = "application/json";
        axios.post(url, params).then((response) => {
          localStorage.setItem("access-token", response.headers["access-token"]);
          localStorage.setItem("client", response.headers["client"]);
          localStorage.setItem("uid", response.headers["uid"]);
          localStorage.setItem("token-type", response.headers["token-type"]);
          this.$router.push("/group");
        });
      } else{
        if (this.resultName==false) {
          const studentIdError = document.getElementById("name");
          studentIdError.style.border="2px solid red";
        } else {
          const studentIdError = document.getElementById("name");
          studentIdError.style.border="2px solid black";
        }
        if (this.resultEmail==false) {
          const studentIdError = document.getElementById("email");
          studentIdError.style.border="2px solid red";
        } else {
          const studentIdError = document.getElementById("email");
          studentIdError.style.border="2px solid black";
        }
        if (this.resultPass==false) {
          const studentIdError = document.getElementById("password");
          studentIdError.style.border="2px solid red";
        } else {
          const studentIdError = document.getElementById("password");
          studentIdError.style.border="2px solid black";
        }
        if (this.resultPasswordConfirmation==false) {
          const studentIdError = document.getElementById("password_confirmation");
          studentIdError.style.border="2px solid red";
        } else {
          const studentIdError = document.getElementById("password_confirmation");
          studentIdError.style.border="2px solid black";
        }
      }
    },
  }
}
</script>


<style>
.home{
  margin-top: 60px;
}
</style>