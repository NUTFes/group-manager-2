<template>
  <v-row>
    <v-col>
      <div class="card">
      <v-card flat>
        <v-row>
          <v-col cols="1"></v-col>
          <v-col cols="10">
            <v-card-title class="font-weight-bold mt-3">
              <v-icon class="mr-5">mdi-cart</v-icon>購入品一覧
              <v-spacer></v-spacer>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs  }">
                  <v-btn 
                          class="mx-2" 
                          fab 
                          text
                          v-bind="attrs"
                          v-on="on"
                          to="/purchase_lists/print"
                          >
                          <v-icon dark>mdi-printer</v-icon>
                  </v-btn>
                </template>
                <span>印刷する</span>
              </v-tooltip>
            </v-card-title>
            <hr class="mt-n3">
            <template>
              <div class="text-center" v-if="purchase_lists.length === 0">
                <br><br>
                <v-progress-circular
                  indeterminate
                  color="#009688"
                  ></v-progress-circular>
                <br><br>
              </div>
              <div v-else>
                <v-data-table
                  :headers="headers"
                  :items="purchase_lists"
                  class="elevation-0 my-9"
                  @click:row="
                              (data) =>
                              $router.push({ path: `/purchase_lists/${data.purchase_list.id}`})
                              "
                  >
                  <template v-slot:item.purchase_list.is_fresh="{ item }">
                    <v-chip v-if="item.purchase_list.is_fresh == true" color="red" text-color="white" small>はい</v-chip>
                    <v-chip v-if="item.purchase_list.is_fresh == false" color="blue" text-color="white" small>いいえ</v-chip>
                  </template>
                  <template v-slot:item.purchase_list.created_at="{ item }">
                    {{ item.purchase_list.created_at | format-date }}
                  </template>
                  <template v-slot:item.purchase_list.updated_at="{ item }">
                    {{ item.purchase_list.updated_at | format-date }}
                  </template>
                </v-data-table>                      
              </div>
            </template>
          </v-col>
          <v-col cols="1"></v-col>
        </v-row>
      </v-card>
      </div>
    </v-col>
  </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      purchase_lists: [],
      headers:[
        { text: 'ID', value: 'purchase_list.id' },
        { text: '参加団体', value: 'group' },
        { text: '販売食品', value: 'food_product' },
        { text: '購入品', value: 'purchase_list.items' },
        { text: '店名', value: 'shop' },
        { text: '開催日', value: 'fes_date.date' },
        { text: 'なまもの', value: 'purchase_list.is_fresh' },
        { text: '日時', value: 'purchase_list.created_at' },
        { text: '編集日時', value: 'purchase_list.updated_at' },
      ],
    }
  },
  mounted() {
    this.$axios.get('/api/v1/get_purchase_lists', {
      headers: { 
        "Content-Type": "application/json", 
      }
    }
    )
      .then(response => {
        this.purchase_lists = response.data
      })
  },
}
</script>

<style>
.card {
  padding-left: 1%;
  padding-right: 5%
}
</style>
