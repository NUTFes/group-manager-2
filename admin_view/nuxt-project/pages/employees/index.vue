<template>
  <v-row>
    <v-col>
      <v-card flat class="mx-15">
        <v-row>
          <v-col cols="1"></v-col>
          <v-col cols="10">
            <v-card-title class="font-weight-bold mt-3">
              <v-icon class="mr-5">mdi-account</v-icon>従業員申請一覧
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
                  <span>従業員の追加</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
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
                    <v-icon class="ma-5" dark>mdi-account</v-icon
                    >従業員の追加
                  </div>
                  <v-spacer></v-spacer>
                  <v-btn text @click="dialog = false" fab dark>
                    ​ <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-card-title>

                <v-card-text>
                  <v-row>
                    <v-col>
                      <v-form ref="form">
                        <v-select
                          label="参加団体名"
                          v-model="Group"
                          :items="groups"
                          :menu-props="{
                            top: true,
                            offsetY: true,
                          }"
                          item-text="name"
                          item-value="id"
                          outlined
                        ></v-select>
                        <v-text-field
                          class="body-1"
                          label="名前"
                          v-model="userName"
                          background-color="white"
                          outlined
                          clearable
                        >
                        </v-text-field>
                        <v-text-field
                          class="body-1"
                          label="学籍番号"
                          v-model="studentId"
                          :rules="[rules.min8, rules.over8]"
                          background-color="white"
                          counter="8"
                          outlined
                          clearable
                        >
                        </v-text-field>
                      </v-form>
                    </v-col>
                  </v-row>
                </v-card-text>
                
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
              <div class="text-center" v-if="employees.length === 0">
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
                  :items="employees"
                  class="elevation-0 my-9"
                  @click:row="
                              (data) =>
                              $router.push({ path: `/employees/${data.employee.id}`})
                              "
                  >
                  <template v-slot:item.employee.created_at="{ item }">
                    {{ item.employee.created_at | format-date }}
                  </template>
                  <template v-slot:item.employee.updated_at="{ item }">
                    {{ item.employee.updated_at | format-date }}
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
</template>

<script>
export default {
  data() {
    return {
      rules: {
        required: (value) => !!value || "入力してください",
        min8: (v) => v.length >= 8 || "8桁かどうかを確認してください",
        over8: (v) => v.length <= 8 || "8桁かどうかを確認してください",
        max: (value) => value <= 1000 || "大きすぎます",
      },
      employees: [],
      groups: [],
      dialog: false,
      Group: [],
      userName: [],
      studentId: [],
      headers: [
        { text: "ID", value: "employee.id" },
        { text: "参加団体", value: "group" },
        { text: "名前", value: "employee.name" },
        { text: "学籍番号", value: "employee.student_id" },
        { text: "日時", value: "employee.created_at" },
        { text: "編集日時", value: "employee.updated_at" },
      ],
    };
  },
  mounted() {
    this.$axios
      .get("/api/v1/get_employees", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.employees = response.data;
      });
    this.$axios.get('/groups', {
      headers: { 
        "Content-Type": "application/json", 
      }
    })
      .then(response => {
        this.groups = response.data
      })
  },

  methods: {
    reload: function () {
      this.$axios
        .get("/api/v1/get_employees", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.employees = response.data;
        });
    },
    register: function () {
      this.$axios.defaults.headers.common["Content-Type"] = "application/json";
      var params = new URLSearchParams();
      params.append("group_id", this.Group);
      params.append("name", this.userName);
      params.append("student_id", this.studentId);
      this.$axios.post("/employees", params).then((response) => {
        console.log(response);
        this.dialog = false;
        this.reload();
        this.Group = "";
        this.userName = "";
        this.studentId = "";
      });
    },
  }
};
</script>
