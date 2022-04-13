<template>
  <div>
    <div id="card">
      <h3>登録情報</h3>
        <div v-for="lists in regist" :key="lists.group.id">
          <div v-for="list in lists.employees" :key="list.id">
            <h4>氏名：{{list.employee.name}}</h4>
            <h4>学籍番号：{{list.employee.student_id}}</h4>
            <div style="display:flex;">
              <button id="btn" type="button" onclick="document.getElementById('editEmployee').show()">編集する</button>
              <button id="btn" type="button" onclick="document.getElementById('editEmployee').close()">削除する</button>
            </div>
            <dialog id="editEmployee" style="margin-left:30%; margin-right:30%; width:40%;">
              <EditEmployee />
            </dialog>
            <br />
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import EditEmployee from "@/components/AllEdit/EditEmployee.vue";
export default {
  components: {
    EditEmployee,
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
    margin: 3% auto 3% auto;
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