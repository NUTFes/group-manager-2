<template>
  <div>
    <div id="card">
      <h3>登録情報</h3>
        <div v-for="lists in regist" :key="lists.group.id">
          {{lists.stage_common_option}}
          <div style="display:flex;">
              <button id="btn" type="button" onclick="document.getElementById('editOption').show()">編集する</button>
              <button id="btn" type="button" onclick="document.getElementById('editOption').close()">削除する</button>
            </div>
            <dialog id="editOption" style="margin-left:30%; margin-right:30%; width:40%;">
              <EditOption />
            </dialog>
          <br />
        </div>
    </div>
  </div>
</template>

<script>
import EditOption from "@/components/AllEdit/EditOption.vue";
export default {
  components: {
    EditOption,
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