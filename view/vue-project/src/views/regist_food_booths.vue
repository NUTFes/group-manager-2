<template>
  <v-row>
    <v-col cols="2"></v-col>
    <v-col cols="8">
      <v-stepper class="stepper" v-model="e1" non-linear alt-labels>
        <v-stepper-header class="stepper">
          <v-stepper-step :complete="e1 > 1" step="1"
            >従業員登録</v-stepper-step
          >
          <v-divider></v-divider>
          <v-stepper-step :complete="e1 > 3" step="2"
            >販売食品の登録</v-stepper-step
          >
        </v-stepper-header>
        <v-stepper-items>
          <!-- 従業員登録 -->
          <v-stepper-content step="1">
            <v-row>
              <v-col cols="1"></v-col>
              <v-col cols="10">
                <v-card flat>
                  <v-card-title>従業員登録</v-card-title>
                  <v-divider></v-divider>
                  <v-card-text>
                    <v-row>
                      <v-col cols=3></v-col>
                      <v-col cols=3>
                    <v-select
                      v-model="employeeSteps"
                      :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                      label="従業員数"
                      outlined
                    ></v-select>
                    </v-col>
                    <v-col cols=6><v-card-text>人の従業員を登録する</v-card-text></v-col>
                    </v-row>
                    <v-stepper class="stepper" v-model="e2">
                      <v-stepper-header class="stepper">
                        <template v-for="employeeStep in employeeSteps">
                          <v-stepper-step
                            :key="`${employeeStep}-step`"
                            :complete="e2 > employeeStep"
                            :step="employeeStep"
                          >
                            {{ employeeStep }}
                          </v-stepper-step>
                          <v-divider
                            v-if="employeeStep !== employeeSteps"
                            :key="employeeStep"
                          ></v-divider>
                        </template>
                      </v-stepper-header>
                      <v-stepper-items>
                        <v-stepper-content
                          v-for="employeeStep in employeeSteps"
                          :key="`${employeeStep}-content`"
                          :step="employeeStep"
                        >
                          <EmployeeCard
                            :groupId="groupId"
                            ref="employeeChild"
                            :key="employeeStep"
                          />
                        <v-card-actions>
                          <v-spacer></v-spacer>
                             <v-btn
                                rounded
                                text
                                large
                                color="btn"
                                class="pr-5"
                                @click="e2 -= 1"
                                v-show="employeeStep != 1"
                              >
                              <v-icon class="mr-n1">mdi-menu-left</v-icon>
                                戻る
                              </v-btn>
                            <v-btn
                              rounded
                              outlined
                              large
                              color="btn"
                              class="pl-5"
                              @click="e2 += 1"
                              v-show="employeeSteps != employeeStep"
                            >
                              {{ employeeStep + 1 }}
                              人目へ
                              <v-icon class="ml-n1">mdi-menu-right</v-icon>
                            </v-btn>
                           
                              </v-card-actions>
                        </v-stepper-content>
                      </v-stepper-items>
                    </v-stepper>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="1"></v-col>
            </v-row>
            <v-divider class="mb-8"></v-divider>
            <v-row>
              <v-col cols="9"></v-col>
              <v-col cols="3">
                <v-btn
                  rounded
                  depressed
                  large
                  class="pl-4 font-weight-bold"
                  color="primary"
                  @click="e1 += 1"
                >
                  次へ
                  <v-icon class="ml-n1">mdi-menu-right</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-stepper-content>

          <!-- 販売食品の登録 -->
          <v-stepper-content step="2">
            <v-row>
              <v-col cols="1"></v-col>
              <v-col cols="10">
                <v-card flat>
                  <v-card-title>販売食品の登録</v-card-title>
                  <v-divider></v-divider>
                  <v-card-text>
                    <v-row>
                      <v-col cols=3></v-col>
                      <v-col cols=3>
                    <v-select
                      v-model="foodProductSteps"
                      :items="[1, 2, 3, 4, 5]"
                      label="購入数"
                      outlined
                    ></v-select>
                      </v-col>
                      <v-col cols=6><v-card-text>個の販売食品を登録する</v-card-text></v-col>
                    </v-row>
                    <v-stepper class="stepper" v-model="e3">
                      <v-stepper-header class="stepper">
                        <template v-for="foodProductStep in foodProductSteps">
                          <v-stepper-step
                            :key="`${foodProductStep}-step`"
                            :complete="e3 > foodProductStep"
                            :step="foodProductStep"
                          >
                            {{ foodProductStep }}
                          </v-stepper-step>
                          <v-divider
                            v-if="foodProductStep !== foodProductSteps"
                            :key="foodProductStep"
                          ></v-divider>
                        </template>
                      </v-stepper-header>
                      <v-stepper-items>
                        <v-stepper-content
                          v-for="foodProductStep in foodProductSteps"
                          :key="`${foodProductStep}-content`"
                          :step="foodProductStep"
                        >
                          <FoodsProductCard
                            :groupId="groupId"
                            ref="foodProductChild"
                            :key="foodProductStep"
                          />
                            <v-card-actions>
                              <v-spacer></v-spacer>
                               <v-btn
                                rounded
                                text
                                large
                                color="btn"
                                class="pr-5"
                                @click="e3 -= 1"
                                v-show="employeeStep != 1"
                              >
                              <v-icon class="mr-n1">mdi-menu-left</v-icon>
                                戻る
                              </v-btn>
                              <v-btn
                               rounded
                              outlined
                              large
                              color="btn"
                              class="pl-5"
                                @click="e3 += 1"
                                v-show="foodProductSteps != foodProductStep"
                              >
                                {{ foodProductStep + 1 }}
                                個目の販売食品へ
                                <v-icon class="ml-n1">mdi-menu-right</v-icon>
                              </v-btn>
                              </v-card-actions>
                        </v-stepper-content>
                      </v-stepper-items>
                    </v-stepper>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="1"></v-col>
            </v-row>
            <v-divider class="mb-8"></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn 
              text  
              rounded
              large
              color="btn"
              class="pr-4 font-weight-bold" 
              @click="e1 -= 1">
              <v-icon class="mr-n1">mdi-menu-left</v-icon>
                戻る
              </v-btn>
              <v-btn
              rounded
              dark
              depressed
              large
              class="font-weight-bold"
              color="btn"
              @click="submit"
              >
                完了
              </v-btn>
            </v-card-actions>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-col>
    <v-col cols="2"></v-col>
  </v-row>
</template>

<script>
import EmployeeCard from "@/components/EmployeeCard";
import FoodsProductCard from "@/components/FoodsProductCard";
export default {
  components: {
    EmployeeCard,
    FoodsProductCard
  },
  data() {
    return {
      e1: 1,
      e2: 1,
      e3: 1,
      employeeSteps: 2,
      foodProductSteps: 2,
      groupId: localStorage.getItem("group_id")
    };
  },
  methods: {
    submit() {
      console.log("subit");
      for (let i = 0; i < this.employeeSteps; i++) {
        this.$refs.employeeChild[i].submit();
      }

      for (let i = 0; i < this.foodProductSteps; i++) {
        this.$refs.foodProductChild[i].submit();
      }
      this.$router.push("regist_purchase");
    }
  }
};
</script>

<style scooped>
.stepper {
  box-shadow: none;
}
</style>
