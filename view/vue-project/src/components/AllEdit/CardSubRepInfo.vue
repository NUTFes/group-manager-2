<template>
  <body id="font">
    <div>
      <div class="card">
        <span class="red"/>
        <div class="choice">
          <div>
            <h6>名前</h6>
          </div>
          <div class="notes">
            {{ regist.name }}
          </div>
        </div>
        <div class="area">
          <div><h6>所属</h6></div>
          <div class="notes">{{ regist.department }}</div>
          <div>{{ regist.grade }}</div>
          <div>{{ regist.student_id }}</div>
        </div>
        <span class="line"/>
        <div class="ps">
          <h4>詳細情報</h4>
          <div class="notes">
            <div class="character2">{{regist.email}}</div>
            <div class="character2">{{regist.tel}}</div>
          </div>
        </div>
        <button class="button" @click="openEditSubRep">
          <div class="edit">編集</div>
        </button>
      </div>
      <EditSubRep
        v-if="editSubRepDisplay"
        :groupId="groupId"
        :name="regist.name"
        :department_id="regist.department_id"
        :grade_id="regist.grade_id"
        :tel="regist.tel"
        :email="regist.email"
        :student_id="regist.student_id"
        @closeEditSubRep="closeEditSubRep"
        @reload="reload"
      />
    </div>
  </body>
</template>

<script>
import EditSubRep from "@/components/AllEdit/EditSubRep.vue";
export default {
  components: {
    EditSubRep
  },
  props: {
    regist: String,
    groupId: Number,
  },
  data() {
    return {
      editSubRepDisplay: false,
    };
  },
  methods: {
    openEditSubRep: function () {
      this.editSubRepDisplay = true;
    },
    closeEditSubRep: function () {
      this.editSubRepDisplay = false;
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
  width: 1200px;
  height: 160px;
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
  width:250px;
  position: absolute;
  top: 10px;
  left: 40px;
  font-weight: 300;
  font-size: 20px;
  letter-spacing: 0.1em;
  color: #333333;
  padding: 0 auto;
}
.line{
  position: absolute;
  left: 320px;
  display: inline-block;
  width: 1px;
  height: 95.5px;
  background: #333333;
}
.area{
  position: absolute;
  top: 10px;
  left: 360px;
  font-weight: 300;
  font-size: 20px;
  letter-spacing: 0.1em;
  color: #333333;
}
.ps{
  position: absolute;
  top: 10px;
  width:400px;
  left: 700px;
  font-weight: 300;
  font-size: 15px;
  line-height: 30px;
  letter-spacing: 0.1em;
  color: #333333;
}
.button{
  position: absolute;
  left: 1050px;
  display: flex;
  background: #62A7FF;
  border-radius: 5px;
}
.edit{
  padding: 5px 30px;
  margin: 0 0 0.2px;
  font-weight: 350;
  font-size: 18px;
  line-height: 26px;
  letter-spacing: 0.3em;
  color: #FFFFFF;
}
.notes {
  padding-top: 10px;
  display: inline-block;
  overflow-x: auto;
  width:100%;
}
.character2 {
  width: 300px;
  margin-top: auto;
  font-weight: 300;
  font-size: 18px;
  line-height: 26px;
  letter-spacing: 0.1em;
  color: #000000;
  white-space: nowrap;
  overflow: auto;
}
</style>
