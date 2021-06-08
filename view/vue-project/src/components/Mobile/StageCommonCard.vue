<template>
  <v-container class="justify-content-center ma-0 pa-0">
    <v-row>
      <v-col cols="12" align="center" class="ma-0 pa-0">
          <v-form ref="form">
            <p align="center">
              所持機器を使用するか
            </p>
              <v-btn-toggle
                class="mb-6"
                borderless
                dense
                v-model="ownEquipment"
                ref="ownEquipment"
                color="purple accent-2"
              >
                <v-btn value="true">YES</v-btn>
                <v-btn value="false">NO</v-btn>
              </v-btn-toggle>
            <p align="center" class="mt-3">
              音楽を流すか
            </p>
              <v-btn-toggle
                class="mb-6"
                borderless
                dense
                v-model="bgm"
                ref="bgm"
                color="purple accent-2"
              >
                <v-btn value="true">YES</v-btn>
                <v-btn value="false">NO</v-btn>
              </v-btn-toggle>
            <p align="center" class="mt-3">
              撮影の許可
            </p>
              <v-btn-toggle
                class="mb-6"
                borderless
                dense
                v-model="cameraPermission"
                ref="cameraPermission"
                color="purple accent-2"
              >
                <v-btn value="true">YES</v-btn>
                <v-btn value="false">NO</v-btn>
              </v-btn-toggle>
            <p align="center" class="mt-3">
              騒音
            </p>
              <v-btn-toggle
                class="mb-6"
                borderless
                dense
                v-model="loudSound"
                ref="loudSound"
                color="purple accent-2"
              >
                <v-btn value="true">YES</v-btn>
                <v-btn value="false">NO</v-btn>
              </v-btn-toggle>
            <v-textarea
              label="ステージ内容"
              ref="stageContent"
              v-model="stageContent"
              :rules="[rules.required]"
              text
              outlined
              required
              class="mt-5"
            ></v-textarea>
          </v-form>
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
        required: value => !!value || "入力してください"
      },
      group: [],
      valid: false
    };
  },

  computed: {
    form() {
      return {
        ownEquipment: "",
        bgm: "",
        cameraPermission: "",
        loudSound: "",
        stageContent: ""
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
      const url = process.env.VUE_APP_URL + "/stage_common_options";
      let params = new URLSearchParams();
      params.append("group_id", this.groupId);
      params.append("own_equipment", this.ownEquipment);
      params.append("bgm", this.bgm);
      params.append("camera_permission", this.cameraPermission);
      params.append("loud_sound", this.loudSound);
      params.append("stage_content", this.stageContent);

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
