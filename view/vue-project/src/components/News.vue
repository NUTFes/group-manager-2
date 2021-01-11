<template>
  <v-row>
    <v-col cols="2"></v-col>
    <v-col cols="8">
      <v-card
        class = "mx-auto"
        outlined
      >
      <v-card-title style="background-color:#ECEFF1; font-size:30px"><v-icon class="pr-2" size="40">mdi-bell</v-icon><b>お知らせ</b></v-card-title>
        <v-list>
          <v-list-item 
          v-for = "item in items"
          :key="item.title"
          link
          >
            <v-list-item-content class = "font-weight-medium">
              <v-col cols = "2">{{item.data}}</v-col>
              <v-col cols = "8"><v-list-item-title>{{ item.title }}</v-list-item-title></v-col>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>
    <v-col cols="2"></v-col>
  </v-row>
</template>

<script>
  export default {
    data () {
      return {
        items: [
          { data: "2020.09.20", title: "第３回参加団体説明会のお知らせ"},
          { data: "2020.09.20", title: "マイページ更新のお知らせ"},
          { data: "2020.09.20", title: "第２回参加団体説明会の配布資料"},
        ],
        right: null,
      }
    },
  }
</script>
