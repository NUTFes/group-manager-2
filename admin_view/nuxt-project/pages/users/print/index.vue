<template>
  <div class="sheets">
    <div>
      <Header/>
        <v-row>
          <v-col cols=2>
            <Menu/>
          </v-col>
          <v-col cols=10>
            <v-row>
              <v-col>
                <v-card-text><router-link to="/users">ユーザー一覧</router-link> > 印刷</v-card-text>
                <v-btn rounded height="50" width="200" color="primary" @click="handlePrint"><v-icon class="mr-3">mdi-printer</v-icon>印刷する</v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
    </div>

    <div class="sheet">
      <h2>ユーザー一覧</h2>
      <h3>テーブルを印刷する</h3>
      <v-simple-table dense>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">ID</th>
              <th class="text-left">name</th>
              <th class="text-left">email</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </div>

    <div>
      <Header/>
        <v-row>
          <v-col cols=2></v-col>
          <v-col cols=10>
            <v-btn text color="white" to="/users"><v-icon color="#333333">mdi-arrow-left-bold</v-icon><div style="color:#333333">ユーザー一覧に戻る</div></v-btn>
          </v-col>
        </v-row>
    </div>
  </div>
</template>

<script>
import Header from '~/components/Header.vue'
import Menu from '~/components/Menu.vue'

export default {
  data() {
    return {
      list: null,
      users: null
    }
  },
  components:{
    Header,
    Menu,
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.$axios.get('api/v1/users/index', {
        headers: { 
          "Content-Type": "application/json", 
        }
      })
      .then(response => {
        this.users = response.data.data
      })
    },
    handlePrint() {
      window.print()
    }
  }
}
</script>

<style lang="scss" scoped>
.sheet {
  page-break-after: always;
}

/* hide in print */
@media print {
  .sheets > :not(.sheet) {
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
    margin-left: 320px;
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
