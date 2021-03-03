<template>
  <v-row>
    <v-col>
      <div class="login-card">
        <v-card flat>
          <v-row align="center">
            <v-col cols="5">
              <v-form ref="form" lazy-validation>
                <v-container>
                  <v-row justify="center">
                    <v-col cols="1"></v-col>
                    <p cols="10" class="mt-3 display-1 grey-title">
                    ログイン
                    </p>
                    <p v-bind:style="warnStyle" v-html="getMessage"></p>
                  </v-row>
                  <v-row align="center" justify="center">
                    <v-col cols="1">
                      <v-icon color="#424242">mdi-email</v-icon>
                    </v-col>
                    <v-col cols="10" md="10" sm="10">
                      <v-text-field
                        v-model="email"
                        ref="email"
                        label="Eメールアドレス"
                        v-on:keyup.enter="loginWithAuthModule"
                        :rules="[rules.requied, rules.email]"
                        required
                        />
                        <p class="caption mb-0" />
                    </v-col>
                  </v-row>
                  <v-row align="center" justify="center">
                    <v-col cols="1">
                      <v-icon color="#424242">mdi-key</v-icon>
                    </v-col>
                    <v-col cols="10" md="10" sm="10">
                      <v-text-field
                        v-model="password"
                        ref="password"
                        label="パスワード"
                        counter
                        v-on:keyup.enter="loginWithAuthModule"
                        v-bind:append-icon="
                                             show_pass ? 'mdi-eye-off' : 'mdi-eye'
                                             "
                        :rules="[rules.required, rules.min]"
                        v-bind:type="show_pass ? 'password' : 'text'"
                        @click:append="show_pass = !show_pass"
                        />
                    </v-col>
                  </v-row>
                  <v-row align="center" justify="center">
                    <v-col cols="1" />
                      <v-col cols="10" md="10" sm="10">
                        <v-btn
                          block
                          class="mr-4 blue white--text"
                          @click="loginWithAuthModule"
                          >
                          ログイン
                        </v-btn>
                      </v-col>
                  </v-row>
                  <v-container>
                    <v-row align="center" justify="center">
                      <v-col cols="2" />
                        <v-col cols="8">
                          <nuxt-link class="text-center" to="/signup">
                            新規登録はこちら
                          </nuxt-link>
                        </v-col>
                        <v-col cols="2" />
                    </v-row>
                  </v-container>
                </v-container>
              </v-form>
            </v-col>
            <v-col cols="7">
              <v-img
                position="right"
                min-height="600"
                max-height="600"
                v-bind:src="image_src"
                class="mt-n3 pt-n3 mb-n3 pb-n3"
                >
                <div class="inner">
                  <img width="80%" src="@/assets/logo_japanese.svg" />
                  <img width="80%" src="@/assets/logo_english.svg" />
                </div>
              </v-img>
            </v-col>
          </v-row>
        </v-card>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      image_src: require("@/assets/homepic.png"),
      password: "",
      email: "",
      show_pass: true,
      formHasErrors: false,
      message: "",
      warnStyle: {
        color: "#F44336"
      },
      rules: {
        required: value => !!value || "入力してください",
        min: value => value.length >= 8 || "８文字以上入力してください",
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "適切なメールアドレスではありません";
        }
      }
    };
  },
  computed: {
    form() {
      return {
        email: null,
        password: null
      };
    },
    getMessage() {
      return this.message;
    }
  },
  methods: {
    async loginWithAuthModule() {
      this.formHasErrors = false;

      Object.keys(this.form).forEach(f => {
        if (!this.form[f]) this.formHasErrors = true;
        this.$refs[f].validate(true);
      });
      if (!this.formHasErrors) return "Can't Sign Up";
      await this.$auth
        .loginWith("local", {
          data: {
            email: this.email,
            password: this.password
          }
        })
        .then(
          response => {
            localStorage.setItem(
              "access-token",
              response.headers["access-token"]
            );
            localStorage.setItem("client", response.headers.client);
            localStorage.setItem("uid", response.headers.uid);
            localStorage.setItem("token-type", response.headers["token-type"]);
            return response;
          },
          error => {
            this.message = "メールアドレスかパスワードが違います。";
            return error;
          }
        );
    }
  }
};
</script>

<style scoped>
.login-card {
  padding-top: 5%;
  padding-left: 20%;
}
.grey-title {
  color: #424242;
}

.inner {
  position: absolute;
  text-align: center;
  top: 50%;
  transform: translateY(-50%);
}

.text-center {
  text-align: center;
  display: block;
}
</style>
