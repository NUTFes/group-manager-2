<template>
  <div class="sheets">
    <div>
      <v-btn type="primary" @click="handlePrint">印刷</v-btn>
      ※PDFで保存したい場合は印刷ダイアログで「PDF保存」を指定してください
    </div>
    <div class="sheet">
      <h2>帳票サンプル</h2>
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
    <div class="sheet">
      <h3>改ページのテスト</h3>
      2ページ目
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: null,
      users: null
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    getList() {
      this.$axios.get('api/v1/users/index', {
        headers: { 
          "Content-Type": "application/json", 
        }
      }
      )
        .then(response => {
          this.users = response.data.data
        })
      // APIからデータ取得する想定
      this.list = [
        { id: 1, author: 'John Due', title: 'Hello, world' },
        { id: 2, author: '太郎', title: 'あいうえお かきくけこ' }
      ]
    },
    fetchData() {
      document.title = 'タイトルをいい感じに設定する'
      setTimeout(() => {
        this.$nextTick(() => {
          this.handlePrint()
        })
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
