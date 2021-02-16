<template>
  <v-row>
    <v-col cols="2"></v-col>
    <v-col cols="8">
      <v-stepper v-model="e1" non-linear alt-labels>
        <v-stepper-header>
          <v-stepper-step :complete="e1 > 1" step="1"
            >従業員登録</v-stepper-step
          >
          <v-divider></v-divider>
          <v-stepper-step :complete="e1 > 2" step="2"
            >販売食品登録</v-stepper-step
          >
          <v-divider></v-divider>
          <v-stepper-step :complete="e1 > 3" step="3"
            >販売リストの登録</v-stepper-step
          >
        </v-stepper-header>
        <v-stepper-items>
          <!-- 従業員登録 -->
          <v-stepper-content step="1">
            <v-row>
              <v-col cols="1"></v-col>
              <v-col cols="10">
                <v-card>
                  <v-card-title>従業員登録</v-card-title>
                  <v-divider></v-divider>
                  <v-card-text>
                    <v-select
                      v-model="employeeSteps"
                      :items="[1, 2, 3, 4, 5]"
                      label="従業員数"
                      outlined
                    ></v-select>
                    <v-stepper v-model="e2">
                      <v-stepper-header class="stepper">
                        <template v-for="employeeStep in employeeSteps">
                          <v-stepper-step
                            :key="`${employeeStep}-step`"
                            :complete="e3 > employeeStep"
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
                          <EmployeeCard />
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
                                個目の物品へ
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
              <v-col cols="2">
                <v-btn
                  class="stepper"
                  rounded
                  height="50"
                  width="170"
                  color="primary"
                  @click="e1 += 1"
                >
                  次へ
                </v-btn>
              </v-col>
            </v-row>
          </v-stepper-content>
          <!-- 販売食品登録 -->
          <v-stepper-content step="2">
            <v-row>
              <v-col cols="1"></v-col>
              <v-col cols="10">
                <v-card>
                  <v-card-title>販売食品登録</v-card-title>
                  <v-divider></v-divider>
                  <v-card-text>
                    <FoodsProductCard />
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="1"></v-col>
            </v-row>
            <v-row>
              <v-col cols="7"></v-col>
              <v-col cols="2">
                <v-btn text height="50" width="170" @click="e1 -= 1">
                  戻る
                </v-btn>
              </v-col>
              <v-col cols="2">
                <v-btn
                  class="stepper"
                  rounded
                  height="50"
                  width="170"
                  color="primary"
                  @click="e1 += 1"
                >
                  次へ
                </v-btn>
              </v-col>
            </v-row>
          </v-stepper-content>
          <!-- 販売リストの登録 -->
          <v-stepper-content step="3">
            <v-row>
              <v-col cols="1"></v-col>
              <v-col cols="10">
                <v-card flat>
                  <v-card-title>販売リストの登録</v-card-title>
                  <v-divider></v-divider>
                  <v-card-text>
                    <v-select
                      v-model="parchaseSteps"
                      :items="[1, 2, 3, 4, 5]"
                      label="購入数"
                      outlined
                    ></v-select>
                    <v-stepper v-model="e3">
                      <v-stepper-header class="stepper">
                        <template v-for="parchaseStep in parchaseSteps">
                          <v-stepper-step
                            :key="`${parchaseStep}-step`"
                            :complete="e3 > parchaseStep"
                            :step="parchaseStep"
                          >
                            {{ parchaseStep }}
                          </v-stepper-step>
                          <v-divider
                            v-if="parchaseStep !== parchaseSteps"
                            :key="parchaseStep"
                          ></v-divider>
                        </template>
                      </v-stepper-header>
                      <v-stepper-items>
                        <v-stepper-content
                          v-for="parchaseStep in parchaseSteps"
                          :key="`${parchaseStep}-content`"
                          :step="parchaseStep"
                        >
                          <ParchaseCard />
                          <v-row>
                            <v-col cols="4" />
                            <v-col cols="4">
                              <v-btn
                                block
                                height="50"
                                outlined
                                color="primary"
                                @click="e2 += 1"
                                v-show="parchaseSteps != parchaseStep"
                              >
                                {{ parchaseStep + 1 }}
                                個目の物品へ
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
              <v-col cols="7"></v-col>
              <v-col cols="2">
                <v-btn text height="50" width="170" @click="e1 -= 1">
                  戻る
                </v-btn>
              </v-col>
              <v-col cols="2">
                <v-btn
                  class="stepper"
                  dark
                  rounded
                  height="50"
                  width="170"
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
import ParchaseCard from "@/components/ParchaseCard";
export default {
  components: {
    EmployeeCard,
    FoodsProductCard,
    ParchaseCard
  },
  data() {
    return {
      e1: 1,
      e2: 1,
      e3: 1,
      employeeSteps: 2,
      parchaseSteps: 2
    };
  },
  methods: {
    submit: () => {
      console.log("test");
    }
  }
};
</script>
