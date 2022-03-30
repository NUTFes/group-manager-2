<template>
  <div id="app">
    <h1>従業員申請フォーム</h1>
    <div class="Blank">
    <span>名前</span>
      <input type="text" v-model="name" id="name">
    </div>
    <div class="Blank">
    <span>学籍番号</span>
      <input type="text" placeholder="学外の方は0を8桁" @change="validationId" maxlength="8" v-model="studentId" id="studentId">
    </div>
    <div class="Blank">
      <router-link to="/mypage"><button style="margin-left:8%;">←戻る</button></router-link>
      <button @click="register" style="margin-left:15%;">登録する→</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      resultId: false,
      new_info: [],
      name: [],
      studentId: [],
    };
  },
  computed: {
    validationId(){
      const pattern = /[0-9０-９]{8}/;
      if (pattern.test(this.studentId)==true) {
        this.onIdValidation();
      } else {
        this.offIdValidation();
      }
      return this.resultId
    },
  },
  methods: {
    onIdValidation: function() {
      this.resultId = true;
    },
    offIdValidation: function() {
      this.resultId = false;
    },
    register: function () {
      if (this.name.length > 0 && this.resultId) {
        const url = process.env.VUE_APP_URL + "/employees";
        axios.defaults.headers.common["Content-Type"] = "application/json";
        let params = new URLSearchParams();
        params.append("group_id", this.new_info.group.id);
        params.append("name", this.name);
        params.append("student_id", this.studentId);

        axios.post(url, params).then(
          (response) => {
            console.log(response.status);
            this.$router.push("mypage");
            this.name = [];
            this.studentId = [];
          },
          (error) => {
            return error;
          }
        );
      } else {
        if (this.name==0) {
          const nameError = document.getElementById("name");
          nameError.style.border="2px solid red";
        } else {
          const nameError = document.getElementById("name");
          nameError.style.border="2px solid black";
        }
        if (this.resultId==false) {
          const studentIdError = document.getElementById("studentId");
          studentIdError.style.border="2px solid red";
        } else {
          const studentIdError = document.getElementById("studentId");
          studentIdError.style.border="2px solid black";
        }
      }
    },
  },
  mounted() {
    const new_info =
    process.env.VUE_APP_URL + "/api/v1/current_user/current_regist_info";
    axios
      .get(new_info, {
        headers: {
          "Content-Type": "application/json",
          "access-token": localStorage.getItem("access-token"),
          client: localStorage.getItem("client"),
          uid: localStorage.getItem("uid"),
        },
      })
      .then((response) => {
        console.log(response);
        this.new_info = response.data.data[0];
      });
  },
}
</script>

<style scoped>
  #app{
    margin: 1%;
  }
  span {
    display: inline-block;
    width: 100px;
    padding-right: 10px;
  }
  .tytle{
    text-align:center;
    padding:1%;
  }
  .Blank{
    text-align: center;
    margin:1%;
  }
  select,input{
    text-align: center;
    width: 30%;
    height:40px;
    border-radius: 7px;
    box-shadow: inset 2px 2px 5px #BABECC, inset -5px -5px 10px #FFF;
    font-size: 25px;
  }
  select,input:required{
    border: 2px solid red;
  }
  select,input:invalid{
    border: 2px solid red;
  }
  select,input:valid{
    border: 2px solid black;
  }
  button{
  color: black;
  font-weight: bold;
  border: solid 2px;
  border-radius: 10px;
  cursor: pointer;
  margin: 1%;
  padding:1%;
  }
  button:hover {
    box-shadow: -2px -2px 5px #FFF, 2px 2px 5px #BABECC;
    background-image: linear-gradient(90deg, rgba(247, 93, 139, 1), rgba(254, 220, 64, 1));
    border: white;
  }
  button:active{
    box-shadow: inset 1px 1px 2px #BABECC, inset -1px -1px 2px #FFF;
  }
</style>