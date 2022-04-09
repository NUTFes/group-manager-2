<template>
  <div id="app">
    <router-link to="/mypage"><button>←マイページに戻る</button></router-link>
    <p>参加団体登録と編集</p>
    <select>
      <option>
      </option>
    </select>
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
            <div style="width:49%; float:left; display:block;" class="card">
              <h2>会場申請新規登録</h2>
              <h3>第1希望</h3>
              <select>
                <option
                  v-for="list in placeList"
                  :value="list.id"
                  :key="list.id"
                >
                  {{ list.name }}
                </option>
              </select>
              <h3>第2希望</h3>
              <select>
                <option
                  v-for="list in placeList"
                  :value="list.id"
                  :key="list.id"
                >
                  {{ list.name }}
                </option>
              </select>
              <h3>第3希望</h3>
              <select>
                <option
                  v-for="list in placeList"
                  :value="list.id"
                  :key="list.id"
                >
                  {{ list.name }}
                </option>
              </select>
              <div>
                <h3>備考</h3>
                <input type="text" name="remark" placeholder="入力欄" v-model="remark">
              </div>
              <div>
                <button type="button">←リセット</button>
                <button type="button">登録する→</button>
              </div>
            </div>

            <div style="width:49%; float:right; display:block;" class="card">
              <span v-for="(list, i) in new_info" :key="i">
                <h1>あなたの登録情報</h1>
                <h3>第1希望</h3>
                <h1 style="color:gold; text-decoration: underline;">{{list.place_order.first}}</h1>
                <div>
                  <button type="button">編集</button>
                  <button type="button">削除</button>
                </div>
                <h3>第2希望</h3>
                <h1 style="color:silver; text-decoration: underline;">{{list.place_order.second}}</h1>
                <div>
                  <button type="button">編集</button>
                  <button type="button">削除</button>
                </div>
                <h3>第3希望</h3>
                <h1 style="color:#C47222; text-decoration: underline;">{{list.place_order.third}}</h1>
                <div>
                  <button type="button">編集</button>
                  <button type="button">削除</button>
                </div>
              </span>
            </div>
          </div>

          <!-- 電力申請 -->
          <div id="area2" class="panel">
            <div style="width:49%; float:left; display:block;" class="card">
              <h3>使用物品名</h3>
              <input type="text" name="power_item" placeholder="使用物品の名前を入力" v-model="power_item">
              <h3>最大定格電力</h3>
              <input type="text" name="power_power" placeholder="最大定格電力" v-model="power_power">
              <h3>メーカー</h3>
              <input type="text" name="power_maker" placeholder="メーカー" v-model="power_maker">
              <h3>型番</h3>
              <input type="text" name="power_manufacturer" placeholder="型番" v-model="power_manufacturer">
              <h3>URL</h3>
              <input type="text" name="power_url" placeholder="URL" v-model="power_url">
              <div>
                <button type="button">←リセット</button>
                <button type="button">登録する→</button>
              </div>
            </div>
            <div style="width:49%; float:right; display:block;" class="card">
              <div  v-for="(regist, i) in new_info" :key="i">
                <h1>あなたの登録情報</h1>
                <span v-for="(list, i) in regist.power_orders" :key="i">
                  <h1>使用物品名：{{list.power_order.item}}</h1>
                  <h1>最大定格電力：{{list.power_order.power}}[W]</h1>
                  <h1>メーカー：{{list.power_order.manufacturer}}</h1>
                  <h1>型番：{{list.power_order.model}}</h1>
                  <h1>URL：{{list.power_order.item_url}}</h1>
                  <div>
                    <button type="button">編集</button>
                    <button type="button">削除</button>
                  </div>
                  <br>
                </span>
              </div>
            </div>
          </div>

          <!-- 物品申請 -->
          <div id="area3" class="panel">
            <div style="width:49%; float:left; display:block;" class="card">
              <h3>物品名</h3>
              <select>
                <option
                  v-for="list in itemList"
                  :value="list.id"
                  :key="list.id"
                >
                  {{ list.name }}
                </option>
              </select>
              <h3>数量</h3>
              <input type="text" name="number of rental" placeholder="数量の入力" v-model="num">
              <div>
                <button type="button">←リセット</button>
                <button type="button">登録する→</button>
              </div>
            </div>
            <div style="width:49%; float:right; display:block;" class="card">
              <div  v-for="(regist, i) in new_info" :key="i">
                <h1>あなたの登録情報</h1>
                <span v-for="(rental_order, i) in regist.rental_orders" :key="i">
                <h1>貸出物品：{{rental_order.rental_item.name}}</h1>
                <h1>貸出個数；{{rental_order.rental_item.num}}</h1>
                <div>
                  <button type="button">編集</button>
                  <button type="button">削除</button>
                </div>
                <br>
                </span>
              </div>
            </div>
          </div>

          <!-- ステージ申請 -->
          <div id="area4" class="panel">
            <div style="width:49%; float:left; display:block;" class="card">
            <h1>日程</h1>
            <select>
              <option  v-for="(date, i) in fes_dates" :key="i">
                {{date.fes_date.date}}
              </option>
            </select>
              <h3>天気</h3>
              <select>
                <option
                  v-for="list in isSunnyList"
                  :value="list.id"
                  :key="list.id"
                >
                  {{ list.label }}
                </option>
              </select>
              <h3>第一希望場所</h3>
              <select>
                <option
                  v-for="list in stageList"
                  :value="list.id"
                  :key="list.id"
                >
                  {{ list.name }}
                </option>
              </select>
              <h3>第二希望場所</h3>
              <select>
                <option
                  v-for="list in stageList"
                  :value="list.id"
                  :key="list.id"
                >
                  {{ list.name }}
                </option>
              </select>

              <div>
                <button type="button">←リセット</button>
                <button type="button">登録する→</button>
              </div>
            </div>
            <div style="width:49%; float:right; display:block;" class="card">
              <h1>あなたの登録情報</h1>
              <div v-for="(regist, i) in new_info" :key="i">
                <span v-for="(list, i) in regist.stage_orders" :key="i">
                  <h1>ステージ希望日程：{{list.stage_order.year}}</h1>
                  <h1>ステージ希望曜日：{{list.stage_order.date}}</h1>
                  <h1>ステージ第一希望：{{list.stage_order.day}}</h1>
                  <h1>ステージ第二希望：{{list.stage_order.stage_first}}</h1>
                  <h1>ステージ準備時間：{{list.stage_order.stage_second}}</h1>
                  <h1>ステージ使用時間：{{list.stage_order.use_time_interval}}</h1>
                  <h1>ステージ掃除時間：{{list.stage_order.cleanup_time_interval}}</h1>
                  <h1>ステージ準備開始：{{list.stage_order.prepare_start_time}}</h1>
                  <h1>ステージ開演時間：{{list.stage_order.performance_start_time}}</h1>
                  <h1>ステージ終了時間：{{list.stage_order.performance_end_time}}</h1>
                  <h1>ステージ撤退時間：{{list.stage_order.cleanup_end_time}}</h1>
                </span>
              </div>
            </div>
          </div>

          <!-- 従業員申請 -->
          <div id="area5" class="panel">
            <div style="width:49%; float:left; display:block;" class="card">
              <h3>名前</h3>
              <input type="text" name="name" placeholder="名前を入力してください" v-model="name">
              <h3>学籍番号</h3>
              <input type="text" name="studentId" placeholder="学籍番号を入力してください" v-model="studentIdd">
              <div>
                <button type="button">←リセット</button>
                <button type="button">登録する→</button>
              </div>
            </div>
            <div style="width:49%; float:right; display:block;" class="card">
              <div  v-for="(regist, i) in new_info" :key="i">
                <h1>あなたの登録情報</h1>
                <span v-for="(list, i) in regist.employees" :key="i">
                  <h1>従業員名：{{list.employee.name}}</h1>
                  <h1>学籍番号：{{list.employee.student_id}}</h1>
                  <div>
                    <button type="button">編集</button>
                    <button type="button">削除</button>
                  </div>
                  <br>
                </span>
              </div>
            </div>
          </div>

          <!-- 食品申請 -->
          <div id="area6" class="panel">
            <div style="width:49%; float:left; display:block;" class="card">
              <h3>料理名</h3>
              <input type="text" name="food_name" placeholder="料理名を入力してください" v-model="food_name">
              <h3>仕込み個数（一日目）</h3>
              <input type="text" name="food_name" placeholder="料理名を入力してください" v-model="food_name">
              <h3>仕込み個数（二日目）</h3>
              <input type="text" name="food_name" placeholder="料理名を入力してください" v-model="food_name">
              <div>
                <button type="button">←リセット</button>
                <button type="button">登録する→</button>
              </div>
            </div>
            <div style="width:49%; float:right; display:block;" class="card">
              <div  v-for="(regist, i) in new_info" :key="i">
                <h1>あなたの登録情報</h1>
                <span v-for="(list, i) in regist.food_products" :key="i">
                  <h1>料理名：{{list.food_product.name}}</h1>
                  <h1 v-if="list.food_product.is_cooking==true">料理の有無：有</h1>
                  <h1 v-else>料理の有無：無</h1>
                  <h1>仕込み個数（一日目）：{{list.food_product.first_day_num}}</h1>
                  <h1>仕込み個数（二日目）：{{list.food_product.second_day_num}}</h1>
                  <div>
                    <button type="button">編集</button>
                    <button type="button">削除</button>
                  </div>
                  <br>
                </span>
              </div>
            </div>
          </div>

          <!-- 購入品申請 -->
          <div id="area7" class="panel">
            <div style="width:49%; float:left; display:block;" class="card">
              <div  v-for="(regist, i) in new_info" :key="i">
                <h3>対象食品</h3>
                <select>
                  <option v-for="(list, i) in regist.food_products" :key="i">
                    {{ list.food_product.name }}
                  </option>
                </select>
              </div>
              <h3>購入場所</h3>
              <select>
                <option
                  v-for="list in shops"
                  :value="list.id"
                  :key="list.id"
                >
                  {{ list.name }}
                </option>
              </select>
              <h3>購入品</h3>
              <input type="text" name="purchaseName" placeholder="購入品名の入力" v-model="purchaseList">
              <h3>生ものの扱い</h3>
              <select>
                <option
                  v-for="list in isFreshList"
                  :value="list.id"
                  :key="list.id"
                >
                  {{ list.label }}
                </option>
              </select>
              <div>
                <button type="button">←リセット</button>
                <button type="button">登録する→</button>
              </div>
            </div>
            <div style="width:49%; float:right; display:block;" class="card">
              <div  v-for="(regist, i) in new_info" :key="i">
                <h1>あなたの登録情報</h1>
                <span v-for="(food_product, i) in regist.food_products" :key="i">
                   <h1 style="text-decoration:underline;">対象商品：{{food_product.food_product.name}}</h1>
                  <span v-for="(list, i) in food_product.purchase_lists" :key="i">
                    <h1>購入品：{{list.purchase_list.items}}</h1>
                    <h1>購入場所：{{list.purchase_list.food_product}}</h1>
                    <h1 v-if="list.purchase_list.is_fresh==true">生もの：有</h1>
                    <h1 v-else>生もの：無</h1>
                    <div>
                      <button type="button">編集</button>
                      <button type="button">削除</button>
                    </div>
                    <br>
                  </span>
                </span>
              </div>
            </div>
          </div>

          <!-- 購入品申請 -->
          <div id="area8" class="panel">
            <div style="width:49%; float:left; display:block;" class="card">
              <h3>所持機器の利用</h3>
              <select>
                <option
                  v-for="list in itemsAvailable"
                  :value="list.id"
                  :key="list.id"
                >
                  {{ list.label }}
                </option>
              </select>
              <h3>音楽</h3>
              <select>
                <option
                  v-for="list in itemsAvailable"
                  :value="list.id"
                  :key="list.id"
                >
                  {{ list.label }}
                </option>
              </select>
              <h3>撮影許可</h3>
              <select>
                <option
                  v-for="list in photoAvailable"
                  :value="list.id"
                  :key="list.id"
                >
                  {{ list.label }}
                </option>
              </select>
              <h3>騒音</h3>
              <select>
                <option
                  v-for="list in loudAble"
                  :value="list.id"
                  :key="list.id"
                >
                  {{ list.label }}
                </option>
              </select>
              <h3>ステージ内容</h3>
              <input type="text" name="stageContent" placeholder="ステージ内容" v-model="stageContent">

              <div>
                <button type="button">←リセット</button>
                <button type="button">登録する→</button>
              </div>
            </div>
            <div style="width:49%; float:right; display:block;" class="card">
              <div  v-for="(regist, i) in new_info" :key="i">
                <h1 v-if="regist.stage_common_option.own_equipment==true">所持機器の利用：有</h1>
                <h1 v-else>所持機器の利用：無</h1>
                <h1 v-if="regist.stage_common_option.bgm==true">音楽：有</h1>
                <h1 v-else>音楽：無</h1>
                <h1 v-if="regist.stage_common_option.camera_permission==true">撮影許可：有</h1>
                <h1 v-else>撮影許可：無</h1>
                <h1 v-if="regist.stage_common_option.loud_sound==true">騒音：有</h1>
                <h1 v-else>騒音：無</h1>
                <h1>ステージ内容：{{regist.stage_common_option.stage_content}}</h1>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      fes_dates: [],
      projectList: [],
      regist_info: [],
      new_info: [],
      power_orders: [],
      placeList: [],
      stageList: [],
      itemList: [],
      shops: [],
      isFreshList: [
        { label: "はい", value: true },
        { label: "いいえ", value: false },
      ],
      isCooking: [
        { label: "はい", value: true },
        { label: "いいえ", value: false },
      ],
      isSunnyList: [
        { label: "晴れ", value: true },
        { label: "雨", value: false },
      ],
      itemsAvailable: [
        { label: "使用", value: true },
        { label: "使用しない", value: false },
      ],
      photoAvailable: [
        { label: "許可", value: true },
        { label: "許可しない", value: false },
      ],
      loudAble: [
        { label: "出す", value: true },
        { label: "出さない", value: false },
      ],
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

    const fes_dates =
    process.env.VUE_APP_URL + "/api/v1/get_fes_dates";
    axios
      .get(fes_dates, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.fes_dates = response.data;
      });

    const placeUrl = process.env.VUE_APP_URL + "/places";
    axios
      .get(placeUrl, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(
        (response) => {
          this.placeList = response.data.data;
        },
        (error) => {
          console.error(error);
          return error;
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

    const itemurl = process.env.VUE_APP_URL + "/rental_items";
    axios
      .get(itemurl, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.itemList = response.data.data;
      });

    axios
      .get(process.env.VUE_APP_URL + "/shops", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        this.shops = response.data.data;
      });
  },
};
</script>

<style scoped>
  #app{
    margin: 1%;
  }
  h1{
    color: black;
    text-align: left;
  }
  p{
    display: inline-block;
    font-size: 30px;
    margin: 0;
    padding: 0% 0% 0% 10%;
  }
  input{
    outline:solid 1px #242424;
  }
  select{
    outline:solid 1px #242424;
    border-radius: 7px;
  }
  .card {
    padding: 1%;
    background: #fff;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgb(87, 77, 77);
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
    background:linear-gradient(transparent 70%, #FFFF00 0%);
  }

  #tab2:checked~.tab_lab2 {
    color: #242424;
    background:linear-gradient(transparent 70%, #FFFF00 0%);
  }

  #tab3:checked~.tab_lab3 {
    color: #242424;
    background:linear-gradient(transparent 70%, #FFFF00 0%);
  }

  #tab4:checked~.tab_lab4 {
    color: #242424;
    background:linear-gradient(transparent 70%, #FFFF00 0%);
  }

  #tab5:checked~.tab_lab5 {
    color: #242424;
    background:linear-gradient(transparent 70%, #FFFF00 0%);
  }

  #tab6:checked~.tab_lab6 {
    color: #242424;
    background:linear-gradient(transparent 70%, #FFFF00 0%);
  }

  #tab7:checked~.tab_lab7 {
    color: #242424;
    background:linear-gradient(transparent 70%, #FFFF00 0%);
  }

  #tab8:checked~.tab_lab8 {
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

  .tab_lab1, .tab_lab2, .tab_lab3, .tab_lab4, .tab_lab5, .tab_lab6 ,.tab_lab7, .tab_lab8{
    padding-left: 1%;
    padding-right: 1%;
  }
  .tab_wrap{
    margin: 1%;
  }
</style>