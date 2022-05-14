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
        :items="departments"
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
        :items="grades"
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
export default {
  data() {
    return {
      name: null,
      email: null,
      student_id: null,
      tel: null,
      department_id: null,
      grade_id: null,

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
          (response) => {
            console.log(response);
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