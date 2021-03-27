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
      <br>
      <h2>貸出物品リスト - 模擬店(食品販売)</h2>
      <hr>
      <br>
      <table border=solid>
          <thead>
            <tr>
              <th class="text-left">団体ID</th>
              <th class="text-left">カテゴリー</th>
              <th class="text-left">参加団体名</th>
              <th class="text-left">物品</th>
              <th class="text-left">場所</th>
              <th class="text-left">個数</th>
            </tr>
          </thead>
          <tbody v-for="group in group_1" :key="group.group.id">
            <tr>
              <td :rowspan=group.assign_rental_item.length>{{ group.group.id }}</td>
              <td :rowspan=group.assign_rental_item.length>食品販売</td>
              <td :rowspan=group.assign_rental_item.length>{{ group.group.name }}</td>
              <td v-if="group.assign_rental_item.length !== 0">{{ group.assign_rental_item[0].name }}</td>
              <td v-else-if="group.assign_rental_item.length === 0">未登録</td>
              <td v-if="group.assign_rental_item.length !== 0">{{ group.assign_rental_item[0].place }}</td>
              <td v-else-if="group.assign_rental_item.length === 0">未登録</td>
              <td v-if="group.assign_rental_item.length !== 0">{{ group.assign_rental_item[0].num }}</td>
              <td v-else-if="group.assign_rental_item.length === 0">未登録</td>
            </tr>
            <tr v-for="i in group.assign_rental_item.slice(1)" v-if="group.assign_rental_item.slice(1) !== 0">
              <td>{{ i.name }}</td>
              <td>{{ i.place }}</td>
              <td>{{ i.num }}</td>
            </tr>
          </tbody>
      </table>
    </div>

    <div class="sheet">
      <br>
      <h2>貸出物品リスト - 模擬店(物品販売)</h2>
      <hr>
      <br>
      <table border=solid>
          <thead>
            <tr>
              <th class="text-left">団体ID</th>
              <th class="text-left">カテゴリー</th>
              <th class="text-left">参加団体名</th>
              <th class="text-left">物品</th>
              <th class="text-left">場所</th>
              <th class="text-left">個数</th>
            </tr>
          </thead>
          <tbody v-for="group in group_2" :key="group.group.id">
            <tr>
              <td :rowspan=group.assign_rental_item.length>{{ group.group.id }}</td>
              <td :rowspan=group.assign_rental_item.length>物品販売</td>
              <td :rowspan=group.assign_rental_item.length>{{ group.group.name }}</td>
              <td v-if="group.assign_rental_item.length !== 0">{{ group.assign_rental_item[0].name }}</td>
              <td v-else-if="group.assign_rental_item.length === 0">未登録</td>
              <td v-if="group.assign_rental_item.length !== 0">{{ group.assign_rental_item[0].place }}</td>
              <td v-else-if="group.assign_rental_item.length === 0">未登録</td>
              <td v-if="group.assign_rental_item.length !== 0">{{ group.assign_rental_item[0].num }}</td>
              <td v-else-if="group.assign_rental_item.length === 0">未登録</td>
            </tr>
            <tr v-for="i in group.assign_rental_item.slice(1)" v-if="group.assign_rental_item.slice(1) !== 0">
              <td>{{ i.name }}</td>
              <td>{{ i.place }}</td>
              <td>{{ i.num }}</td>
            </tr>
          </tbody>
      </table>
    </div>

    <div class="sheet">
      <br>
      <h2>貸出物品リスト - ステージ企画</h2>
      <hr>
      <br>
      <table border=solid>
          <thead>
            <tr>
              <th class="text-left">団体ID</th>
              <th class="text-left">カテゴリー</th>
              <th class="text-left">参加団体名</th>
              <th class="text-left">物品</th>
              <th class="text-left">場所</th>
              <th class="text-left">個数</th>
            </tr>
          </thead>
          <tbody v-for="group in group_3" :key="group.group.id">
            <tr>
              <td :rowspan=group.assign_rental_item.length>{{ group.group.id }}</td>
              <td :rowspan=group.assign_rental_item.length>ステージ</td>
              <td :rowspan=group.assign_rental_item.length>{{ group.group.name }}</td>
              <td v-if="group.assign_rental_item.length !== 0">{{ group.assign_rental_item[0].name }}</td>
              <td v-else-if="group.assign_rental_item.length === 0">未登録</td>
              <td v-if="group.assign_rental_item.length !== 0">{{ group.assign_rental_item[0].place }}</td>
              <td v-else-if="group.assign_rental_item.length === 0">未登録</td>
              <td v-if="group.assign_rental_item.length !== 0">{{ group.assign_rental_item[0].num }}</td>
              <td v-else-if="group.assign_rental_item.length === 0">未登録</td>
            </tr>
            <tr v-for="i in group.assign_rental_item.slice(1)" v-if="group.assign_rental_item.slice(1) !== 0">
              <td>{{ i.name }}</td>
              <td>{{ i.place }}</td>
              <td>{{ i.num }}</td>
            </tr>
          </tbody>
      </table>
    </div>

    <div class="sheet">
      <br>
      <h2>貸出物品リスト - 展示・体験</h2>
      <hr>
      <br>
      <table border=solid>
          <thead>
            <tr>
              <th class="text-left">団体ID</th>
              <th class="text-left">カテゴリー</th>
              <th class="text-left">参加団体名</th>
              <th class="text-left">物品</th>
              <th class="text-left">場所</th>
              <th class="text-left">個数</th>
            </tr>
          </thead>
          <tbody v-for="group in group_4" :key="group.group.id">
            <tr>
              <td :rowspan=group.assign_rental_item.length>{{ group.group.id }}</td>
              <td :rowspan=group.assign_rental_item.length>展示・体験</td>
              <td :rowspan=group.assign_rental_item.length>{{ group.group.name }}</td>
              <td v-if="group.assign_rental_item.length !== 0">{{ group.assign_rental_item[0].name }}</td>
              <td v-else-if="group.assign_rental_item.length === 0">未登録</td>
              <td v-if="group.assign_rental_item.length !== 0">{{ group.assign_rental_item[0].place }}</td>
              <td v-else-if="group.assign_rental_item.length === 0">未登録</td>
              <td v-if="group.assign_rental_item.length !== 0">{{ group.assign_rental_item[0].num }}</td>
              <td v-else-if="group.assign_rental_item.length === 0">未登録</td>
            </tr>
            <tr v-for="i in group.assign_rental_item.slice(1)" v-if="group.assign_rental_item.slice(1) !== 0">
              <td>{{ i.name }}</td>
              <td>{{ i.place }}</td>
              <td>{{ i.num }}</td>
            </tr>
          </tbody>
      </table>
    </div>

    <div class="sheet">
      <br>
      <h2>貸出物品リスト - 研究室公開</h2>
      <hr>
      <br>
      <table border=solid>
          <thead>
            <tr>
              <th class="text-left">団体ID</th>
              <th class="text-left">カテゴリー</th>
              <th class="text-left">参加団体名</th>
              <th class="text-left">物品</th>
              <th class="text-left">場所</th>
              <th class="text-left">個数</th>
            </tr>
          </thead>
          <tbody v-for="group in group_5" :key="group.group.id">
            <tr>
              <td :rowspan=group.assign_rental_item.length>{{ group.group.id }}</td>
              <td :rowspan=group.assign_rental_item.length>研究室公開</td>
              <td :rowspan=group.assign_rental_item.length>{{ group.group.name }}</td>
              <td v-if="group.assign_rental_item.length !== 0">{{ group.assign_rental_item[0].name }}</td>
              <td v-else-if="group.assign_rental_item.length === 0">未登録</td>
              <td v-if="group.assign_rental_item.length !== 0">{{ group.assign_rental_item[0].place }}</td>
              <td v-else-if="group.assign_rental_item.length === 0">未登録</td>
              <td v-if="group.assign_rental_item.length !== 0">{{ group.assign_rental_item[0].num }}</td>
              <td v-else-if="group.assign_rental_item.length === 0">未登録</td>
            </tr>
            <tr v-for="i in group.assign_rental_item.slice(1)" v-if="group.assign_rental_item.slice(1) !== 0">
              <td>{{ i.name }}</td>
              <td>{{ i.place }}</td>
              <td>{{ i.num }}</td>
            </tr>
          </tbody>
      </table>
    </div>

    <div class="sheet">
      <br>
      <h2>貸出物品リスト - その他</h2>
      <hr>
      <br>
      <table border=solid>
          <thead>
            <tr>
              <th class="text-left">団体ID</th>
              <th class="text-left">カテゴリー</th>
              <th class="text-left">参加団体名</th>
              <th class="text-left">物品</th>
              <th class="text-left">場所</th>
              <th class="text-left">個数</th>
            </tr>
          </thead>
          <tbody v-for="group in group_6" :key="group.group.id">
            <tr>
              <td :rowspan=group.assign_rental_item.length>{{ group.group.id }}</td>
              <td :rowspan=group.assign_rental_item.length>その他</td>
              <td :rowspan=group.assign_rental_item.length>{{ group.group.name }}</td>
              <td v-if="group.assign_rental_item.length !== 0">{{ group.assign_rental_item[0].name }}</td>
              <td v-else-if="group.assign_rental_item.length === 0">未登録</td>
              <td v-if="group.assign_rental_item.length !== 0">{{ group.assign_rental_item[0].place }}</td>
              <td v-else-if="group.assign_rental_item.length === 0">未登録</td>
              <td v-if="group.assign_rental_item.length !== 0">{{ group.assign_rental_item[0].num }}</td>
              <td v-else-if="group.assign_rental_item.length === 0">未登録</td>
            </tr>
            <tr v-for="i in group.assign_rental_item.slice(1)" v-if="group.assign_rental_item.slice(1) !== 0">
              <td>{{ i.name }}</td>
              <td>{{ i.place }}</td>
              <td>{{ i.num }}</td>
            </tr>
          </tbody>
      </table>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      lists: [],
      group_1: [],
      group_2: [],
      group_3: [],
      group_4: [],
      group_5: [],
      group_6: [],
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.$axios.get('api/v1/get_print_items', {
        headers: { 
          "Content-Type": "application/json", 
        }
      })
      .then(response => {
        this.lists = response.data
        this.group_1 = this.lists.group_1
        this.group_2 = this.lists.group_2
        this.group_3 = this.lists.group_3
        this.group_4 = this.lists.group_4
        this.group_5 = this.lists.group_5
        this.group_6 = this.lists.group_6
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
table {
  border-collapse:collapse;
}
th {
  padding: 0.3%;
  width: 150px
}
td {
  padding: 0.3%;
  width: 150px
}
</style>
