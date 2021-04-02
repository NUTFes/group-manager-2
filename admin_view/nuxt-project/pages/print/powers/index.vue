<template>
  <div class="sheets">
    <v-row>
      <v-col cols=4></v-col>
      <v-col>
        <h1 style="color:#333333;">印刷プレビュー</h1>
      </v-col>
      <v-col cols=2></v-col>
    </v-row>
    <v-row>
      <v-col cols=4></v-col>
      <v-col cols=3>
        <v-btn rounded block color="blue" height="50" to="/print"><v-icon class="mr-3" style="color:white">mdi-arrow-left-bold</v-icon><div style="color:white">管理者画面に戻る</div></v-btn>
      </v-col>
      <v-col cols=3>
        <v-btn rounded block height="50" color="primary" @click="handlePrint"><v-icon class="mr-3">mdi-printer</v-icon>印刷する</v-btn>
      </v-col>
      <v-col cols=2></v-col>
    </v-row>

    <div class="sheet">
      <h2>ユーザー一覧</h2>
      <h3>テーブルを印刷する</h3>
      <table table border="1" rules="rows">
      <v-simple-table dense>
        <template v-slot:default>
         
          <thead>
            <tr>
              <th class="text-left">ID</th>
              <th class="text-left">group name</th>
              <th class="text-left">item</th>
              <th class="text-left">power</th>
              <th class="text-left">manufacturer</th>
              <th class="text-left">model</th>
              <th class="text-left">item url</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(power, i) in powers" :key="i">
              <td>{{power.id}}</td>
              <td>{{power.group_name}}</td>
              <td>{{power.item}}</td>
              <td>{{power.power}}</td>
              <td>{{power.manufacturer}}</td>
              <td>{{power.model}}</td>
              <td>{{power.item_url}}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      </table>
    </div>

    <v-row>
      <v-col cols=4></v-col>
      <v-col>
        <v-btn text color="white" to="/users"><v-icon color="#333333">mdi-arrow-left-bold</v-icon><div style="color:#333333">ユーザー一覧に戻る</div></v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Header from '~/components/Header.vue'
import Menu from '~/components/Menu.vue'

export default {
  data() {
    return {
      list: null,
      powers: null
    }
  },
  components:{
    Header,
    Menu,
  },
  mounted() {
    this.getList()
    setTimeout(this.handlePrint, 100);
  },
  methods: {
    getList() {
      this.$axios.get('api/v1/get_print_powers', {
        headers: { 
          "Content-Type": "application/json", 
        }
      })
      .then(response => {
        this.powers = response.data
      })
    },
    handlePrint() {
      window.print()
    }
  }
}
</script>

<style lang="scss" scoped>
h1 {
  border-bottom: solid 3px black;
}
.sheet {
  page-break-after: always;
}

/* hide in print */
@media print {
  .sheets > :not(.sheet){
    display: none;
  }
}

/* for preview */
@media screen {
  /* mm単位で指定しているけど、vueコンポ側はpx単位なので、無理にmmにしなくてもいいかも。解像度の違いでハマるかも */
  .sheet {
    width: 200mm;
    min-height: 296mm; /* 設定しなくてもいいかも。あまり印刷画面に似せすぎると、些細な違いがバグに見えてしまう */
    margin: 5mm;
    padding: 5mm;
    background: white;
    box-shadow: 0 .5mm 2mm rgba(0,0,0,.3);
    margin-left: 32%;
  }
}
</style>
<style lang="scss">
/* for preview */
@media screen {
  BODY {
    background: #eee;
  }
}
</style>
