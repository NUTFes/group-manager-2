<template>
  <div>
    <v-row>
      <v-col>
        <div class="card">
          <v-card-text>
            <div class="breadcrumbs">
              <ul>
                <li>
                  <div class="breadcrumbs-item">
                    <router-link to="/stage_orders"
                      >ステージ申請一覧</router-link
                    >
                  </div>
                </li>
                <li>
                  <div class="breadcrumbs-item">{{ group }}</div>
                </li>
              </ul>
            </div>
          </v-card-text>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card flat class="mx-15">
          <v-row>
            <v-col cols="1"></v-col>
            <v-col cols="10">
              <v-card-title class="font-weight-bold mt-3">
                {{ group }}
                <v-spacer></v-spacer>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      text
                      v-bind="attrs"
                      v-on="on"
                      @click="edit_dialog_open"
                      fab
                    >
                      <v-icon class="ma-5">mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                  <span>編集</span>
                </v-tooltip>
                <v-tooltip top v-if="selfRoleId == (1 || 2)">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      text
                      v-bind="attrs"
                      v-on="on"
                      @click="delete_dialog = true"
                      fab
                    >
                      <v-icon class="ma-5">mdi-delete</v-icon>
                    </v-btn>
                  </template>
                  <span>削除</span>
                </v-tooltip>
              </v-card-title>
              <hr class="mt-n3" />
              <v-simple-table class="my-9">
                <template v-slot:default>
                  <tbody>
                    <tr>
                      <th>ID：</th>
                      <td class="caption">{{ stage_order.id }}</td>
                    </tr>
                    <tr>
                      <th>参加団体：</th>
                      <td class="caption">{{ group }}</td>
                    </tr>
                    <tr>
                      <th>晴れを希望：</th>
                      <td class="caption">
                        <v-chip
                          v-if="stage_order.is_sunny == true"
                          color="red"
                          text-color="white"
                          small
                          >はい</v-chip
                        >
                        <v-chip
                          v-if="stage_order.is_sunny == false"
                          color="blue"
                          text-color="white"
                          small
                          >いいえ</v-chip
                        >
                      </td>
                    </tr>
                    <tr>
                      <th>希望日：</th>
                      <td class="caption">
                        {{ fes_date.date }} - {{ fes_date.day }} -
                        {{ fes_date.days_num }}日目
                      </td>
                    </tr>
                    <tr>
                      <th>第一希望：</th>
                      <td class="caption">{{ stage_first }}</td>
                    </tr>
                    <tr>
                      <th>第二希望：</th>
                      <td class="caption">{{ stage_second }}</td>
                    </tr>
                    <tr>
                      <th>使用時間幅：</th>
                      <td class="caption">
                        {{ stage_order.use_time_interval }}
                      </td>
                    </tr>
                    <tr>
                      <th>準備時間幅：</th>
                      <td class="caption">
                        {{ stage_order.prepare_time_interval }}
                      </td>
                    </tr>
                    <tr>
                      <th>掃除寺間幅：</th>
                      <td class="caption">
                        {{ stage_order.cleanup_time_interval }}
                      </td>
                    </tr>
                    <tr>
                      <th>準備開始時刻：</th>
                      <td class="caption">
                        {{ stage_order.prepare_start_time }}
                      </td>
                    </tr>
                    <tr>
                      <th>パフォーマンス開始時刻：</th>
                      <td class="caption">
                        {{ stage_order.performance_start_time }}
                      </td>
                    </tr>
                    <tr>
                      <th>パフォーマンス終了時刻：</th>
                      <td class="caption">
                        {{ stage_order.performance_end_time }}
                      </td>
                    </tr>
                    <tr>
                      <th>掃除終了時刻：</th>
                      <td class="caption">
                        {{ stage_order.cleanup_end_time }}
                      </td>
                    </tr>
                    <tr>
                      <th>登録日時：</th>
                      <td class="caption">
                        {{ stage_order.created_at | format-date }}
                      </td>
                    </tr>
                    <tr>
                      <th>編集日時：</th>
                      <td class="caption">
                        {{ stage_order.updated_at | format-date }}
                      </td>
                      <td v-if="rights == 1">
                        <v-icon color="#E91E63">mdi-pencil</v-icon>
                      </td>
                      <td v-if="rights == 2">
                        <v-icon color="#E91E63">mdi-eye</v-icon>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-col>
            <v-col cols="1"></v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <div class="card">
          <v-btn text color="white" to="/stage_orders"
            ><v-icon color="#333333">mdi-arrow-left-bold</v-icon>
            <div class="back-button">ステージ申請一覧に戻る</div></v-btn
          >
        </div>
      </v-col>
    </v-row>

    <!-- modal window to edit -->
    <v-dialog v-model="edit_dialog" max-width="500">
      <v-card>
        <v-card-title class="headline blue-grey darken-3">
          <div style="color: white">
            <v-icon class="ma-5" dark>mdi-pencil</v-icon>編集
          </div>
          <v-spacer></v-spacer>
          <v-btn text @click="edit_dialog = false" fab dark>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col>
              <v-form ref="form">
                <v-select
                  label="参加団体名"
                  v-model="group_id"
                  :items="groups"
                  :menu-props="{
                    top: true,
                    offsetY: true
                  }"
                  item-text="name"
                  item-value="id"
                  outlined
                ></v-select>
                <v-select
                  label="天気"
                  v-model="is_sunny"
                  :items="is_sunny_list"
                  item-text="label"
                  item-value="value"
                  text
                  outlined
                  clearable
                />
                <v-select
                  label="開催日"
                  v-model="fes_date_id"
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
                  v-model="stage_first_id"
                  :items="stages_list"
                  item-text="name"
                  item-value="id"
                  text
                  outlined
                  clearable
                />
                <v-select
                  label="第二希望"
                  v-model="stage_second_id"
                  :items="stages_list"
                  item-text="name"
                  item-value="id"
                  text
                  outlined
                  clearable
                />
                <v-radio-group v-model="radioGroup">
                  <v-radio label="時間幅で登録" :value="1"></v-radio>
                  <v-radio label="時刻で登録" :value="2"></v-radio>
                </v-radio-group>
                <div v-if="radioGroup === 1">
                  <v-select
                    label="使用時間"
                    v-model="use_time_interval"
                    :items="time_interval"
                    text
                    outlined
                    clearable
                  />
                  <v-select
                    label="準備時間"
                    v-model="prepare_time_interval"
                    :items="time_interval"
                    text
                    outlined
                    clearable
                  />
                  <v-select
                    label="掃除時間"
                    v-model="cleanup_time_interval"
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
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn depressed dark color="btn" @click="edit">
            編集する
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 削除ダイアログ -->
    <v-dialog v-model="delete_dialog" width="500">
      <v-card>
        <v-card-title class="headline blue-grey darken-3">
          <div style="color: white">
            <v-icon class="ma-5" dark>mdi-delete</v-icon>削除
          </div>
          <v-spacer></v-spacer>
          <v-btn text @click="delete_dialog = false" fab dark>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-title>
          削除してよろしいですか？
        </v-card-title>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn depressed dark color="yes" @click="delete_yes">
            はい
          </v-btn>
          <v-btn depressed dark color="no" @click="delete_dialog = false">
            いいえ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 編集成功SnackBar -->
    <v-snackbar v-model="success_snackbar" color="blue-grey" top elevation="24">
      編集しました

      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
export default {
  data() {
    return {
      success_snackbar: false,
      stage_order: [],
      group: [],
      fes_date: [],
      fes_date_id: [],
      stage_first: [],
      stage_second: [],
      stage_first_id: [],
      stage_second_id: [],
      prepare_time_interval: [],
      use_time_interval: [],
      prepareStartTime: [],
      performanceStartTime: [],
      performanceEndTime: [],
      cleanupEndTime: [],
      stages_list: [],
      expand: false,
      edit_dialog: false,
      delete_dialog: false,
      radioGroup: 1,
      is_sunny_list: [
        { label: "晴れ", value: true },
        { label: "雨", value: false }
      ],
      fes_date_list: [],
      hour_range: ["9", "10", "11", "12", "13", "14", "15", "16", "17", "00"],
      minute_range: [
        "00",
        "05",
        "10",
        "15",
        "20",
        "25",
        "30",
        "35",
        "40",
        "45",
        "50",
        "55"
      ],
      time_range: [],
      time_interval: [
        "5分",
        "10分",
        "15分",
        "20分",
        "25分",
        "30分",
        "35分",
        "40分",
        "45分",
        "50分",
        "55分",
        "60分",
        "65分",
        "70分",
        "75分",
        "80分",
        "90分",
        "95分",
        "100分",
        "105分",
        "110分",
        "115分",
        "120分"
      ]
    };
  },
  computed: {
    ...mapState({
      selfRoleId: state => state.users.role
    })
  },
  mounted() {
    this.$store.dispatch("users/getUser");
    const url = "/api/v1/get_stage_order_details/" + this.$route.params.id;
    this.$axios
      .get(url, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        this.stage_order = response.data.stage_order;
        this.group = response.data.group;
        this.stage_first = response.data.stage_first;
        this.stage_second = response.data.stage_second;
        this.fes_date = response.data.fes_date;
        this.fes_date_id = this.stage_order.fes_date_id;
        this.group_id = this.stage_order.group_id;
        this.is_sunny = this.stage_order.is_sunny;
        this.stage_first_id = this.stage_order.stage_first;
        this.stage_second_id = this.stage_order.stage_second;
        this.prepare_time_interval = this.stage_order.prepare_time_interval;
        this.use_time_interval = this.stage_order.use_time_interval;
        this.cleanup_time_interval = this.stage_order.cleanup_time_interval;
        this.prepareStartTime = this.stage_order.prepare_start_time;
        this.performanceStartTime = this.stage_order.performance_start_time;
        this.performanceEndTime = this.stage_order.performance_end_time;
        this.cleanupEndTime = this.stage_order.cleanup_end_time;
      });
    this.set_time_range();
  },
  methods: {
    reload: function() {
      const url = "/api/v1/get_stage_order_details/" + this.$route.params.id;
      this.$axios
        .get(url, {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(response => {
          this.stage_order = response.data.stage_order;
          this.group = response.data.group;
          this.stage_first = response.data.stage_first;
          this.stage_second = response.data.stage_second;
          this.fes_date = response.data.fes_date;
          this.fes_date_id = this.stage_order.fes_date_id;
          this.group_id = this.stage_order.group_id;
          this.is_sunny = this.stage_order.is_sunny;
          this.stage_first_id = this.stage_order.stage_first;
          this.stage_second_id = this.stage_order.stage_second;
          this.prepare_time_interval = this.stage_order.prepare_time_interval;
          this.use_time_interval = this.stage_order.use_time_interval;
          this.cleanup_time_interval = this.stage_order.cleanup_time_interval;
          this.prepareStartTime = this.stage_order.prepare_start_time;
          this.performanceStartTime = this.stage_order.performance_start_time;
          this.performanceEndTime = this.stage_order.performance_end_time;
          this.cleanupEndTime = this.stage_order.cleanup_end_time;
        });
    },
    set_time_range: function() {
      for (var hour of this.hour_range) {
        for (var minute of this.minute_range) {
          this.time_range.push(hour + ":" + minute);
        }
      }
    },
    edit_dialog_open: function() {
      this.$axios
        .get("/stages", {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(response => {
          this.stages_list = response.data;
        });
      this.$axios
        .get("/groups", {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(response => {
          this.groups = response.data;
        });
      this.$axios
        .get("/fes_dates", {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(response => {
          this.fes_date_list = response.data;
        });
      this.edit_dialog = true;
    },
    edit: function() {
      const edit_url =
        "/stage_orders/" +
        this.stage_order.id +
        "?group_id=" +
        this.group_id +
        "&is_sunny=" +
        this.is_sunny +
        "&fes_date_id=" +
        this.fes_date_id +
        "&stage_first_id=" +
        this.stage_first_id +
        "&stage_second=" +
        this.stage_second_id +
        "&use_time_interval=" +
        this.use_time_interval +
        "&prepare_time_interval=" +
        this.prepare_time_interval +
        "&cleanup_time_interval=" +
        this.cleanup_time_interval +
        "&prepare_start_time=" +
        this.prepareStartTime +
        "&performance_start_time=" +
        this.performanceStartTime +
        "&performance_end_time=" +
        this.performanceEndTime +
        "&cleanup_end_time=" +
        this.cleanupEndTime;
      this.$axios
        .put(edit_url, {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(response => {
          console.log(response);
          this.reload();
          this.edit_dialog = false;
          this.success_snackbar = true;
        });
    },
    delete_yes: function() {
      const url = "/stage_orders/" + this.$route.params.id;
      this.$axios.delete(url);
      this.$router.push("/stage_orders");
    }
  }
};
</script>

<style>
.card {
  padding-left: 1%;
  padding-right: 5%;
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
