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