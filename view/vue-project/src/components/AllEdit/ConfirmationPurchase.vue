<template>
  <div>
    <div id="card">
      <h3>登録情報</h3>
        <div v-for="lists in regist" :key="lists.group.id">
          <div v-for="list in lists.food_products" :key="list.id">
            <div v-for="part in list.purchase_lists" :key="part.id">
              <h4>対象商品：{{part.purchase_list.food_product}}</h4>
              <h4>購入品：{{part.purchase_list.items}}</h4>
              <h4>生鮮食品：{{part.purchase_list.is_fresh}}</h4>
              <h4>購入場所：{{part.purchase_list.shop}}</h4>
              <div style="display:flex;">
                <button id="btn" type="button" onclick="document.getElementById('editPurchase').show()">編集する</button>
                <button id="btn" type="button" onclick="document.getElementById('editPurchase').close()">削除する</button>
              </div>
              <dialog id="editPurchase" style="margin-left:30%; margin-right:30%; width:40%;">
                <EditPurchase />
              </dialog>
              <br />
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import EditPurchase from "@/components/AllEdit/EditPurchase.vue";
export default {
  components: {
    EditPurchase,
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