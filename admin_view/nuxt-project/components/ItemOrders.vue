<template>
  <div>
    <div class="card">
      <v-card flat>
        <v-row> 
          <v-col cols=1></v-col>
          <v-col cols=10>
            <v-card-title>物品申請一覧</v-card-title>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      rental_orders: [],
      headers:[
        { text: 'ID', value: 'id' },
        { text: 'group_id', value: 'group_id' },
        { text: '貸し出し物品', value: 'rental_item_id' },
        { text: '個数', value: 'num' },
      ],
    }
  },
  mounted() {
    this.$axios.get('/rental_orders', {
      headers: { 
        "Content-Type": "application/json", 
        "access-token": localStorage.getItem('access-token'),
        "client": localStorage.getItem('client'),
        "uid": localStorage.getItem('uid')
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
