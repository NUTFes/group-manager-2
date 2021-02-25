<template>
  <v-row>
    <v-col>
      <div class="card">
        <v-card flat>
          <v-row>
            <v-col cols="1"></v-col>
            <v-col cols="10">
              <v-card-title class="font-weight-bold mt-3">
                <v-icon>mdi-account-group</v-icon>参加団体一覧
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
                            to="/groups/print"
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
                  :items="groups"
                  class="elevation-0 my-9"
                  @click:row="
                              (data) =>
                              $router.push({ path: `/groups/${data.id}`})
                              "
                  >
                  <template v-slot:item.group_category_id="{ item }">
                    <v-chip v-if="item.group_category_id == 1" color="red" text-color="white" small>{{ category[0] }}</v-chip>
                    <v-chip v-if="item.group_category_id == 2" color="pink" text-color="white" small>{{ category[1] }}</v-chip>
                    <v-chip v-if="item.group_category_id == 3" color="blue" text-color="white" small>{{ category[2] }}</v-chip>
                    <v-chip v-if="item.group_category_id == 4" color="green" text-color="white" small>{{ category[3] }}</v-chip>
                    <v-chip v-if="item.group_category_id == 5" color="orange" text-color="white" small>{{ category[4] }}</v-chip>
                    <v-chip v-if="item.group_category_id == 6" color="blue-gray" text-color="white" small>{{ category[5] }}</v-chip>
                  </template>
                  <template v-slot:item.fes_year_id="{ item }">
                    {{ years[item.fes_year_id] }}
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
      groups: [],
      group_categories: [],
      category: [],
      fes_years: [],
      years: [],
      headers:[
        { text: 'ID', value: 'id' },
        // { text: 'USER_ID', value: 'user_id' },
        { text: 'グループ名', value: 'name' },
        { text: '企画名', value: 'project_name' },          
        // { text: '活動内容', value: 'activity' },
        { text: 'グループカテゴリ', value: 'group_category_id' },
        { text: '開催年', value: 'fes_year_id' },
        { text: '日時', value: 'created_at' },
        { text: '編集日時', value: 'updated_at' },
      ],
    }
  },
  mounted() {
    this.$axios.get('/groups', {
      headers: { 
        "Content-Type": "application/json", 
        "access-token": localStorage.getItem('access-token'),
        "client": localStorage.getItem('client'),
        "uid": localStorage.getItem('uid')
      }
    })
      .then(response => {
        this.groups = response.data
      })

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

    this.$axios.get('/fes_years', {
      headers: { 
        "Content-Type": "application/json", 
      }
    })
      .then(response => {
        this.fes_years = response.data
        for (let i = 0; i < this.fes_years.length; i++) {
          this.years.push(this.fes_years[i]['year_num'])
        }
      })
  },
  methods: {
    reload: function() {
    this.$axios.get('/groups', {
      headers: { 
        "Content-Type": "application/json", 
        "access-token": localStorage.getItem('access-token'),
        "client": localStorage.getItem('client'),
        "uid": localStorage.getItem('uid')
      }
    }
    )
      .then(response => {
        this.groups = response.data
      })
    }
  }
}
</script>

<style>
.card {
  padding-left: 1%;
  padding-right: 5%
}
</style>
