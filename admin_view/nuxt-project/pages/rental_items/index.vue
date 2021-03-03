<template>
  <v-row>
    <v-col>
      <div class="card">
      <v-card flat>
        <v-row>
          <v-col cols="1"></v-col>
          <v-col cols="10">
            <v-card-title class="font-weight-bold mt-3">
              <v-icon class="mr-5">mdi-seat-outline</v-icon>物品一覧
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
                <div class="text-center" v-if="rental_items.length === 0">
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
                :items="rental_items"
                class="elevation-0 my-9"
                @click:row="
                            (data) =>
                            $router.push({ path: `/rental_items/${data.id}`})
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
      rental_items: [],
      headers:[
        { text: 'ID', value: 'id' },
        { text: '名前', value: 'name' },
        { text: '貸し出し', value: 'is_rentable' },
        { text: '日時', value: 'created_at' },
        { text: '編集日時', value: 'updated_at' },
      ],
    }
  },
  mounted() {
    this.$axios.get('/rental_items', {
      headers: { 
        "Content-Type": "application/json", 
        "access-token": localStorage.getItem('access-token'),
        "client": localStorage.getItem('client'),
        "uid": localStorage.getItem('uid')
      }
    }
    )
      .then(response => {
        this.rental_items = response.data
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
