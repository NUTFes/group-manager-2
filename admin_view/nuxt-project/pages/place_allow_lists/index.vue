<template>
  <v-row>
    <v-col>
      <div class="card">
        <v-card flat>
          <v-row>
            <v-col cols="1"></v-col>
            <v-col cols="10">
              <v-card-title class="font-weight-bold mt-3">
                <v-icon>mdi-account-multiple</v-icon>使用会場一覧
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
                <div class="text-center" v-if="place_allow_list.length === 0">
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
                    :items="place_allow_list"
                    class="elevation-0 my-9"
                    @click:row="
                    (data) =>
                    $router.push({ path: `/place_allow_lists/${data.place_allow_list.id}`})
                    "
                    >
                  <template v-slot:item.group_category.id="{ item }">
                    <v-chip v-if="item.group_category.id == 1" color="red" text-color="white" small>{{ category[0] }}</v-chip>
                    <v-chip v-if="item.group_category.id == 2" color="pink" text-color="white" small>{{ category[1] }}</v-chip>
                    <v-chip v-if="item.group_category.id == 3" color="blue" text-color="white" small>{{ category[2] }}</v-chip>
                    <v-chip v-if="item.group_category.id == 4" color="green" text-color="white" small>{{ category[3] }}</v-chip>
                    <v-chip v-if="item.group_category.id == 5" color="orange" text-color="white" small>{{ category[4] }}</v-chip>
                    <v-chip v-if="item.group_category.id == 6" color="blue-gray" text-color="white" small>{{ category[5] }}</v-chip>
                  </template>
                    <template v-slot:item.place_allow_list.enable="{ item }">
                      <v-chip v-if="item.place_allow_list.enable == true" color="red" text-color="white" small><v-icon class="mr-1">mdi-check</v-icon>可能</v-chip>
                      <v-chip v-if="item.place_allow_list.enable == false" color="blue" text-color="white" small><v-icon class="mr-1">mdi-close</v-icon>不可能</v-chip>
                    </template>
                    <template v-slot:item.place_allow_list.created_at="{ item }">
                      {{ item.place_allow_list.created_at | format-date }}
                    </template>
                    <template v-slot:item.place_allow_list.updated_at="{ item }">
                      {{ item.place_allow_list.updated_at | format-date }}
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
      place_allow_list: [],
      group_categories: [],
      category: [],
      headers:[
        { text: 'ID', value: 'place_allow_list.id' },
        { text: '場所', value: 'place' },
        { text: 'グループカテゴリー', value: 'group_category.id' },
        { text: '使用', value: 'place_allow_list.enable' },
        { text: '作成日時', value: 'place_allow_list.created_at' },
        { text: '編集日時', value: 'place_allow_list.updated_at' },
      ],
    }
  },
  mounted() {
    this.$axios.get('/group_categories', {
      headers: { 
        "Content-Type": "application/json", 
      }
    })
      .then(response => {
        this.group_categories = response.data
        for (let i = 0; i < this.group_categories.length; i++) {
          this.category.push(this.group_categories[i]['name'])
        }
      })
    this.$axios.get('/api/v1/get_place_allow_lists', {
      headers: { 
        "Content-Type": "application/json", 
      }
    }
    )
      .then(response => {
        this.place_allow_list = response.data
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
