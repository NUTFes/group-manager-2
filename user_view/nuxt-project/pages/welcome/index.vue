<template>
  <div>
    <Row>
    <div class="header-content">
      <span @click="mainPage">技大祭{{year}}</span>
      <span><a>signIn</a><a>SignUp</a></span>
    </div>
    <div>
      <span>ようこそ技大祭へ</span>
    </div>
    <div>
      <MainCard>
        123456789
      </MainCard>
    </div>
    <div>qwerty</div>
    </Row>
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
