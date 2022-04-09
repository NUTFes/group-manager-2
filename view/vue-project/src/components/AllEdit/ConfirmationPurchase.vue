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
              <br />
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
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
</style>