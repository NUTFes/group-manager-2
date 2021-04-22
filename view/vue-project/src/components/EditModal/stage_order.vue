<template>
  <v-dialog v-model="isDisplay" persistent width="1000">
    <v-card flat>
      <v-card-title style="background-color: #eceff1; font-size: 30px">
        <v-icon class="pr-3" size="35">mdi-account-single</v-icon
        ><b>ステージ利用申請を修正する</b>
        <v-spacer></v-spacer>
        <v-btn text fab @click="isDisplay = false"
          ><v-icon>mdi-close</v-icon></v-btn
        >
      </v-card-title>
      <v-container>
        <v-row>
          <v-col cols="2"></v-col>
          <v-col cols="8">
            <v-form ref="form">
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
                <v-radio label="時間幅で修正" :value="1"></v-radio>
                <v-radio label="時刻で修正" :value="2"></v-radio>
              </v-radio-group>
              <div v-if="radioGroup === 1">
                <v-select
                  label="準備時間"
                  v-model="prepareTimeInterval"
                  :items="time_interval"
                  text
                  outlined
                  clearable
                />
                <v-select
                  label="使用時間"
                  v-model="useTimeInterval"
                  :items="time_interval"
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
                <v-select
                  label="準備開始時刻"
                  v-model="prepareStartTime"
                  :items="time_range"
                  text
                  outlined
                  clearable
                />
                <v-select
                  label="パフォーマンス開始時刻"
                  v-model="performanceStartTime"
                  :items="time_range"
                  text
                  outlined
                  clearable
                />
                <v-select
                  label="パフォーマンス終了時刻"
                  v-model="performanceEndTime"
                  :items="time_range"
                  text
                  outlined
                  clearable
                />
                <v-select
                  label="掃除終了時刻"
                  v-model="cleanupEndTime"
                  :items="time_range"
                  text
                  outlined
                  clearable
                />
              </div>
            </v-form>
            <br />
          </v-col>
          <v-col cols="2"></v-col>
        </v-row>
        <v-row>
          <v-col cols="4"></v-col>
          <v-col cols="4">
            <v-btn color="blue darken-1" large block dark @click="edit"
              >編集する</v-btn
            >
          </v-col>
          <v-col cols="4"></v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";
export default {
  props: {
    id: Number,
    groupId: Number,
    isSunny: Boolean,
    stageDateId: Number,
    stageFirst: Number,
    stageSecond: Number,
    useTimeInterval: String,
    prepareTimeInterval: String,
    cleanupTimeInterval: String,
    prepareStartTime: String,
    performanceStartTime: String,
    performanceEndTime: String,
    cleanupEndTime: String,
  },
  data() {
    return {
      isDisplay: false,
      is_sunny_list: [
        { label: "晴れ", value: true },
        { label: "雨", value: false },
      ],
      stages_list: [],
      radioGroup: 1,
      time_interval: ["5分","10分","15分","20分","25分","30分","35分","40分","45分","50分","55分","60分","65分","70分","75分","80分","90分","95分","100分","105分","110分","115分","120分",],
      hour_range: ["9", "10", "11", "12", "13", "14", "15", "16", "17", "00"],
      minute_range: ["00","05","10","15","20","25","30","35","40","45","50","55",],
      time_range: [],
    };
  },
  computed: {
    form() {
      return {};
    },
  },
  methods: {
    edit: function () {
      const url = process.env.VUE_APP_URL + "/stage_orders/" + this.id + "?group_id=" + this.groupId + "&is_sunny=" + this.isSunny + "&fes_date_id=" + this.stageDateId + "&stage_first=" + this.stageFirst + "&stage_second=" + this.stageSecond + "&use_time_interval=" + this.useTimeInterval + "&prepare_time_interval=" + this.prepareTimeInterval + "&cleanup_time_interval=" + this.cleanupTimeInterval + "&prepare_start_time=" + this.prepareStartTime + "&performance_start_time=" + this.performanceStartTime + "&performance_end_time=" + this.performanceEndTime + "&cleanup_end_time=" + this.cleanupEndTime;
      console.log(url);
      axios.defaults.headers.common["Content-Type"] = "application/json";
      axios.put(url).then(
        (response) => {
          console.log(response);
          this.isDisplay = false;
          this.$emit("openStageOrderSnackbar");
          this.$emit("reload");
        },
        (error) => {
          return error;
        }
      );
    },
    set_time_range: function () {
      for (var hour of this.hour_range) {
        for (var minute of this.minute_range) {
          this.time_range.push(hour + ":" + minute);
        }
      }
    },
  },
  mounted() {
    axios
      .get(process.env.VUE_APP_URL + "/stages", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.stages_list = response.data;
      });
    this.set_time_range();
  },
};
</script>
