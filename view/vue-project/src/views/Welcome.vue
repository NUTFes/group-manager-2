<template>
  <div class="background" id="container">
     <div>
      <br><br><br>
      <div class="text-label">
        <v-container>
          <v-row>
          <v-col cols="3"></v-col>
            <v-col cols="6">
              <v-sheet>NUT festival<br>~飛翔~</v-sheet>
            </v-col>
            <v-col cols="3"></v-col>
          </v-row>
        </v-container>
      </div>
      <br><br>
      <v-row>
        <v-col cols="3"></v-col>
        <v-col cols="6">
          <div class="text-center">
            <v-btn depressed color="#5C6BC0" dark @click="onClickSignUp">新規登録</v-btn>
            <Signup ref="signup"/> 
          </div>
          <br>
          <div class="text-center">
            <v-btn depressed color="#5C6BC0" dark @click="onClickSignIn">ログイン</v-btn>
            <Signin ref="signin"/> 
            <br>
          </div>
        </v-col>
        <v-col cols="3"></v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import AssetsImage from "../assets/welcome.png"
import Signup from '../components/SignUp.vue'
import Signin from '../components/SignIn.vue'
export default {
  name: "Welcome",
  components: {
    Signup,
    Signin
  },
  methods: {
    onClickSignUp() {
      this.$refs.signup.open();
    },
    onClickSignIn() {
      this.$refs.signin.open();
    }
  }
}
</script>


<style>
v-sheet{
  color: black;
}

.text-label{
  opacity: 0.5;
  text-align: center;
}

.background{
 background-image: url("~@/assets/welcome.png");
 background-size: cover;
 min-height: 100vh;
 background-position: center center;
}

.text-label{
  font-size: 45px;
  text-align: center;
}
</style>
