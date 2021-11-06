<template>
  <v-app>
    <MobileHeader />
    <Header />
    <v-main class="overflow-hidden">
      <transition mode="out-in">
        <router-view />
      </transition>
    </v-main>
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
</style>
