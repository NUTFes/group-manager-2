<template>
  <v-row>
    <v-col>
      <div class="card">
        <v-card flat>
          <v-row>
            <v-col cols="1"></v-col>
            <v-col cols="10">
              <v-card-title class="font-weight-bold mt-3">
                <v-icon>mdi-account-multiple</v-icon>販売食品一覧
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
                <v-data-table
                  :headers="headers"
                  :items="food_products"
                  class="elevation-0 my-9"
                  @click:row="
                              (data) =>
                              $router.push({ path: `/food_products/${data.food_product.id}`})
                              "
                  >
                  <template v-slot:item.food_product.is_cooking="{ item }">
                    <v-chip v-if="item.food_product.is_cooking == true" color="red" text-color="white" small>する</v-chip>
                    <v-chip v-if="item.food_product.is_cooking == false" color="blue" text-color="white" small>しない</v-chip>
                  </template>
                  <template v-slot:item.food_product.created_at="{ item }">
                    {{ item.food_product.created_at | format-date }}
                  </template>
                  <template v-slot:item.food_product.updated_at="{ item }">
                    {{ item.food_product.updated_at | format-date }}
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
export default {
  data() {
    return {
      food_products: [],
      headers:[
        { text: 'ID', value: 'food_product.id' },
        { text: 'group_id', value: 'group' },
        { text: '名前', value: 'food_product.name' },
        { text: '1日目の個数', value: 'food_product.first_day_num' },
        { text: '2日目の個数', value: 'food_product.second_day_num' },
        { text: '調理の有無', value: 'food_product.is_cooking' },
        { text: '日時', value: 'food_product.created_at' },
        { text: '編集日時', value: 'food_product.updated_at' },
      ],
    }
  },
  mounted() {
    this.$axios.get('/api/v1/get_food_products', {
      headers: { 
        "Content-Type": "application/json", 
      }
    }
    )
      .then(response => {
        this.food_products = response.data
      })
  },
}
</script>

<style>
.card {
  padding-left: 1%;
  padding-right: 5%;
}
</style>
