<template>
  <body id="font">
    <div>
      <div class="card">
        <span class="red" />
        <div class="date">{{ date }}</div>
        <span class="line" />
        <div class="weather">{{ isSunny? "晴" : "雨" }}</div>
        <span class="line" />
        <div class="stage">
          <div class="first">第1希望‣ {{ firstStage }} </div> 
          <div class="second">第2希望‣ {{ secondStage }} </div>
        </div>
        <div class="button">
          <button class="edit" @click="openEditStage">編集</button>
          <button class="delete">削除</button>
        </div>
      </div>
      <EditStage
        v-if="editStageisplay"
        @closeEditStage="closeEditStage"
      />
    </div>
  </body>
</template>

<script>
import EditStage from "@/components/AllEdit/EditStage.vue";
export default {
  components: {
    EditStage
  },
  props: {
    firstStage: String,
    secondStage: String,
    date: String,
    isSunny: Boolean,
  },
  data() {
    return {
      editStageisplay: false,
    };
  },
  methods: {
    openEditStage: function () {
      this.editStageisplay = true;
    },
    closeEditStage: function () {
      this.editStageisplay = false;
    },
  },
};
</script>

<style scoped>
#font {
  font-family: "Noto Sans JP";
  font-style: normal;
}
.card {
  display: flex;
  align-items: center;
  margin: 3%;
  position: relative;
  width: 1026px;
  height: 149px;
  margin-left: 9.12%;
  background: #fff;
  box-shadow: 0px 4px 10px 1px rgba(0, 0, 0, 0.25);
}
.red {
  position: absolute;
  left: 0;
  display: inline-block;
  width: 18px;
  height: 100%;
  background: #f71e35;
}
.date {
  display: flex;
  align-items: center;
  margin-left: 30px;
  margin-right: 25px;
  font-style: normal;
  font-weight: 300;
  font-size: 56px;
  line-height: 43px;
  letter-spacing: 0.1em;
  color: #333333;
}
.line {
  display: inline-block;
  width: 1px;
  height: 95.5px;
  background: #333333;
}
.weather {
  display: flex;
  margin-left: 20px;
  margin-right: 20px;
  font-weight: 300;
  font-size: 56px;
  line-height: 80px;
  letter-spacing: 0.1em;
  color: #333333;
}
.stage {
  width: 460px;
  margin-right: 27px;
  margin-left: 27px;
  font-weight: 300;
  font-size: 25px;
  line-height: 26px;
  letter-spacing: 0.1em;
  text-align: center;
  color: #333333;
}
.first { 
  text-align: left;
}
.second {
  margin-top: 15px;
  text-align: left;
}
.button {
  width: 126px;
  height: 80px;
  margin-top: 5px;
  margin-left: 18px;
}
.edit {
  font-weight: 350;
  font-size: 18px;
  line-height: 30px;
  letter-spacing: 0.3em;
  background: #62a7ff;
  color: #ffffff;
  border-radius: 5px;
  margin: 0.5rem;
  padding: 0 1rem;
}
.delete{
  font-weight: 350;
  font-size: 18px;
  line-height: 30px;
  letter-spacing: 0.3em;
  background: #ff6262;
  color: #ffffff;
  border-radius: 5px;
  margin: 0.5rem;
  padding: 0 1rem;
}
</style>  