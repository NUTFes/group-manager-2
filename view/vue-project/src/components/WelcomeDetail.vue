<template>
  <div style='background-color:rgb(237,237,232)'>
    <v-conteiner>
     <v-row>
      
      
      <v-col cols="2.5"></v-col>

      <v-col cols="7">
    
        <v-row>

          <v-row>
            <v-col cols="2"></v-col>
            <v-col cols="1" class="d-flex justify-end" >
              <v-img contain  src="@/assets/40th_nutfes_logo_black.png" width="150" height="150"></v-img>
            </v-col>
            <v-col cols="9" class="d-flex align-center" >
              <span class='welcometitle'>技大祭に出展しませんか？</span>
            </v-col>
          </v-row>


          <hr width='100%' style='background-color:#aaa'>
        </v-row>

<v-col cols="12"></v-col>

        <v-row class='welcomerow'>
          <v-col cols='7' class='welcomecol'>
            <v-img src="../assets/mogiten.jpg"  height='500'></v-img>
          </v-col>

          <v-col cols='5'class='welcomecol'>
          <v-row>
              <v-col cols='2'></v-col>
              <v-col cols='8'>
                  <v-row>
                    <v-col cols='12' class='welcometitleback'>
                     <span class='welcometitle'>模擬店</span>
                    </v-col>
                    <v-col cold='12'class='welcomesentence'>
                      <p>hoge</p>
                    </v-col>  
                  </v-row>
              </v-col>
              <v-col cols='2'></v-col>
            </v-row>
          </v-col>
        </v-row>


        <v-row class='welcomerow'>

          <v-col cols='7' class='welcomecol'>
            <v-img src="../assets/stage.jpg"  height='500'></v-img>
          </v-col>

          <v-col cols='5'class='welcomecol'>
          <v-row>
              <v-col cols='2'></v-col>
              <v-col cols='8'>
                  <v-row>
                    <v-col cols='12' class='welcometitleback'>
                     <span class='welcometitle'>ステージ企画</span>
                    </v-col>
                    <v-col cold='12'class='welcomesentence'>
                      <p>hoge</p>
                    </v-col>  
                  </v-row>
              </v-col>
              <v-col cols='2'></v-col>
            </v-row>
          </v-col>

        </v-row>



        <v-row class='welcomerow'>

          <v-col cols='7' class='welcomecol'>
            <v-img src="../assets/taiken1.jpg"  height='500'></v-img>
          </v-col>

          <v-col cols='5'class='welcomecol'>
          <v-row>
              <v-col cols='2'></v-col>
              <v-col cols='8'>
                  <v-row>
                    <v-col cols='12' class='welcometitleback'>
                     <span class='welcometitle'>展示・体験</span>
                    </v-col>
                    <v-col cold='12'class='welcomesentence'>
                      <p>hoge</p>
                    </v-col>  
                  </v-row>
              </v-col>
              <v-col cols='2'></v-col>
            </v-row>
          </v-col>

        </v-row>



        <v-row class='welcomerow'>

          <v-col cols='7' class='welcomecol'>
            <v-img src="../assets/lab2.jpg"  height='500'></v-img>
          </v-col>

          <v-col cols='5'class='welcomecol'>
          <v-row>
              <v-col cols='2'></v-col>
              <v-col cols='8'>
                  <v-row>
                    <v-col cols='12' class='welcometitleback'>
                     <span class='welcometitle'>研究室公開</span>
                    </v-col>
                    <v-col cold='12'class='welcomesentence'>
                      <p>hoge</p>
                    </v-col>  
                  </v-row>
              </v-col>
              <v-col cols='2'></v-col>
            </v-row>
          </v-col>

        </v-row>






    </v-col>

    <v-col cols="2.5"></v-col>
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

.welcomecol{
background:#fff;
padding:0;
margin:0;
}

.welcometitleback
{
  height:260px;
  margin:40px 0 0;
  display:flex;
  justify-content:center;
  align-items:center;
  border-top:groove;
}
.welcomesentence{
  height:136px;
  margin:0 0 40px;
  border-bottom:groove;

}

.welcometitle{
  text-align:left;
  font-size:25pt;
 
}

.welcomeback
{
background-color:#dcedc8;
height:500px;
}


.welcomerow{

margin:150px 0;

}

</style>
