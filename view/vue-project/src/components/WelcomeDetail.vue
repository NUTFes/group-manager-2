<template>
  <div>
    <v-conteiner>
      <v-row>
        <v-col cols="2"></v-col>
        <v-col cols="1" class="d-flex justify-end" >
          <v-img contain  src="@/assets/40th_nutfes_logo_black.png" width="150" height="150"></v-img>
        </v-col>
        <v-col cols="9" class="d-flex align-center" >
            <h1>技大祭に出展しませんか？？</h1>
        </v-col>
      </v-row>
      <v-row>
      
      </v-row>
      <v-row>
        <v-col cols="2"></v-col>
        <v-col cols="8">
          <v-row>
          <hr width='100%' style='background-color:#aaa'>
          </v-row>
          <v-row>
            <v-col cols="6">
              <h1 style='text-align:left'>模擬店</h1>
              <v-img src="../assets/mogiten.jpg"></v-img>
              <p>模擬店の紹介</p>
            </v-col>
            <v-col cols="6">
              <h1 >研究室紹介</h1>
              <v-img src="../assets/lab2.jpg"></v-img>
              <p>研究室の紹介</p>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-img src="../assets/stage.jpg"></v-img>
            </v-col>
            <v-col cols="6">
              <h1 style='text-align:left'>ステージ企画</h1>
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
              
            </v-col>
            <v-col cols="6">

            </v-col>
          </v-row>
        </v-col>
        <v-col cols="2"></v-col>
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
h1
{
  text-align:left;
}
</style>
