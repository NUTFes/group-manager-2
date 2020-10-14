<template>
  <div>
    <div class="background" id="container">
      <v-app-bar
        app
        color = "grey darken-1"
        height = "90"
        >
        <v-row align="center">
          <v-col cols="3"><v-btn text class = "title white--text" to="/mypage">参加団体管理アプリ</v-btn></v-col>
          <v-col cols="6" align="center">
            <router-link to="/">
              <v-img 
                         height="70"
                         width ="70"
                         src = "../assets/40th_nutfes_logo_white.png"
                         ></v-img>
            </router-link>
          </v-col>
        </v-row>
      </v-app-bar>
      <div>
        <br><br><br>
        <v-row>
          <v-col cols="1"></v-col>
          <v-col cols="5">
            <div class="text-center">
        <div class="text-label">
          <v-container>
            <v-row>
              <v-col>
                <br><br><br>
                <v-sheet>NUT festival<br>~飛翔~</v-sheet>
              </v-col>
            </v-row>
          </v-container>
        </div>
            </div>
          </v-col>
          <v-col cols="5">
            <v-card class="card-color">
              <br>
              <div class="text-center" v-show="show">
                <Signup />
                <a @click="toggle_show">ログインはこちら</a>
              </div>
              <div class="text-center" v-show="!show">
                <Signin />
                <a @click="toggle_show">新規登録はこちら</a>
              </div>
              <br>
            </v-card>
          </v-col>
          <v-col cols="1"></v-col>
        </v-row>
      </div>
    </div>
    <WelcomeDetail/>
  </div>
</template>

<script>
import IconImage from "../assets/40th_nutfes_logo_black.png"
import Signup from '../components/SignUp.vue'
import Signin from '../components/SignIn.vue'
import WelcomeDetail from '@/components/WelcomeDetail.vue'
export default {
  name: "Welcome",
  components: {
    Signup,
    Signin,
    WelcomeDetail
  },
  data() {
    return {
      show: true,
      iconImage: IconImage,
    }
  },
  methods: {
    toggle_show() {
      this.show = !this.show
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

.card-color {
  background-color: rgba(255,255,255,0.5) !important;
  border-color: white !important;
}
</style>
