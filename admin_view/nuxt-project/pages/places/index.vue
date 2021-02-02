<template>
  <v-row>
    <v-col>
      <div class="card">
        <v-card flat>
          <v-row>
            <v-col cols="1"></v-col>
            <v-col cols="10">
              <v-card-title class="font-weight-bold mt-3">
                <v-icon>mdi-account-multiple</v-icon>会場一覧
                <v-spacer></v-spacer>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs  }">
                    <v-btn 
                            class="mx-2" 
                            fab 
                            text
                            v-bind="attrs"
                            v-on="on"
                            @click="reload"
                            >
                            <v-icon dark>mdi-reload</v-icon>
                    </v-btn>
                  </template>
                  <span>更新する</span>
                </v-tooltip>
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
                  :items="places"
                  class="elevation-0 my-9"
                  @click:row="
                               (data) =>
                               $router.push({ path: `/places/${data.id}`})
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
      places: [],
      headers:[
        { text: 'ID', value: 'id' },
        { text: '名前', value: 'name' },
        { text: '日時', value: 'created_at' },
        { text: '編集日時', value: 'updated_at' },
      ],
    }
  },
  mounted() {
    this.$axios.get('places', {
      headers: { 
        "Content-Type": "application/json", 
      }
    })
      .then(response => {
        this.places = response.data
      })
  },
  methods: {
    reload: function() {
      this.$axios.get('places', {
        headers: { 
          "Content-Type": "application/json", 
        }
      }
      )
        .then(response => {
          this.places = response.data
        })
    }
  }
}
</script>

<style>
.card {
  padding-left: 1%;
  padding-right: 5%;
}
</style>
