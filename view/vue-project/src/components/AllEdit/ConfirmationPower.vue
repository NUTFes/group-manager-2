<template>
  <div>
    <div id="card">
      <h3>登録情報</h3>
        <div v-for="lists in regist" :key="lists.group.id">
          <div v-for="list in lists.power_orders" :key="list.id">
            <h4>申請物品：{{list.power_order.item}}</h4>
            <h4>最大定格電力：{{list.power_order.power}}</h4>
            <h4>メーカー：{{list.power_order.manufacturer}}</h4>
            <h4>モデル：{{list.power_order.model}}</h4>
            <h4>URL：{{list.power_order.item_url}}</h4>
            <div style="display:flex;">
              <button id="btn" type="button" @click="editPowerDisplay=true">編集する</button>
              <button id="btn" type="button" v-on:click="$emit('closeEditPower')">削除する</button>
            </div>
            <dialog id="editPower" style="margin-left:30%; margin-right:30%; width:40%;">
              <EditPower
                v-if="editPowerDisplay"
                :regist="regist"
                :id="list.power_order.id"
                :item="list.power_order.item"
                :power="list.power_order.power"
                :manufacturer="list.power_order.manufacturer"
                :model="list.power_order.model"
                :url="list.power_order.item_url"
                @closeEditPower="closeEditPower"
              />
            </dialog>
            <dialog id="deletePower" style="margin-left:30%; margin-right:30%; width:40%; border-color: red;">
              <h2 style="text-align:center;">登録情報の削除</h2>
              <div style="display:flex; padding:1%; margin:5%;">
                <button id="btn" type="button" onclick="delete">削除する</button>
                <button id="btn" type="button" onclick="document.getElementById('deletePower').close()">閉じる</button>
              </div>
            </dialog>
            <br />
          </div>
        </div>
    </div>
  </div>
</template>

<script>

import EditPower from "@/components/AllEdit/EditPower.vue";
export default {
  components: {
    EditPower
  },
  props: {
    regist: String,
  },
  data() {
    return {
      editPowerDisplay: false,
    };
  },
  methods: {
    closeAddPower: function () {
      this.editPowerDisplay=false
    },
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