<template>
  <body id="font">
    <div class="card">
      <span class="red" />
      <div class="number">
        No.{{ studentId }}
      </div>
      <div v-if="setting" class="button">
        <button class="button1" @click="openEditEmployee">
          <div class="edit">編集</div>
        </button>
        <button class="button2" @click="openDeleteEmployee">
          <div class="edit">削除</div>
        </button>
      </div>
      <div class="name">{{ name }}</div>
      <EditEmployee
        v-if="editEmployeeDisplay"
        @closeEditEmployee="closeEditEmployee"
        :groupId="groupId"
        :id="id"
        :name="name"
        :studentId="studentId"
        :stoolTestId="stoolTestId"
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
    groupId: Number,
    id: Number,
    name: String,
    studentId: Number,
    stoolTestId: Number,
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
  width: 380px;
  height: 200px;
  margin: 5px;
  background: #fff;
  box-shadow: 0px 4px 10px 1px rgba(0, 0, 0, 0.25);
}
.red {
  position: absolute;
  width: 18px;
  height: 200px;
  left: 0;
  background: #f71e35;
}
.number {
  position: relative;
  top: 2%;
  font-weight: 300;
  font-size: 24px;
  letter-spacing: 0.1em;
  line-height: 34.75px;
  left: 25px;
}
.name {
  padding: 25% 0 0 5%;
  text-align: center;
  font-weight: 300;
  font-size: 32px;
  letter-spacing: 0.1em;
  bottom: 20px;
  left: 25px;
  overflow: auto;
}
.button {
  position: absolute;
  right: 12.97px;
  top: 8.74px;
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
  margin: auto;
  font-weight: 350;
  font-size: 18px;
  line-height: 26px;
  letter-spacing: 0.3em;
  color: #ffffff;
}
</style>
