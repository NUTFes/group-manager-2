<template>
  <transition name="fade" appear>
    <div class="add-modal">
        <div class="add-modal_box">
          <div id="btnContainer">
            <button v-on:click="$emit('closeEditSubRep')">✖</button>
          </div>
          <h1>副代表申請</h1>
          <div class="entry">名前</div>
          <input type="text" v-model="name" id="name">
          <div class="entry">学科</div>
          <select v-model="department_id" @change="validationGrade" id="department_id">
              <option
                v-for="item in departments"
                :value="item.id"
                :key="item.id"
              >
                {{ item.name }}
              </option>
            </select>
          <div class="entry">学年</div>
          <select v-model="grade_id" @change="validationDepartment" id="grade_id">
            <option
              v-for="item in grades"
              :value="item.id"
              :key="item.id"
            >
              {{ item.name }}
            </option>
          </select>
          <div class="entry">電話番号</div>
          <input type="text" v-model="tel" id="tel">
          <div class="entry">メールアドレス</div>
          <input type="text" v-model="email" id="email">
          <div class="entry">学生番号</div>
          <input type="text" v-model="student_id" id="student_id">
          <span style="display:flex;">
            <button id="btn" type="button" @click="reset">リセット</button>
            <button id="btn" type="button" @click="register">✓編集</button>
          </span>
      </div>
    </div>
  </transition>
</template>

<script>
import axios from "axios";
export default {
  props: {
    groupId: Number,
    name: String,
    department_id: String,
    grade_id: String,
    tel: String,
    email: String,
    student_id: String,
  },
  data() {
    return {
      departments: [
        { name: "機械創造工学課程", id: 1 },
        { name: "電気電子情報工学課程", id: 2 },
        { name: "物質材料工学課程", id: 3 },
        { name: "環境社会基盤工学課程", id: 4 },
        { name: "生物機能工学課程", id: 5 },
        { name: "情報・経営システム工学課程", id: 6 },
        { name: "機械創造工学専攻", id: 7 },
        { name: "電気電子情報工学専攻", id: 8 },
        { name: "物質材料工学専攻", id: 9 },
        { name: "環境社会基盤工学専攻", id: 10 },
        { name: "生物機能工学専攻", id: 11 },
        { name: "情報・経営システム工学専攻", id: 12 },
        { name: "原子力システム安全工学専攻", id: 13 },
        { name: "システム安全専攻", id: 14 },
        { name: "技術科学イノベーション専攻", id: 15 },
        { name: "情報・制御工学専攻", id: 16 },
        { name: "材料工学専攻", id: 17 },
        { name: "エネルギー・環境工学専攻", id: 18 },
        { name: "生物統合工学専攻", id: 19 },
        { name: "その他", id: 20 },
      ],
      grades: [
        { name: "B1[学部1年]", id: 1 },
        { name: "B2[学部2年]", id: 2 },
        { name: "B3[学部3年]", id: 3 },
        { name: "B4[学部4年]", id: 4 },
        { name: "M1[修士1年]", id: 5 },
        { name: "M2[修士2年]", id: 6 },
        { name: "D1[博士1年]", id: 7 },
        { name: "D2[博士2年]", id: 8 },
        { name: "D3[博士3年]", id: 9 },
        { name: "GD1[イノベ1年]", id: 10 },
        { name: "GD2[イノベ2年]", id: 11 },
        { name: "GD3[イノベ3年]", id: 12 },
        { name: "GD4[イノベ4年]", id: 13 },
        { name: "GD5[イノベ5年]", id: 14 },
        { name: "その他", id: 15 },
      ],
    };
  },
  methods: {
    reset: function() {
      this.name = [],
      this.department_id = [],
      this.grade_id = [],
      this.tel = [],
      this.email = [],
      this.student_id = []
    },
    register: function () {
      const url =
      process.env.VUE_APP_URL +
      "/sub_reps" + "/" + this.groupId + "?" +
      "name=" + this.name +
      "&department_id=" + this.department_id +
      "&grade_id=" + this.grade_id +
      "&tel=" + this.tel +
      "&email=" + this.email +
      "&student_id=" + this.student_id;
      axios.put(url).then(
        (response) => {
          console.log("response:", response);
          this.$emit("closeEditSubRep");
          this.$emit("reload");
        },
        (error) => {
          return error;
        });
    },
  },
};
</script>

<style scoped>
  #btn{
    background: #032030;
    color: white;
    font-size: 15px;
    font-weight: bold;
    cursor: pointer;
    width: 30%;
    height: 30px;
    display: block;
    margin-right: 10%;
    margin-left: 10%;
    margin-top: 15%;
    margin-bottom: 5%;
    border-radius: 5px;
  }
  #btn:hover {
    box-shadow: -2px -2px 5px #FFF, 2px 2px 5px #BABECC;
    background-image: linear-gradient(90deg, rgba(247, 93, 139, 1), rgba(254, 220, 64, 1));
    border: white;
  }
  #btn:active{
    box-shadow: inset 1px 1px 2px #BABECC, inset -1px -1px 2px #FFF;
  }
  #btnContainer {
    display: flex;
    justify-content: end;
    width: 100%;
    margin-bottom: -1.5rem;
    z-index: 0;
  }
  input{
    width: 80%;
    margin: 0% auto;
    border: 1px solid silver;
    border-top : solid 1px #717171;
    border-bottom : solid 1px #e0e0e0;
    border-radius: 5px;
    background-color: white;
  }
  select{
    width: 80%;
    margin: 0% auto;
    border: 1px solid silver;
    border-top : solid 1px #717171;
    border-bottom : solid 1px #e0e0e0;
    border-radius: 5px;
    background-color: white;
  }
  h1 {
    margin: 5%;
  }
  .entry {
    margin-top: 3%;
    margin-left: 10%;
    margin-right: 10%;
  }
  .tuiki {
    margin-top: 3%;
    margin-left: 10%;
    margin-right: 10%;
    font-size: 12px;
  }
  .add-modal_box {
    display: flex;
    padding: 10px 10px;
    margin: 0 25%;
    justify-content: center;
    flex-flow: column;
    background-color: #DADADA;
    border-radius: 10px;
    margin: 0 30%;
  }
  .add-modal {
    top: 0;
    left: 0;
    position: fixed;
    padding: 100px;
    height: 100%;
    width: 100%;
    z-index: 11;
    background-color: rgba(51, 51, 51, 0.3);
    overflow: auto;
  }
</style>