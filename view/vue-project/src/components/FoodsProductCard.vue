<template>
  <v-container class="justify-content-center">
    <v-row>
      <v-col cols="12" align="center">
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              label="名前"
              ref="name"
              v-model="name"
              :rules="[rules.required]"
              text
              outlined
              required
            ></v-text-field>
            <v-text-field
              label="一日目の個数"
              ref="firstDayNum"
              v-model="firstDayNum"
              type="number"
              :rules="[rules.required, rules.max]"
              outlined
              text
              required
            ></v-text-field>
            <v-text-field
              label="二日目の個数"
              ref="secondDayNum"
              v-model="secondDayNum"
              type="number"
              :rules="[rules.required]"
              outlined
              text
              required
            ></v-text-field>
            <p align="left">
              調理するか
              <v-btn-toggle
                class="mb-12 ml-6"
                v-model="isCooking"
                borderless
                dense
                ref="isCooking"
                color="purple accent-2"
              >
                <v-btn value="true">YES</v-btn>
                <v-btn value="false">NO</v-btn>
              </v-btn-toggle>
            </p>
          </v-form>
        </v-card-text>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  props: { groupId: Number },
  data() {
    return {
      rules: {
        required: value => !!value || "入力してください",
        max: value => value <= 1000 || "大きすぎます"
      },
      group: [],
      valid: false
    };
  },

  computed: {
    form() {
      return {
        name: "",
        firstDayNum: "",
        secondDayNum: "",
        isCooking: ""
      };
    }
  },
  methods: {
    cancel() {
      this.$refs.form.reset();
    },
    validate() {
      if (!this.$refs.form.validate()) {
        valid = false;
        return false;
      }
      return true;
    },
    submit() {
      const url = process.env.VUE_APP_URL + "/food_products";
      let params = new URLSearchParams();
      params.append("group_id", this.groupId);
      params.append("name", this.name);
      params.append("first_day_num", this.firstDayNum);
      params.append("second_day_num", this.secondDayNum);
      params.append("is_cooking", this.isCooking);

      axios.defaults.headers.common["Content-Type"] = "application/json";
      axios.post(url, params).then(
        response => {
          console.log("response:", response);
          return "ok";
        },
        error => {
          console.log("登録できませんでした");
          return error;
        }
      );
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
