<template>
  <div>
    <v-row>
      <v-col>
        <div class="card">
        <v-card flat>
          <v-row>
            <v-col cols="1"></v-col>
            <v-col cols="10">
              <v-card-title class="font-weight-bold mt-3">
                <v-icon class="mr-5">mdi-microphone</v-icon>ステージ申請一覧
                <v-spacer></v-spacer>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      class="mx-2"
                      fab
                      text
                      v-bind="attrs"
                      v-on="on"
                      @click="open_dialog"
                    >
                      <v-icon dark>mdi-plus-circle-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>ステージ申請の追加</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      class="mx-2"
                      fab
                      text
                      v-bind="attrs"
                      v-on="on"
                      @click="reload"
                    >
                      <v-icon dark>mdi-reload</v-icon>
                    </v-btn>
                  </template>
                  <span>更新する</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs  }">
                    <v-btn 
                            class="mx-2" 
                            fab 
                            text
                            v-bind="attrs"
                            v-on="on"
                            to="/stage_orders/print"
                            >
                            <v-icon dark>mdi-printer</v-icon>
                    </v-btn>
                  </template>
                  <span>印刷する</span>
                </v-tooltip>
              </v-card-title>

              <v-dialog v-model="dialog" max-width="500">
                <v-card>
                  <v-card-title class="headline blue-grey darken-3">
                    <div style="color: white">
                      <v-icon class="ma-5" dark>mdi-microphone</v-icon
                      >ステージの追加
                    </div>
                    <v-spacer></v-spacer>
                    <v-btn text @click="dialog = false" fab dark>
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-card-title>

                  <v-card-text>
                    <v-row>
                      <v-col>
                        <v-form ref="form">
                          <v-select
                            label="参加団体名"
                            v-model="Group"
                            :items="groups"
                            :menu-props="{
                              top: true,
                              offsetY: true,
                            }"
                            item-text="name"
                            item-value="id"
                            outlined
                          ></v-select>
                          <v-select
                            label="天気"
                            v-model="isSunny"
                            :items="is_sunny_list"
                            item-text="label"
                            item-value="value"
                            text
                            outlined
                            clearable
                          />
                          <v-select
                            label="開催日"
                            v-model="fesDateId"
                            background-color="white"
                            :items="fes_date_list"
                            item-text="date"
                            item-value="id"
                            outlined
                            clearable
                          >
                          </v-select>
                          <v-select
                            label="第一希望"
                            v-model="stageFirst"
                            :items="stages_list"
                            item-text="name"
                            item-value="id"
                            text
                            outlined
                            clearable
                          />
                          <v-select
                            label="第二希望"
                            v-model="stageSecond"
                            :items="stages_list"
                            item-text="name"
                            item-value="id"
                            text
                            outlined
                            clearable
                          />
                          <v-radio-group v-model="radioGroup">
                            <v-radio
                              label="時間幅で登録"
                              :value="1"
                          ></v-radio>
                            <v-radio
                              label="時刻で登録"
                              :value="2"
                          ></v-radio>
                          </v-radio-group>
                          <div v-if="radioGroup === 1">
                            <v-select
                              label="使用時間"
                              v-model="useTimeInterval"
                              :items="time_interval"
                              text
                              outlined
                              clearable
                            />
                            <v-select
                              label="準備時間"
                              v-model="prepareTimeInterval"
                              :items="time_interval"
                              text
                              text
                              outlined
                              clearable
                            />
                            <v-select
                              label="掃除時間"
                              v-model="cleanupTimeInterval"
                              :items="time_interval"
                              text
                              outlined
                              clearable
                            />
                          </div>

                          <div v-if="radioGroup === 2">
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
                              v-model="performanceEndTime"
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
                              v-model="cleanupEndTime"
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
                          <v-card-actions>
                            <v-btn
                              flatk
                              large
                              block
                              dark
                              color="blue"
                              @click="register()"
                              >登録 ​
                            </v-btn>
                          </v-card-actions>
                        </v-form>
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <br />
                </v-card>
              </v-dialog>

              <hr class="mt-n3">
              <template>
                <div class="text-center" v-if="stage_orders.length === 0">
                  <br><br>
                  <v-progress-circular
                    indeterminate
                    color="#009688"
                    ></v-progress-circular>
                  <br><br>
                </div>
                <div v-else>
                <v-data-table
                  :headers="headers"
                  :items="stage_orders"
                  class="elevation-0 my-9"
                  @click:row="
                               (data) =>
                               $router.push({ path: `/stage_orders/${data.stage_order.id}`})
                               "
                  >
                  <template v-slot:item.is_sunny="{ item }">
                    <v-chip v-if="item.stage_order.is_sunny == true" color="red" text-color="white" small>はい</v-chip>
                    <v-chip v-if="item.stage_order.is_sunny == false" color="blue" text-color="white" small>いいえ</v-chip>
                  </template>
                  <template v-slot:item.created_at="{ item }">
                    {{ item.stage_order.created_at | format-date }}
                  </template>
                  <template v-slot:item.updated_at="{ item }">
                    {{ item.stage_order.updated_at | format-date }}
                  </template>
                </v-data-table>                      
                </div>
              </template>
            </v-col>
            <v-col cols="1"></v-col>
          </v-row>
        </v-card>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import vueTimepicker from "vue2-timepicker/src/vue-timepicker";
import "vue2-timepicker/dist/VueTimepicker.css";
import VueTimepicker from "vue2-timepicker/src/vue-timepicker.vue";
export default {
  components: {
    "vue-timepicker": vueTimepicker,
    VueTimepicker
  },
  data() {
    return {
      rules: {
        required: (value) => !!value || "入力してください",
      },
      stage_orders: [],
      stages: [],
      stages_list:[],
      groups: [],
      Group: [],
      dialog: false,
      isSunny: [],
      fesDateId: [],
      stageFirst: [],
      stageSecond: [],
      radioGroup: 1,
      useTimeInterval: [],
      prepareTimeInterval: [],
      cleanupTimeInterval: [],
      prepareStartTime: [],
      performanceStartTime: [],
      performanceEndTime: [],
      cleanupEndTime: [],
      headers:[
        { text: 'ID', value: 'stage_order.id' },
        { text: '参加団体', value: 'group' },
        { text: '晴れ希望', value: 'is_sunny' },
        { text: '開催日', value: 'fes_date.date' },
        { text: '第一希望', value: 'stage_first' },
        { text: '第二希望', value: 'stage_second' },
        // { text: '総合時間幅', value: 'use_time_interval' },
        { text: '日時', value: 'created_at' },
        { text: '編集日時', value: 'updated_at' },
      ],
      is_sunny_list: [
        {label:"晴れ",value:true},
        {label:"雨",value:false}
      ],
      fes_date_list: [],
      time_interval: ["5分", "10分", "15分", "20分", "25分", "30分", "35分", "40分", "45分", "50分", "55分", "60分", "65分", "70分", "75分", "80分", "90分", "95分", "100分", "105分", "110分", "115分", "120分"],
    }
  },
  mounted() {
    this.$axios.get('api/v1/get_stage_orders_details', {
      headers: { 
        "Content-Type": "application/json", 
      }
    })
      .then(response => {
        this.stage_orders = response.data
      })
  },
  computed: {
    useInterval() {
      let minute = this.performanceEndTime.mm - this.performanceStartTime.mm;
      let hour =
        (this.performanceEndTime.HH - this.performanceStartTime.HH) * 60;
      return hour + minute;
    },
    prepareInterval() {
      let minute = this.performanceStartTime.mm - this.prepareStartTime.mm;
      let hour = (this.performanceStartTime.HH - this.prepareStartTime.HH) * 60;
      return hour + minute;
    },
    cleanupInterval() {
      let minute = this.cleanupEndTime.mm - this.performanceEndTime.mm;
      let hour =
        (this.cleanupEndTime.HH - this.performanceEndTime.HH) * 60;
      return hour + minute;
    },
    stringPrepareStartTime() {
      return this.prepareStartTime.HH + ":" + this.prepareStartTime.mm;
    },
    stringPerformanceStartTime() {
      return this.performanceStartTime.HH + ":" + this.performanceStartTime.mm;
    },
    stringPerformanceEndTime() {
      return (
        this.performanceEndTime.HH + ":" + this.performanceEndTime.mm
      );
    },
    stringCleanupEndTime() {
      return this.cleanupEndTime.HH + ":" + this.cleanupEndTime.mm;
    }
  },
  methods: {
    open_dialog: function(){
      this.$axios.get('/stages', {
        headers: { 
          "Content-Type": "application/json", 
        }
      })
        .then(response => {
          this.stages_list = response.data
        })
      this.$axios.get('/groups', {
        headers: { 
          "Content-Type": "application/json", 
        }
      })
        .then(response => {
          this.groups = response.data
        })
      this.$axios.get('/fes_dates', {
        headers: { 
          "Content-Type": "application/json", 
        }
      })
        .then(response => {
          this.fes_date_list = response.data
        })
      this.dialog = true
    },
    reload: function () {
      this.$axios
        .get("/api/v1/get_stage_orders_details", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.stage_orders = response.data;
        });
    },
    register: function () {
      if (this.prepareTimeInterval.length == 0){
        this.prepareTimeInterval = "-9999"
      }
      if (this.useTimeInterval.length == 0){
        this.useTimeInterval = "-9999"
      }
      if (this.cleanupTimeInterval.length == 0){
        this.cleanupTimeInterval = "-9999"
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
      if (this.performanceEndTime.length == 0){
        this.performanceEndTime = { "HH": "00", "mm": "00" }
      }
      if (this.performanceEndTime.HH == "" && this.performanceEndTime.mm == ""){
        this.performanceEndTime = { "HH": "00", "mm": "00" }
      }
      if (this.cleanupEndTime.length == 0){
        this.cleanupEndTime = { "HH": "00", "mm": "00" }
      }
      if (this.cleanupEndTime.HH == "" && this.cleanupEndTime.mm == ""){
        this.cleanupEndTime = { "HH": "00", "mm": "00" }
      }
      this.$axios.defaults.headers.common["Content-Type"] = "application/json";
      var params = new URLSearchParams();
      params.append("group_id", this.Group);
      params.append("is_sunny", this.isSunny);
      params.append("fes_date_id", this.fesDateId);
      params.append("stage_first", this.stageFirst);
      params.append("stage_second", this.stageSecond);
      params.append("use_time_interval", this.useTimeInterval);
      params.append("prepare_time_interval", this.prepareTimeInterval);
      params.append("cleanup_time_interval", this.cleanupTimeInterval);
      params.append("prepare_start_time", this.stringPrepareStartTime);
      params.append("performance_start_time", this.stringPerformanceStartTime);
      params.append("performance_end_time", this.stringPerformanceEndTime);
      params.append("cleanup_end_time", this.stringCleanupEndTime);

      this.$axios.post("/stage_orders", params).then((response) => {
        console.log(response);
        this.dialog = false;
        this.reload();
        this.Group = "";
        this.isSunny = "";
        this.fesDateId = "";
        this.stageFirst = "";
        this.stageSecond = "";
        this.useTimeInterval = "";
        this.prepareTimeInterval = "";
        this.cleanupTimeInterval = "";
        this.prepareStartTime = "";
        this.performanceStartTime = "";
        this.performanceEndTime = "";
        this.cleanupEndTime = "";
      });
    },
  }
}
</script>

<style>
.card {
  padding-left: 1%;
  padding-right: 5%
}
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
