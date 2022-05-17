<template>
  <body id="font">
    <div>
      <div class="card">
        <span class="red"/>
        <div class="choice">
          <div>
            <h6>名前</h6>
          </div>
          <div>
            {{ regist.name }}
          </div>
        </div>
        <span class="line"/>
        <div class="area">
          <div><h6>所属</h6></div>
          <div>{{ regist.department }}</div>
          <div>{{ regist.grade }}</div>
          <div>{{ regist.student_id }}</div>
        </div>
        <div class="ps">
          <h4>詳細情報</h4>
          <div>{{ regist.email }}</div>
          <div>{{ regist.tel }}</div>
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
  position: absolute;
  top: 10px;
  left: 39px;
  font-weight: 300;
  font-size: 20px;
  letter-spacing: 0.1em;
  color: #333333;
  padding: 0 auto;
}
.line{
  position: absolute;
  left: 189px;
  display: inline-block;
  width: 1px;
  height: 95.5px;
  background: #333333;
}
.area{
  position: absolute;
  top: 10px;
  left: 219px;
  font-weight: 300;
  font-size: 20px;
  letter-spacing: 0.1em;
  color: #333333;
}
.ps{
  position: absolute;
  top: 10px;
  left: 520px;
  font-weight: 300;
  font-size: 15px;
  line-height: 30px;
  letter-spacing: 0.1em;
  color: #333333;
}
.button{
  position: absolute;
  left: 860px;
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
</style>