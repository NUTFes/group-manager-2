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
                      @click="dialog = true"
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
                            label="晴れ希望"
                            v-model="isSunny"
                            :items="is_sunny"
                            item-text="name"
                            item-value="id"
                            text
                            outlined
                            clearable
                            :rules="[rules.required]"
                          />
                          <v-text-field
                            label="開催日"
                            v-model="fesDateId"
                            background-color="white"
                            outlined
                            clearable
                          >
                          </v-text-field>
                          <v-select
                            label="第一希望"
                            v-model="item_id"
                            :items="stages_list"
                            item-text="name"
                            item-value="id"
                            text
                            outlined
                            clearable
                            :rules="[rules.required]"
                          />
                          <v-select
                            label="第二希望"
                            v-model="item_id"
                            :items="stage_list"
                            item-text="name"
                            item-value="id"
                            text
                            outlined
                            clearable
                            :rules="[rules.required]"
                          />
                          <v-select
                            label="使用時間"
                            v-model="useTimeInterval"
                            :items="item_list"
                            item-text="name"
                            item-value="id"
                            text
                            outlined
                            clearable
                            :rules="[rules.required]"
                          />
                          <v-select
                            label="準備時間"
                            v-model="prepareTimeInterval"
                            :items="item_list"
                            item-text="name"
                            item-value="id"
                            text
                            outlined
                            clearable
                            :rules="[rules.required]"
                          />
                          <v-select
                            label="掃除時間"
                            v-model="cleanupTimeInterval"
                            :items="item_list"
                            item-text="name"
                            item-value="id"
                            text
                            outlined
                            clearable
                            :rules="[rules.required]"
                          />
                          <v-select
                            label="準備開始時刻"
                            v-model="prepareStartTime"
                            :items="item_list"
                            item-text="name"
                            item-value="id"
                            text
                            outlined
                            clearable
                            :rules="[rules.required]"
                          />
                          <v-select
                            label="パフォーマンス開始時刻"
                            v-model="performanceStartTime"
                            :items="item_list"
                            item-text="name"
                            item-value="id"
                            text
                            outlined
                            clearable
                            :rules="[rules.required]"
                          />
                          <v-select
                            label="パフォーマンス終了時刻"
                            v-model="performanceEndTime"
                            :items="item_list"
                            item-text="name"
                            item-value="id"
                            text
                            outlined
                            clearable
                            :rules="[rules.required]"
                          />
                          <v-select
                            label="掃除終了時刻"
                            v-model="cleanupEndTime"
                            :items="item_list"
                            item-text="name"
                            item-value="id"
                            text
                            outlined
                            clearable
                            :rules="[rules.required]"
                          />
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
import Header from '~/components/Header.vue'
import Menu from '~/components/Menu.vue'
export default {
  components: {
    Header,
    Menu,
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
    }
  },
  mounted() {
    this.$axios.get('/stages', {
      headers: { 
        "Content-Type": "application/json", 
      }
    })
      .then(response => {
        this.stages = response.data
        for (let i = 0; i < this.stages.length; i++) {
          this.stages_list.push(this.stages[i]['name'])
        }
      })
    this.$axios.get('api/v1/get_stage_orders_details', {
      headers: { 
        "Content-Type": "application/json", 
      }
    })
      .then(response => {
        this.stage_orders = response.data
      })
    this.$axios.get('/groups', {
      headers: { 
        "Content-Type": "application/json", 
      }
    })
      .then(response => {
        this.groups = response.data
      })
  },

  methods: {
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
      params.append("prepare_start_time", this.prepareStartTime);
      params.append("performance_start_time", this.performanceStartTime);
      params.append("performance_end_time", this.performanceEndTime);
      params.append("cleanup_end_time", this.cleanupEndTime);
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
</style>
