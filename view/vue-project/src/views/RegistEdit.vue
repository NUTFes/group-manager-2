<template>
  <div id="app">
    <div id="line">
      <router-link to="/mypage"><button id="btn">Mypageに戻る</button></router-link>
      <h3>参加団体登録＆編集ページ</h3>
      <select v-model="projectName">
        <option
          v-for="list in regist_info"
          :key="list.group.id"
          :value="list.group.id"
          >{{list.group.project_name}}
        </option>
      </select>
    </div>

    <section class="tab_contents">
      <div class="tab_wrap">
        <span class="bubble"></span>
        <input id="tab1" type="radio" name="check" checked>
        <label for="tab1" class="tab_lab1">会場申請</label>

        <input id="tab2" type="radio" name="check">
        <span class="bubble"></span>
        <label for="tab2" class="tab_lab2">電力申請</label>

        <input id="tab3" type="radio" name="check">
        <span class="bubble"></span>
        <label for="tab3" class="tab_lab3">物品申請</label>

        <input id="tab4" type="radio" name="check">
        <span class="bubble"></span>
        <label for="tab4" class="tab_lab4">ステージ申請</label>

        <input id="tab8" type="radio" name="check">
        <span class="bubble"></span>
        <label for="tab8" class="tab_lab8">ステージオプション申請</label>

        <input id="tab5" type="radio" name="check">
        <span class="bubble"></span>
        <label for="tab5" class="tab_lab5">従業員申請</label>

        <input id="tab6" type="radio" name="check">
        <span class="bubble"></span>
        <label for="tab6" class="tab_lab6">食品申請</label>

        <input id="tab7" type="radio" name="check">
        <span class="bubble"></span>
        <label for="tab7" class="tab_lab7">購入品申請</label>

        <div class="panels">

          <!-- 会場申請 -->
          <div id="area1" class="panel">
            <div class="card">
              <h1>Registration Form(place)</h1>
              <EditPlace />
              <br />
              <h1>your information(place)</h1>
              <button type="button" onclick="document.getElementById('dialog').show()" style="display: block; margin: 0 0 0 auto; background-color: red;">開く</button>

              <dialog id="dialog" style="margin-left:30%; margin-right:30%; width:40%;">
                <ConfirmationPlace :regist="new_info" />
                <button type="button" onclick="document.getElementById('dialog').close()">閉じる</button>
              </dialog>
            </div>
          </div>

          <!-- 電力申請 -->
          <div id="area2" class="panel">
            <div class="card">
              <h1>Registration Form(power)</h1>
              <EditPower />
              <br />
              <h1>your information(power)</h1>
              <ConfirmationPower :regist="new_info" />
            </div>
          </div>

          <!-- 物品申請 -->
          <div id="area3" class="panel">
            <div class="card">
              <h1>Registration Form(item)</h1>
              <EditItem />
              <h1>your information(item)</h1>
              <ConfirmationItem :regist="new_info" />
            </div>
          </div>

          <!-- ステージ申請 -->
          <div id="area4" class="panel">
            <div class="card">
              <h1>Registration Form(stage)</h1>
              <EditStage />
              <h1>your information(stage)</h1>
              <ConfirmationStage :regist="new_info" />
            </div>
          </div>

          <!-- 従業員申請 -->
          <div id="area5" class="panel">
            <div class="card">
              <h1>Registration Form(employee)</h1>
              <EditEmployee />
              <h1>your information(employee)</h1>
              <ConfirmationEmployee :regist="new_info" />
            </div>
          </div>

          <!-- 食品申請 -->
          <div id="area6" class="panel">
            <div class="card">
              <h1>Registration Form(food)</h1>
              <EditFood />
              <h1>your information(food)</h1>
              <ConfirmationFood :regist="new_info" />
            </div>
          </div>

          <!-- 購入品申請 -->
          <div id="area7" class="panel">
            <div class="card">
              <h1>Registration Form(purchase)</h1>
              <EditPurchase />
              <h1>your information(purchase)</h1>
              <ConfirmationPurchase :regist="new_info" />
            </div>
          </div>

          <!-- ステージオプション -->
          <div id="area8" class="panel">
            <div class="card">
              <h1>Registration Form(option)</h1>
              <EditOption />
              <h1>your information(option)</h1>
              <ConfirmationOption :regist="new_info" />
            </div>
          </div>

        </div>
      </div>
    </section>

  </div>
</template>

<script>
import axios from "axios";

import EditPlace from "@/components/AllEdit/EditPlace.vue";
import ConfirmationPlace from "@/components/AllEdit/ConfirmationPlace.vue";
import EditPower from "@/components/AllEdit/EditPower.vue";
import ConfirmationPower from "@/components/AllEdit/ConfirmationPower.vue";
import EditItem from "@/components/AllEdit/EditItem.vue";
import ConfirmationItem from "@/components/AllEdit/ConfirmationItem.vue";
import EditStage from "@/components/AllEdit/EditStage.vue";
import ConfirmationStage from "@/components/AllEdit/ConfirmationStage.vue";
import EditOption from "@/components/AllEdit/EditOption.vue";
import ConfirmationOption from "@/components/AllEdit/ConfirmationOption.vue";
import EditEmployee from "@/components/AllEdit/EditEmployee.vue";
import ConfirmationEmployee from "@/components/AllEdit/ConfirmationEmployee.vue";
import EditFood from "@/components/AllEdit/EditFood.vue";
import ConfirmationFood from "@/components/AllEdit/ConfirmationFood.vue";
import EditPurchase from "@/components/AllEdit/EditPurchase.vue";
import ConfirmationPurchase from "@/components/AllEdit/ConfirmationPurchase.vue";

export default {
  components: {
    EditPlace,
    ConfirmationPlace,
    EditPower,
    ConfirmationPower,
    ConfirmationItem,
    ConfirmationStage,
    ConfirmationOption,
    ConfirmationEmployee,
    ConfirmationFood,
    ConfirmationPurchase,
    EditItem,
    EditStage,
    EditOption,
    EditEmployee,
    EditFood,
    EditPurchase,
  },
  data() {
    return {
      regist_info: [],
      new_info: [],
      projectName: [],
    };
  },
  mounted() {
    const regist_info_url =
    process.env.VUE_APP_URL + "/api/v1/current_user/regist_info";
    axios
      .get(regist_info_url, {
        headers: {
          "Content-Type": "application/json",
          "access-token": localStorage.getItem("access-token"),
          client: localStorage.getItem("client"),
          uid: localStorage.getItem("uid"),
        },
      })
      .then((response) => {
        console.log(response);
        this.regist_info = response.data;
      });
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
        this.new_info = response.data.data;

      });
  },
};
</script>

<style scoped>
#app{
    margin: 1%;
  }
#buton {
  align:rihgt;
}
#btn {
    position: relative;
    display: inline-block;
    font-weight: bold;
    padding: 0.25em 0.5em;
    text-decoration: none;
    color: black;
    background: #ECECEC;
    transition: .4s;
    margin-bottom: 10px;
  }
  #btn:hover {
    background: #00bcd4;
    color: white;
  }
  #button:active{
    box-shadow: inset 1px 1px 2px #BABECC, inset -1px -1px 2px #FFF;
  }
  #line {
    display: inline-block;
    display: flex;
    justify-content: space-evenly;
  }
  input{
    outline:solid 1px #242424;
  }
  select{
    width: 10%;
    text-align: center;
    background-color: #E5E5E5;
    cursor: pointer;
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
  #tab1:checked~.panels #area1 {
    display: block;
  }

  #tab2:checked~.panels #area2 {
    display: block;
  }

  #tab3:checked~.panels #area3 {
    display: block;
  }
  #tab4:checked~.panels #area4 {
    display: block;
  }

  #tab5:checked~.panels #area5 {
    display: block;
  }

  #tab6:checked~.panels #area6 {
    display: block;
  }

  #tab7:checked~.panels #area7 {
    display: block;
  }

  #tab8:checked~.panels #area8 {
    display: block;
  }

  #tab1:checked~.tab_lab1 {
    color: #242424;
    background-color: #D0DFE6;
    left: 0%;
    right: 87.5%;
    top: 6.84%;
    bottom: 84.66%;

    background: #D0DFE6;
    box-shadow: 5px -3px 3px 1px rgba(0, 0, 0, 0.25);
    border-radius: 20px 20px 0px 0px;
  }

  #tab2:checked~.tab_lab2 {
    color: #242424;
    background-color: #D0DFE6;
    left: 0%;
    right: 87.5%;
    top: 6.84%;
    bottom: 84.66%;

    background: #D0DFE6;
    box-shadow: 5px -3px 3px 1px rgba(0, 0, 0, 0.25);
    border-radius: 20px 20px 0px 0px;
  }

  #tab3:checked~.tab_lab3 {
    color: #242424;
    background-color: #D0DFE6;
    left: 0%;
    right: 87.5%;
    top: 6.84%;
    bottom: 84.66%;

    background: #D0DFE6;
    box-shadow: 5px -3px 3px 1px rgba(0, 0, 0, 0.25);
    border-radius: 20px 20px 0px 0px;
  }

  #tab4:checked~.tab_lab4 {
    color: #242424;
    background-color: #D0DFE6;
    left: 0%;
    right: 87.5%;
    top: 6.84%;
    bottom: 84.66%;

    background: #D0DFE6;
    box-shadow: 5px -3px 3px 1px rgba(0, 0, 0, 0.25);
    border-radius: 20px 20px 0px 0px;
  }

  #tab5:checked~.tab_lab5 {
    color: #242424;
    background-color: #D0DFE6;
    left: 0%;
    right: 87.5%;
    top: 6.84%;
    bottom: 84.66%;

    background: #D0DFE6;
    box-shadow: 5px -3px 3px 1px rgba(0, 0, 0, 0.25);
    border-radius: 20px 20px 0px 0px;
  }

  #tab6:checked~.tab_lab6 {
    color: #242424;
    background-color: #D0DFE6;
    left: 0%;
    right: 87.5%;
    top: 6.84%;
    bottom: 84.66%;

    background: #D0DFE6;
    box-shadow: 5px -3px 3px 1px rgba(0, 0, 0, 0.25);
    border-radius: 20px 20px 0px 0px;
  }

  #tab7:checked~.tab_lab7 {
    color: #242424;
    background-color: #D0DFE6;
    left: 0%;
    right: 87.5%;
    top: 6.84%;
    bottom: 84.66%;

    background: #D0DFE6;
    box-shadow: 5px -3px 3px 1px rgba(0, 0, 0, 0.25);
    border-radius: 20px 20px 0px 0px;
  }

  #tab8:checked~.tab_lab8 {
    color: #242424;
    background-color: #D0DFE6;
    left: 0%;
    right: 87.5%;
    top: 6.84%;
    bottom: 84.66%;

    background: #D0DFE6;
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
    background-color: #D0DFE6;
  }
  .tab_lab1, .tab_lab2, .tab_lab3, .tab_lab4, .tab_lab5, .tab_lab6 ,.tab_lab7, .tab_lab8{
    padding: 1%;
    left: 12.5%;
    right: 75%;
    top: 6.84%;
    bottom: 84.66%;
    background: #EAEAEA;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 20px 20px 0px 0px;
    font-family: 'Noto Sans JP';
    font-style: normal;
    letter-spacing: 0.1em;
    color: #333333;
  }
  .tab_wrap{
    margin: 1%;
  }
</style>