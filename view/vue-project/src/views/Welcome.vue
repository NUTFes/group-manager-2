<template>
  <div class="background">
     <div>
      <br><br><br>
      <h1>Welcome</h1>
      <br><br>
      <div class="text-center">
        <v-btn depressed color="#5C6BC0" dark @click="onClickSignUp">Sign Up</v-btn>
        <Signup ref="signup"/> 
      </div>
      <br>
      <div class="text-center">
        <v-btn depressed color="#5C6BC0" dark @click="onClickSignIn">Sign In</v-btn>
        <Signin ref="signin"/> 
        <br>
      </div>
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
h1 {
  text-align: center;
  font-family: "Monotype Corsiva";
  color: #5E35B1;
  font-size: 125px;
}
.background{
 background-image: url("~@/assets/welcome.png");
 background-size: contain;
 background-position: center center;
}
.text-center {
  text-align: center;
}

</style>
