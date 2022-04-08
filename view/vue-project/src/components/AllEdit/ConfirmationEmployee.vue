<template>
  <div>
    <div id="card">
      <h3>登録情報</h3>
        <div v-for="lists in regist" :key="lists.group.id">
          <div v-for="list in lists.employees" :key="list.id">
            <h4>氏名：{{list.employee.name}}</h4>
            <h4>学籍番号：{{list.employee.student_id}}</h4>
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