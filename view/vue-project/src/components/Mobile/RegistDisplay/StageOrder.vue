<template>
  <v-container>
    <v-row
        v-for="(stage_order, i) in regist.stage_orders"
        :key="i">
      <v-col>
        <v-card flat>
          <v-card-title class="font-weight-bold subtitle-2">
            <v-icon class="pr-2">mdi-microphone</v-icon>
            <b>ステージ利用申請情報</b>
            <v-spacer></v-spacer>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs  }">
                <v-btn
                    v-if="isEditStageOrder"
                    x-small
                    fab
                    text
                    v-bind="attrs"
                    v-on="on"
                    @click="openStageOrderDisplay(stage_order.id, stage_order.group_id, stage_order.is_sunny, stage_order.stage_date.id, stage_order.first_stage_order.id, stage_order.second_stage_order.id, stage_order.use_time_interval, stage_order.prepare_time_interval, stage_order.cleanup_time_interval, stage_order.prepare_start_time, stage_order.performance_start_time, stage_order.performance_end_time, stage_order.cleanup_end_time)"
                    >
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
              <span>ステージ利用申請情報を編集する</span>
            </v-tooltip>
          </v-card-title>

          <hr>
          <v-list class="subtitle-2">
            <v-list-item>
              <v-list-item-content class="pr-3">月日</v-list-item-content>
              <v-list-item-content v-if="stage_order.stage_date.id == -9999">未登録</v-list-item-content>
              <v-list-item-content v-else>{{ stage_order.stage_date.date }}</v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item>
              <v-list-item-content class="pr-3">天気</v-list-item-content>
              <v-list-item-content v-if="stage_order.is_sunny == -9999">未登録</v-list-item-content>
              <v-list-item-content v-else-if="stage_order.is_sunny==true">晴れ</v-list-item-content>
              <v-list-item-content v-else>雨</v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item>
              <v-list-item-content class="pr-3">第1希望</v-list-item-content>
              <v-list-item-content v-if="stage_order.first_stage_order == -9999">未登録</v-list-item-content>
              <v-list-item-content v-else>{{ stage_order.first_stage_order.name }}</v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item>
              <v-list-item-content class="pr-3">第2希望</v-list-item-content>
              <v-list-item-content v-if="stage_order.second_stage_order == -9999">未登録</v-list-item-content>
              <v-list-item-content v-else>{{ stage_order.second_stage_order.name }}</v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item>
              <v-list-item-content class="pr-3">準備時間幅</v-list-item-content>
              <v-list-item-content v-if="stage_order.prepare_time_interval == -9999">未登録</v-list-item-content>
              <v-list-item-content v-else>{{ stage_order.prepare_time_interval }}</v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item>
              <v-list-item-content class="pr-3">使用時間幅</v-list-item-content>
              <v-list-item-content v-if="stage_order.use_time_interval == -9999">未登録</v-list-item-content>
              <v-list-item-content v-else>{{ stage_order.use_time_interval }}</v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item>
              <v-list-item-content class="pr-3">掃除時間幅</v-list-item-content>
              <v-list-item-content v-if="stage_order.cleanup_time_interval == -9999">未登録</v-list-item-content>
              <v-list-item-content v-else>{{ stage_order.cleanup_time_interval }}</v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item>
              <v-list-item-content class="pr-3">準備開始時刻</v-list-item-content>
              <v-list-item-content v-if="stage_order.prepare_start_time == -9999">未登録</v-list-item-content>
              <v-list-item-content v-else>{{ stage_order.prepare_start_time }}</v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item>
              <v-list-item-content class="pr-3">パフォーマンス開始時刻</v-list-item-content>
              <v-list-item-content v-if="stage_order.performance_start_time == -9999">未登録</v-list-item-content>
              <v-list-item-content v-else>{{ stage_order.performance_start_time }}</v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item>
              <v-list-item-content class="pr-3">パフォーマンス終了時刻</v-list-item-content>
              <v-list-item-content v-if="stage_order.performance_end_time == -9999">未登録</v-list-item-content>
              <v-list-item-content v-else>{{ stage_order.performance_end_time }}</v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item>
              <v-list-item-content class="pr-3">掃除終了時刻</v-list-item-content>
              <v-list-item-content v-if="stage_order.cleanup_end_time == -9999">未登録</v-list-item-content>
              <v-list-item-content v-else>{{ stage_order.cleanup_end_time }}</v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>

      </v-col>
    </v-row>

    <!-- Edit Modal -->
    <StageOrder ref="stageOrderDlg"
                :id="this.stage_order_id"
                :groupId="this.regist.group.id"
                :isSunny="this.is_sunny"
                :stageDateId="this.stage_date"
                :stageFirst="this.stage_first"
                :stageSecond="this.stage_second"
                :useTimeInterval="this.use_time_interval"
                :prepareTimeInterval="this.prepare_time_interval"
                :cleanupTimeInterval="this.cleanup_time_interval"
                :prepareStartTime="this.prepare_start_time"
                :performanceStartTime="this.performance_start_time"
                :performanceEndTime="this.performance_end_time"
                :cleanupEndTime="this.cleanup_end_time"
                @reload="reload"
                @openStageOrderSnackbar="openStageOrderSnackbar"
                ></StageOrder> 
    <v-snackbar
        top
        text
        color="purple accent-2"
        v-model="stageOrderSnackbar">
      ステージ申請情報を更新しました
    </v-snackbar>

  </v-container>
</template>

<script>
import axios from 'axios'
import StageOrder from '@/components/Mobile/EditModal/StageOrder.vue'

export default {
  props: {
    num: String,
    regist: String,
  },
  components: {
    StageOrder,

  },
  data(){
    return{
      data: [
        localStorage.getItem('access-token'),
        localStorage.getItem('client'),
        localStorage.getItem('uid')
      ], 
      delete_dialog_stage: false,
      stageOrderSnackbar: false,
      isEditStageOrder: [],
      group_id: [],
      is_sunny: [],
      stage_date: [],
      stage_first: [],
      stage_second: [],
      use_time_interval: [],
      prepare_time_interval: [],
      cleanup_time_interval: [],
      prepare_start_time: [],
      performance_start_time: [],
      performance_end_time: [],
      cleanup_end_time: [],
    }
  },
  methods:{
    //編集後Snackbar
    openStageOrderSnackbar() {
      this.stageOrderSnackbar = true
    },
    reload() {
      this.$emit('reload');
    },
    openStageOrderDisplay(stage_order_id, group_id, is_sunny, stage_date, stage_first, stage_second, use_time_interval, prepare_time_interval, cleanup_time_interval, prepare_start_time, performance_start_time, performance_end_time, cleanup_end_time) {
      this.stage_order_id = stage_order_id
      this.group_id = group_id
      this.is_sunny = is_sunny
      this.stage_date = stage_date
      this.stage_first = stage_first
      this.stage_second = stage_second
      this.use_time_interval = use_time_interval
      this.prepare_time_interval = prepare_time_interval
      this.cleanup_time_interval = cleanup_time_interval
      this.prepare_start_time = prepare_start_time
      this.performance_start_time = performance_start_time
      this.performance_end_time = performance_end_time
      this.cleanup_end_time = cleanup_end_time
      this.$refs.stageOrderDlg.isDisplay = true
    },
  },

  mounted() {
    const settingurl = process.env.VUE_APP_URL + '/user_page_settings'
    axios.get(settingurl, {
      headers: { 
        "Content-Type": "application/json", 
        "access-token": localStorage.getItem('access-token'),
        "client": localStorage.getItem('client'),
      }
    }
    )
      .then(response => {
        this.isEditStageOrder = response.data[0].is_edit_stage_order
      })
  },
}
</script>
