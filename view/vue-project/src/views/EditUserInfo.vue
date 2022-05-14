<template>
  <div>
    <router-link to="/mypage" style="text-decoration: none"><span class="regist-back-link">マイページへ</span></router-link>
    <h1 style="color: #333333; padding-bottom: 50px">ユーザー情報変更</h1>
    <v-form ref="form">
      <v-text-field
        label="フルネーム"
        v-model="name"
        :rules="[rules.requied]"
        outlined
        clearable
      />
      <br />
      <v-text-field
        label="メールアドレス"
        v-model="email"
        :rules="[rules.requied, rules.email]"
        outlined
        clearable
      />
      <br />
      <v-text-field
        label="学籍番号８桁"
        v-model="student_id"
        :rules="[rules.requied, rules.student_id_length]"
        hint="お持ちでない方：0を8桁入力"
        counter="8"
        outlined
        clearable
      />
      <br />
      <v-text-field
        label="TEL"
        v-model="tel"
        :rules="[rules.requied, rules.tel_length]"
        counter="11"
        hint="ハイフンなしで半角入力"
        persistent-hint
        outlined
        clearable
      />
      <br />
      <v-select
        label="学科"
        v-model.number="department_id"
        :rules="[rules.requied]"
        :items="departmentList"
        item-text="name"
        item-value="id"
        :menu-props="{ top: true, offsetY: true }"
        outlined
      />
      <br />
      <v-select
        label="学年"
        v-model.number="grade_id"
        :rules="[rules.requied]"
        :items="gradeList"
        item-text="name"
        item-value="id"
        :menu-props="{ top: true, offsetY: true }"
        outlined
      />
    </v-form>
    <div class="regist-button">
      <button class="regist-submit-button" @click="submit">登録</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import departmentList from "../plugins/department";
import gradeList from "../plugins/grade";
export default {
  data() {
    return {
      name: null,
      email: null,
      student_id: null,
      tel: null,
      department_id: null,
      grade_id: null,
      departmentList: departmentList,
      gradeList: gradeList,

      rules: {
        requied: (value) => !!value || "入力してください",
        student_id_length: (v) =>
          v.length == 8 || "8桁かどうかを確認してください",
        tel_length: (v) => v.length == 11 || "11桁かどうかを確認してください",
        email: (v) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(v) || "適切なメールアドレスではありません。";
        },
      },
    };
  },
  computed: {},
  methods: {
    goMypage: function() {
      this.$router.push("/mypage")
    },
    cancel: function () {
      this.$refs.form.reset();
    },

    zeropadding: function (num) {
      let padnum = null;
      padnum = ("00000000" + num).slice(-8);
      console.log(padnum);
      return padnum;
    },

    submit: function () {
      if (!this.$refs.form.validate()) return;

      const post_url =
        process.env.VUE_APP_URL + "/api/v1/current_user/edit_user_info";

      let params = {
        name: this.name,
        email: this.email,
        student_id: Number(this.student_id),
        tel: this.tel,
        department_id: this.department_id,
        grade_id: this.grade_id,
      };

      axios
        .post(post_url, params, {
          headers: {
            "Content-Type": "application/json",
            "access-token": localStorage.getItem("access-token"),
            client: localStorage.getItem("client"),
            uid: localStorage.getItem("uid"),
          },
        })
        .then(
          () => {
            localStorage.setItem("uid", this.email);
            this.$router.push("MyPage");
          },
          (error) => {
            console.log("登録できませんでした");
            return error;
          }
        );
    },
  },
  mounted() {
    if (this.$store.state.editUserInfoPermission == false) {
      this.$router.push("/mypage");
    }
    const get_url =
      process.env.VUE_APP_URL + "/api/v1/current_user";
    axios
      .get(get_url, {
        headers: {
          "Content-Type": "application/json",
          "access-token": localStorage.getItem("access-token"),
          "client": localStorage.getItem("client"),
          "uid": localStorage.getItem("uid"),
        },
      })
      .then(
        (response) => {
          this.name = response.data.data.user.name;
          this.email = response.data.data.user.email;
          this.student_id = String(
            this.zeropadding(response.data.data.user_detail.student_id)
          );
          this.tel = response.data.data.user_detail.tel;
          this.department_id = response.data.data.user_detail.department_id;
          this.grade_id = response.data.data.user_detail.grade_id;
        },
        (error) => {
          console.error(error);
          return error;
        }
      );
  },
};
</script>