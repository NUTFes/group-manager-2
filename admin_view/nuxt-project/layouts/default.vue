<template>
  <v-app dark :style="{ background: $vuetify.theme.themes.light.background }">
    <Header />
      <div class="pad-bottom">
        <v-row>
          <v-col cols="2" v-if="main">
            <Menu  />
          </v-col>
          <v-col cols="10">
            <v-main>
              <transition mode='out-in'>
                <nuxt/>
              </transition>
            </v-main>
          </v-col>
        </v-row>
      </div>
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
      return this.$route.path !== '/' && this.$route.path !== '/signup' && this.$route.path !== '/regist_user_detail'
    }
  }
}
</script>

<style>
.pad-bottom {
  padding-bottom: 150px;
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
  transition: all .5s 0s ease;
}
</style>
