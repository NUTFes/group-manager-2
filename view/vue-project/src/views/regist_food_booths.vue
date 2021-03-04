<template>
  <v-row>
    <v-col cols="2"></v-col>
    <v-col cols="8">
      <v-stepper class="stepper" v-model="e1" non-linear alt-labels>
        <v-stepper-header>
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
                    <v-select
                      v-model="employeeSteps"
                      :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                      label="従業員数"
                      outlined
                    ></v-select>
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
                          <v-row>
                            <v-col cols="4" />
                            <v-col cols="4">
                              <v-btn
                                block
                                height="50"
                                outlined
                                color="primary"
                                @click="e2 += 1"
                                v-show="employeeSteps != employeeStep"
                              >
                                {{ employeeStep + 1 }}
                                人目へ
                              </v-btn>
                            </v-col>
                            <v-col cols="4" />
                          </v-row>
                          <v-row>
                            <v-col cols="4" />
                            <v-col cols="4">
                              <v-btn
                                height="50"
                                block
                                text
                                @click="e2 -= 1"
                                v-show="employeeStep != 1"
                              >
                                戻る
                              </v-btn>
                            </v-col>
                            <v-col cols="4" />
                          </v-row>
                        </v-stepper-content>
                      </v-stepper-items>
                    </v-stepper>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="1"></v-col>
            </v-row>
            <v-row>
              <v-col cols="9"></v-col>
              <v-col cols="3">
                <v-btn
                  class="stepper"
                  rounded
                  height="50"
                  block
                  color="primary"
                  @click="e1 += 1"
                >
                  次へ
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
                    <v-select
                      v-model="foodProductSteps"
                      :items="[1, 2, 3, 4, 5]"
                      label="購入数"
                      outlined
                    ></v-select>
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
                          <v-row>
                            <v-col cols="4" />
                            <v-col cols="4">
                              <v-btn
                                block
                                height="50"
                                outlined
                                color="primary"
                                @click="e3 += 1"
                                v-show="foodProductSteps != foodProductStep"
                              >
                                {{ foodProductStep + 1 }}
                                個目の販売食品へ
                              </v-btn>
                            </v-col>
                            <v-col cols="4" />
                          </v-row>
                          <v-row>
                            <v-col cols="4" />
                            <v-col cols="4">
                              <v-btn
                                height="50"
                                block
                                text
                                @click="e3 -= 1"
                                v-show="employeeStep != 1"
                              >
                                戻る
                              </v-btn>
                            </v-col>
                            <v-col cols="4" />
                          </v-row>
                        </v-stepper-content>
                      </v-stepper-items>
                    </v-stepper>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="1"></v-col>
            </v-row>
            <v-row>
              <v-col cols="6"></v-col>
              <v-col cols="3">
                <v-btn text height="50" block @click="e1 -= 1">
                  戻る
                </v-btn>
              </v-col>
              <v-col cols="3">
                <v-btn
                  class="stepper"
                  dark
                  rounded
                  height="50"
                  block
                  color="purple accent-2"
                  @click="submit"
                >
                  登録
                </v-btn>
              </v-col>
            </v-row>
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
