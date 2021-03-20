<template>
  <v-row>
    <v-col>
      <div class="card">
        <v-card flat>
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
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      item_list:[
        { text: 'ユーザー', url: '/print/users' },
      ],
    }
  },
}
</script>
