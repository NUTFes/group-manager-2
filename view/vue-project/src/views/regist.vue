<template>
  <div>
    <Header/>
      <v-row>
        <v-col cols="2"></v-col>
        <v-col cols="8">
          <v-stepper v-model="e1" alt-labels>
            <v-stepper-header>
              <v-stepper-step :complete="e1 > 1" step="1">参加団体登録</v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step :complete="e1 > 2" step="2">副代表登録</v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step :complete="e1 > 3" step="3">会場申請</v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step :complete="e1 > 4" step="4">ステージ<br>利用申請</v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step :complete="e1 > 5" step="5">電力申請</v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step step="6">物品申請</v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
              <!-- 参加団体登録 -->
              <v-stepper-content step="1">
                <v-card
                  class="mb-12"
                  height="200px"
                  flat
                  >
                </v-card>
                  <v-btn
                    color="primary"
                    @click="e1 += 1"
                    >
                    次へ
                  </v-btn>
              </v-stepper-content>

              <!-- 副代表登録 -->
              <v-stepper-content step="2">
                <v-card
                  class="mb-12"
                  height="200px"
                  flat
                  ></v-card>
                  <v-btn text
                         @click="e1 -= 1"
                         >
                         戻る
                  </v-btn>
                <v-btn
                  color="primary"
                  @click="e1 += 1"
                  >
                  次へ
                </v-btn>
              </v-stepper-content>

              <!-- 会場申請登録 -->
              <v-stepper-content step="3">
                <v-card
                  class="mb-12"
                  height="200px"
                  flat
                  ></v-card>

                  <v-btn text
                         @click="e1 -= 1"
                         >
                         戻る
                  </v-btn>
                <v-btn
                  color="primary"
                  @click="e1 += 1"
                  >
                  次へ
                </v-btn>
              </v-stepper-content>

              <!-- ステージ利用申請 -->
              <v-stepper-content step="4">
                <v-card
                  class="mb-12"
                  height="200px"
                  flat
                  ></v-card>
                  <v-btn text
                         @click="e1 -= 1"
                         >
                         戻る
                  </v-btn>
                <v-btn
                  color="primary"
                  @click="e1 += 1"
                  >
                  次へ
                </v-btn>
              </v-stepper-content>

              <!-- 電力申請 -->
              <v-stepper-content step="5">
                <v-card
                  class="mb-12"
                  height="200px"
                  flat
                  ></v-card>
                  <v-btn text
                         @click="e1 -= 1"
                         >
                         戻る
                  </v-btn>
                <v-btn
                  color="primary"
                  @click="e1 += 1"
                  >
                  次へ
                </v-btn>
              </v-stepper-content>

              <!-- 物品申請 -->
              <v-stepper-content step="6">
                <v-card
                  class="mb-12"
                  height="200px"
                  flat
                  ></v-card>
                  <v-btn text
                         @click="e1 -= 1"
                         >
                         戻る
                  </v-btn>
                <v-btn
                  color="primary"
                  @click="e1 += 1"
                  >
                  登録
                </v-btn>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </v-col>
        <v-col cols="2"></v-col>
      </v-row>
  </div>
</template>

<script>
  import Header from '@/components/Header.vue'
  import Group from '@/components/group.vue'
  import SubRep from '@/components/sub_rep.vue'
  import Power from '@/components/power.vue'
  import Place from '@/components/place.vue'
  export default {
    components: {
      Header,
      Group,
      SubRep,
      Power,
      Place
    },
    data () {
      return {
        e1: 1,
      }
    },
  }
</script>
