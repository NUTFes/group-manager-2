<template>
  <v-row>
    <v-col cols="2" />
    <v-col cols="8">
      <v-card-title>購入品登録</v-card-title>
      <v-divider />
      <v-card-text>
        <v-row>
        <v-col cols=3></v-col>
        <v-col cols=3>
        <v-select
          v-model="purchaseSteps"
          :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
          label="購入品数"
          outlined
        ></v-select>
        </v-col>
        <v-col cols="6"><v-card-text>個の購入品を登録</v-card-text></v-col>
        </v-row>
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
                  <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    rounded
                    text
                    color="btn"
                    class="pr-5"
                    @click="e1 -= 1"
                    v-show="purchaseStep != 1"
                  >
                  <v-icon class="mr-n1">mdi-menu-left</v-icon>
                    戻る
                  </v-btn>
                  <v-btn
                    rounded
                    outlined
                    color="btn"
                    class="pl-5"
                    @click="e1 += 1"
                    v-show="purchaseSteps != purchaseStep"
                  >
                    {{ purchaseStep + 1 }}
                    つ目へ
                    <v-icon class="ml-n1">mdi-menu-right</v-icon>
                  </v-btn>
                    </v-card-actions>
               <v-divider class="mb-8" />
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
        <v-row>
          <v-col cols="10" />
          <v-col cols="2">
            <v-btn
              rounded
              dark
              depressed
              large
              class="font-weight-bold"
              color="btn"
              @click="submit"
              >完了
            </v-btn></v-col
          ></v-row
        >
      </v-card-text>
    </v-col>
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
        this.$refs.purchaseChild[i].submit();
      }
      this.$router.push("MyPage");
    }
  }
};
</script>
