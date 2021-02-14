<template>
  <v-row>
    <v-col>
      <div class="card">
      <v-card flat>
        <v-row>
          <v-col cols="1"></v-col>
          <v-col cols="10">
            <v-card-title class="font-weight-bold mt-3">
              <v-icon>mdi-table-chair</v-icon>割り当て物品一覧
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
                :items="assign_rental_items"
                class="elevation-0 my-9"
                @click:row="
                            (data) =>
                            $router.push({ path: `/rental_items/${data.id}`})
                            "
                >
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
export default {
  data() {
    return {
      assign_rental_items: [],
      headers:[
        { text: 'ID', value: 'id' },
        { text: '参加団体', value: 'group_id' },
        { text: '物品', value: 'rental_item_id' },
        { text: '個数', value: 'num' },
        { text: '在庫場所', value: 'stocker_place_id' },
        { text: '日時', value: 'created_at' },
        { text: '編集日時', value: 'updated_at' },
      ],
    }
  },
  mounted() {
    this.$axios.get('/assign_rental_items', {
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
