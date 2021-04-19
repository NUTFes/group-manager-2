<template>
  <v-row>
    <v-col>
      <v-card flat class="mx-15">
        <v-row>
          <v-col cols="1"></v-col>
          <v-col cols="10">
            <v-card-title class="font-weight-bold mt-3">
              <v-icon class="mr-5">mdi-calendar-multiple</v-icon>開催日
              <v-spacer></v-spacer>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs  }">
                  <v-btn 
                          class="mx-2" 
                          fab 
                          text
                          v-bind="attrs"
                          v-on="on"
                          @click="openModal()"
                          >
                          <v-icon dark>mdi-plus-circle-outline</v-icon>
                  </v-btn>
                </template>
                <span>開催日の追加</span>
              </v-tooltip>
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
            </v-card-title>
            <v-dialog v-model="dialog" max-width="500">
              <v-card>
                <v-card-title class="headline blue-grey darken-3">
                  <div style="color: white">
                    <v-icon class="ma-5" dark>mdi-calendar-multiple</v-icon>
                    開催日の追加 
                  </div>
                  <v-spacer></v-spacer>
                  <v-btn text @click="dialog = false" fab dark>
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-card-title>
                <v-row>
                  <v-col cols="1"></v-col>
                  <v-col cols="10">
                    <v-select
                      class="body-1"
                      label="開催年"
                      background-color="white"
                      outlined
                      v-model="fes_year_id"
                      :items="fes_years"
                      item-text="year_num"
                      item-value="id"
                      clearable
                    >
                    </v-select>
                    <v-select
                      class="body-1"
                      label="days_num"
                      background-color="white"
                      outlined
                      v-model="days_num"
                      :items="days_num_list"
                      clearable
                    >
                    </v-select>
                    <v-text-field
                      class="body-1"
                      label="開催日"
                      background-color="white"
                      outlined
                      v-model="date"
                      clearable
                    >
                    </v-text-field>
                    <v-text-field
                      class="body-1"
                      label="曜日"
                      background-color="white"
                      outlined
                      v-model="day"
                      clearable
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="1"></v-col>
                </v-row>

                <v-divider></v-divider>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        depressed
                        dark
                        color="btn"
                        @click="register()"
                      >登録
                      </v-btn>
                    </v-card-actions>
              </v-card>
            </v-dialog>

            <hr class="mt-n3">
            <template>
              <div class="text-center" v-if="fes_dates.length === 0">
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
                  :items="fes_dates"
                  class="elevation-0 my-9"
                  @click:row="
                              (data) =>
                              $router.push({ path: `/fes_dates/${data.fes_date.id}`})
                              "
                  >
                  <template v-slot:item.fes_date.created_at="{ item }">
                    {{ item.fes_date.created_at | format-date }}
                  </template>
                  <template v-slot:item.fes_date.updated_at="{ item }">
                    {{ item.fes_date.updated_at | format-date }}
                  </template>
                </v-data-table>                      
              </div>
            </template>
          </v-col>
          <v-col cols="1"></v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fes_dates: [],
      fes_years: [],
      days_num: [],
      date: [],
      day: [],
      fes_year_id: [],
      dialog:false,
      headers:[
        { text: 'ID', value: 'fes_date.id' },
        { text: '開催年', value: 'fes_year' },
        { text: 'num', value: 'fes_date.days_num' },
        { text: '開催日', value: 'fes_date.date' },
        { text: '曜日', value: 'fes_date.day' },
        { text: '日時', value: 'fes_date.created_at' },
        { text: '編集日時', value: 'fes_date.updated_at' },
      ],
      days_num_list: [0, 1, 2],
    }
  },
  mounted() {
    this.$axios.get('/api/v1/get_fes_dates', {
      headers: { 
        "Content-Type": "application/json", 
      },
    }
    )
      .then(response => {
        this.fes_dates = response.data
      })
  },

  methods:{
    openModal: function(){
      this.$axios
        .get("/fes_years", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.fes_years = response.data;
        })
      this.dialog = true
    },
    reload: function() {
      this.$axios.get('/api/v1/get_fes_dates', {
        headers: { 
          "Content-Type": "application/json", 
        },
      }
      )
        .then(response => {
          this.fes_dates = response.data
        })
    },
    register: function() {
      this.$axios.defaults.headers.common["Content-Type"] = "application/json";
      var params = new URLSearchParams();
      params.append("days_num", this.year_num);
      params.append("date", this.date);
      params.append("day", this.day);
      params.append("fes_year_id", this.fes_year_id);
      this.$axios.post('/fes_dates', params).then(response => {
        this.reload()
        this.dialog = false
      })
      this.fes_year_id = []
      this.days_num = []
      this.date = []
      this.day = []
    },
  }
}
</script>
