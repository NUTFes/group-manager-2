<template>
  <div>
    <br><br><br>
    <h1>Welcome</h1>
    <br>
    <div class="text-center">
      <v-btn rounded color="#033" dark @click="onClick">Sign Up</v-btn>
      <Signup ref="signup"/> 
    </div>
  </div>
</template>

<script>
import Signup from '../components/SignUp.vue'
export default {
  name: "Welcome",
  components: {
    Signup
  },
  methods: {
    onClick() {
      this.$refs.signup.open();
    }
  }
}
</script>

<style>
h1 {
  text-align: center;
  font-family: "Monotype Corsiva";
  color: white;
  font-size: 80px;
}
body {
  background-color: #333333;
}
.text-center {
  text-align: center;
}
</style>
