<template>
  <v-container class="justify-content-center">
    <v-row>
      <v-col cols="12" align="center" class="ma-0 pa-0">
          <v-form ref="form">
            <v-text
              v-if="isSunny==true"
              class="font-weight-bold"
            >
              晴れ
            </v-text>
            <v-text
              v-if="isSunny==false"
              class="font-weight-bold"
            >
              雨
            </v-text>
            <v-divider class="mb-8" />
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
            <v-select
              label="第一希望場所"
              ref="stageFirst"
              v-model.number="stageFirst"
              :items="firstStageList"
              :menu-props="{ top: false, offsetY: true }"
              item-text="name"
              item-value="id"
              clearable
              outlined
              required
              @change="selectSecondStageList"
            ></v-select>
            <v-select
              label="第二希望場所"
              ref="stageSecond"
              v-model.number="stageSecond"
              :items="secondStageList"
              :menu-props="{ top: false, offsetY: true }"
              item-text="name"
              item-value="id"
              clearable
              outlined
              required
              ></v-select>
            <v-radio-group
              v-model="radio"
              >
              <v-radio
                label="時間幅で申請"
                :value=1
                ></v-radio>
              <v-radio
                label="時刻で申請"
                :value=2
                ></v-radio>
            </v-radio-group>
              <div v-if="radio == 1">
                <v-select
                  label="準備時間幅"
                  v-model="prepareInterval"
                  :items="time_interval"
                  :menu-props="{ top: false, offsetY: true }"
                  clearable
                  outlined
                  required
                  ></v-select>
                <v-select
                  label="使用時間幅"
                  ref="stageSecond"
                  v-model="useInterval"
                  :items="time_interval"
                  :menu-props="{ top: false, offsetY: true }"
                  clearable
                  outlined
                  required
                  ></v-select>
                <v-select
                  label="掃除時間幅"
                  ref="stageSecond"
                  v-model="cleanupInterval"
                  :items="time_interval"
                  :menu-props="{ top: false, offsetY: true }"
                  clearable
                  outlined
                  required
                  ></v-select>
              </div>
              <div v-if="radio == 2">
                <p align="left">
                準備開始時刻
                <vue-timepicker
                  input-class="timepicker"
                  v-model="prepareStartTime"
                  format="HH:mm"
                  minute-interval="15"
                  :hour-range="[9, 10, 11, 12, 13, 14, 15, 16, 17]"
                  hide-disable-hours
                  hide-disable-minutes
                  advanced-keyboard
                  manual-input
                  />
                </p>

                <p align="left">
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
                  />
                </p>

                <p align="left">
                パフォーマンス終了時刻
                <vue-timepicker
                  input-class="timepicker"
                  v-model="performanceFinishTime"
                  format="HH:mm"
                  minute-interval="15"
                  :hour-range="[9, 10, 11, 12, 13, 14, 15, 16, 17]"
                  hide-disable-hours
                  hide-disable-minutes
                  advanced-keyboard
                  manual-input
                  />
                </p>
                <p align="left">
                掃除終了時刻
                <vue-timepicker
                  input-class="timepicker"
                  v-model="cleanupFinishTime"
                  format="HH:mm"
                  minute-interval="15"
                  :hour-range="[9, 10, 11, 12, 13, 14, 15, 16, 17]"
                  hide-disable-hours
                  hide-disable-minutes
                  advanced-keyboard
                  manual-input
                  />
                </p>
              </div>
          </v-form>
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
    VueTimepicker
  },
  props: { 
    groupId: Number,
    isSunny: Boolean,
  },
  data() {
    return {
      rules: {
        required: value => !!value || "入力してください"
      },
      radio: 1,
      group: [],
      valid: false,
      fesDateList: [
        { name: "一日目", id: 2 },
        { name: "二日目", id: 3 }
      ],
      time_interval: ["5分", "10分", "15分", "20分", "25分", "30分", "35分", "40分", "45分", "50分", "55分", "60分", "65分", "70分", "75分", "80分", "90分", "95分", "100分", "105分", "110分", "115分", "120分"],
      stageList: [],
      sunnyStageList: [],
      rainyStageList: [],
      firstStageList: [],
      secondStageList: [],
      fesDate: "",
      stageFirst: "",
      stageSecond: "",
      prepareInterval: [],
      useInterval: [],
      cleanupInterval: [],
      prepareStartTime: [],
      performanceStartTime: [],
      performanceFinishTime: [],
      cleanupFinishTime: []
    };
  },

  computed: {
    useInterval() {
      let minute = this.performanceFinishTime.mm - this.performanceStartTime.mm;
      let hour =
        (this.performanceFinishTime.HH - this.performanceStartTime.HH) * 60;
      return hour + minute;
    },
    prepareInterval() {
      let minute = this.performanceStartTime.mm - this.prepareStartTime.mm;
      let hour = (this.performanceStartTime.HH - this.prepareStartTime.HH) * 60;
      return hour + minute;
    },
    cleanupInterval() {
      let minute = this.cleanupFinishTime.mm - this.performanceFinishTime.mm;
      let hour =
        (this.cleanupFinishTime.HH - this.performanceFinishTime.HH) * 60;
      return hour + minute;
    },
    stringPrepareStartTime() {
      return this.prepareStartTime.HH + ":" + this.prepareStartTime.mm;
    },
    stringPerformanceStartTime() {
      return this.performanceStartTime.HH + ":" + this.performanceStartTime.mm;
    },
    stringPerformanceFinishTime() {
      return (
        this.performanceFinishTime.HH + ":" + this.performanceFinishTime.mm
      );
    },
    stringCleanupFinishTime() {
      return this.cleanupFinishTime.HH + ":" + this.cleanupFinishTime.mm;
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
      if (this.prepareInterval.length == 0){
        this.prepareInterval = "-9999"
      }
      if (this.useInterval.length == 0){
        this.useInterval = "-9999"
      }
      if (this.cleanupInterval.length == 0){
        this.cleanupInterval = "-9999"
      }
      if (this.prepareStartTime.length == 0){
        this.prepareStartTime = { "HH": "00", "mm": "00" }
      }
      if (this.prepareStartTime.HH == "" && this.prepareStartTime.mm == ""){
        this.prepareStartTime = { "HH": "00", "mm": "00" }
      }
      if (this.performanceStartTime.length == 0){
        this.performanceStartTime = { "HH": "00", "mm": "00" }
      }
      if (this.performanceStartTime.HH == "" && this.performanceStartTime.mm == ""){
        this.performanceStartTime = { "HH": "00", "mm": "00" }
      }
      if (this.performanceFinishTime.length == 0){
        this.performanceFinishTime = { "HH": "00", "mm": "00" }
      }
      if (this.performanceFinishTime.HH == "" && this.performanceFinishTime.mm == ""){
        this.performanceFinishTime = { "HH": "00", "mm": "00" }
      }
      if (this.cleanupFinishTime.length == 0){
        this.cleanupFinishTime = { "HH": "00", "mm": "00" }
      }
      if (this.cleanupFinishTime.HH == "" && this.cleanupFinishTime.mm == ""){
        this.cleanupFinishTime = { "HH": "00", "mm": "00" }
      }
      const url = process.env.VUE_APP_URL + "/stage_orders";
      let params = new URLSearchParams();
      params.append("group_id", this.groupId);
      params.append("is_sunny", this.isSunny);
      params.append("fes_date_id", this.fesDate);
      params.append("stage_first", this.stageFirst);
      params.append("stage_second", this.stageSecond);
      params.append("use_time_interval", this.useInterval);
      params.append("prepare_time_interval", this.prepareInterval);
      params.append("cleanup_time_interval", this.cleanupInterval);
      params.append("prepare_start_time", this.stringPrepareStartTime);
      params.append("performance_start_time", this.stringPerformanceStartTime);
      params.append("performance_end_time", this.stringPerformanceFinishTime);
      params.append("cleanup_end_time", this.stringCleanupFinishTime);

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
    },
    selectSecondStageList() {
      this.secondStageList = [];
      for (let i = 0; i < this.firstStageList.length; i++) {
        if (this.firstStageList[i].id != this.stageFirst) {
          this.secondStageList.push(this.firstStageList[i]);
        }
      }
    },
    createSunnyStageList(){
      this.sunnyStageList = [];
      for(let i = 0; i < this.stageList.length; i++){
        if(this.stageList[i].enable_sunny == true){
          this.sunnyStageList.push(this.stageList[i])
        }
      }
    },
    createRainyStageList(){
      this.rainyStageList = [];
      for(let i = 0; i < this.stageList.length; i++){
        if(this.stageList[i].enable_rainy == true){
          this.rainyStageList.push(this.stageList[i])
        }
      }
    },
    createStageList() {
      if(this.isSunny==true){
        this.firstStageList = this.sunnyStageList;
        this.secondStageList = this.sunnyStageList;
      }
      else if(this.isSunny==false){
        this.firstStageList = this.rainyStageList;
        this.secondStageList = this.rainyStageList;
      }
    },
  },

  mounted() {
    axios.get(process.env.VUE_APP_URL + "/stages",{
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(
      response => {
        this.stageList = response.data;
        this.createSunnyStageList()
        this.createRainyStageList()
        this.createStageList()
      }
    )
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
