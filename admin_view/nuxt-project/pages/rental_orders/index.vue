<template>
  <v-row>
    <v-col>
      <div class="card">
      <v-card flat>
        <v-row>
          <v-col cols="1"></v-col>
          <v-col cols="10">
            <v-card-title class="font-weight-bold mt-3">
              <v-icon class="mr-5">mdi-seat</v-icon>物品申請一覧
              <v-spacer></v-spacer>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs  }">
                  <v-btn 
                          class="mx-2" 
                          fab 
                          text
                          v-bind="attrs"
                          v-on="on"
                          to="/users/print"
                          >
                          <v-icon dark>mdi-printer</v-icon>
                  </v-btn>
                </template>
                <span>印刷する</span>
              </v-tooltip>
            </v-card-title>
            <hr class="mt-n3">
            <template>
                <div class="text-center" v-if="rental_orders.length === 0">
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
                :items="rental_orders"
                class="elevation-0 my-9"
                @click:row="
                            (data) =>
                            $router.push({ path: `/rental_orders/${data.rental_order.id}`})
                            "
                >
                <template v-slot:item.rental_order.created_at="{ item }">
                  {{ item.rental_order.created_at | format-date }}
                </template>
                <template v-slot:item.rental_order.updated_at="{ item }">
                  {{ item.rental_order.updated_at | format-date }}
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
      rental_orders: [],
      headers:[
        { text: 'ID', value: 'rental_order.id' },
        { text: '参加団体', value: 'group' },
        { text: '貸し出し物品', value: 'item' },
        { text: '個数', value: 'rental_order.num' },
        { text: '日時', value: 'rental_order.created_at' },
        { text: '編集日時', value: 'rental_order.updated_at' },
      ],
    }
  },
  mounted() {
    this.$axios.get('/api/v1/get_rental_orders', {
      headers: { 
        "Content-Type": "application/json", 
      }
    }
    )
      .then(response => {
        this.rental_orders = response.data
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
