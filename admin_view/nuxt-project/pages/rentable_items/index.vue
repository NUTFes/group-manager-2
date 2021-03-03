<template>
  <v-row>
    <v-col>
      <div class="card">
      <v-card flat>
        <v-row>
          <v-col cols="1"></v-col>
          <v-col cols="10">
            <v-card-title class="font-weight-bold mt-3">
              <v-icon>mdi-table-chair</v-icon>貸し出し物品一覧
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
                :items="rentable_items"
                class="elevation-0 my-9"
                @click:row="
                            (data) =>
                            $router.push({ path: `/rentable_items/${data.id}`})
                            "
                >
                  <template v-slot:item.is_rentable="{ item }">
                    <v-chip v-if="item.is_rentable== true" color="red" text-color="white" small><v-icon class="mr-1">mdi-check</v-icon>可能</v-chip>
                    <v-chip v-if="item.is_rentable== false" color="blue" text-color="white" small><v-icon class="mr-1">mdi-close</v-icon>不可能</v-chip>
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
export default {
  data() {
    return {
      rentable_items: [],
      headers:[
        { text: 'ID', value: 'id' },
        { text: '物品', value: 'stocker_item_id' },
        { text: '在庫場所', value: 'stocker_place_id' },
        { text: '最大数', value: 'max_num' },
        { text: '日時', value: 'created_at' },
        { text: '編集日時', value: 'updated_at' },
      ],
    }
  },
  mounted() {
    this.$axios.get('/rentable_items', {
      headers: { 
        "Content-Type": "application/json", 
      }
    }
    )
      .then(response => {
        this.rentable_items = response.data
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
