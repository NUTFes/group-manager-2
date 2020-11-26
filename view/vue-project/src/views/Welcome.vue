<template>
  <div>
    <div class="background" id="container">
      <v-app-bar
        app
        color = "#FAFAFA"
        height = "70"
        >
      <v-row>
        <v-col cols=2></v-col>
        <v-col cols=2>
          <router-link to="/mypage">
            <v-img
              class="logo"
              :src="logoImage"
              >
            </v-img>
          </router-link>
        </v-col>
      <v-spacer></v-spacer>
      <v-col><v-btn text color="black">参加団体管理アプリとは</v-btn></v-col>
      <v-col><v-btn text color="black">初めての方へ</v-btn></v-col>
      <v-col><v-btn text color="black">よくあるご質問</v-btn></v-col>
          <v-col cols="2" align="right">
            <v-chip
              v-if="this.show===true"
              color="black"
              label
              link
              outlined
              @click="toggle_show"
              >
              ログイン
            </v-chip>
            <v-chip
              v-if="this.show===false"
              color="black"
              label
              link
              outlined
              @click="toggle_show"
              >
              新規登録
            </v-chip>
      </v-col>
      <v-col cols="2"></v-col>
        </v-row>
      </v-app-bar>
      <div>
        <br><br><br>
        <v-row>
          <v-col cols="2"></v-col>
          <v-col cols="4">
            <div class="text-center">
        <div class="text-label">
          <v-container>
            <v-row>
              <v-col>
                <v-img :src="topImage"></v-img>
              </v-col>
            </v-row>
          </v-container>
        </div>
            </div>
          </v-col>
          <v-col cols="4">
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
          <v-col cols="2"></v-col>
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
import logo from '@/assets/logo.svg'
import topImage from '@/assets/top.svg'
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
      logoImage: logo,
      topImage: topImage,
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
 min-height: 80vh;
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
.logo {
  fill: #FFFFFF;
}
</style>
