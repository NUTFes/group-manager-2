<template>
  <v-row>
    <v-col cols="2" />
    <v-col cols="8">
      <v-card-title>購入品登録</v-card-title>
      <v-divider />
      <v-card-text>
        <v-select
          v-model="employeeSteps"
          :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
          label="購入品数"
          outlined
        ></v-select>
        <v-stepper class="stepper" v-model="e1">
          <v-stepper-header class="stepper">
            <template v-for="purchaseStep in purchaseSteps">
              <v-stepper-step
                :key="`${purchaseStep}-step`"
                :complete="e1 > purchaseStep"
                :step="purchaseStep"
              >
                {{ purchaseStep }}
              </v-stepper-step>
              <v-divider
                v-if="purchaseStep !== purchaseSteps"
                :key="purchaseStep"
              ></v-divider>
            </template>
          </v-stepper-header>
          <v-stepper-items>
            <v-stepper-content
              v-for="purchaseStep in purchaseSteps"
              :key="`${purchaseStep}-content`"
              :step="purchaseStep"
            >
              <PurchaseCard
                :groupId="groupId"
                ref="purchaseChild"
                :key="purchaseStep"
              />
              <v-row>
                <v-col cols="2" />
                <v-col cols="8">
                  <v-btn
                    block
                    height="50"
                    outlined
                    color="primary"
                    @click="e1 += 1"
                    v-show="purchaseSteps != purchaseStep"
                  >
                    {{ purchaseStep + 1 }}
                    人目へ
                  </v-btn>
                </v-col>
                <v-col cols="2" />
              </v-row>
              <v-row>
                <v-col cols="4" />
                <v-col cols="4">
                  <v-btn
                    height="50"
                    block
                    text
                    @click="e1 -= 1"
                    v-show="purchaseStep != 1"
                  >
                    戻る
                  </v-btn>
                </v-col>
                <v-col cols="4" />
              </v-row>
              <v-divider />
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
        <v-row>
          <v-col cols="9" />
          <v-col cols="3">
            <v-btn
              class="stepper"
              dark
              rounded
              height="50"
              block
              @click="submit"
              color="purple accent-2"
              align="right"
              >登録
            </v-btn></v-col
          ></v-row
        >
      </v-card-text>
    </v-col>
    <v-col cols="2" />
  </v-row>
</template>
<script>
import PurchaseCard from "@/components/PurchaseCard";
export default {
  components: { PurchaseCard },
  data() {
    return {
      purchaseSteps: 2,
      e1: 1,
      groupId: localStorage.getItem("group_id")
    };
  },
  methods: {
    submit() {
      for (let i = 0; i < this.purchaseSteps; i++) {
        this.$refs.puchaseChild[i].submit();
      }
      this.$router.push("MyPage");
    }
  }
};
</script>
