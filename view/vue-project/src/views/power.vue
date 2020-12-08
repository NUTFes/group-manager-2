<template>
  <v-card>
    <v-row justify="space-around">
      <v-col cols="5"></v-col>
      <v-col cols="2">
        <h1>電力登録</h1>
        <v-select
          v-model="steps"
          :items="[1, 2, 3, 4, 5]"
          label="登録製品数"
        ></v-select>
      </v-col>
      <v-col cols="5"></v-col>
    </v-row>
    <v-row>
      <v-col cols="2"></v-col>
      <v-col cols="8">
        <v-stepper v-model="e1" :vertical="horizontal">
          <template v-for="step in steps">
            <v-stepper-step
              :key="`${step}-step`"
              :complete="e1 > step"
              :step="step"
              :editable="true"
            >
              Step {{ n }}
            </v-stepper-step>
            <v-stepper-content :key="`${step}-content`" :step="step">
              <PowerCard ref="child" :key="step" />
            </v-stepper-content>
          </template>
        </v-stepper>
        <v-btn color="blue darken-1" block @click="all_submit">登録</v-btn>
      </v-col>
      <v-col cols="2"></v-col>
    </v-row>
  </v-card>
</template>

<script>
import axios from "axios";
import PowerCard from "../components/PowerCard";
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
      steps: 2
    };
  },
  watch: {
    steps(val) {
      if (this.e1 > val) this.e1 = val;
    }
  },
  computed: {
    form() {
      return {
        item: [],
        power: [],
        manufacturer: [],
        model: [],
        itemUrl: [],
        groupId: []
      };
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
      for (let i = 0; i < this.steps; i++) {
        this.$refs.child[i].submit();
      }
    },
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
