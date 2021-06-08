<template>
  <div>
    <v-row>
      <v-col>
        <v-stepper class="stepper" v-model="e1" non-linear alt-labels>
          <v-stepper-header class="stepper">
            <v-stepper-step :complete="e1 > 1" step="1" color="purple accent-2"
              >副代表登録</v-stepper-step
            >
            <v-divider></v-divider>
            <v-stepper-step :complete="e1 > 2" step="2" color="purple accent-2"
              >物品申請</v-stepper-step
            >
            <v-divider></v-divider>
            <v-stepper-step :complete="e1 > 3" step="3" color="purple accent-2"
              >電力申請</v-stepper-step
            >
            <v-divider></v-divider>
            <v-stepper-step
              :complete="e1 > 4"
              step="4"
              color="purple accent-2"
              >ステージ<br>利用申請</v-stepper-step
            >
            <v-divider></v-divider>
            <v-stepper-step
              :complete="e1 > 5"
              step="5"
              color="purple accent-2"
              >ステージ<br>利用詳細</v-stepper-step
            >
          </v-stepper-header>

          <v-stepper-items class="stepper">
            <!-- 副代表登録 -->
            <v-stepper-content step="1">
              <v-row>
                <v-col cols="1"></v-col>
                <v-col cols="10">
                  <v-card class="mb-12" flat>
                    <v-card-title class="font-weight-bold justify-center">副代表登録</v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                      <v-text-field
                        label="名前"
                        v-model="subRepName"
                        clearable
                        outlined
                      ></v-text-field>

                      <v-text-field
                        label="学籍番号"
                        background-color="white"
                        v-model="subRepStudentId"
                        :rules="[rules.min8, rules.over8]"
                        hint="お持ちでない方：0を8桁入力"
                        persistent-hint
                        item-text="name"
                        item-value="id"
                        counter="8"
                        clearable
                        outlined
                      ></v-text-field>

                      <v-select
                        label="学科"
                        v-model.number="subRepDepartmentId"
                        :items="departments"
                        :menu-props="{ top: true, offsetY: true }"
                        item-text="name"
                        item-value="id"
                        clearable
                        outlined
                      ></v-select>

                      <v-select
                        label="学年"
                        v-model.number="subRepGradeId"
                        :items="grades"
                        :menu-props="{ top: true, offsetY: true }"
                        item-text="name"
                        item-value="id"
                        clearable
                        outlined
                      ></v-select>

                      <v-text-field
                        label="電話番号"
                        background-color="white"
                        v-model="subRepTel"
                        :rules="[rules.min11, rules.over11]"
                        hint="ハイフンなしで半角入力"
                        persistent-hint
                        counter="11"
                        clearable
                        outlined
                      ></v-text-field>

                      <v-text-field
                        label="メールアドレス"
                        background-color="white"
                        v-model="subRepEmail"
                        clearable
                        outlined
                      ></v-text-field>
                    </v-card-text>
                    <v-divider class="mb-8"></v-divider>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        depressed
                        large
                        rounded
                        dark
                        color="btn"
                        class="stepper pl-4 font-weight-bold"
                        @click="e1 += 1"
                      >
                        次へ<v-icon class="ml-n1">mdi-menu-right</v-icon>
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
                <v-col cols="1"></v-col>
              </v-row>
            </v-stepper-content>

            <!-- 物品申請 -->
            <v-stepper-content step="2">
              <v-row>
                <v-col cols="1"></v-col>
                <v-col cols="10">
                  <v-card class="mb-12" flat>
                    <v-card-title class="font-weight-bold justify-center">物品登録</v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                      <v-row>
                        <v-col>
                          <v-select
                            v-model="rentalSteps"
                            :items="[1, 2, 3, 4, 5, 6]"
                            label="登録物品数"
                            outlined
                          />
                        </v-col>
                      </v-row>
                      <v-stepper class="stepper" v-model="e3">
                        <v-stepper-header class="stepper">
                          <template v-for="rentalStep in rentalSteps">
                            <v-stepper-step
                              :key="`${rentalStep}-step`"
                              :complete="e3 > rentalStep"
                              :step="rentalStep"
                            >
                              {{ rentalStep }}
                            </v-stepper-step>
                            <v-divider
                              v-if="rentalStep !== rentalSteps"
                              :key="rentalStep"
                            ></v-divider>
                          </template>
                        </v-stepper-header>
                        <v-stepper-items>
                          <v-stepper-content
                            v-for="rentalStep in rentalSteps"
                            :key="`${rentalStep}-content`"
                            :step="rentalStep"
                            class="ma-0 pa-0"
                          >
                            <RentalCard
                              ref="rentalChild"
                              :groupId="groupId"
                              :key="rentalStep"
                            />
                            <v-card-actions>
                              <v-spacer></v-spacer>
                                <v-btn
                                  small
                                  rounded
                                  text
                                  color="btn"
                                  @click="e3 -= 1"
                                  v-show="rentalStep != 1"
                                >
                                  <v-icon class="mr-n1">mdi-menu-left</v-icon>
                                  戻る
                                </v-btn>
                                <v-btn
                                  small
                                  rounded
                                  outlined
                                  color="btn"
                                  class="pl-5"
                                  @click="e3 += 1"
                                  v-show="rentalSteps != rentalStep"
                                >
                                  {{ rentalStep + 1 }}
                                  個目の物品へ
                                  <v-icon class="ml-n1">mdi-menu-right</v-icon></v-btn>
                            </v-card-actions>
                          </v-stepper-content>
                        </v-stepper-items>
                      </v-stepper>
                    </v-card-text>
                    <v-divider class="mb-8" />
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn 
                        text  
                        rounded
                        large
                        color="btn"
                        class="pr-4 font-weight-bold"
                        @click="e1 -= 1"
                      >
                        <v-icon class="mr-n1">mdi-menu-left</v-icon>戻る
                      </v-btn>
                      <v-btn
                        rounded
                        depressed
                        large
                        class="pl-4 font-weight-bold"
                        color="primary"
                        @click="e1 += 1"
                      >
                        次へ<v-icon class="ml-n1">mdi-menu-right</v-icon>
                      </v-btn>
                    </v-card-actions>

                  </v-card>
                </v-col>
                <v-col cols="1"></v-col>
              </v-row>
            </v-stepper-content>

            <!-- 電力申請 -->
            <v-stepper-content step="3">
              <v-row>
                <v-col cols="1"></v-col>
                <v-col cols="10">
                  <v-card class="mb-12" flat>
                    <v-card-title class="font-weight-bold justify-center">電力申請</v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                      <v-select
                        v-model="powerSteps"
                        :items="[1, 2, 3, 4, 5]"
                        label="登録製品数"
                        outlined
                      />
                      <v-stepper class="stepper ma-0 pa-0" v-model="e2">
                        <v-stepper-header class="stepper">
                          <template v-for="powerStep in powerSteps">
                            <v-stepper-step
                              :key="`${powerStep}-step`"
                              :complete="e2 > powerStep"
                              :step="powerStep"
                            >
                              {{ powerStep }}個目
                            </v-stepper-step>

                            <v-divider
                              v-if="powerStep !== powerSteps"
                              :key="powerStep"
                            ></v-divider>
                          </template>
                        </v-stepper-header>
                        <v-stepper-items>
                          <v-stepper-content
                            class="ma-0 pa-0"
                            v-for="powerStep in powerSteps"
                            :key="`${powerStep}-content`"
                            :step="powerStep"
                          >
                            <PowerCard
                              class="ma-0 pa-0"
                              :groupId="groupId"
                              ref="powerChild"
                              :key="powerStep"
                            />
                            <v-card-actions>
                              <v-spacer></v-spacer>
                                <v-btn
                                  rounded
                                  text
                                  color="btn"
                                  class="pr-5"
                                  @click="e2 -= 1"
                                  v-show="powerStep != 1"
                                >
                                  <v-icon class="mr-n1">mdi-menu-left</v-icon>
                                  戻る
                                </v-btn>
                                <v-btn
                                  rounded
                                  outlined
                                  color="btn"
                                  class="pl-5"
                                  @click="e2 += 1"
                                  v-show="powerSteps != powerStep"
                                >
                                  {{ powerStep + 1 }}個目の製品へ
                                  <v-icon class="ml-n1">mdi-menu-right</v-icon></v-btn>
                            </v-card-actions>
                          </v-stepper-content>
                        </v-stepper-items>
                      </v-stepper>
                    </v-card-text>
                    <v-divider class="mb-8" />
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn 
                        text  
                        rounded
                        large
                        color="btn"
                        class="pr-4 font-weight-bold"
                        @click="e1 -= 1"
                      >
                        <v-icon class="mr-n1">mdi-menu-left</v-icon>戻る
                      </v-btn>
                      <v-btn
                        rounded
                        dark
                        depressed
                        large
                        class="pl-4 font-weight-bold"
                        color="btn"
                        @click="e1 += 1"
                      >
                        次へ<v-icon class="ml-n1">mdi-menu-right</v-icon>
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
                <v-col cols="1"></v-col>
              </v-row>
            </v-stepper-content>

            <!-- ステージ利用申請 -->
            <v-stepper-content v-if="isStage" step="4">
              <v-row>
                <v-col cols="1"></v-col>
                <v-col cols="10">
                  <v-card class="mb-12" flat>
                    <v-card-title class="font-weight-bold justify-center">
                      ステージ利用申請
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                      <v-stepper class="stepper" v-model="e2">
                        <v-stepper-header class="stepper">
                          <template v-for="stageStep in stageSteps">
                            <v-stepper-step
                              :key="`${stageStep}-step`"
                              :complete="e2 > stageStep"
                              :step="stageStep"
                              > 
                              <div v-if="stageStep == 1">晴れ</div>
                              <div v-if="stageStep == 2">雨</div>
                            </v-stepper-step>
                            <v-divider
                              v-if="stageStep !== stageSteps"
                              :key="stageStep"
                            ></v-divider>
                          </template>
                        </v-stepper-header>
                        <v-stepper-items>
                          <v-stepper-content
                            class="ma-0 pa-0"
                            v-for="stageStep in stageSteps"
                            :key="`${stageStep}-content`"
                            :step="stageStep"
                          >
                            <StageCard
                              ref="stageChild"
                              :groupId="groupId"
                              :isSunny=weatherFlag[stageStep-1]
                              :key="stageStep"
                            />
                            
                            <v-card-actions>
                              <v-spacer></v-spacer>
                                <v-btn
                                  rounded
                                  text
                                  color="btn"
                                  class="pr-5"
                                  @click="e2 -= 1"
                                  v-show="stageStep != 1"
                                >
                                  <v-icon class="mr-n1">mdi-menu-left</v-icon>
                                  戻る
                                </v-btn>
                                <v-btn
                                  rounded
                                  outlined
                                  color="btn"
                                  class="pl-5"
                                  @click="e2 += 1"
                                  v-show="stageSteps != stageStep"
                                >
                                  次へ
                                  <v-icon class="ml-n1">mdi-menu-right</v-icon></v-btn>
                            </v-card-actions>
                          </v-stepper-content>
                        </v-stepper-items>
                      </v-stepper>
                    </v-card-text>
                    <v-divider class="mb-8" />
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn 
                        text  
                        rounded
                        large
                        color="btn"
                        class="pr-4 font-weight-bold"
                        @click="e1 -= 1"
                      >
                        <v-icon class="mr-n1">mdi-menu-left</v-icon>戻る
                      </v-btn>
                      <v-btn
                        rounded
                        dark
                        depressed
                        large
                        class="pl-4 font-weight-bold"
                        color="btn"
                        @click="e1 += 1"
                      >
                        次へ<v-icon class="ml-n1">mdi-menu-right</v-icon>
                      </v-btn>
                    </v-card-actions>

                  </v-card>
                </v-col>
                <v-col cols="1"></v-col>
              </v-row>
            </v-stepper-content>

            <!-- ステージ利用詳細 -->
            <v-stepper-content v-if="isStage" step="5">
              <v-row>
                <v-col cols="1"></v-col>
                <v-col cols="10">
                  <v-card class="mb-12" flat>
                    <v-card-title class="font-weight-bold justify-center">
                      ステージ詳細申請
                    </v-card-title>
                    <v-divider class="mb-8" />
                    <v-card-text>
                      <StageCommonCard
                        :groupId="groupId"
                        ref="stageCommonChild"
                        :key="stageCommonStep"
                      />
                    </v-card-text>
                    <v-divider class="mb-8" />
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn 
                        text  
                        rounded
                        large
                        color="btn"
                        class="pr-4 font-weight-bold"
                        @click="e1 -= 1"
                      >
                        <v-icon class="mr-n1">mdi-menu-left</v-icon>戻る
                      </v-btn>
                      <v-btn
                        rounded
                        dark
                        depressed
                        large
                        class="font-weight-bold"
                        color="btn"
                        @click="stageSubmit"
                      >
                        完了
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
                <v-col cols="1"></v-col>
              </v-row>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from "axios";
import Header from "@/components/Header.vue";
import PowerCard from "@/components/Mobile/PowerCard";
import RentalCard from "@/components/Mobile/RentalCard";
import StageCard from "@/components/Mobile/StageCard";
import StageCommonCard from "@/components/Mobile/StageCommonCard";
export default {
  components: {
    Header,
    PowerCard,
    RentalCard,
    StageCard,
    StageCommonCard
  },
  data() {
    return {
      e1: 1,
      e2: 1,
      e3: 1,
      rules: {
        required: value => !!value || "入力してください",
        min8: v => v.length >= 8 || "8桁かどうかを確認してください",
        over8: v => v.length <= 8 || "8桁かどうかを確認してください",
        min11: v => v.length >= 11 || "11桁かどうかを確認してください",
        over11: v => v.length <= 11 || "11桁かどうかを確認してください",
        max: value => value <= 1000 || "大きすぎます"
      },
      groupId: localStorage.getItem("group_id"),
      groupCategoryId: localStorage.getItem("group_category_id"),
      subRepName: [], // 副代表の名前
      subRepStudentId: [], // 副代表の学籍番号
      subRepDepartmentId: [], // 副代表の課程
      subRepGradeId: [], // 副代表の学年
      subRepTel: [], // 副代表の電話番号
      subRepEmail: [], // 副代表のメールアドレス
      // 課程
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
        { name: "その他", id: 20 }
      ],
      // 学年
      grades: [
        { name: "B1 [学部1年]", id: 1 },
        { name: "B2 [学部2年]", id: 2 },
        { name: "B3 [学部3年]", id: 3 },
        { name: "B4 [学部4年]", id: 4 },
        { name: "M1 [修士1年]", id: 5 },
        { name: "M2 [修士2年]", id: 6 },
        { name: "D1 [博士1年]", id: 7 },
        { name: "D2 [博士2年]", id: 8 },
        { name: "D3 [博士3年]", id: 9 },
        { name: "GD1 [イノベ1年]", id: 10 },
        { name: "GD2 [イノベ2年]", id: 11 },
        { name: "GD3 [イノベ3年]", id: 12 },
        { name: "GD4 [イノベ4年]", id: 13 },
        { name: "GD5 [イノベ5年]", id: 14 },
        { name: "その他", id: 15 }
      ],
      // 会場登録
      placeList: [],
      placeFirstId: [], // 第1希望
      placeSecondId: [], // 第2希望
      placeThirdId: [], // 第3希望
      placeRemark: [], // 備考
      // 電力申請
      powerSteps: 2, // 電力申請登録数
      powerItem: [], // 製品名
      power: [], // 電力量
      powerManufacturer: [], // メーカー
      powerModel: [], // 型番
      powerItemUrl: [], // 製品URL

      // 物品申請
      rentalSteps: 2,

      // ステージ申請
      stageSteps: 2,
      weatherFlag: [true, false],
    };
  },
  watch: {
    powerSteps(val) {
      if (this.e2 > val) {
        this.e2 = val;
        
      }
    }
  },
  computed: {
    isStage: () => {
      if (localStorage.getItem("group_category_id") == 3) {
        return true;
      }
      return false;
    }
  },
  methods: {
    commonSubmit: function() {
      // 副代表登録
      axios.defaults.headers.common["Content-Type"] = "application/json";
      const subRepUrl = process.env.VUE_APP_URL + "/sub_reps";
      var subRepParams = new URLSearchParams();
      subRepParams.append("group_id", this.groupId);
      subRepParams.append("name", this.subRepName);
      subRepParams.append("department_id", this.subRepDepartmentId);
      subRepParams.append("grade_id", this.subRepGradeId);
      subRepParams.append("tel", this.subRepTel);
      subRepParams.append("email", this.subRepEmail);
      subRepParams.append("student_id", this.subRepStudentId);
      axios.post(subRepUrl, subRepParams).then(
        response => {
          console.log("副代表登録");
          // console.log(response)
        },
        error => {
          return error;
        }
      );

      // 電力申請
      for (let i = 0; i < this.powerSteps; i++) {
        this.$refs.powerChild[i].submit();
      }

      // 物品登録
      for (let i = 0; i < this.rentalSteps; i++) {
        this.$refs.rentalChild[i].submit();
      }

      // ステージ登録
      for (let i = 0; i < this.stageSteps; i++) {
        this.$refs.stageChild[i].submit();
      }

      this.$router.push("mobile_mypage");
    },
    saleSubmit: function() {
      if (groupCategoryId == null) {
        console.log("can't group_category_id");
        return;
      }

      this.commonSubmit();

      // 会場申請登録
      const placeUrl = process.env.VUE_APP_URL + "/place_orders";
      var placeParams = new URLSearchParams();
      placeParams.append("group_id", this.groupId);
      placeParams.append("first", this.placeFirstId);
      placeParams.append("second", this.placeSecondId);
      placeParams.append("third", this.placeThirdId);
      placeParams.append("remark", this.placeRemark);
      axios.post(placeUrl, placeParams).then(
        response => {
          console.log("会場申請登録");
          // console.log(response)
        },
        error => {
          return error;
        }
      );

      this.$router.push("mobile_mypage");
    },
    stageSubmit: function() {
      this.commonSubmit();

      // this.$refs.stageChild.submit();

      this.$refs.stageCommonChild.submit();

      this.$router.push("mobile_mypage");
    },
    getIndex: function() {
      for (let i = 0; i < this.placeList.length; i++) {
        if (this.placeList[i]["group_id"] === this.groupId) {
          return i;
        }
      }
      return 0;
    },
    nextStep: n => {
      if (n === this.powerSteps) {
        this.e2 = 1;
      } else {
        this.e2 = n + 1;
      }
    },
    onInputPower: val => {
      this.powerSteps = parseInt(val);
    }
  },
  mounted() {
    const placeUrl =
      process.env.VUE_APP_URL + "/api/v1/current_user/groups/places";
    axios
      .get(placeUrl, {
        headers: {
          "Content-Type": "application/json",
          "access-token": localStorage.getItem("access-token"),
          client: localStorage.getItem("client"),
          uid: localStorage.getItem("uid")
        }
      })
      .then(
        response => {
          for (let i = 0; i < response.data.length; i++) {
            this.placeList.push(response.data[i]);
          }
          // console.log('place: ',this.placeList)
        },
        error => {
          console.error(error);
          return error;
        }
      );
  }
};
</script>

<style scooped>
.stepper {
  box-shadow: none;
}
</style>
