<template>
  <v-container>
    <v-row
        v-for="(employee, i) in regist.employees"
        :key="i">
      <v-col>
        <v-card v-if="employee.name == -9999"></v-card>
        <v-card v-else flat>
          <v-card-title class="font-weight-bold subtitle-1">
            <v-icon class="pr-2">mdi-account</v-icon>
            従業員 {{i+1}}
            <v-spacer></v-spacer>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs  }">
                <v-btn
                    v-if="isEditEmployee"
                    x-small
                    fab
                    text
                    v-bind="attrs"
                    v-on="on"
                    @click="openEmployeeDisplay(employee.id, employee.group_id, employee.name, employee.student_id)"
                    >
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
              <span>従業員情報を編集する</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    v-if="isEditEmployee"
                    x-small
                    text
                    v-bind="attrs"
                    v-on="on"
                    @click="open_delete_dialog_employee(employee.id)"
                    fab
                    ><v-icon class="ma-5">mdi-delete</v-icon>
                </v-btn>
              </template>
              <span>削除</span>
            </v-tooltip>
          </v-card-title>
          <hr>
          <v-list class="subtitle-2">
            <v-list-item>
              <v-list-item-content>名前</v-list-item-content>
              <v-list-item-content>{{employee.name}}</v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item>
              <v-list-item-content>学籍番号</v-list-item-content>
              <v-list-item-content>{{employee.student_id}}</v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <!-- 削除ダイアログ(従業員) -->
    <v-dialog v-model="delete_dialog_employee" width="500">
      <v-card>
        <v-card-title class="main font-weight-bold">
          <v-icon class="pr-2" size="30">mdi-delete</v-icon>削除
          <v-spacer></v-spacer>
          <v-btn 
                               fab
                               text 
                               class="my-n2"
                               @click="delete_dialog_employee = false" 
                               >
                               <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-title>
          削除してよろしいですか？
        </v-card-title>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn depressed color="red" dark @click="delete_yes_employee">
            はい
          </v-btn>
          <v-btn depressed color="blue" dark @click="delete_dialog_employee = false">
            いいえ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--AddButtom -->
    <v-row>
      <v-col cols="1"></v-col>
      <v-col cols="10">
        <v-card-actions>
          <v-spacer />
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs  }">
                <v-btn
                    v-if="addEmployee"
                    fab
                    dark
                    v-bind="attrs"
                    v-on="on"
                    color="purple accent-2"
                    elevation="0"
                    @click="openAddEmployeeDisplay()"
                    >
                    <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>
              <span>従業員申請を追加する</span>
            </v-tooltip>
        </v-card-actions>
      </v-col>
      <v-col cols="1"></v-col>
    </v-row>

    <!--EditModal-->
    <Employee ref="employeeDlg"
              :id="this.employee_id"
              :groupId="this.group_id"
              :studentId ="this.student_id"
              :name="this.name"
              @reload="reload"
              @openEmployeeSnackbar="openEmployeeSnackbar"
              ></Employee>

    <!--AddModal-->
    <AddEmployee ref="addemployeeDlg"
                 :groupId="this.regist.group.id"
                 @reload="reload"
                 @openAddEmployeeSnackbar="openAddEmployeeSnackbar"           
                 ></AddEmployee>

    <v-snackbar
        top
        text
        color="purple accent-2"
        v-model="employeeSnackbar">
      従業員情報を更新しました
    </v-snackbar>

    <v-snackbar
        top
        text
        color="purple accent-2"
        v-model="addemployeeSnackbar">
      従業員情報を追加しました
    </v-snackbar>

  </v-container>
</template>

<script>
  import axios from 'axios'
  import Employee from '@/components/Mobile/EditModal/Employee.vue'
  import AddEmployee from '@/components/Mobile/AddModal/Employee.vue'

export default {
    props: {
      num: String,
      regist: String,
    },
    components: {
        Employee,
        AddEmployee,
    },
    data() {
        return{
            data: [
                localStorage.getItem('access-token'),
                localStorage.getItem('client'),
                localStorage.getItem('uid')
            ],
            delete_dialog_employee: false,
            employeeSnackbar: false,
            addEmployeeSnackbar: false,
            addEmployee: [],
            isEditEmployee: [],
            employee_id: [],
            group_id: [],
            name: [],
            student_id: [],       
        }
    },
    methods: {
        //削除メソッド(従業員申請)
        delete_yes_employee() {
            const url = process.env.VUE_APP_URL +  "/employees/" + this.employee_id;
            axios.delete(url);
            this.reload()
            this.delete_dialog_employee = false
        },
        reload() {
            this.$emit('reload');
        },
        openEmployeeSnackbar() {
            this.employeeSnackbar = true
        },
        openAddEmployeeSnackbar() {
            this.addemployeeSnackbar = true
        },
        openEmployeeDisplay(id, group_id, name, student_id){
            this.employee_id = id
            this.group_id = group_id
            this.name = name
            this.student_id = student_id
            this.$refs.employeeDlg.isDisplay = true
        },
        openAddEmployeeDisplay() {
            this.$refs.addemployeeDlg.isDisplay = true
        },
        open_delete_dialog_employee(id){
            this.employee_id = id
            this.delete_dialog_employee = true
        },
    },

    mounted() {
      const settingurl = process.env.VUE_APP_URL + '/user_page_settings'
      axios.get(settingurl, {
        headers: { 
          "Content-Type": "application/json", 
          "access-token": localStorage.getItem('access-token'),
          "client": localStorage.getItem('client'),
        }
      }
      )
        .then(response => {
          this.isEditEmployee = response.data[0].is_edit_employee
          this.addEmployee = response.data[0].add_employee
          console.log(response)
        })
    },
}
</script>
