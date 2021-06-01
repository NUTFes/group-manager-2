<template>
  <div>
    <div class="background">
      <div>
        <v-row class="hero-header">
          <v-col>
            <v-card flat class="card-color">
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
        </v-row>
      </div>
    </div>
    <WelcomeDetail v-if="this.isStep == 1"/>
    <WelcomeDetailStep v-if="this.isStep == 2"/>
    <div class="text-center">
      <v-btn @click="change" text>登録の手順はこちら</v-btn>
    </div>
  </div>
</template>

<script>
import IconImage from "@/assets/40th_nutfes_logo_black.png"
import Signup from '@/components/Mobile/SignUp.vue'
import Signin from '@/components/Mobile/SignIn.vue'
import logo from '@/assets/logo.svg'
import topImage from '@/assets/top.svg'
import WelcomeDetail from '@/components/WelcomeDetail.vue'
import WelcomeDetailStep from '@/components/WelcomeDetail-step.vue'
export default {
  name: "Welcome",
  components: {
    Signup,
    Signin,
    WelcomeDetail,
    WelcomeDetailStep,
  },
  data() {
    return {
      show: true,
      iconImage: IconImage,
      logoImage: logo,
      topImage: topImage,
      isStep: 1,
      windowWidth: window.innerWidth
    }
  },
  mounted() {
    window.addEventListener('resize', this.calculateWindowWidth);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.calculateWindowWidth);
  },
  methods: {
    toggle_show() {
      this.show = !this.show
    },
    change(){
      if(this.isStep == 1){
        this.isStep = 2
      }else if(this.isStep == 2){
        this.isStep = 1
      }
    },
    calculateWindowWidth() {
      this.windowWidth = window.innerWidth;
      console.log(this.windowWidth);
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
  background-image: url("~@/assets/mobile-hero-header-golden-ratio-logo.png");
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
