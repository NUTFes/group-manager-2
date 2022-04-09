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
            <br />
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