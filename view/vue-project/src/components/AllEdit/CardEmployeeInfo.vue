<template>
  <body id="font">
    <div class="card">
      <span class="red" />
        <div class="name">
          {{ name }}
        </div>
        <p class="box">
          <span class="number">
            {{ num }}
          </span>
          <span class="student_id">学籍番号</span>
        </p>
        <div v-if="setting" class="button">
          <button class="button1" @click="openEditEmployee">
            <div class="edit">編集</div>
          </button>
          <button class="button2" @click="openDeleteEmployee">
            <div class="edit">削除</div>
          </button>
        </div>
        <EditEmployee
          v-if="editEmployeeDisplay"
          :groupId="groupId"
          :id="regist.id"
          :name="regist"
          @closeEditEmployee="closeEditEmployee"
          @reload="reload"
        />
        <DeleteEmployee
          v-if="deleteEmployeeDisplay"
          :id="id"
          @closeDeleteEmployee="closeDeleteEmployee"
          @reload="reload"
        />
      </div>
    </body>
</template>

<script>
import EditEmployee from "@/components/AllEdit/EditEmployee.vue";
import DeleteEmployee from "@/components/AllEdit/DeleteEmployee.vue";
export default {
  components: {
    EditEmployee,
    DeleteEmployee,
  },
  props: {
    groupId: String,
    regist: String,
    name: String,
    num: Number,
    setting: Boolean,
  },
  data() {
    return {
      editEmployeeDisplay: false,
      deleteEmployeeDisplay: false,
    };
  },
  methods: {
    openEditEmployee: function () {
      this.editEmployeeDisplay = true;
    },
    closeEditEmployee: function () {
      this.editEmployeeDisplay = false;
    },
    openDeleteEmployee: function () {
      this.deleteEmployeeDisplay = true;
    },
    closeDeleteEmployee: function () {
      this.deleteEmployeeDisplay = false;
    },
    reload: function () {
      this.$emit("reload");
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
.red {
  position: absolute;
  width: 18px;
  height: 239px;
  left: 0;
  background: #f71e35;
}
.item {
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
.box {
  display: flex;
  justify-content: end;
  align-items: end;
  position: absolute;
  height: 74px;
  width: 126px;
  bottom: 15px;
  left: 52px;
}
.number {
  font-weight: 350;
  font-size: 48px;
  letter-spacing: 0.1em;
  line-height: 34.75px;
}
.pieces {
  font-weight: 350;
  font-size: 24px;
  letter-spacing: 0.1em;
  line-height: 19px;
}
.button {
  position: absolute;
  right: 12.97px;
  bottom: 8.74px;
}
.button1 {
  display: flex;
  width: 126.77px;
  height: 37.74px;
  margin: 6.26px;
  background: #62a7ff;
  border-radius: 5px;
}
.button2 {
  display: flex;
  width: 126.77px;
  height: 37.74px;
  margin: 6.26px;
  background: #ff6262;
  border-radius: 5px;
}
.edit {
  margin-top: 5px;
  margin-left: 14px;
  font-weight: 350;
  font-size: 18px;
  line-height: 26px;
  letter-spacing: 0.3em;
  color: #ffffff;
}
</style>