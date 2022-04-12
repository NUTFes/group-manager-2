<template>
  <div class="home">
    <h1>ログイン</h1>
    <a href="/signup">新規登録はこちら</a>
    <form>
      <h3>{{resultPass}}{{resultEmail}}
        <label>
          メールアドレス
          <br>
          <input
          id="email"
          ref="email"
          v-model="email"
          type="email"
          required
          @change="validationEmail"
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
          required
          @change="validationPass"
          >
        </label>
      </h3>
      <br>
      <button @click="Submit">ログイン</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
export default{
  data(){
    return {
      email: [],
      password: [],
      resultEmail: false,
      resultPass: false,
      new_info: [],
    }
  },
  computed: {
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

      if (this.password.length) {
        this.onPassValidation();
      } else {
        this.offPassValidation();
      }
      return this.resultPass
    },
  },
  mounted() {
    const new_info_url = process.env.VUE_APP_URL + "/api/v1/users/show";
    axios
      .get(new_info_url, {
        headers: {
          "Content-Type": "application/json",
          "access-token": localStorage.getItem("access-token"),
          client: localStorage.getItem("client"),
          uid: localStorage.getItem("uid"),
        },
      })
      .then((response) => {
        console.log(response);
        this.new_info = response.data;
      });
  },
  methods: {
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

    Submit() {
      if (this.resultEmail && this.resultPass){
        const url = process.env.VUE_APP_URL + "/api/auth/sign_in";
        let params = new URLSearchParams();
        params.append("email", this.email);
        params.append("password", this.password);
        axios.defaults.headers.common["Content-Type"] = "application/json";
        axios.post(url, params).then(
          (response) => {
            localStorage.setItem("access-token",response.headers["access-token"]);
            localStorage.setItem("client", response.headers["client"]);
            localStorage.setItem("uid", response.headers["uid"]);
            localStorage.setItem("token-type", response.headers["token-type"]);
            this.$router.push("/display");
            console.log("aaaaaaaaaaaaaaaaaaaaaa")
          },
          (error) => {
            this.message = "ログインに失敗しました。<br>Failed to SignIn";
            console.log("ddddddddddddddd")
            return error;
          });
      }else{
        console.log("bbbbbbbbbbbbbbbbbbbbb")
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
      }
    }
  },
}
</script>

<style scoped>
.home{
  margin-top: 60px;
}
</style>