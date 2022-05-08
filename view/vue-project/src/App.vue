<template>
  <v-app>
    <MobileHeader />
    <Header />
    <main v-if="this.$route.path == '/'" class="top">
      <router-view />
    </main>
    <main v-else class="no-top">
      <router-view />
    </main>
    <Footer />
  </v-app>
</template>

<script>
import Header from "@/components/Header.vue";
import MobileHeader from "@/components/Mobile/Header.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "App",

  components: {
    Header,
    MobileHeader,
    Footer,
  },
  data() {
    return {
      isMobile: false,
      mobile: [],
    };
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100;300;400;500;700;900&display=swap');
#app {
  background-color: white;
}
.v-enter {
  transform: translate(-100px, 0);
  opacity: 0;
}
.v-enter-to {
  opacity: 1;
}
.v-enter-active {
  transition: all 1s 0s ease;
}
.v-leave {
  transform: translate(0, 0);
  opacity: 1;
}
.v-leave-to {
  transform: translate(100px, 0);
  opacity: 0;
}
.v-leave-active {
  transition: all 0.5s 0s ease;
}
.top {
  padding-top: 0vh;
  padding-left: 0vh;
  padding-right: 0vh;
  padding-bottom: 0vh;
}
.no-top {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 1000px; 
  padding-top: 80px;
}
</style>
