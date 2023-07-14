<template>
  <div class="main-content">
    <div class="body"></div>
    <div class="grad"></div>
    <div class="header">
      <div>Group<span> Manager</span> 2</div>
    </div>
    <br />
    <div class="login">
      <input v-model="email" type="text" placeholder="email" /><br />
      <input v-model="password" type="password" placeholder="password" /><br />
      <button @click="loginWithAuthModule" class="bn632-hover bn27">
        login
      </button>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      image_src: require("@/assets/homepic.png"),
      password: "",
      email: "",
      show_pass: true,
      formHasErrors: false,
      message: "",
      warnStyle: {
        color: "#F44336",
      },
      rules: {
        required: (value) => !!value || "入力してください",
        min: (value) => value.length >= 8 || "８文字以上入力してください",
        email: (value) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "適切なメールアドレスではありません";
        },
      },
    };
  },
  computed: {
    form() {
      return {
        email: null,
        password: null,
      };
    },
    getMessage() {
      return this.message;
    },
  },
  methods: {
    ...mapActions('users', ['getUser']),
    async loginWithAuthModule() {
      // this.formHasErrors = false;
      // Object.keys(this.form).forEach((f) => {
      //   if (!this.form[f]) this.formHasErrors = true;
      //   this.$refs[f].validate(true);
      // });
      // if (!this.formHasErrors) return "Can't Sign Up";
      await this.$auth
        .loginWith("local", {
          data: {
            email: this.email,
            password: this.password,
          },
        })
        .then(
          (response) => {
            localStorage.setItem(
              "access-token",
              response.headers["access-token"]
            );
            localStorage.setItem("client", response.headers.client);
            localStorage.setItem("uid", response.headers.uid);
            localStorage.setItem("token-type", response.headers["token-type"]);
            this.getUser()
            return response;
          },
        )
          // (error) => {
          //   this.message = "メールアドレスかパスワードが違います。";
          //   return error;
          // }
          .catch(() => {
            alert(
              "ログインに失敗しました。メールアドレスとパスワードを確認してください。\nLogin failed. Please check your email address and password."
            );
          });
      
    },
  },
};
</script>

<style scoped>
@import url(https://fonts.googleapis.com/css?family=Exo:100,200,400);
@import url(https://fonts.googleapis.com/css?family=Source+Sans+Pro:700,400,300);

body {
  margin: 0;
  padding: 0;
  background: #fff;

  color: #fff;
  font-family: Arial;
  font-size: 12px;
}

.body {
  position: absolute;
  top: -20px;
  left: -20px;
  right: -40px;
  bottom: -40px;
  width: auto;
  height: auto;
  background-color: #535353;
  background-size: cover;
  -webkit-filter: blur(5px);
  z-index: 0;
}

.grad {
  position: absolute;
  top: -20px;
  left: -20px;
  right: -40px;
  bottom: -40px;
  width: auto;
  height: auto;
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    color-stop(0%, rgba(0, 0, 0, 0)),
    color-stop(100%, rgba(0, 0, 0, 0.65))
  ); /* Chrome,Safari4+ */
  z-index: 1;
  opacity: 0.7;
}

.header {
  position: absolute;
  top: calc(50% - 35px);
  left: calc(45% - 255px);
  z-index: 2;
}

.header div {
  float: left;
  color: #fff;
  font-family: "Exo", sans-serif;
  font-size: 30px;
  font-weight: 200;
}

.header div span {
  color: #5379fa !important;
}

.login {
  position: absolute;
  top: calc(50% - 75px);
  left: calc(50% - 50px);
  height: 150px;
  width: 350px;
  padding: 10px;
  z-index: 2;
}

.login input[type="text"] {
  width: 250px;
  height: 30px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 2px;
  color: #fff;
  font-family: "Exo", sans-serif;
  font-size: 16px;
  font-weight: 400;
  padding: 4px;
}

.login input[type="password"] {
  width: 250px;
  height: 30px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 2px;
  color: #fff;
  font-family: "Exo", sans-serif;
  font-size: 16px;
  font-weight: 400;
  padding: 4px;
  margin-top: 10px;
}

.login input[type="button"] {
  width: 260px;
  height: 35px;
  background: #fff;
  border: 1px solid #fff;
  cursor: pointer;
  border-radius: 2px;
  color: #a18d6c;
  font-family: "Exo", sans-serif;
  font-size: 16px;
  font-weight: 400;
  padding: 6px;
  margin-top: 10px;
}

.login input[type="button"]:hover {
  opacity: 0.8;
}

.login input[type="button"]:active {
  opacity: 0.6;
}

.login input[type="text"]:focus {
  outline: none;
  border: 1px solid rgba(255, 255, 255, 0.9);
}

.login input[type="password"]:focus {
  outline: none;
  border: 1px solid rgba(255, 255, 255, 0.9);
}

.login input[type="button"]:focus {
  outline: none;
}

::-webkit-input-placeholder {
  color: rgba(255, 255, 255, 0.6);
}

::-moz-input-placeholder {
  color: rgba(255, 255, 255, 0.6);
}
.bn632-hover {
  width: 160px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  margin: 20px;
  height: 55px;
  text-align: center;
  border: none;
  background-size: 300% 100%;
  border-radius: 50px;
  moz-transition: all 0.4s ease-in-out;
  -o-transition: all 0.4s ease-in-out;
  -webkit-transition: all 0.4s ease-in-out;
  transition: all 0.4s ease-in-out;
}

.bn632-hover:hover {
  background-position: 100% 0;
  moz-transition: all 0.4s ease-in-out;
  -o-transition: all 0.4s ease-in-out;
  -webkit-transition: all 0.4s ease-in-out;
  transition: all 0.4s ease-in-out;
}

.bn632-hover:focus {
  outline: none;
}

.bn632-hover.bn27 {
  background-image: linear-gradient(
    to right,
    #ed6ea0,
    #ec8c69,
    #f7186a,
    #fbb03b
  );
  box-shadow: 0 4px 15px 0 rgba(236, 116, 149, 0.75);
}
/* 簡易リセットCSS */
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

/* 背景 */
.bg {
  background-color: #000; /* 画像がない場合のフォールバック */
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  width: 100%;
  padding: 60px 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ガラス本体 */
.glass {
  width: 100%;
  max-width: 2200px;
  padding-top: 500px;
  background-color: rgba(255, 255, 255, 0.1); /* 背景色 */
  border: 1px solid rgba(255, 255, 255, 0.4); /* ボーダー */
  border-right-color: rgba(255, 255, 255, 0.2);
  border-bottom-color: rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  -webkit-backdrop-filter: blur(20px); /* ぼかしエフェクト */
  backdrop-filter: blur(20px);
  box-shadow: 0 5px 20px rgba(255, 152, 79, 0.5); /* 薄い影 */
}
</style>
