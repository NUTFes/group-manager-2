<template>
  <body id="font">
    <div>
      <div class="card">
        <span class="red" />
        <div class="device">
          <div class="upper">機器▾</div>
          <div class="lower">{{ ownEquipment ? "使用" : "不使用" }}</div>
        </div>
        <span class="line" />
        <div class="music">
          <div class="upper">音楽▾</div>
          <div class="lower">{{ bgm ? "使用" : "不使用" }}</div>
        </div>
        <span class="line" />
        <div class="permission">
          <div class="upper">撮影▾</div>
          <div class="lower">{{ cameraPermission ? "許可" : "禁止" }}</div>
        </div>
        <span class="line" />
        <div class="loud_sound">
          <div class="upper">騒音</div>
          <div class="lower">{{ loudSound ? "有" : "無" }}</div>
        </div>
        <span class="line" />
        <div class="content">
          <div class="upper">ステージ内容▾</div>
          <div class="performance">{{ stageContent }}</div>
        </div>
        <div v-if="setting" class="button">
          <button class="edit" @click="openEditOption">編集</button>
        </div>
        <EditOption
          v-if="editOptionDisplay"
          :groupId="groupId"
          :id="id"
          :ownEquipment="ownEquipment"
          :bgm="bgm"
          :cameraPermission="cameraPermission"
          :loudSound="loudSound"
          :stageContent="stageContent"
          @closeEditOption="closeEditOption"
          @reload="reload"
        />
      </div>
    </div>
  </body>
</template>

<script>
import EditOption from "@/components/AllEdit/EditOption.vue";
export default {
  components: {
    EditOption,
  },
  props: {
    groupId: Number,
    id: Number,
    ownEquipment: Boolean,
    bgm: Boolean,
    cameraPermission: Boolean,
    loudSound: Boolean,
    stageContent: String,
    setting: Boolean,
  },
  data() {
    return {
      editOptionDisplay: false,
    };
  },

  methods: {
    openEditOption: function () {
      this.editOptionDisplay = true;
    },
    closeEditOption: function () {
      this.editOptionDisplay = false;
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
.device {
  width: 120px;
  height: 95.5px;
  align-items: center;
  font-family: "Noto Sans JP";
  margin-left: 25px;
  margin-right: 20px;
  font-style: normal;
  font-weight: 300;
  letter-spacing: 0.1em;
  color: #333333;
}
.upper {
  font-size: 18px;
}
.lower {
  font-size: 35px;
  margin: center;
  text-align: center;
}
.line {
  display: inline-block;
  width: 1px;
  height: 95.5px;
  background: #333333;
}
.music {
  width: 120px;
  height: 95.5px;
  align-items: center;
  font-family: "Noto Sans JP";
  margin-left: 20px;
  margin-right: 20px;
  font-style: normal;
  font-weight: 300;
  letter-spacing: 0.1em;
  color: #333333;
}
.permission {
  width: 80px;
  height: 95.5px;
  align-items: center;
  font-family: "Noto Sans JP";
  margin-left: 15px;
  margin-right: 15px;
  font-style: normal;
  font-weight: 300;
  letter-spacing: 0.1em;
  color: #333333;
}
.loud_sound {
  width: 50px;
  height: 95.5px;
  align-items: center;
  font-family: "Noto Sans JP";
  margin-left: 15px;
  margin-right: 15px;
  font-style: normal;
  font-weight: 300;
  letter-spacing: 0.1em;
  color: #333333;
}
.content {
  width: 350px;
  height: 95.5px;
  align-items: center;
  font-family: "Noto Sans JP";
  margin-left: 15px;
  margin-right: 15px;
  font-style: normal;
  font-weight: 300;
  font-size: 21px;
  letter-spacing: 0.1em;
  overflow-wrap: break-word;
  color: #333333;
}
.performance {
  width: 100%;
  height: 100%;
  margin: auto auto;
  overflow: auto;
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
