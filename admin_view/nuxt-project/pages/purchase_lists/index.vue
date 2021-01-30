<template>
  <v-row>
    <v-col>
      <div class="card">
      <v-card flat>
        <v-row>
          <v-col cols="1"></v-col>
          <v-col cols="10">
            <v-card-title class="font-weight-bold mt-3">
              <v-icon>mdi-cart</v-icon>購入品一覧
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
              <v-data-table
                :headers="headers"
                :items="purchase_lists"
                class="elevation-0 my-9"
                @click:row="
                            (data) =>
                            $router.push({ path: `/purchase_lists/${data.id}`})
                            "
                >
                <template v-slot:item.is_fresh="{ item }">
                  <v-chip v-if="item.is_fresh == true" color="red" text-color="white" small>はい</v-chip>
                  <v-chip v-if="item.is_fresh == false" color="blue" text-color="white" small>いいえ</v-chip>
                </template>
                <template v-slot:item.created_at="{ item }">
                  {{ item.created_at | format-date }}
                </template>
                <template v-slot:item.updated_at="{ item }">
                  {{ item.updated_at | format-date }}
                </template>
              </v-data-table>                      
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
import Header from '~/components/Header.vue'
import Menu from '~/components/Menu.vue'
export default {
  components: {
    Header,
    Menu,
  },
  data() {
    return {
      purchase_lists: [],
      headers:[
        { text: 'ID', value: 'id' },
        { text: 'food_product_id', value: 'food_product_id' },
        { text: '購入品', value: 'items' },
        { text: '店名', value: 'shop_id' },
        { text: '開催日', value: 'fes_date_id' },
        { text: 'なまもの', value: 'is_fresh' },
        { text: '日時', value: 'created_at' },
        { text: '編集日時', value: 'updated_at' },
      ],
    }
  },
  mounted() {
    this.$axios.get('/purchase_lists', {
      headers: { 
        "Content-Type": "application/json", 
        "access-token": localStorage.getItem('access-token'),
        "client": localStorage.getItem('client'),
        "uid": localStorage.getItem('uid')
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
