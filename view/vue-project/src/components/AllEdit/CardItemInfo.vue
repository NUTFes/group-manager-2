<template>
  <body id="font">
      <div class="card">
        <span class="red" />
        <div class="item">
          {{name}}
        </div>
        <p class="box">
          <span class="number">
          {{num}}
          </span>
          <span class="pieces">
            個
          </span>
        </p>
        <div class="button">
          <button class="button1" @click="openEditItem">
            <div class="edit">編集</div>
          </button>
          <button class="button2" @click="openDeleteItem">
            <div class="edit">削除</div>
          </button>
        </div>
        <EditItem
          v-if="editItemisplay"
          @closeEditItem="closeEditItem"
        />
        <DeleteItem
          v-if="deleteItemisplay"
          @closeDeleteItem="closeDeleteItem"
        />
      </div>
  </body>
</template>

<script>
import EditItem from "@/components/AllEdit/EditItem.vue";
import DeleteItem from "@/components/AllEdit/DeleteItem.vue";
export default {
  components: {
    EditItem,
    DeleteItem
  },
  props: {
    name: String,
    num: Number,
  },
  data() {
    return {
      editItemisplay: false,
      deleteItemisplay: false,
    };
  },
  methods: {
    openEditItem: function () {
      this.editItemisplay = true;
    },
    closeEditItem: function () {
      this.editItemisplay = false;
    },
    openDeleteItem: function () {
      this.deleteItemisplay = true;
    },
    closeDeleteItem: function () {
      this.deleteItemisplay = false;
    },
  },
};
</script>

<style scoped>
.card {
  position: relative;
  width: 394px;
  height: 239px;
  margin: 5px;
  background: #fff;
  box-shadow: 0px 4px 10px 1px rgba(0, 0, 0, 0.25);
}
.red{
  position: absolute;
  width: 18px;
  height: 239px;
  left: 0;
  background: #F71E35;
}
.item{
  position: absolute;
  width: 347px;
  height: 72px;
  top: 32px;
  right: 19px;
  margin: auto;
  font-weight: 350;
  font-size: 36px;
  line-height: 52px;
  text-align: center;
}
.box{
  display: flex;
  justify-content: end;
  align-items: end;
  position: absolute;
  height: 74px;
  width: 126px;
  bottom: 15px;
  left: 52px;
}
.number{
  font-weight: 350;
  font-size: 48px;
  letter-spacing: 0.1em;
  line-height: 34.75px;
  
}
.pieces{
  font-weight: 350;
  font-size: 24px;
  letter-spacing: 0.1em;
  line-height: 19px;
}
.button{
  position: absolute;
  right: 12.97px;
  bottom: 8.74px;
}
.button1{
  display: flex;
  width: 126.77px;
  height: 37.74px;
  margin: 6.26px;
  background: #62A7FF;
  border-radius: 5px;
}
.button2{
  display: flex;
  width: 126.77px;
  height: 37.74px;
  margin: 6.26px;
  background: #FF6262;
  border-radius: 5px;
}
.edit{
  margin-top: 5px;
  margin-left: 14px;
  font-weight: 350;
  font-size: 18px;
  line-height: 26px;
  letter-spacing: 0.3em;
  color: #FFFFFF;
}
</style>