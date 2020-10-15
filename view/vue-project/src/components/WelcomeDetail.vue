<template>
  <div>
    <v-conteiner>
      <v-row>
        <v-col align="center">
          <v-img src="@/assets/40th_nutfes_logo_black.png" width="600" height="600"></v-img>
        </v-col>
      </v-row>
      <v-row>
        <v-col align="center">
          <h1>技大祭に出展しませんか？</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="1"></v-col>
        <v-col cols="10">
          <v-row>
            <v-col cols="6">
              <h1>模擬店</h1>
              <p>模擬店の紹介</p>
            </v-col>
            <v-col cols="6">
              <v-img src="../assets/mogiten.jpg"></v-img>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-img src="../assets/stage.jpg"></v-img>
            </v-col>
            <v-col cols="6">
              <h1>ステージ企画</h1>
              <p>ステージ企画の紹介</p>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <h1>展示・体験</h1>
              <p>展示・体験の紹介</p>
            </v-col>
            <v-col cols="6">
              <v-img src="../assets/taiken1.jpg"></v-img>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-img src="../assets/lab2.jpg"></v-img>
            </v-col>
            <v-col cols="6">
              <h1>研究室紹介</h1>
              <p>研究室の紹介</p>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="1"></v-col>
      </v-row>
    </v-conteiner>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
}
</script>

<style>
h1 {
  overflow: hidden;
  text-align: center;
}
h1 span {
  position: relative;
  display: inline-block;
  margin: 0 2.5em;
  padding: 0 1em;
  text-align: left;
}
h1 span::before,
h1 span::after {
  position: absolute;
  top: 50%;
  content: '';
  width: 400%;
  height: 1px;
  background-color: #ccc;
}
h1 span::before {
  right: 100%;
}
h1 span::after {
  left: 100%;
}
</style>
