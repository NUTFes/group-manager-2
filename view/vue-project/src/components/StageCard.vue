<template>
  <v-container class="justify-content-center">
    <v-row>
      <v-col cols="12" align="center">
        <v-card-text>
          <v-form ref="form">
            <p align="left">
              天気
              <v-btn-toggle
                class="mb-12 ml-6"
                v-model="isSunny"
                ref="isSunny"
                color="purple accent-2"
              >
                <v-btn value="true">晴れ</v-btn>
                <v-btn value="false">雨</v-btn>
              </v-btn-toggle>
            </p>
            <v-select
              label="何日目か"
              ref="fesDate"
              v-model.number="fesDate"
              :items="fesDateList"
              :menu-props="{ top: false, offsetY: true }"
              item-text="name"
              item-value="id"
              :rules="[rules.required]"
              clearable
              outlined
            ></v-select>
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
              label="第二希望場所"
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
            <p>
              パフォーマンス開始時刻
              <vue-timepicker
                input-class="timepicker"
                v-model="performanceStartTime"
                format="HH:mm"
                minute-interval="15"
                :hour-range="[9, 10, 11, 12, 13, 14, 15, 16, 17]"
                hide-disable-hours
                hide-disable-minutes
                advanced-keyboard
                manual-input
              ></vue-timepicker>
            </p>

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
          {{ performanceStartTime }}
          {{ performanceFinishTime }}
          {{ useInterval }}
          <v-btn @click="submit"></v-btn>
        </v-card-text>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import vueTimepicker from "vue2-timepicker/src/vue-timepicker";
import "vue2-timepicker/dist/VueTimepicker.css";
import VueTimepicker from "vue2-timepicker/src/vue-timepicker.vue";
export default {
  components: {
    "vue-timepicker": vueTimepicker,
    VueTimepicker,
    Datetime
  },
  props: { groupId: Number },
  data() {
    return {
      rules: {
        required: value => !!value || "入力してください"
      },
      group: [],
      valid: false,
      fesDateList: [
        { name: "一日目", id: 2 },
        { name: "二日目", id: 3 }
      ],
      stageList: [
        { name: "メインステージ", id: 1 },
        { name: "サブステージ", id: 2 },
        { name: "メインステージ", id: 3 }
      ]
    };
  },

  computed: {
    form() {
      return {
        isSunny: true,
        fesDate: "",
        stageFirst: "",
        stageSecond: "",
        prepareStartTime: "",
        performanceStartTime: "",
        performanceFinishTime: "",
        cleanupFinishTime: "",
        useInterval: "",
        prepareInterval: "",
        cleanupInterval: ""
      };
    },
    calcUseInterval() {
      let minute = this.performanceFinishTime.mm - this.performanceStartTime.mm;
      let hour =
        (this.performanceFinishTime.HH - this.performanceStartTime.HH) * 60;
      this.useInterval = hour + minute;
    },
    calcPrepareInterval() {
      let minute = this.performanceStartTime.mm - this.prepareStartTime.mm;
      let hour = (this.performanceStartTime.HH - this.prepareStartTime.HH) * 60;
      this.prepareInterval = hour + minute;
    },
    calcCleanupInterval() {
      let minute = this.cleanupFinishTime.mm - this.performanceFinishTime.mm;
      let hour =
        (this.cleanupFinishTime.HH - this.performanceFinishTime.HH) * 60;
      this.prepareInterval = hour + minute;
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
      calcUseInterval;
      calcPrepareInterval;
      calcCleanupInterval;

      const url = process.env.VUE_APP_URL + "/stage_orders";
      let params = new URLSearchParams();
      params.append("group_id", this.groupId);
      params.append("is_sunny", isSunny);
      params.append("fes_date_id", fesDate);
      params.append("stage_first", stageFirst);
      params.append("stage_second", stageSecond);
      params.append("use_time_interval", useInterval);
      params.append("prepare_time_interval", prepareInterval);
      params.append("cleanup_time_interval", cleanupInterval);
      params.append("prepare_start_time", prepareStartTime);
      params.append("performance_start_time", performanceStartTime);
      params.append("performance_end_time", performanceEndTime);
      params.append("cleanup_end_time", prepareStartTime);

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
<style>
input.timepicker {
  padding: 0 12px !important;
  align-items: stretch !important;
  min-height: 56px !important;
  cursor: text !important;
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1) !important;
  border-radius: 8px !important;
  margin-bottom: 8px !important;
  width: 100% !important;
  display: flex !important;
  box-sizing: inherit !important;
  font-size: 16px !important;
  text-align: left !important;
  letter-spacing: normal !important;
  flex: 1 1 auto !important;
  font-weight: 400 !important;
  line-height: 1.375rem !important;
  overflow-wrap: break-word !important;
  white-space: normal !important;
  border-color: rgb(9e, 9e, 9e) !important;
}
</style>
