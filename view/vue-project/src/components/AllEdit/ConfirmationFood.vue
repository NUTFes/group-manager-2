<template>
  <div>
    <div id="card">
      <h3>登録情報</h3>
        <div v-for="lists in regist" :key="lists.group.id">
          <div v-for="list in lists.food_products" :key="list.id">
            <h4>食品：{{list.food_product.name}}</h4>
            <h4>料理の有無：{{list.food_product.is_cooking}}</h4>
            <h4>1日目の販売個数：{{list.food_product.first_day_num}}</h4>
            <h4>2日目の販売個数：{{list.food_product.second_day_num}}</h4>
            <div style="display:flex;">
              <button id="btn" type="button" onclick="document.getElementById('editFood').show()">編集する</button>
              <button id="btn" type="button" onclick="document.getElementById('editFood').close()">削除する</button>
            </div>
            <dialog id="editFood" style="margin-left:30%; margin-right:30%; width:40%;">
              <EditFood />
            </dialog>
            <br />
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import EditFood from "@/components/AllEdit/EditFood.vue";
export default {
  components: {
    EditFood,
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