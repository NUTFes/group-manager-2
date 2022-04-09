<template>
  <div>
    <div id="card">
      <h3>登録情報</h3>
        <div v-for="lists in regist" :key="lists.group.id">
          {{lists.place_order}}
          <!-- <div v-for="list in lists.place_order" :key="list.id">
            {{list}}
          </div> -->
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