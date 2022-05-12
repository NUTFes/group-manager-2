<template>
  <div id="app">
    <br><br><br>
    <div id="font">
      <div id="line">
        <router-link to="/mypage"><button id="btn">Mypageに戻る</button></router-link>
        <h3>参加団体登録＆編集ページ{{regist_info}}</h3>
        <select v-model="projectName">
          <option
            v-for="list in regist_info"
            :key="list.group.id"
            :value="list.group.id"
          >
            {{ list.group.name }}
          </option>
        </select>
      </div>

      <section class="tab_contents">
        <div class="tab_wrap">
          <span class="bubble"></span>
          <input id="tab1" type="radio" name="check" checked />
          <label for="tab1" class="tab_lab1">会場申請</label>

          <input id="tab2" type="radio" name="check" />
          <span class="bubble"></span>
          <label for="tab2" class="tab_lab2">電力申請</label>

          <input id="tab3" type="radio" name="check" />
          <span class="bubble"></span>
          <label for="tab3" class="tab_lab3">物品申請</label>

          <input id="tab4" type="radio" name="check" />
          <span class="bubble"></span>
          <label for="tab4" class="tab_lab4">ステージ申請</label>

          <input id="tab8" type="radio" name="check" />
          <span class="bubble"></span>
          <label for="tab8" class="tab_lab8">ステージオプション申請</label>

          <input id="tab5" type="radio" name="check" />
          <span class="bubble"></span>
          <label for="tab5" class="tab_lab5">従業員申請</label>

          <input id="tab6" type="radio" name="check" />
          <span class="bubble"></span>
          <label for="tab6" class="tab_lab6">食品申請</label>

          <input id="tab7" type="radio" name="check" />
          <span class="bubble"></span>
          <label for="tab7" class="tab_lab7">購入品申請</label>

          <div class="panels">
            <!-- 会場申請 -->
            <div id="area1" class="panel">
              <div >
                <CardPlaceInfo :regist="new_info" />
              </div>
            </div>

            <!-- 電力申請 -->
            <div id="area2" class="panel">
              <div>
                <CardPowerInfo :regist="new_info" />
              </div>
              <button
                id="btn1"
                type="button"
                @click="addPowerDisplay = true"
                style="display: block; margin: 0 0 0 auto"
              >
                追加
              </button>
              <AddPower
                v-if="addPowerDisplay"
                :groupId="projectName"
                @closeAddPower="closeAddPower"
              />
            </div>

            <!-- 物品申請 -->
            <div id="area3" class="panel">
              <div class="card">
                <ConfirmationItem :regist="test" />
              </div>
              <button
                id="btn1"
                type="button"
                @click="addItemDisplay = true"
                style="display: block; margin: 0 0 0 auto"
              >
                追加
              </button>
              <AddItem
                v-if="addItemDisplay"
                :groupId="projectName"
                @closeAddItem="closeAddItem"
              />
              <div>
                <CardItemInfo :regist="test" />
              </div>
            </div>

            <!-- ステージ申請 -->
            <div id="area4" class="panel">
              <div class="card">
                <ConfirmationStage :regist="test" />
              </div>
            
              <div>
                <CardStageInfo :regist="test" />
              </div>
            </div>

            <!-- ステージオプション -->
            <div id="area8" class="panel">
              <div class="card">
                <ConfirmationOption :regist="test" />
              </div>

              <div>
                <CardStageOptionInfo :regist="test" />
              </div>
            </div>

            <!-- 従業員申請 -->
            <div id="area5" class="panel">
              <div class="card">
                <ConfirmationEmployee :regist="test" />
              </div>
              <button
                id="btn1"
                type="button"
                onclick="document.getElementById('addEmployee').show()"
                style="display: block; margin: 0 0 0 auto"
              >
                申請
              </button>
              <dialog
                id="addEmployee"
                style="
                  margin-left: 30%;
                  margin-right: 30%;
                  width: 40%;
                  border: 0;
                  border-radius: 10px;
                  box-shadow: 0 0 0 10000px rgba(0, 0, 0, 0.4);
                "
              >
                <AddEmployee :groupId="projectName" />
              </dialog>
            </div>

            <!-- 食品申請 -->
            <div id="area6" class="panel">
              <div class="card">
                <ConfirmationFood :regist="test" />
              </div>
              <button
                id="btn1"
                type="button"
                onclick="document.getElementById('addFood').show()"
                style="display: block; margin: 0 0 0 auto"
              >
                追加
              </button>
              <dialog
                id="addFood"
                style="margin-left: 30%; margin-right: 30%; width: 40%"
              >
                <AddFood />
              </dialog>
            </div>

            <!-- 購入品申請 -->
            <div id="area7" class="panel">
              <div class="card">
                <ConfirmationPurchase :regist="test" />
              </div>
              <button
                id="btn1"
                type="button"
                onclick="document.getElementById('addPurchase').show()"
                style="display: block; margin: 0 0 0 auto"
              >
                追加
              </button>
              <dialog
                id="addPurchase"
                style="margin-left: 30%; margin-right: 30%; width: 40%"
              >
                <AddPurchase />
              </dialog>
            </div>

          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import axios from "axios";

import AddPower from "@/components/AllEdit/AddPower.vue";
import AddItem from "@/components/AllEdit/AddItem.vue";
import ConfirmationStage from "@/components/AllEdit/ConfirmationStage.vue";
import ConfirmationOption from "@/components/AllEdit/ConfirmationOption.vue";
import AddEmployee from "@/components/AllEdit/AddEmployee.vue";
import ConfirmationEmployee from "@/components/AllEdit/ConfirmationEmployee.vue";
import AddFood from "@/components/AllEdit/AddFood.vue";
import ConfirmationFood from "@/components/AllEdit/ConfirmationFood.vue";
import AddPurchase from "@/components/AllEdit/AddPurchase.vue";
import ConfirmationPurchase from "@/components/AllEdit/ConfirmationPurchase.vue";
import CardPlaceInfo from "@/components/AllEdit/CardPlaceInfo.vue";
// import CardPowerInfo from "@/components/AllEdit/CardPowerInfo.vue";
import CardItemInfo from "@/components/AllEdit/CardItemInfo.vue";
import CardStageInfo from "@/components/AllEdit/CardStageInfo.vue";
import CardStageOptionInfo from "@/components/AllEdit/CardStageOptionInfo.vue";

export default {
  components: {
    ConfirmationStage,
    ConfirmationOption,
    ConfirmationEmployee,
    ConfirmationFood,
    ConfirmationPurchase,
    AddPower,
    AddItem,
    AddEmployee,
    AddFood,
    AddPurchase,
    CardPlaceInfo,
    // CardPowerInfo,
    CardItemInfo,
    CardStageInfo,
    CardStageOptionInfo,
  },
  data() {
    return {
      regist_info: [],
      projectName: "",
      addPowerDisplay: false,
      test: "aaaaa",
      addItemDisplay: false,
    };
  },

  methods: {
    closeAddPower: function () {
      this.addPowerDisplay = false;
    },
    closeAddItem: function () {
      this.addItemDisplay = false;
    },
  },
  mounted() {
    const regist_info = process.env.VUE_APP_URL + "/api/v1/current_user/current_regist_info";
    axios
      .get(regist_info, {
        headers: {
          "Content-Type": "application/json",
          "access-token": localStorage.getItem("access-token"),
          "client": localStorage.getItem("client"),
          "uid": localStorage.getItem("uid"),
        },
      })
      .then((response) => {
        this.regist_info = response.data.data;
        // デフォルトで一番最初のgroupが選択される
        this.projectName = response.data.data[0].group.id;
      });
  },
};
</script>

<style scoped>
#app {
  margin: 1%;
}
#font {
  font-family: "Noto Sans JP";
  font-style: normal;
}
#btn {
  position: relative;
  display: inline-block;
  font-weight: bold;
  padding: 0.25em 0.5em;
  text-decoration: none;
  color: black;
  background: #ececec;
  transition: 0.4s;
  margin-bottom: 10px;
}
#btn:hover {
  background: #cccccc;
  color: white;
}
#btn:active {
  box-shadow: inset 1px 1px 2px #babecc, inset -1px -1px 2px #fff;
}
#btn1 {
  background: #032030;
  color: white;
  font-size: 20px;
  font-weight: bold;
  border-radius: 100%;
  cursor: pointer;
  width: 70px;
  height: 70px;
  display: block;
  margin: 3% 3% 3% auto;
}
#btn1:hover {
  box-shadow: -2px -2px 5px #fff, 2px 2px 5px #babecc;
  background-image: linear-gradient(
    90deg,
    rgba(247, 93, 139, 1),
    rgba(254, 220, 64, 1)
  );
  border: white;
}
#btn1:active {
  box-shadow: inset 1px 1px 2px #babecc, inset -1px -1px 2px #fff;
}
#btn2 {
  background: #62a7ff;
  color: white;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  width: 141px;
  height: 41.98px;
  display: block;
  margin: 3% 3% 3% auto;
}
#btn2:hover {
  box-shadow: -2px -2px 5px #fff, 2px 2px 5px #babecc;
  background-image: linear-gradient(
    90deg,
    rgba(247, 93, 139, 1),
    rgba(254, 220, 64, 1)
  );
  border: white;
}
#btn2:active {
  box-shadow: inset 1px 1px 2px #babecc, inset -1px -1px 2px #fff;
}
#button {
  color: black;
  font-weight: bold;
  border: solid 2px;
  border-radius: 10px;
  cursor: pointer;
  margin: 1%;
  padding: 1%;
}
#button:hover {
  box-shadow: -2px -2px 5px #fff, 2px 2px 5px #babecc;
  background-image: linear-gradient(
    90deg,
    rgba(247, 93, 139, 1),
    rgba(254, 220, 64, 1)
  );
  border: white;
}
#button:active {
  box-shadow: inset 1px 1px 2px #babecc, inset -1px -1px 2px #fff;
}
#line {
  display: inline-block;
  display: flex;
  justify-content: space-evenly;
}
input {
  outline: solid 1px #242424;
}
select {
  position: relative;
  display: inline-block;
  padding: 0.25em 0.5em;
  text-decoration: none;
  transition: 0.4s;
  margin-bottom: 10px;
  border: 1px solid black;
  border-radius: 10px;
}
.card {
  width: 60%;
  margin-left: 20%;
  margin-right: 20%;
  float: left;
  display: block;
  padding: 1%;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgb(87, 77, 77);
}
#tab1:checked ~ .panels #area1 {
  display: block;
}

#tab2:checked ~ .panels #area2 {
  display: block;
}

#tab3:checked ~ .panels #area3 {
  display: block;
}
#tab4:checked ~ .panels #area4 {
  display: block;
}

#tab5:checked ~ .panels #area5 {
  display: block;
}

#tab6:checked ~ .panels #area6 {
  display: block;
}

#tab7:checked ~ .panels #area7 {
  display: block;
}

#tab8:checked ~ .panels #area8 {
  display: block;
}

#tab1:checked ~ .tab_lab1 {
  color: #242424;
  background-color: #d0dfe6;
  left: 0%;
  right: 87.5%;
  top: 6.84%;
  bottom: 84.66%;

  background: #d0dfe6;
  box-shadow: 5px -3px 3px 1px rgba(0, 0, 0, 0.25);
  border-radius: 20px 20px 0px 0px;
}

#tab2:checked ~ .tab_lab2 {
  color: #242424;
  background-color: #d0dfe6;
  left: 0%;
  right: 87.5%;
  top: 6.84%;
  bottom: 84.66%;

  background: #d0dfe6;
  box-shadow: 5px -3px 3px 1px rgba(0, 0, 0, 0.25);
  border-radius: 20px 20px 0px 0px;
}

#tab3:checked ~ .tab_lab3 {
  color: #242424;
  background-color: #d0dfe6;
  left: 0%;
  right: 87.5%;
  top: 6.84%;
  bottom: 84.66%;

  background: #d0dfe6;
  box-shadow: 5px -3px 3px 1px rgba(0, 0, 0, 0.25);
  border-radius: 20px 20px 0px 0px;
}

#tab4:checked ~ .tab_lab4 {
  color: #242424;
  background-color: #d0dfe6;
  left: 0%;
  right: 87.5%;
  top: 6.84%;
  bottom: 84.66%;

  background: #d0dfe6;
  box-shadow: 5px -3px 3px 1px rgba(0, 0, 0, 0.25);
  border-radius: 20px 20px 0px 0px;
}

#tab5:checked ~ .tab_lab5 {
  color: #242424;
  background-color: #d0dfe6;
  left: 0%;
  right: 87.5%;
  top: 6.84%;
  bottom: 84.66%;

  background: #d0dfe6;
  box-shadow: 5px -3px 3px 1px rgba(0, 0, 0, 0.25);
  border-radius: 20px 20px 0px 0px;
}

#tab6:checked ~ .tab_lab6 {
  color: #242424;
  background-color: #d0dfe6;
  left: 0%;
  right: 87.5%;
  top: 6.84%;
  bottom: 84.66%;

  background: #d0dfe6;
  box-shadow: 5px -3px 3px 1px rgba(0, 0, 0, 0.25);
  border-radius: 20px 20px 0px 0px;
}

#tab7:checked ~ .tab_lab7 {
  color: #242424;
  background-color: #d0dfe6;
  left: 0%;
  right: 87.5%;
  top: 6.84%;
  bottom: 84.66%;

  background: #d0dfe6;
  box-shadow: 5px -3px 3px 1px rgba(0, 0, 0, 0.25);
  border-radius: 20px 20px 0px 0px;
}

#tab8:checked ~ .tab_lab8 {
  color: #242424;
  background-color: #d0dfe6;
  left: 0%;
  right: 87.5%;
  top: 6.84%;
  bottom: 84.66%;

  background: #d0dfe6;
  box-shadow: 5px -3px 3px 1px rgba(0, 0, 0, 0.25);
  border-radius: 20px 20px 0px 0px;
}
input[name="check"] {
  display: none;
}
.panel {
  padding: 3%;
  display: none;
  min-height: 100vh;
  background-color: #d0dfe6;
}
.tab_lab1,
.tab_lab2,
.tab_lab3,
.tab_lab4,
.tab_lab5,
.tab_lab6,
.tab_lab7,
.tab_lab8 {
  padding: 1%;
  left: 12.5%;
  right: 75%;
  top: 6.84%;
  bottom: 84.66%;
  background: #eaeaea;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 20px 20px 0px 0px;
  font-family: "Noto Sans JP";
  font-style: normal;
  letter-spacing: 0.1em;
  color: #333333;
}
.tab_wrap {
  margin: 1%;
}
</style>
