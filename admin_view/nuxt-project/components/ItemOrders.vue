<template>
  <div>
    <v-card flat class="mr-15">
      <v-row> 
        <v-col cols=1></v-col>
        <v-col cols=10>
          <v-card-title class="my-3">物品申請一覧</v-card-title>
          <hr class="mt-n3" />
          <v-data-table
            :headers="headers"
            :items="rental_orders"
            class="elevation-0 my-9"
            >
          </v-data-table>
        </v-col>
        <v-col cols=1></v-col>
      </v-row>
    </v-card>
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


<style scoped>
.card {
  padding-left: 1%;
  padding-right: 5%
}
</style>
