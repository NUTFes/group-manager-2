<template>
  <v-app id="app">
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld';
import Welcome from './views/Welcome.vue';

export default {
  name: 'App',

  components: {
    HelloWorld,
    Welcome,
  },

  data: () => ({
    //
  }),
};
</script>

<style>
body {
  background-color: #333333;
}
</style>
