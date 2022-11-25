<template>
  <div class="header-contents">
    <div class="header-content">
      <span @click="mainPage">技大祭{{year}}</span>
      <span><a>signIn</a><a>SignUp</a></span>
    </div>
    <div>
      <span>ようこそ技大祭へ</span>
    </div>
    <div></div>
  </div>
</template>

<script>
// import axios from "axios";
export default {
  data() {
    return {
      year: null,
    };

  },
  mounted() {
    const currentTime = new Date();
    this.year = currentTime.getFullYear();
  },
  methods: {
    mainPage:function (){
      this.$router.push("/");
    }
  }
}
</script>

<style scoped>
.header-content {
  display: flex;
  justify-content: space-between;
}
</style>
