<template>
  <body id="font">
    <div>
      <div class="card">
        <span class="red"/>
        <div class="choice">
          第{{ n }}希望
        </div>
        <span class="line"/>
        <div class="area">
          {{ place }}
        </div>
        <div class="ps">
          追記：
        </div>
        <div class="scroll">
          <div class="notes">
            {{ remark }}
          </div>
        </div>
        <div class="button"> 
          <button class="edit" @click="openEditPlace">編集</button>
        </div>
      </div>
      <EditPlace
        v-if="editPlaceDisplay"
        :placeOrderId="placeOrderId"
        :first="regist.first"
        :second="regist.second"
        :third="regist.third"
        :remark="remark"
        @closeEditPlace="closeEditPlace"
        @reload="reload"
      />
    </div>
  </body>
</template>

<script>
import EditPlace from "@/components/AllEdit/EditPlace.vue";
export default {
  components: {
    EditPlace
  },
  props: {
    regist: String,
    placeOrderId: Number,
    n: Number,
    place: String,
    remark: String,
  },
  data() {
    return {
      editPlaceDisplay: false,
    };
  },
  methods: {
    openEditPlace: function () {
      this.editPlaceDisplay = true;
    },
    closeEditPlace: function () {
      this.editPlaceDisplay = false;
    },
    reload: function () {
      this.$emit("reload");
    },
  },
};
</script>

<style scoped>
.card {
  display: flex;
  align-items: center;
  position: relative;
  margin-top: 3%;
  width: 1026px;
  height: 149px;
  background: #fff;
  box-shadow: 0px 4px 10px 1px rgba(0, 0, 0, 0.25);
}
.red{
  position: absolute;
  left: 0;
  display: inline-block;
  width: 18px;
  height: 100%;
  background: #F71E35;
}
.choice{
  width: 120px;
  height: 100%;
  align-items: top;
  margin-top: 5%;
  margin-left: 3%;
  margin-right: 3%;
  font-weight: 300;
  font-size: 30px;
  line-height: 43px;
  letter-spacing: 0.1em;
  color: #333333;
}
.line{
  display: inline-block;
  width: 1px;
  height: 95.5px;
  background: #333333;
}
.area{
  display: flex;
  width: 40%;
  height: 100%;
  align-items: center;
  margin-left: 20px;
  margin-right: 20px;
  font-style: normal;
  font-size: 34px;
  font-weight: 300;
  letter-spacing: 0.1em;
  color: #333333;
  white-space: nowrap;
  overflow: auto;
}
.ps{
  width: 7%;
  height: 100%;
  align-items: top;
  margin-top: 5%;
  font-weight: 300;
  font-size: 18px;
  line-height: 26px;
  letter-spacing: 0.1em;
  color: #333333;
}
.scroll {
  width: 18%;
  height: 100%;
  margin-top: 5%;
  padding-bottom: 3%;
  font-weight: 300;
  font-size: 18px;
  line-height: 26px;
  letter-spacing: 0.1em;
  overflow-wrap: break-word;
  color: #333333;
}
.notes{
  width: 100%;
  height: 100%;
  overflow: auto;
}
.button{
  width: 10%;
  height: 24%;
  margin-top: auto; 
  margin-bottom: auto;
  background: #62A7FF;
  border-radius: 5px;
}
.edit{
  font-weight: 350;
  font-size: 18px;
  letter-spacing: 0.3em;
  line-height: 30px;
  color: #ffffff;
  margin: 0.5rem;
  padding: 0 1rem;
}
</style>