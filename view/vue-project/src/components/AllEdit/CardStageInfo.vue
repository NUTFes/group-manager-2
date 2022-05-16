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
        </div>
      </div>
      <EditStage
        v-if="editStageDisplay"
        :groupId="groupId"
        :id="regist.id"
        :stageDateId="regist.fes_date_id"
        :isSunny="regist.is_sunny"
        :stageFirst="regist.stage_first"
        :stageSecond="regist.stage_second"
        :useTimeInterval="regist.use_time_interval"
        :prepareTimeInterval="regist.prepare_time_interval"
        :cleanupTimeInterval="regist.cleanup_time_interval"
        :prepareStartTime="regist.prepare_start_time"
        :performanceStartTime="regist.performance_start_time"
        :performanceEndTime="regist.performance_end_time"
        :cleanupEndTime="regist.cleanup_end_time"
        @closeEditStage="closeEditStage"
        @reload="reload"
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
    groupId: Number,
    regist: String,
    firstStage: String,
    secondStage: String,
    date: String,
    isSunny: Boolean,
  },
  data() {
    return {
      editStageDisplay: false,
    };
  },
  methods: {
    openEditStage: function () {
      this.editStageDisplay = true;
    },
    closeEditStage: function () {
      this.editStageDisplay = false;
    },
    reload: function () {
      this.$emit("reload");
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
  margin-top: 3%;
  position: relative;
  width: 1026px;
  height: 149px;
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
  margin-top: auto;
  margin-bottom: auto;
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
</style>  