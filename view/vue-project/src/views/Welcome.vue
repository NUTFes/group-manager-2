<template>
  <div>
    <br><br><br>
    <h1>Welcome</h1>
    <br>
    <div class="text-center">
      <v-btn rounded color="#033" dark @click="onClickSignUp">Sign Up</v-btn>
      <Signup ref="signup"/> 
    </div>
    <br>
    <div class="text-center">
      <v-btn rounded color="#033" dark @click="onClickSignIn">Sign In</v-btn>
      <Signin ref="signin"/> 
    </div>
  </div>
</template>

<script>
import Signup from '../components/SignUp.vue'
import Signin from '../components/SignIn.vue'
export default {
  name: "Welcome",
  components: {
    Signup,
    Signin
  },
  data: () => ({
    dialog: false,
  }),
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
  color: #008b8b;
  font-size: 80px;
}
.text-center {
  text-align: center;
}
</style>
