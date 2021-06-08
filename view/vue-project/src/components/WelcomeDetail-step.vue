<template>
  <div style='background-color:rgb(255,255,255)'>
    <v-conteiner>
<!-- 参加概要 -->
      <div class="my-16">
      <v-row>
        <v-col cols='2'></v-col>
        <v-col cols='8'>
          <p class="mt-16 text-center text-h3 text-no-wrap stroke">
            参加概要
          </p>
        </v-col>
        <v-col cols='2'></v-col>
      </v-row>

      <v-row>
        <v-col cols='2'></v-col>
        <v-col cols='8'>
          <div class="text-center text-h4 text-no-wrap">
              <p>開催日時：2021年9月14日(土) 15日(日)<br></p>
              <p>募集締切：2021年7月30日(月)</p>
          </div>
        </v-col>
        <v-col cols='2'></v-col>
      </v-row>
      </div>

<!-- 参加実績 -->
      <div class="my-16">
        <v-row>
          <v-col cols='2'></v-col>
          <v-col cols='8'>
            <div class="text-center text-h3 text-no-wrap stroke">
              開催実績
            </div>
          </v-col>
          <v-col cols='2'></v-col>
        </v-row>

<!-- 参加団体数 -->
        <v-row>
          <v-col cols="2.5"></v-col>

          <v-col cols="2">
            <v-row>
              <v-col class="text-center text-h5 mx-5">
                <p>参加団体数</p>
              </v-col>
            </v-row>
            <v-row>
              <v-img src="../assets/group.svg" class="mt-n5"></v-img>
            </v-row>
          </v-col>


<!-- 継続参加率 -->
          <v-col cols="0.5"></v-col>

          <v-col cols="2" class="">
            <v-row>
              <v-col class="text-center text-h5">
                <p>継続参加率</p>
              </v-col>
            </v-row>
            <v-row>
              <div class="pie mt-2">92.7%</div>
            </v-row>
          </v-col>

          <v-col cols="0.5"></v-col>

<!-- 参加団体増加率 -->
          <v-col cols="2">
            <v-row>
              <v-col class="text-center text-h5">
                <p>参加団体増加率</p>
              </v-col>
            </v-row>
            <v-row>
              <v-img src="../assets/graph-arrow.svg" class="mt-2"></v-img>
            </v-row>
          </v-col>

          <v-col cols="2.5"></v-col>
        </v-row>
      </div>

<!-- 登録の流れ -->
    <div class="my-16"><!-- 登録の流れwrapper -->
      <v-row>
        <v-col cols='2'></v-col>
        <v-col cols='8'>
          <div class="text-center text-h3 text-no-wrap stroke">
            登録の流れ
          </div>
        </v-col>
        <v-col cols='2'></v-col>
      </v-row>

<!-- 01_ユーザー情報の登録 -->
      <v-row class="pa-1 blue-grey lighten-5">
        <v-col cols="1.5"></v-col>
        <v-col cols="4"><!-- 画像 -->
          <v-img src="../assets/following-step01.svg"></v-img>
        </v-col>

        <v-col cols="5"><!-- 文章 -->
          <v-row>
            <v-col cols="1"><!-- STEP01 -->
              <v-row>
                <v-col class="num-title--text text-h5 pa-0">
                  <p class="mb-0 ml-1">STEP</p>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="pa-0 num-title--num text-h2 font-weight-medium">
                  <p class="">01</p>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="11"><!-- title and text -->
              <div class="ml-4">
                <v-row>
                  <v-col class="pa-o text-h3 font-weight-medium text-no-wrap" >
                    <p class="ma-0 mt-4">
                      ユーザー情報の登録
                    </p>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="text-body-1">
                    <p class="mt-10">
                      代表の方の学籍番号、電話番号、学科、学年を入力してください。
                    </p>
                  </v-col>
                </v-row>
              </div>

            </v-col>
          </v-row>
        </v-col>

        <v-col cols="1.5"></v-col>
      </v-row>

<!-- 02_参加団体登録 -->
      <v-row class="pa-1">
        <v-col cols="1.5"></v-col>

        <v-col cols="5"><!-- 文章 -->
          <v-row>
            <v-col cols="1"><!-- STEP01 -->
              <v-row>
                <v-col class="num-title--text text-h5 pa-0">
                  <p class="mb-0 ml-1">STEP</p>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="pa-0 num-title--num text-h2 font-weight-medium">
                  <p class="">02</p>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="11"><!-- title and text -->
              <div class="ml-4">
                <v-row>
                  <v-col class="pa-o text-h3 font-weight-medium text-no-wrap" >
                    <p class="ma-0 mt-4">
                      参加団体登録
                    </p>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="text-body-1">
                    <p class="mt-10">
                      あなたの団体名、カテゴリ、活動内容、企画名を登録してください。
                    </p>
                  </v-col>
                </v-row>
              </div>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="4"><!-- 画像 -->
          <v-img src="../assets/following-step02.svg"></v-img>
        </v-col>
        <v-col cols="1.5"></v-col>
      </v-row>

<!-- 03_副代表登録 -->
      <v-row class="pa-1 blue-grey lighten-5">
        <v-col cols="1.5"></v-col>
        <v-col cols="4"><!-- 画像 -->
          <v-img src="../assets/following-step03.svg"></v-img>
        </v-col>

        <v-col cols="5"><!-- 文章 -->
          <v-row>
            <v-col cols="1"><!-- STEP01 -->
              <v-row>
                <v-col class="num-title--text text-h5 pa-0">
                  <p class="mb-0 ml-1">STEP</p>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="pa-0 num-title--num text-h2 font-weight-medium">
                  <p class="">03</p>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="11"><!-- title and text -->
              <div class="ml-4">
                <v-row>
                  <v-col class="pa-o text-h3 font-weight-medium text-no-wrap" >
                    <p class="ma-0 mt-4">
                      副代表登録
                    </p>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="text-body-1">
                    <p class="mt-10">
                      副代表の方の名前、学籍番号、学科、学年、電話番号、メールアドレスを登録してください。
                    </p>
                  </v-col>
                </v-row>
              </div>

            </v-col>
          </v-row>
        </v-col>

        <v-col cols="1.5"></v-col>
      </v-row>

<!-- 04_物品登録 -->
      <v-row class="pa-1">
        <v-col cols="1.5"></v-col>

        <v-col cols="5"><!-- 文章 -->
          <v-row>
            <v-col cols="1"><!-- STEP01 -->
              <v-row>
                <v-col class="num-title--text text-h5 pa-0">
                  <p class="mb-0 ml-1">STEP</p>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="pa-0 num-title--num text-h2 font-weight-medium">
                  <p class="">04</p>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="11"><!-- title and text -->
              <div class="ml-4">
                <v-row>
                  <v-col class="pa-o text-h3 font-weight-medium text-no-wrap" >
                    <p class="ma-0 mt-4">
                      物品登録
                    </p>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="text-body-1">
                    <p　class="mt-10">
                      あなたの団体の借りたい物品の種類・数を登録してください。
                    </p>
                  </v-col>
                </v-row>
              </div>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="4"><!-- 画像 -->
          <v-img src="../assets/following-step04.svg"></v-img>
        </v-col>


        <v-col cols="1.5"></v-col>
      </v-row>

<!-- 05_電力申請 -->
      <v-row class="pa-1 blue-grey lighten-5">
        <v-col cols="1.5"></v-col>
        <v-col cols="4"><!-- 画像 -->
          <v-img src="../assets/following-step05.svg"></v-img>
        </v-col>

        <v-col cols="5"><!-- 文章 -->
          <v-row>
            <v-col cols="1"><!-- STEP01 -->
              <v-row>
                <v-col class="num-title--text text-h5 pa-0">
                  <p class="mb-0 ml-1">STEP</p>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="pa-0 num-title--num text-h2 font-weight-medium">
                  <p class="">05</p>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="11"><!-- title and text -->
              <div class="ml-4">
                <v-row>
                  <v-col class="pa-o text-h3 font-weight-medium text-no-wrap" >
                    <p class="ma-0 mt-4">
                      電力申請
                    </p>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="text-body-1">
                    <p class="mt-10">
                      あなたの団体が技大祭当日に使用する製品の製品名・消費電力量・メーカー・型番・製品URLを登録してください。
                    </p>
                  </v-col>
                </v-row>
              </div>

            </v-col>
          </v-row>
        </v-col>

        <v-col cols="1.5"></v-col>
      </v-row>

<!-- 06_会場登録 -->
      <v-row class="pa-1">
        <v-col cols="1.5"></v-col>

        <v-col cols="5"><!-- 文章 -->
          <v-row>
            <v-col cols="1"><!-- STEP01 -->
              <v-row>
                <v-col class="num-title--text text-h5 pa-0">
                  <p class="mb-0 ml-1">STEP</p>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="pa-0 num-title--num text-h2 font-weight-medium">
                  <p class="">06</p>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="11"><!-- title and text -->
              <div class="ml-4">
                <v-row>
                  <v-col class="pa-o text-h3 font-weight-medium text-no-wrap" >
                    <p class="ma-0 mt-4">
                      会場・ステージ登録
                    </p>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="text-body-1">
                    <p class="mt-10">
                      あなたの団体の第一希望から第三希望までの出店希望場所を登録してください。
                    </p>
                  </v-col>
                </v-row>
              </div>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="4"><!-- 画像 -->
          <v-img src="../assets/following-step06.svg"></v-img>
        </v-col>


        <v-col cols="1.5"></v-col>
      </v-row>
    </div>
<!-- 以降　各種SNSのリンク、連絡先の表示、よくある質問へのリンク -->

      <div  class="my-16"><!-- よくある質問 -->
      <v-row>
        <v-col cols='2'></v-col>
        <v-col cols='8'>
          <p class="text-center text-h4 text-no-wrap">
            よくある質問
          </p>
        </v-col>
        <v-col cols='2'></v-col>
      </v-row>

      <v-row class="">
        <v-col cols='2'></v-col>
        <v-col cols='8'>
          <div class="text-center text-h5 text-no-wrap">
              <p>ご不明な点がある場合は「<a href="">よくある質問と解答</a>」をご覧ください。
              </p>
          </div>
        </v-col>
        <v-col cols='2'></v-col>
      </v-row>
      </div>

      </v-col>
      <v-col cols="2.5"></v-col>
    </v-row>
    </v-conteiner>
  </div>

<!-- ここテスト機関 -->

</template>

<script>
export default {
  data() {
    return {
    }
  },
}
</script>

<style scooped>
.pie {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: auto;
  margin-left: auto;
  width: 200px;
  height: 200px;
  font-size: 26px;
  font-weight: 700;
  background-image: radial-gradient(#fff 40%, transparent 41%), conic-gradient(#E040FB 0% 92.7%, #d9d9d9 92.7% 100%);
  border-radius: 50%;
}

.num-title--text {
  height: 1.5rem;
}

.num-title--num {
  height: 4rem;
}

.stroke {
  color: rgba(0 0 0 / 0);
  letter-spacing: .1em;
  -webkit-text-stroke: 1px #333;
  text-shadow: 2px 2px 0 #E040FB;
}

</style>

```