<template>
  <div id="app">
    <h1 class="tytle">ステージ申請の登録</h1>
    <div class="Blank">
      {{ fesDateList }}
      <span>日程</span>
      <select v-model="date" id="date">
        <option
          v-for="list in fesDateList"
          :value="list.id"
          :key="list.id"
        >
          {{ list.date }}
        </option>
      </select>
      {{ date }}
    </div>
    <div class="Blank">
      <span>天気</span>
      <select v-model="weather" @change="validationWeather" id="weather">
        <option
          v-for="list in isSunnyList"
          :value="list.value"
          :key="list.value"
        >
          {{ list.label }}
        </option>
      </select>
    </div>
    <div class="Blank">
      <span>第一希望場所</span>
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
    <div class="Blank">
      <span>第二希望場所</span>
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
              <div class="Blank">
                <span>準備時間幅</span>
                  <select v-model="readyInterval">
                    <option
                      v-for="list in timeBox"
                      :key="list"
                    >
                      {{ list }}
                    </option>
                  </select>
                </div>
                <div class="Blank">
                <span>使用時間幅</span>
                  <select v-model="useInterval" id="useInterval">
                    <option
                      v-for="list in timeBox"
                      :key="list"
                    >
                      {{ list }}
                    </option>
                  </select>
                </div>
                <div class="Blank">
                <span>片付け時間幅</span>
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
              <div class="Blank">
                <span>準備開始時間</span>
                <select v-model="readyTime" id="readyTime">
                    <option
                      v-for="list in timeRange"
                      :key="list"
                    >
                      {{ list }}
                    </option>
                  </select>
              </div>
              <div class="Blank">
                <span>パフォーマンス開始時間</span>
                <select v-model="peformanceTime" id="peformanceTime">
                    <option
                      v-for="list in timeRange"
                      :key="list"
                    >
                      {{ list }}
                    </option>
                  </select>
              </div>
              <div class="Blank">
                <span>パフォーマンス終了時間</span>
                <select v-model="endTime" id="endTime">
                    <option
                      v-for="list in timeRange"
                      :key="list"
                    >
                      {{ list }}
                    </option>
                  </select>
              </div>
              <div class="Blank">
                <span>片付け終了時間</span>
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
    <div class="Blank">
      <router-link to="/mypage"><button style="margin-left:8%;">←戻る</button></router-link>
      <button @click="register" style="margin-left:15%;">登録する→</button>
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
      new_info: [],
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
      if (this.date>0 && this.resultWeather && this.first>0 && this.second>0 && this.first!=this.second) {
        const url = process.env.VUE_APP_URL + "/stage_orders";
        let params = new URLSearchParams();
        params.append("group_id", this.new_info.group.id);
        params.append("is_sunny", this.weather);
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
          (response) => {
            console.log("response:", response);
            this.$router.push("mypage");
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
      .get(process.env.VUE_APP_URL + "/fes_dates", {
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
  #app{
    margin: 1%;
  }
  span {
    display: inline-block;
    width: 125px;
    padding-right: 10px;
  }
  .tytle{
    text-align:center;
    padding:1%;
  }
  .Blank{
    text-align: center;
    margin:1%;
  }
  select,input{
    text-align: center;
    width: 30%;
    height:40px;
    border-radius: 7px;
    box-shadow: inset 2px 2px 5px #BABECC, inset -5px -5px 10px #FFF;
    font-size: 25px;
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
  button{
  color: black;
  font-weight: bold;
  border: solid 2px;
  border-radius: 10px;
  cursor: pointer;
  margin: 1%;
  padding:1%;
  }
  button:hover {
    box-shadow: -2px -2px 5px #FFF, 2px 2px 5px #BABECC;
    background-image: linear-gradient(90deg, rgba(247, 93, 139, 1), rgba(254, 220, 64, 1));
    border: white;
  }
  button:active{
    box-shadow: inset 1px 1px 2px #BABECC, inset -1px -1px 2px #FFF;
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
