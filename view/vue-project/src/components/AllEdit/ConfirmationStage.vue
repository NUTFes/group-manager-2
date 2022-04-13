<template>
  <div>
    <div id="card">
      <h3>登録情報</h3>
        <div v-for="lists in regist" :key="lists.group.id">
          <div v-for="list in lists.stage_orders" :key="list.id">
            <h4>開催年度：{{list.stage_order.year}}</h4>
            <h4>開催日時：{{list.stage_order.date}}</h4>
            <h4>開催曜日：{{list.stage_order.day}}</h4>
            <h4>天気：{{list.stage_order.is_sunny}}</h4>
            <h4>第一希望：{{list.stage_order.stage_first}}</h4>
            <h4>第二希望：{{list.stage_order.stage_second}}</h4>
            <h4>準備時間：{{list.stage_order.prepare_time_interval}}</h4>
            <h4>演技時間：{{list.stage_order.use_time_interval}}</h4>
            <h4>撤去時間：{{list.stage_order.cleanup_time_interval}}</h4>
            <h4>準備時刻：{{list.stage_order.prepare_start_time}}</h4>
            <h4>開始時刻：{{list.stage_order.performance_start_time}}</h4>
            <h4>終了時刻：{{list.stage_order.performance_end_time}}</h4>
            <h4>撤去時刻：{{list.stage_order.cleanup_end_time}}</h4>
            <div style="display:flex;">
              <button id="btn" type="button" onclick="document.getElementById('editStage').show()">編集する</button>
              <button id="btn" type="button" onclick="document.getElementById('editStage').show()">削除する</button>
            </div>
            <dialog id="editStage" style="margin-left:30%; margin-right:30%; width:40%;">
              <EditStage />
            </dialog>
            <br />
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import EditStage from "@/components/AllEdit/EditStage.vue";
export default {
  components: {
    EditStage,
  },
  props: {
    regist: String,
  },
};
</script>

<style scoped>
  #card{
    margin-right: 15%;
    margin-left: 15%;
  }
  #btn{
    background: #032030;
    color: white;
    font-size: 15px;
    font-weight: bold;
    cursor: pointer;
    width: 80px;
    height: 30px;
    display: block;
    margin: 1% auto 1% auto;
  }
  #btn:hover {
    box-shadow: -2px -2px 5px #FFF, 2px 2px 5px #BABECC;
    background-image: linear-gradient(90deg, rgba(247, 93, 139, 1), rgba(254, 220, 64, 1));
    border: white;
  }
  #btn:active{
    box-shadow: inset 1px 1px 2px #BABECC, inset -1px -1px 2px #FFF;
  }
</style>