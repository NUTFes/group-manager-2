<template>
  <transition name="fade" appear>
    <div class="add-modal">
      <div class="add-modal_box">
        <div id="btnContainer">
          <button v-on:click="$emit('closeEditStage')">✖</button>
        </div>
        <h1>ステージ申請</h1>
        <div>日程</div>
        <select v-model="date" id="date">
          <option
            v-for="list in fesDateList"
            :value="list.id"
            :key="list.id"
          >
            {{ list.date }}
          </option>
        </select>
        <div>天気</div>
        <select v-model="weather" @change="validationWeather" id="weather">
          <option
            v-for="list in isSunnyList"
            :value="list.value"
            :key="list.value"
          >
            {{ list.label }}
          </option>
        </select>
        <div>第一希望場所</div>
        <select v-model="first" id="first">
          <option
            v-for="list in stageList"
            :value="list.id"
            :key="list.id"
          >
            {{ list.name }}
          </option>
        </select>
        <div>第二希望場所</div>
        <select v-model="second" id="second">
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
              <div>準備時間幅</div>
              <select v-model="readyInterval">
                <option
                  v-for="list in timeBox"
                  :key="list"
                >
                  {{ list }}
                </option>
              </select>
              <div>使用時間幅</div>
              <select v-model="useInterval" id="useInterval">
                <option
                  v-for="list in timeBox"
                  :key="list"
                >
                  {{ list }}
                </option>
              </select>
              <div>片付け時間幅</div>
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
          <div class="tab-content tab-2-content">
            <!-- 時刻軸 -->
            <div id="area2" class="panel">
              <div>準備開始時間</div>
              <select v-model="readyTime" id="readyTime">
                <option
                  v-for="list in timeRange"
                  :key="list"
                >
                  {{ list }}
                </option>
              </select>
              <div>パフォーマンス開始時間</div>
              <select v-model="peformanceTime" id="peformanceTime">
                <option
                  v-for="list in timeRange"
                  :key="list"
                >
                  {{ list }}
                </option>
              </select>
              <div>パフォーマンス終了時間</div>
              <select v-model="endTime" id="endTime">
                <option
                  v-for="list in timeRange"
                  :key="list"
                >
                  {{ list }}
                </option>
              </select>
            <div>片付け終了時間</div>
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

        <span style="display:flex;">
          <button id="btn" type="button" @click="reset">リセット</button>
          <button id="btn" type="button">✓登録</button>
        </span>
      </div>
    </div>
  </transition>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      new_info: [],
      fesDateList: [],
      stageList: [],

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
      this.date = [],
      this.weather = [],
      this.first = [],
      this.second = [],
      this.readyInterval = [],
      this.useInterval = [],
      this.cleanUpInterval = [],
      this.readyTime = [],
      this.peformanceTime = [],
      this.endTime = [],
      this.cleanUpTime = []
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
    margin-top: 5%;
    margin-bottom: 5%;
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
    border: 1px solid silver;
    width: 100%;
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
    margin-top: 12px;
  }

  /* タブのスタイル */
  .tabs .tab-label {
    margin: 0 15%;
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
    padding: 10px;
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