<template>
  <v-row>
    <v-col>
      <div class="card">
      <v-card flat>
        <v-row>
          <v-col cols="1"></v-col>
          <v-col cols="10">
            <v-card-title class="font-weight-bold mt-3">
              <v-icon class="mr-5">mdi-cube-outline</v-icon>割り当て物品一覧
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
                <div class="text-center" v-if="assign_rental_items.length === 0">
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
                :items="assign_rental_items"
                class="elevation-0 my-9"
                @click:row="
                            (data) =>
                            $router.push({ path: `/assign_rental_items/${data.assign_rental_item.id}`})
                            "
                >
                <template v-slot:item.assign_rental_item.created_at="{ item }">
                  {{ item.assign_rental_item.created_at | format-date }}
                </template>
                <template v-slot:item.assign_rental_item.updated_at="{ item }">
                  {{ item.assign_rental_item.updated_at | format-date }}
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
      assign_rental_items: [],
      headers:[
        { text: 'ID', value: 'assign_rental_item.id' },
        { text: '参加団体', value: 'group' },
        { text: '物品', value: 'item' },
        { text: '個数', value: 'assign_rental_item.num' },
        { text: '在庫場所', value: 'stocker_place' },
        { text: '日時', value: 'assign_rental_item.created_at' },
        { text: '編集日時', value: 'assign_rental_item.updated_at' },
      ],
    }
  },
  mounted() {
    this.$axios.get('/api/v1/get_assign_rental_items', {
      headers: { 
        "Content-Type": "application/json", 
      }
    }
    )
      .then(response => {
        this.assign_rental_items = response.data
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
