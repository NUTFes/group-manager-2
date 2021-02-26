<template>
  <v-row>
    <v-col>
      <div class="card">
      <v-card flat>
        <v-row>
          <v-col cols="1"></v-col>
          <v-col cols="10">
            <v-card-title class="font-weight-bold mt-3">
              <v-icon class="mr-5">mdi-account</v-icon>従業員一覧
              <v-spacer></v-spacer>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs  }">
                  <v-btn 
                          class="mx-2" 
                          fab 
                          text
                          v-bind="attrs"
                          v-on="on"
                          to="/employees/print"
                          >
                          <v-icon dark>mdi-printer</v-icon>
                  </v-btn>
                </template>
                <span>印刷する</span>
              </v-tooltip>
            </v-card-title>
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
                  <template v-slot:item.updated_at="{ item }">
                    {{ item.employee.updated_at | format-date }}
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
      employees: [],
      headers:[
        { text: 'ID', value: 'employee.id' },
        { text: '参加団体', value: 'group' },
        { text: '名前', value: 'employee.name' },
        { text: '学籍番号', value: 'employee.student_id' },
        { text: '日時', value: 'employee.created_at' },
        { text: '編集日時', value: 'employee.updated_at' },
      ],
    }
  },
  mounted() {
    this.$axios.get('/api/v1/get_employees', {
      headers: { 
        "Content-Type": "application/json", 
      }
    }
    )
      .then(response => {
        this.employees = response.data
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
