<template>
  <div>
  <v-row justify="center">
    <v-col>
    <v-card flat>
      <v-row>
        <v-col cols="1"></v-col>
        <v-col cols="10">
          <v-card-title class="justify-center font-weight-bold">
            電力登録
          </v-card-title>
          <v-divider class="mb-7"/>
          <v-card-text>
            <v-select
                v-model="steps"
                :items="[1, 2, 3, 4, 5]"
                label="登録製品数"
                outlined
                ></v-select>
            <v-select
                label="団体"
                ref="group"
                v-model="groupId"
                :rules="[rules.required]"
                :items="group"
                :menu-props="{
                              top: true,
                              offsetY: true
                              }"
                item-text="name"
                item-value="id"
                outlined
                ></v-select>
          <v-stepper
              class="elevation-0"
              v-model="e1" 
              :vertical="false" 
              >
              <v-stepper-header class="elevation-0">
                <template v-for="step in steps">
                  <v-stepper-step
                      :key="`${step}-step`"
                      :complete="e1 > step"
                      :step="step"
                      :editable="true"
                      >
                  </v-stepper-step>
                    <v-divider v-if="step !== steps" :key="step" />
                </template>
              </v-stepper-header>
              <v-stepper-items>
                <template>
                  <v-stepper-content
                      class="step"
                      v-for="step in steps"
                      :key="`${step}-content`"
                      :step="step"
                      >
                      <PowerCard :groupId="groupId" ref="child" :key="step"/>
                  </v-stepper-content>
                </template>
              </v-stepper-items>
          </v-stepper>
          <v-btn color="blue darken-1" block @click="all_submit">登録</v-btn>
          </v-card-text>
              <v-divider class="mb-8"></v-divider>
              <v-card-actions>
                <v-btn
                  color="btn"
                  rounded
                  large
                  text
                  tabindex="1"
                  class="pr-4 font-weight-bold"
                  to="/mobile_mypage"><v-icon class="pr-n1">mdi-menu-left</v-icon>マイページへ</v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  color="btn" 
                  rounded
                  large
                  dark 
                  depressed
                  tabindex="0"
                  class="pl-4 font-weight-bold"
                  @click="all_submit">登録<v-icon class="ml-n1">mdi-menu-right</v-icon></v-btn>
              </v-card-actions>

        </v-col>
        <v-col cols="1"></v-col>
      </v-row>
    </v-card>
</v-col>
  </v-row>
</div>
</template>

<script>
import axios from "axios";
import PowerCard from "@/components/Mobile/PowerCard";
export default {
  components: {
    PowerCard
  },
  data() {
    return {
      rules: {
        required: value => !!value || "入力してください",
        max: value => value <= 1000 || "大きすぎます"
      },
      group: [],
      e1: 1,
      steps: 2,
      groupId: 0
    };
  },
  watch: {
    steps(val) {
      if (this.e1 > val) this.e1 = val;
    }
  },
  methods: {
    onInput: val => {
      this.steps = parseInt(val);
    },
    nextStep: n => {
      if (n === this.steps) {
        this.e1 = 1;
      } else {
        this.e1 = n + 1;
      }
    },
    all_submit: function() {
      let valid = true;
      for (let i = 0; i < this.steps; i++) {
        if (!this.$refs.child[i].validate) {
          valid = false;
        }
      }
      if (!valid) {
        console.log("cannot submit");
        return;
      }
      for (let i = 0; i < this.steps; i++) {
        let res = this.$refs.child[i].submit();
      }
      this.$router.push("mobile_mypage");
    }
  },
  mounted() {
    const url = process.env.VUE_APP_URL + "/api/v1/users/show";
    axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          "access-token": localStorage.getItem("access-token"),
          client: localStorage.getItem("client"),
          uid: localStorage.getItem("uid")
        }
      })
      .then(
        response => {
          this.user = response.data.data;
          console.log(this.user);
          console.log(this.user.id);
        },
        error => {
          console.error(error);
          return error;
        }
      );
    const groupUrl = process.env.VUE_APP_URL + "/api/v1/current_user/groups";
    axios
      .get(groupUrl, {
        headers: {
          "Content-Type": "application/json",
          "access-token": localStorage.getItem("access-token"),
          client: localStorage.getItem("client"),
          uid: localStorage.getItem("uid")
        }
      })
      .then(
        response => {
          for (let i = 0; i < response.data.length; i++) {
            this.group.push(response.data[i]);
          }
          console.log(this.group);
        },
        error => {
          console.error(error);
          return error;
        }
      );
  }
};
</script>

<style scoped>
.step {
  padding: 0px 0px 0px 0px !important;
  margin: 0px 0px 0px 0px !important;
}
</style>
