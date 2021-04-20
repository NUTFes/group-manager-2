<template>
  <v-row>
    <v-col>
        <v-card flat class="mx-15">
          <v-row>
            <v-col cols="1"></v-col>
            <v-col cols="10">
              <v-card-title class="font-weight-bold mt-3">
                <v-icon class="mr-5">mdi-newspaper-variant</v-icon>お知らせ
                <v-spacer></v-spacer>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs  }">
                    <v-btn 
                            class="mx-2" 
                            fab 
                            text
                            v-bind="attrs"
                            v-on="on"
                            @click="dialog=true"
                            >
                            <v-icon dark>mdi-plus-circle-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>お知らせの追加</span>
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
                      <v-icon class="ma-5" dark>mdi-bell-plus-outline</v-icon>
                      お知らせの追加 
                    </div>
                    <v-spacer></v-spacer>
                    <v-btn text @click="dialog = false" fab dark>
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-card-title>
                  <v-row>
                    <v-col cols="1"></v-col>
                    <v-col cols="10">
                      <v-text-field
                        class="body-1"
                        label="タイトル"
                        background-color="white"
                        outlined
                        v-model="title"
                        clearable
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="1"></v-col>
                  </v-row>
                  <v-row>
                    ​ <v-col cols="1"></v-col>
                    <v-col cols="10">
                      <v-textarea
                        class="body-1"
                        label="内容"
                        background-color="white"
                        outlined
                        height="100"
                        v-model="body"
                        clearable
                     />
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
                          @click="
                            register();
                            dialog = false;
                            reload;
                          "
                        >登録
                        </v-btn>
                      </v-card-actions>
                </v-card>
              </v-dialog>

              <hr class="mt-n3">
              <template>
                <div class="text-center" v-if="news.length === 0">
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
                    :items="news"
                    class="elevation-0 my-9"
                    @click:row="
                                (data) =>
                                $router.push({ path: `/news/${data.id}`})
                                "
                    >
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
    </v-col>
  </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      news: [],
      title:[],
      body:[],
      dialog:false,
      headers:[
        { text: 'ID', value: 'id' },
        { text: 'タイトル', value: 'title' },
        { text: '日時', value: 'created_at' },
        { text: '編集日時', value: 'updated_at' },
      ],
    }
  },
  mounted() {
    this.$axios.get('/news', {
      headers: { 
        "Content-Type": "application/json", 
        dialog: false,
      },
    }
    )
      .then(response => {
        this.news = response.data
      })
  },

  methods:{
    register: function() {
      this.$axios.defaults.headers.common["Content-Type"] = "application/json";
      var params = new URLSearchParams();
      params.append("title", this.title);
      params.append("body", this.body);
      this.$axios.post('/news', params)
    },
    reload: function() {
      this.$axios.get('/news', {
      headers: { 
        "Content-Type": "application/json", 
        dialog: false,
      },
    }
    )
      .then(response => {
        this.news = response.data
      })
    }
  }
}
</script>
