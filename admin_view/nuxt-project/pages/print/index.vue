<template>
  <v-row>
    <v-col>
      <v-card flat class="mx-15">
        <v-row>
          <v-col cols="1"></v-col>
          <v-col cols="10">
            <v-card-title class="font-weight-bold mt-3">
              <v-icon class="mr-5">mdi-printer</v-icon>印刷
              <v-spacer></v-spacer>
            </v-card-title>
            <hr class="mt-n3">
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">項目</th>
                    <th class="text-left">印刷</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in item_list" :key="item.text">
                      <td class="text-left">{{ item.text }}</td>
                      <td class="text-left"><v-btn :to="item.url" style="box-shadow:none" color="blue"><v-icon color="white">mdi-printer</v-icon></v-btn></td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
          <v-col cols="1"></v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      item_list:[
        { text: '従業員リスト', url: '/print/employees' },
        { text: '販売食品リスト', url: '/print/products' },
        { text: '貸出物品リスト', url: '/print/items' },
        { text: '使用電力リスト', url: '/print/powers' },
        { text: '連絡先リスト', url: '/print/address' },
      ],
    }
  },
}
</script>
