<template>
  <div>
    <v-row>
      <v-col>
        <div class="card">
        <v-card flat>
          <v-row>
            <v-col cols="1"></v-col>
            <v-col cols="10">
              <v-card-title class="font-weight-bold mt-3">
                <v-icon class="mr-5">mdi-power-plug</v-icon>電力申請一覧
                <v-spacer></v-spacer>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs  }">
                    <v-btn 
                            class="mx-2" 
                            fab 
                            text
                            v-bind="attrs"
                            v-on="on"
                            to="/power_orders/print"
                            >
                            <v-icon dark>mdi-printer</v-icon>
                    </v-btn>
                  </template>
                  <span>印刷する</span>
                </v-tooltip>
              </v-card-title>
              <hr class="mt-n3">
              <template>
                <div class="text-center" v-if="power_orders.length === 0">
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
                  :items="power_orders"
                  class="elevation-0 my-9"
                  @click:row="
                               (data) =>
                               $router.push({ path: `/power_orders/${data.power_order.id}`})
                               "
                  >
                  <template v-slot:item.power_order.created_at="{ item }">
                    {{ item.power_order.created_at | format-date }}
                  </template>
                  <template v-slot:item.power_order.updated_at="{ item }">
                    {{ item.power_order.updated_at | format-date }}
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
      power_orders: [],
      headers:[
        { text: 'ID', value: 'power_order.id' },
        { text: '参加団体', value: 'group' },
        { text: '製品', value: 'power_order.item' },
        { text: '電力', value: 'power_order.power' },
        { text: '日時', value: 'power_order.created_at' },
        { text: '編集日時', value: 'power_order.updated_at' },
      ],
    }
  },
  mounted() {
    this.$axios.get('/api/v1/get_power_orders', {
      headers: { 
        "Content-Type": "application/json", 
      }
    }
    )
      .then(response => {
        this.power_orders = response.data
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
