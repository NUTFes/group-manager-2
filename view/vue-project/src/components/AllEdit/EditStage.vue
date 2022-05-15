<template>
  <transition name="fade" appear>
    <div class="add-modal">
      <div class="add-modal_box">
        <div id="btnContainer">
          <button v-on:click="$emit('closeEditStage')">✖</button>
        </div>
        <h1>ステージ編集[{{ isSunny? "晴" : "雨" }}]</h1>
        <div class="entry">日程</div>
        <select v-model="stageDateId" id="date">
          <option
            v-for="list in fesDateList"
            :value="list.id"
            :key="list.id"
          >
            {{ list.date }}
          </option>
        </select>
        <!-- <div class="entry">天気</div>
        <select v-model="isSunny" id="weather">
          <option
            v-for="list in isSunnyList"
            :value="list.value"
            :key="list.value"
          >
            {{ list.label }}
          </option>
        </select> -->
        <div class="entry">第一希望場所</div>
        <select v-model="stageFirst" id="first">
          <option
            v-for="list in stageList"
            :value="list.id"
            :key="list.id"
          >
            {{ list.name }}
          </option>
        </select>
        <div class="entry">第二希望場所</div>
        <select v-model="stageSecond" id="second">
          <option
            v-for="list in stageList"
            :value="list.id"
            :key="list.id"
          >
            {{ list.name }}
          </option>
        </select>

        <div class="tabs">
          <input id="tab-1" type="radio" name="tab-radio" checked>
          <label class="tab-label" for="tab-1">時間指定なし</label>
          <input id="tab-2" type="radio" name="tab-radio">
          <label class="tab-label" for="tab-2">時間指定あり</label>

          <div class="tab-content tab-1-content">
            <!-- 時間軸 -->
            <div id="area1" class="panel">
              <div class="time">準備時間幅</div>
              <select v-model="prepareTimeInterval">
                <option
                  v-for="list in timeBox"
                  :key="list"
                >
                  {{ list }}
                </option>
              </select>
              <div class="time">使用時間幅</div>
              <select v-model="useTimeInterval" id="useInterval">
                <option
                  v-for="list in timeBox"
                  :key="list"
                >
                  {{ list }}
                </option>
              </select>
              <div class="time">片付け時間幅</div>
              <select v-model="cleanupTimeInterval" id="cleanUpInterval">
                <option
                  v-for="list in timeBox"
                  :key="list"
                >
                  {{ list }}
                </option>
              </select>
            </div>
          </div>
          <div class="tab-content tab-2-content">
            <!-- 時刻軸 -->
            <div id="area2" class="panel">
              <div class="time">準備開始時間</div>
              <select v-model="prepareStartTime" id="readyTime">
                <option
                  v-for="list in timeRange"
                  :key="list"
                >
                  {{ list }}
                </option>
              </select>
              <div class="time">パフォーマンス開始時間</div>
              <select v-model="performanceStartTime" id="peformanceTime">
                <option
                  v-for="list in timeRange"
                  :key="list"
                >
                  {{ list }}
                </option>
              </select>
              <div class="time">パフォーマンス終了時間</div>
              <select v-model="performanceEndTime" id="endTime">
                <option
                  v-for="list in timeRange"
                  :key="list"
                >
                  {{ list }}
                </option>
              </select>
            <div class="time">片付け終了時間</div>
            <select v-model="cleanupEndTime" id="cleanUpTime">
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

        <span style="display:flex;">
          <button id="btn" type="button" @click="reset">リセット</button>
          <button id="btn" type="button" @click="register">✓編集</button>
        </span>
      </div>
    </div>
  </transition>
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
    }
  },

  methods: {
    reset: function() {
      this.stageDateId = [],
      this.isSunny = [],
      this.stageFirst = [],
      this.stageSecond = [],
      this.prepareTimeInterval = [],
      this.useTimeInterval = [],
      this.cleanupTimeInterval = [],
      this.prepareStartTime = [],
      this.performanceStartTime = [],
      this.performanceEndTime = [],
      this.cleanupEndTime = []
    },
    register: function () {
      if (this.stageDateId>0 && this.stageFirst>0 && this.stageSecond>0 && this.stageFirst!=this.stageSecond) {
        const url = process.env.VUE_APP_URL + "/stage_orders/" + this.id +
        "?group_id=" + this.groupId +
        "&is_sunny=" + this.isSunny +
        "&fes_date_id=" + this.stageDateId +
        "&stage_first=" + this.stageFirst +
        "&stage_second=" + this.stageSecond +
        "&use_time_interval=" + this.useTimeInterval +
        "&prepare_time_interval=" + this.prepareTimeInterval +
        "&cleanup_time_interval=" + this.cleanupTimeInterval +
        "&prepare_start_time=" + this.prepareStartTime +
        "&performance_start_time=" + this.performanceStartTime +
        "&performance_end_time=" + this.performanceEndTime +
        "&cleanup_end_time=" + this.cleanupEndTime;
        axios.defaults.headers.common["Content-Type"] = "application/json";
        axios.put(url).then(
          (response) => {
            console.log(response);
            this.$emit("closeEditStage");
            this.$emit("reload");
          },
          (error) => {
            return error;
          }
        );
      } else {
        if (this.stageDateId == 0) {
          const dateError = document.getElementById("date");
          dateError.style.border="2px solid red";
        } else {
          const dateError = document.getElementById("date");
          dateError.style.border="2px solid black";
        }
        if (this.stageFirst == 0 || this.first==this.second) {
          const firstError = document.getElementById("first");
          firstError.style.border="2px solid red";
        } else {
          const firstError = document.getElementById("first");
          firstError.style.border="2px solid black";
        }
        if (this.stageSecond == 0 || this.first==this.second) {
          const secondError = document.getElementById("second");
          secondError.style.border="2px solid red";
        } else {
          const secondError = document.getElementById("second");
          secondError.style.border="2px solid black";
        }
      }
    },
    set_time_range: function () {
      for (let hour of this.hour_range) {
        for (let minute of this.minute_range) {
          this.timeRange.push(hour + ":" + minute);
        }
      }
    },
  },

  mounted() {
    const new_info =
    process.env.VUE_APP_URL + "/api/v1/current_user/current_regist_info";
    axios
      .get(new_info, {
        headers: {
          "Content-Type": "application/json",
          "access-token": localStorage.getItem("access-token"),
          client: localStorage.getItem("client"),
          uid: localStorage.getItem("uid"),
        },
      })
      .then((response) => {
        console.log(response);
        this.new_info = response.data.data[0];
      });

    axios
      .get(process.env.VUE_APP_URL + "/api/v1/get_current_fes_dates", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.fesDateList = response.data.data;
      });

    axios
      .get(process.env.VUE_APP_URL + "/stages", {
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
  #btn{
    background: #032030;
    color: white;
    font-size: 15px;
    font-weight: bold;
    cursor: pointer;
    width: 30%;
    height: 30px;
    display: block;
    margin-right: 10%;
    margin-left: 10%;
    margin-top: 15%;
    margin-bottom: 5%;
    border-radius: 5px;
}
  #btn:hover {
    box-shadow: -2px -2px 5px #FFF, 2px 2px 5px #BABECC;
    background-image: linear-gradient(90deg, rgba(247, 93, 139, 1), rgba(254, 220, 64, 1));
    border: white;
  }
  #btn:active{
    box-shadow: inset 1px 1px 2px #BABECC, inset -1px -1px 2px #FFF;
  }
  #btnContainer {
    display: flex;
    justify-content: end;
    width: 100%;
    margin-bottom: -1.5rem;
    z-index: 0;
  }
  input{
    border: 1px solid silver;
    width: 100%;
  }
  select{
    width: 80%;
    margin: 0% auto;
    border: 1px solid silver;
    border-top : solid 1px #717171;
    border-bottom : solid 1px #e0e0e0;
    border-radius: 5px;
    background-color: white;
  }
  h1 {
    margin: 5%;
  }
  .entry {
    margin-top: 3%;
    margin-left: 10%;
    margin-right: 10%;
  }
  .time {
    margin-top: 3%;
  }
  .add-modal_box {
    display: flex;
    padding: 10px 10px;
    margin: 0 25%;
    justify-content: center;
    flex-flow: column;
    background-color: #DADADA;
    border-radius: 10px;
    margin: 0 30%;
  }
  .add-modal {
    top: 0;
    left: 0;
    position: fixed;
    padding: 100px;
    height: 100%;
    width: 100%;
    z-index: 11;
    background-color: rgba(51, 51, 51, 0.3);
    overflow: auto;
  }

  .tabs {
    margin-top: 5%;
  }

  /* タブのスタイル */
  .tabs .tab-label {
    margin: 5% 12%;
    background-color: #DADADA;
    border-bottom: none;
    font-size: 0.9em;
  }

  /* タブにマウスカーソルがのったときフッター */
  .tabs .tab-label:hover {
    opacity: 0.7;
  }

  /* ラジオボタンと内容を非表示 */
  .tabs input[name="tab-radio"],
  .tabs .tab-content {
    display: none;
  }

  /* タブ内容のスタイル */
  .tabs .tab-content{
    margin: 5% 10%;
  }

  /* 選択されているタブのコンテンツのみを表示 */
  .tabs #tab-1:checked ~ .tab-1-content,
  .tabs #tab-2:checked ~ .tab-2-content{
    display: block;
  }

  /* 選択されているタブのスタイルを変える */
  .tabs input[name="tab-radio"]:checked + .tab-label {
    background-color: silver;
    border-radius: 0.3rem;
    padding: 0.2rem;
  }
</style>