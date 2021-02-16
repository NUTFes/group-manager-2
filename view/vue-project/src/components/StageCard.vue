<template>
  <v-container class="justify-content-center">
    <v-row>
      <v-col cols="12" align="center">
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              label="晴れかどうか"
              ref="isSunny"
              v-model="isSunny"
              :rules="[rules.required]"
              text
              outlined
              required
            ></v-text-field>
            <v-text-field
              label="何日目か"
              ref="enableSunny"
              v-model="enableSunny"
              :rules="[rules.required]"
              text
              outlined
              required
            ></v-text-field>
            <v-text-field
              label="第一希望場所"
              ref="enableRainy"
              v-model="enableRainy"
              :rules="[rules.required]"
              text
              outlined
              required
            ></v-text-field>
            <v-text-field
              label="第一希望場所"
              ref="enableRainy"
              v-model="enableRainy"
              :rules="[rules.required]"
              text
              outlined
              required
            ></v-text-field>
            <v-text-field
              label="使用時間幅"
              ref="enableRainy"
              v-model="enableRainy"
              :rules="[rules.required]"
              text
              outlined
              required
            ></v-text-field>
            <v-text-field
              label="準備時間幅"
              ref="enableRainy"
              v-model="enableRainy"
              :rules="[rules.required]"
              text
              outlined
              required
            ></v-text-field>
            <v-text-field
              label="掃除時間幅"
              ref="enableRainy"
              v-model="enableRainy"
              :rules="[rules.required]"
              text
              outlined
              required
            ></v-text-field>
            <v-text-field
              label="準備開始時刻"
              ref="enableRainy"
              v-model="enableRainy"
              :rules="[rules.required]"
              text
              outlined
              required
            ></v-text-field>
            <v-text-field
              label="パフォーマンス開始時刻"
              ref="enableRainy"
              v-model="enableRainy"
              :rules="[rules.required]"
              text
              outlined
              required
            ></v-text-field>
            <v-text-field
              label="パフォーマンス終了時刻"
              ref="enableRainy"
              v-model="enableRainy"
              :rules="[rules.required]"
              text
              outlined
              required
            ></v-text-field>
            <v-text-field
              label="掃除終了時刻"
              ref="enableRainy"
              v-model="enableRainy"
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
        name: "",
        enableSunny: "",
        enableRainy: ""
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
