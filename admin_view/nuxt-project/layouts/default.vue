<template>
  <v-app dark :style="{ background: $vuetify.theme.themes.light.background }">
    <Header />
    <Menu v-if="main" />
      <v-main>
        <transition mode='out-in'>
          <nuxt />
        </transition>
      </v-main>
  </v-app>
</template>
<script>
import Header from '~/components/Header.vue'
import Menu from '~/components/Menu.vue'
export default {
  components: {
    Header,
    Menu,
  },
  computed:{
    main(){
      return this.$route.path !== '/'
    }
  }
}
</script>

<style>
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
  transition: all .5s 0s ease;
}
</style>
