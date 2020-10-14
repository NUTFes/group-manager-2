<template>
  <v-app>
    <v-main>
      <router-view/>
        <Footer/>
    </v-main>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld';
import Welcome from './views/Welcome.vue';
import Footer from '@/components/Footer.vue'

export default {
  name: 'App',

  components: {
    HelloWorld,
    Welcome,
    Footer
  },

  data: () => ({
    //
  }),
};
</script>

<style>
#app{
  background-color: #f5f7fa;
}
</style>
