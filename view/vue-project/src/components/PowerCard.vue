<template>
  <v-container class="justify-content-center">
    <v-row>
      <v-col cols="12" align="center">
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              label="製品名"
              ref="item"
              v-model="item"
              v-bind:value="n"
              :rules="[rules.required]"
              text
              outlined
              required
            ></v-text-field>
            <v-text-field
              label="電力量（ワット）"
              ref="power"
              v-model="power"
              type="number"
              :rules="[rules.required, rules.max]"
              text
              outlined
              required
            ></v-text-field>
            <v-text-field
              label="メーカー"
              ref="manufacturer"
              v-model="manufacturer"
              :rules="[rules.required]"
              text
              outlined
              required
            ></v-text-field>
            <v-text-field
              label="型番"
              ref="model"
              v-model="model"
              :rules="[rules.required]"
              text
              outlined
              required
            ></v-text-field>
            <v-text-field
              label="製品URL"
              ref="itemUrl"
              v-model="itemUrl"
              :rules="[rules.required]"
              text
              outlined
              required
            ></v-text-field>
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
        item: "",
        power: "",
        manufacturer: "",
        model: "",
        itemUrl: ""
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
      const url = process.env.VUE_APP_URL + "/power_orders";
      let params = new URLSearchParams();
      params.append("group_id", this.groupId);
      params.append("item", this.item);
      params.append("power", this.power);
      params.append("manufacturer", this.manufacturer);
      params.append("model", this.model);
      params.append("item_url", this.itemUrl);

      axios.defaults.headers.common["Content-Type"] = "application/json";
      axios.post(url, params).then(
        response => {
          console.log("response:", response);
          //          this.$router.push("MyPage");
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
