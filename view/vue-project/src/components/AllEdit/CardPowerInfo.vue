<template>
  <body id="font">
    <div class="card">
      <span class="red"/>
      <div class="product">
        {{item}}
      </div>
      <span class="span1"/>
      <button class="button1">
      </button>
      <span class="span2"/>
      <span class="line"/>
      <div class="power">
        <div class="number">{{power}}</div>
        <div class="watt">[W]</div>
      </div>
      <span class="line"/>
      <div>
        <div class="detail">
          <div class="character1">メーカー</div><canvas class="triangle"/><div class="character2">{{manufacturer}}</div>
        </div>
        <div class="detail">
          <div class="character1">型番</div><canvas class="triangle"/><div class="character2">{{model}}</div>
        </div>
      </div>
      <span class="span3"/>
      <div class="column">
        <button class="button2" @click="openEditPower">
          <div class="edit">編集</div>
        </button>
        <button class="button3" @click="openDeletePower">
          <div class="edit">削除</div>
        </button>
      </div>
      <EditPower
        v-if="editPowerDisplay"
        @closeEditPower="closeEditPower"
        :groupId="groupId"
        :id="id"
        :item="item"
        :power="power"
        :manufacturer="manufacturer"
        :model="model"
        :url="url"
      />
      <DeletePower
        v-if="deletePowerDisplay"
        :id="id"
        @closeDeletePower="closeDeletePower"
      />
    </div>
  </body>
</template>

<script>
import EditPower from "@/components/AllEdit/EditPower.vue";
import DeletePower from "@/components/AllEdit/DeletePower.vue";
export default {
  components: {
    EditPower,
    DeletePower
  },
  props: {
    groupId: Number,
    id: Number,
    item: String,
    power: Number,
    manufacturer: String,
    model: String,
    url: String
  },
  data() {
    return {
      editPowerDisplay: false,
      deletePowerDisplay: false,
    };
  },
  methods: {
    openEditPower: function () {
      this.editPowerDisplay = true;
    },
    closeEditPower: function () {
      this.editPowerDisplay = false;
    },
    openDeletePower: function () {
      this.deletePowerDisplay = true;
    },
    closeDeletePower: function () {
      this.deletePowerDisplay = false;
    },
  },
};
</script>

<style scoped>
#font1{
  font-family: 'Noto Sans JP';
  font-style: normal;
}
.card {
  display: flex;
  align-items: center;
  width: 1079px;
  height: 149px;
  margin-left: 9.12%;
  background: #fff;
  box-shadow: 0px 4px 10px 1px rgba(0, 0, 0, 0.25);
}
.red{
  width: 18px;
  height: 149px;
  background: #F71E35;
}
.product{
  white-space: nowrap;
  font-weight: 300;
  font-size: 48px;
  line-height: 70px;
  letter-spacing: 0.1em;
  margin-left: 22px;
}
.span1{
  width: 5px;
}
.button1{
  width: 60px;
  height: 60px;
  background: #FFFFFF;
  border: 1px solid rgba(236, 236, 236, 0.63);
  box-shadow: 2px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius:100%;
}
.span2{
width: 21px;
}
.line{
  display: inline-block;
  width: 1px;
  height: 95.5px;
  background: #333333;
}
.power{
  display: flex;
  justify-content: end;
  margin: 14px;
  width: 165px;
}
.number{
  font-weight: 300;
  font-size: 64px;
  line-height: 93px;
  letter-spacing: 0.1em;
  color: #000000;
}
.watt{
  margin-top: 50px;
  font-weight: 300;
  font-size: 18px;
  line-height: 26px;
  letter-spacing: 0.1em;
  color: #000000;
}
.detail{
  display: flex;
  align-items: center;
  margin-left: 15px;
  margin-bottom: 18px;
}
.triangle{
  width: 0;
	height: 0;
  margin: 6px;
	border: 5px solid transparent;
	border-left: 7px solid #333333;
}
.character1{
  width: 81px;
  height: 26px;
  font-weight: 300;
  font-size: 18px;
  line-height: 26px;
  text-align: center;
  letter-spacing: 0.1em;
  color: #000000;
}
.character2{
  font-weight: 300;
  font-size: 18px;
  line-height: 26px;
  letter-spacing: 0.1em;
  color: #000000;
}
.span3{
  width: 50px;
}
.column{
  flex-flow: column;
  align-items: center;
}
.button2{
  display: flex;
  width: 131px;
  height: 39px;
  margin: 9.5px;
  background: #62A7FF;
  border-radius: 5px;
}
.button3{
  display: flex;
  width: 131px;
  height: 39px;
  margin: 9.5px;
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