<template>
  <div>
    <Header/>
      <v-row>
        <v-col cols=2>
          <Menu/>
        </v-col>
        <v-col cols=10>
          <v-row>
            <v-col cols="1"></v-col>
            <v-col cols="10">
              <v-card>
                <v-row>
                  <v-col cols="1"></v-col>
                  <v-col cols="10">
                    <v-card-title class="font-weight-bold mt-3">
                      <v-icon>mdi-account-multiple</v-icon>ユーザー一覧
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
                    <!-- Comment
                      <v-data-table
                      :headers="headers"
                      :items="users"
                      :items-per-page="5"
                      class="elevation-1"
                      ></v-data-table>
                    -->
                    <template>
                      <v-simple-table class="my-9">
                        <template v-slot:default>
                          <thead>
                            <tr>
                              <th class="text-center">ID</th>
                              <th class="text-center">名前</th>
                              <th class="text-center">メールアドレス</th>
                              <th class="text-center">権限
</th>
                              <th class="text-center">
                                作成日時
                              </th>
                              <th class="text-center">
                                編集日時
                              </th>
                              <th class="text-center">
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              class="text-center"
                              v-for="user in users"
                              @click="$router.push({name:'users-id', params:{id: user.id}})"
                              :key="user.id"
                              >
                              <td>{{ user.id }}</td>
                              <td>{{ user.name }}</td>
                              <td>{{ user.email }}</td>
                              <td v-if="user.role_id == 1"><v-chip color="red" text-color="white" small><v-icon class="mr-1">mdi-account-cog</v-icon>developer</v-chip></td>
                              <td v-else-if="user.role_id == 2"><v-chip color="green" text-color="white" small><v-icon class="mr-1">mdi-account-tie</v-icon>manager</v-chip></td>
                              <td v-else-if="user.role_id == 3"><v-chip color="blue" text-color="white" small><v-icon class="mr-1">mdi-account</v-icon>user</v-chip></td>
                              <td>{{ user.created_at | format-date }}</td>
                              <td>{{ user.updated_at | format-date}}</td>
                              <td><v-icon color="#E91E63">mdi-eye</v-icon></td>
                              <!-- <td v-if="rights == 1"><v-icon color="#E91E63">mdi-pencil</v-icon></td> -->
                              <!-- <td v-if="rights == 2"><v-icon color="#E91E63">mdi-eye</v-icon></td> -->
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </template>
                  </v-col>
                  <v-col cols="1"></v-col>
                </v-row>
              </v-card>
            </v-col>
            <v-col cols="1"></v-col>
          </v-row>
        </v-col>
      </v-row>
  </div>
</template>

<script>
import pdfMake from 'pdfmake/build/pdfmake'
import '../../plugins/vfs_fonts.js'
import Header from '~/components/Header.vue'
import Menu from '~/components/Menu.vue'
if (process.browser) {
  const vfs = require ('pdfmake/build/vfs_fonts.js')
  console.log(vfs)
}

export default {
  components: {
    Header,
    Menu,
  },
  data() {
    return {
      users: [],
     /* headers:[
        { text: 'id', value: 'id' },
        { text: '名前', value: 'name' },
        { text: 'メールアドレス', value: 'email' },
        { text: '権限', value: 'role_id' },
        { text: '日時', value: 'created_at' },
        { text: '編集日時', value: 'updated_at' },
      ],*/
    }
  },
  mounted() {
    this.$axios.get('api/v1/users/index', {
      headers: { 
        "Content-Type": "application/json", 
        "access-token": localStorage.getItem('access-token'),
        "client": localStorage.getItem('client'),
        "uid": localStorage.getItem('uid')
      }
    }
    )
      .then(response => {
        this.users = response.data.data
      })
  },
  methods: {
    onDownloadPDFClickWithPDFMake() {
      pdfMake.fonts = {
        GenShin: {
          normal: 'GenShinGothic-Normal-Sub.ttf',
          bold: 'GenShinGothic-Normal-Sub.ttf',
          italics: 'GenShinGothic-Normal-Sub.ttf',
          bolditalics: 'GenShinGothic-Normal-Sub.ttf',
        },
      };
      const defaultStyle = 'GenShin';

      // PDF出力する内容の定義
      const docDefinition = {
        content: [
          {
            text: 'ユーザー一覧',
            style: 'header'
          },
          // {
          //   text: 'サンプルです。',
          //   style: 'subheader'
          // },
          // {
          //   text: '※これはただのサンプルです。',
          //   style: { color: 'red', fontSize: 10 },
          // },
          {
            layout: 'lightHorizontalLines',
            table: {
              headerRows: 1,
              widths: ['auto', '*', '*', '*'],
              body: [
                ['ID', '名前', 'メールアドレス', '権限'],
                ['aa', 'bb', 'cc', 'dd']
              ]
            }
          },
        ],
        defaultStyle: {
          font: defaultStyle,
        },
        styles: {
          header: {
            fontSize: 30,
          },
          subheader: {
            fontSize: 20,
          },
        },
      };

      // pdfMakeでのPDF出力
      pdfMake.createPdf(docDefinition).download();
    },
  }
}
</script>
