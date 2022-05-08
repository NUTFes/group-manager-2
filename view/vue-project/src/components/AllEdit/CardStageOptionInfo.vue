<template>
  <body id="font">
    <div>
      <div class="card">
        <span class="red" />
        <div class="devices">
          <div class="upper">機器▾</div>
          <div class="lower">使用</div>
        </div>
        <span class="line" />
        <div class="music">
          <div class="upper">音楽▾</div>
          <div class="lower">使用</div>
        </div>
        <span class="line" />
        <div class="permission">
          <div class="upper">撮影▾</div>
          <div class="lower">許可</div>
        </div>
        <span class="line" />
        <div class="loud_voice">
          <div class="upper">騒音</div>
          <div class="lower">有</div>
        </div>
        <span class="line" />
        <div class="content">
            <div class="upper">ステージ内容▾</div>
            <div class="performance">
              {{regist}}
            </div>
        </div>
        <div class="button">
          <button class="edit" @click="openEditOption">編集</button>
          <button class="delete">削除</button>
        </div>
        <EditOption
          v-if="editOptionisplay"
          @closeEditOption="closeEditOption"
        />
      </div>
    </div>
  </body>
</template>

<script>
import EditOption from "@/components/AllEdit/EditOption.vue";
export default {
  components: {
    EditOption
  },
  props: {
    regist: String,
  },
  data() {
    return {
      editOptionisplay: false,
    };
  },

  methods: {
    openEditOption: function () {
      this.editOptionisplay = true;
    },
    closeEditOption: function () {
      this.editOptionisplay = false;
    },
  },
};
</script>

<style scoped>
#font {
  font-family: 'Noto Sans JP';
  font-style: normal;
}
.card {
  display: flex;
  align-items: center;
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
.devices {
  width: 80px;
  align-items: center;
  font-family: 'Noto Sans JP';
  margin-left: 25px;
  margin-right: 20px;
  font-style: normal;
  font-weight: 300;
  line-height: 43px;
  letter-spacing: 0.1em;
  color: #333333;
}
.upper {
  margin-top: 10px;
  font-size: 18px;
}
.lower {
  font-size: 35px;
  margin: center;
  text-align:center;
}
.line {
  display: inline-block;
  width: 1px;
  height: 95.5px;
  margin-top: 29px;
  background: #333333;
}
.music {
  width: 80px;
  align-items: center;
  font-family: 'Noto Sans JP';
  margin-left: 20px;
  margin-right: 20px;
  font-style: normal;
  font-weight: 300;
  line-height: 43px;
  letter-spacing: 0.1em;
  color: #333333;
}
.permission {
  width: 80px;
  align-items: center;
  font-family: 'Noto Sans JP';
  margin-left: 15px;
  margin-right: 15px;
  font-style: normal;
  font-weight: 300;
  line-height: 43px;
  letter-spacing: 0.1em;
  color: #333333;
}
.loud_voice {
  width: 50px;
  align-items: center;
  font-family: 'Noto Sans JP';
  margin-left: 15px;
  margin-right: 15px;
  font-style: normal;
  font-weight: 300;
  line-height: 43px;
  letter-spacing: 0.1em;
  color: #333333;
}
.content {
  align-items: center;
  font-family: 'Noto Sans JP';
  margin-left: 15px;
  margin-right: 15px;
  font-style: normal;
  font-weight: 300;
  font-size: 20px;
  line-height: 43px;
  letter-spacing: 0.1em;
  color: #333333;
}
.performance {
  font-size: 30px;
}
.button {
  width: 120px;
  height: 80px;
  margin-top: 5px;
  border-radius: 5px;
  text-align: center;
}
.edit {
  font-weight: 350;
  font-size: 18px;
  line-height: 30px;
  letter-spacing: 0.3em;
  background: #62a7ff;
  color: #ffffff;
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
  margin: 0.5rem;
  padding: 0 1rem;
}
</style> 