<template>
  <div>
    <router-link to="/mypage" style="text-decoration: none"><span class="regist-back-link">マイページに戻る</span></router-link>
    <div class="regist-title">ステージの登録 - 晴れの場合</div>
    <!-- 晴れの場合 -->
    <div class="regist-card">
      <div class="regist-card-content">
        <div class="regist-card-content-question">
          <div class="regist-card-content-question-label">日程</div>
          <select v-model="date" id="date">
            <option
              v-for="list in fesDateList"
              :value="list.id"
              :key="list.id"
            >
              {{ list.date }} - {{ list.days_num }}日目
            </option>
          </select>
        </div>
        <!-- <div class="regist-card-content-question">
          <div class="regist-card-content-question-label">天気</div>
          <select v-model="weather" @change="validationWeather" id="weather">
            <option
              v-for="list in isSunnyList"
              :value="list.value"
              :key="list.value"
            >
              {{ list.label }}
            </option>
          </select>
        </div> -->
        <div class="regist-card-content-question">
          <div class="regist-card-content-question-label">第1希望場所</div>
          <select v-model="first" id="first">
            <option
              v-for="list in stageList"
              :value="list.id"
              :key="list.id"
            >
              {{ list.name }}
            </option>
          </select>
        </div>
        <div class="regist-card-content-question">
          <div class="regist-card-content-question-label">第2希望場所</div>
          <select v-model="second" id="second">
            <option
              v-for="list in stageList"
              :value="list.id"
              :key="list.id"
            >
              {{ list.name }}
            </option>
          </select>
        </div>
        <div class="Blank">
          <section class="tab_contents">
            <div class="tab_wrap">
              <span class="bubble"></span>
              <input id="tab1" type="radio" name="check" checked>
              <label for="tab1" class="tab_lab1">時間指定なし</label>

              <input id="tab2" type="radio" name="check">
              <span class="bubble"></span>
              <label for="tab2" class="tab_lab2">時間指定あり</label>

              <div class="panels">

                <!-- 時間軸 -->
                <div id="area1" class="panel">
                <div class="regist-card-content-question">
                  <div class="regist-card-content-question-label">準備時間幅</div>
                      <select v-model="readyInterval">
                        <option
                          v-for="list in timeBox"
                          :key="list"
                        >
                          {{ list }}
                        </option>
                      </select>
                    </div>
                  <div class="regist-card-content-question">
                    <div class="regist-card-content-question-label">使用時間幅</div>
                      <select v-model="useInterval" id="useInterval">
                        <option
                          v-for="list in timeBox"
                          :key="list"
                        >
                          {{ list }}
                        </option>
                      </select>
                    </div>
                    <div class="regist-card-content-question">
                      <div class="regist-card-content-question-label">片付け時間幅</div>
                      <select v-model="cleanUpInterval" id="cleanUpInterval">
                        <option
                          v-for="list in timeBox"
                          :key="list"
                        >
                          {{ list }}
                        </option>
                      </select>
                  </div>
                </div>

                <!-- 時刻軸 -->
                  <div id="area2" class="panel">
                    <div class="regist-card-content-question">
                      <div class="regist-card-content-question-label">準備開始時間</div>
                        <select v-model="readyTime" id="readyTime">
                          <option
                            v-for="list in timeRange"
                            :key="list"
                          >
                            {{ list }}
                          </option>
                      </select>
                    </div>
                  <div class="regist-card-content-question">
                    <div class="regist-card-content-question-label">パフォーマンス開始時間</div>
                      <select v-model="peformanceTime" id="peformanceTime">
                        <option
                          v-for="list in timeRange"
                          :key="list"
                        >
                          {{ list }}
                        </option>
                      </select>
                  </div>
                  <div class="regist-card-content-question">
                    <div class="regist-card-content-question-label">パフォーマンス終了時間</div>
                      <select v-model="endTime" id="endTime">
                        <option
                          v-for="list in timeRange"
                          :key="list"
                        >
                          {{ list }}
                        </option>
                      </select>
                  </div>
                  <div class="regist-card-content-question">
                    <div class="regist-card-content-question-label">片付け終了時間</div>
                      <select v-model="cleanUpTime" id="cleanUpTime">
                        <option
                          v-for="list in timeRange"
                          :key="list"
                        >
                          {{ list }}
                        </option>
                      </select>
                    </div>
                  </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
    <div class="regist-button">
      <button @click="register" class="regist-submit-button">登録する→</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      resultWeather: false,
      date: [],
      weather: [],
      first: [],
      second: [],
      readyInterval: [],
      useInterval: [],
      cleanUpInterval: [],
      readyTime: [],
      peformanceTime: [],
      endTime: [],
      cleanUpTime: [],
      fesDateList: [],
      stageList: [],
      isSunnyList: [
        { label: "晴れ", value: true },
        { label: "雨", value: false },
      ],
      timeBox: ["5分","10分","15分","20分","25分","30分","35分","40分","45分","50分","55分","60分",
        "65分","70分","75分","80分","90分","95分","100分","105分","110分","115分","120分",
      ],
      hour_range: ["9", "10", "11", "12", "13", "14", "15", "16", "17", "18"],
      minute_range: ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50","55"],
      timeRange: [],
    };
  },

  methods: {
    validationWeather: function() {
      if (this.weather==true ||this.weather==false) {
        this.resultWeather = true;
      } else {
        this.resultWeather = false;
      }
      return this.resultWeather
    },
    set_time_range: function () {
      for (let hour of this.hour_range) {
        for (let minute of this.minute_range) {
          this.timeRange.push(hour + ":" + minute);
        }
      }
    },
    register: function() {
      if (this.date>0 && this.first>0 && this.second>0 && this.first!=this.second) {
        const url = process.env.VUE_APP_URL + "/stage_orders";
        let params = new URLSearchParams();
        params.append("group_id", localStorage.getItem("group_id"));
        params.append("is_sunny", true);
        params.append("fes_date_id", this.date);
        params.append("stage_first", this.first);
        params.append("stage_second", this.second);
        params.append("use_time_interval", this.readyInterval);
        params.append("prepare_time_interval", this.useInterval);
        params.append("cleanup_time_interval", this.cleanUpInterval);
        params.append("prepare_start_time", this.readyTime);
        params.append("performance_start_time", this.peformanceTime);
        params.append("performance_end_time", this.endTime);
        params.append("cleanup_end_time", this.cleanUpTime);
        axios.defaults.headers.common["Content-Type"] = "application/json";
        axios.post(url, params).then(
          () => {
            if (this.$store.state.typeStage == 1) {
              // 1: マイページから新規登録で両方登録してない場合）晴れ → 雨 → マイページ
              this.$store.commit("acceptRegistStageOrderRainyPermission");
              this.$store.commit("rejectRegistStageOrderSunnyPermission");
              this.$router.push("/regist_stage_rainy");
            } else if (this.$store.state.typeStage == 2) {
              // 2: マイページから新規登録で両方登録してない場合）雨 → 晴れ → マイページ
              this.$store.commit("rejectRegistStageOrderSunnyPermission");
              this.$router.push("/mypage");
            } else if (this.$store.state.typeStage == 3) {
              // 3: マイページから新規登録で片方だけ登録していない場合) 晴れ → マイページ
              this.$store.commit("rejectRegistStageOrderSunnyPermission");
              this.$router.push("/mypage");
            } else if (this.$store.state.typeStage == 5) {
              // 5: 新規登録の場合) 晴れ → 雨 → ステージオプション
              this.$store.commit("acceptRegistStageOrderRainyPermission");
              this.$store.commit("rejectRegistStageOrderSunnyPermission");
              this.$router.push("/regist_stage_rainy");
            } else {
              this.$$router.push("/mypage");
            }
          },
          (error) => {
            console.log("登録できませんでした");
            return error;
          });
      } else {
        if (this.date == 0) {
          const dateError = document.getElementById("date");
          dateError.style.border="2px solid red";
        } else {
          const dateError = document.getElementById("date");
          dateError.style.border="2px solid black";
        }
        if (this.resultWeather == false) {
          const weatherError = document.getElementById("weather");
          weatherError.style.border="2px solid red";
        } else {
          const weatherError = document.getElementById("weather");
          weatherError.style.border="2px solid black";
        }
        if (this.first == 0 || this.first==this.second) {
          const firstError = document.getElementById("first");
          firstError.style.border="2px solid red";
        } else {
          const firstError = document.getElementById("first");
          firstError.style.border="2px solid black";
        }
        if (this.second == 0 || this.first==this.second) {
          const secondError = document.getElementById("second");
          secondError.style.border="2px solid red";
        } else {
          const secondError = document.getElementById("second");
          secondError.style.border="2px solid black";
        }
      }
    },
  },

  mounted() {
    // 直リンク対策
    if (this.$store.state.registStageOrderSunnyPermission == false) {
      this.$router.push("/mypage");
    }

    axios
      .get(process.env.VUE_APP_URL + "/api/v1/get_current_fes_dates", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.fesDateList = response.data.data.filter(fesDate => fesDate.days_num >= 1);
      });

    axios
      .get(process.env.VUE_APP_URL + "/sunny/stages", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.stageList = response.data.data;
      });
    this.set_time_range();
  },
};
</script>

<style scoped>
  select, input{
    text-align: left;
    padding: 1%;
    height: 50px;
    width: 800px;
    border-radius: 7px;
    font-size: 18px;
    vertical-align: top;
  }
  select,input:required{
    border: 2px solid red;
  }
  select,input:invalid{
    border: 2px solid red;
  }
  select,input:valid{
    border: 2px solid black;
  }
  #tab1:checked~.panels #area1 {
    display: block;
  }

  #tab2:checked~.panels #area2 {
    display: block;
  }

  #tab1:checked~.tab_lab1 {
    color: #242424;
    background:linear-gradient(transparent 70%, #FFFF00 0%);
  }

  #tab2:checked~.tab_lab2 {
    color: #242424;
    background:linear-gradient(transparent 70%, #FFFF00 0%);
  }

  input[name="check"] {
    display: none;
  }
  .panel {
    padding: 1%;
    display: none;
  }

  .tab_lab1, .tab_lab2{
    padding-left: 3.5%;
    padding-right: 3.5%;
  }
  .tab_wrap{
    margin: 1%;
  }
</style>
