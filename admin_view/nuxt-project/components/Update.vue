<template>
  <v-card flat class="mx-15">
      <v-row>
          <v-col cols=1></v-col>
          <v-col>
              <v-card-title><v-icon class="mr-2">mdi-information</v-icon>アップデート情報</v-card-title>
              <v-card-text>
                  <li v-for="t in text">
                      <v-chip class="ma-2" label color="red" x-small><div style="color:white">new</div></v-chip> ({{ t.date }}) {{ t.body }}
                  </li>
              </v-card-text>
          </v-col>
          <v-col cols=1></v-col>
      </v-row>
  </v-card>
</template>
<script>
export default {
    data() {
    return {
        text: [
            { body: "ユーザー一覧から参加団体を参照できるようになりました", date: "03月31日" },
            { body: "連絡先リストの印刷機能を追加しました", date: "03月28日" },
            { body: "貸出物品リストの印刷機能を追加しました", date: "03月28日" },
            { body: "アップデート情報を公開することにしました", date: "03月28日" },
            { body: "参加団体管理アプリのベータ版を公開しました", date: "03月28日" },
        ]
    };
  },
}
</script>
