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
              <p>開催日時：2021年9月11日(土) 12日(日)<br></p>
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

<!-- 主な参加形式 -->
    <div class="my-16">
      <v-row>
        <v-col cols='2'></v-col>
        <v-col cols='8'>
          <div class="text-center text-h3 text-no-wrap stroke">
            主な参加形式
          </div>
        </v-col>
        <v-col cols='2'></v-col>
      </v-row>

<!-- 01_模擬店 -->
      <v-row class="py-3 blue lighten-5">
        <v-col cols="1.5"></v-col>
        <v-col class="mx-4 img-rotate-left" cols="4"><!-- 画像 -->
          <v-img class="ma-1 welcome-img" src="../assets/welcome_shop.jpg"></v-img>
        </v-col>
        <v-col cols="5"><!-- 文章 -->
          <v-row>
            <v-col cols="1">
              <v-row>
                <v-col class="num-title--text text-h5 pa-0">
                  <p class="mb-0 ml-1">TYPE</p>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="pa-1 num-title--num text-h2 font-weight-medium">
                  <p class="">01</p>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="11"><!-- title and text -->
              <div class="ml-4">
                <v-row>
                  <v-col class="text-h3 font-weight-bold text-no-wrap" >
                    <p class="ml-2 mt-4 txt-box-title-letter-spacing">
                      模擬店
                    </p>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="pa-5 text-body-1 welcome-textbox-blue white">
                    <div class="font-weight-bold welcome-textbox">
                      <p>
                        サークル・研究室・留学生など毎年たくさんの団体に出店していただいています。
                      </p>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="1.5"></v-col>
      </v-row>

<!-- 三角 -->
      <v-row>
        <div class="triangle-after01"></div>
      </v-row>

<!-- 02_ステージ企画 -->
      <v-row class="pa-1">
        <v-col cols="1.5"></v-col>
        <v-col cols="5"><!-- 文章 -->
          <v-row>
            <v-col cols="1"><!-- STEP01 -->
              <v-row>
                <v-col class="num-title--text text-h5 pa-0">
                  <p class="mb-0 ml-1">TYPE</p>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="pa-0 num-title--num text-h2 font-weight-medium">
                  <p>02</p>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="11">
              <div class="ml-4">
                <v-row>
                  <v-col class="pa-o text-h3 font-weight-medium text-no-wrap" >
                    <p class="ml-3 mt-4 font-weight-bold txt-box-title-letter-spacing">
                      ステージ企画
                    </p>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="pa-5 text-body-1 welcome-textbox-white">
                    <div class="font-weight-bold welcome-textbox">
                      <p>
                        機械建設棟前のメインステージを使ってパフォーマンスをしていただいています。
                      </p>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="ma-4 img-rotate-right" cols="4"><!-- 画像 -->
          <v-img class="welcome-img" src="../assets/welcome_stage.jpg"></v-img>
        </v-col>
        <v-col cols="1.5"></v-col>
      </v-row>

<!-- 三角 -->
      <v-row>
        <div class="triangle-befor03"></div>
      </v-row>

<!-- 03_展示体験 -->
      <v-row class="pa-1 blue lighten-5">
        <v-col cols="1.5"></v-col>
        <v-col class="ma-4 img-rotate-left" cols="4"><!-- 画像 -->
          <v-img class="welcome-img" src="../assets/welcome_exhexp.jpg"></v-img>
        </v-col>
        <v-col cols="5"><!-- 文章 -->
          <v-row>
            <v-col cols="1"><!-- STEP01 -->
              <v-row>
                <v-col class="num-title--text text-h5 pa-0">
                  <p class="mb-0 ml-1">TYPE</p>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="pa-0 num-title--num text-h2 font-weight-medium">
                  <p>03</p>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="11"><!-- title and text -->
              <div class="ml-4">
                <v-row>
                  <v-col class="text-h3 font-weight-medium text-no-wrap" >
                    <p class="ml-3 mt-4 txt-box-title-letter-spacing font-weight-bold font-weight-black">
                      展示・体験
                    </p>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="pa-5 text-body-1 welcome-textbox-blue white">
                    <div class="box font-weight-bold welcome-textbox">
                      <p>
                        主にサークル活動の楽しさを伝えるための展示や体験ができるブースを出店していただいています。
                      </p>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="1.5"></v-col>
      </v-row>

<!-- 三角 -->
      <v-row>
        <div class="triangle-after03"></div>
      </v-row>

<!-- 04_研究室公開 -->
      <v-row class="my-n2">
        <v-col cols="1.5"></v-col>
        <v-col cols="5"><!-- 文章 -->
          <v-row>
            <v-col cols="1"><!-- STEP04 -->
              <v-row>
                <v-col class="num-title--text text-h5 pa-0">
                  <p class="mb-0 ml-1">TYPE</p>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="pa-0 num-title--num text-h2 font-weight-medium">
                  <p>04</p>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="11"><!-- title and text -->
              <div class="ml-4">
                <v-row>
                  <v-col class="text-h3 font-weight-medium text-no-wrap" >
                    <p class="ml-3 mt-4 font-weight-bold txt-box-title-letter-spacing">
                      研究室公開
                    </p>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="pa-5 text-body-1 welcome-textbox-white">
                    <div class="font-weight-bold welcome-textbox">
                      <p>
                        研究内容に興味を持ってもらえるような展示や体験ブースを出店していただいています。
                      </p>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="ma-4 img-rotate-right" cols="4"><!-- 画像 -->
          <v-img class="welcome-img" src="../assets/welcome_labo.jpg"></v-img>
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

      <v-row>
        <v-col cols='2'></v-col>
        <v-col cols='8'>
          <div class="text-center text-h5 text-no-wrap">
            <p>ご不明な点がある場合は「<a href="">よくある質問と解答</a>」をご覧ください。</p>
          </div>
        </v-col>
        <v-col cols='2'></v-col>
      </v-row>
    </div>

    </v-conteiner>
  </div>
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
.pie {/* 開催実績の円グラフ */
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

.stroke {/* 見出しずらし装飾 */
  color: rgba(0 0 0 / 0);
  letter-spacing: .1em;
  -webkit-text-stroke: 1px #333;
  text-shadow: 2px 2px 0 #E040FB;
}

.num-title--text {
  height: 1.5rem;
}
.num-title--num {
  height: 4rem;
  color: #E040FB;
}

/* 画像回転 */
.img-rotate-left {
	display: inline-block;
	transform: rotate(-2.5deg);
}
.img-rotate-right {
  display: iniline-block;
  transform: rotate(2.5deg);
}

/* 画像の影 */
.welcome-img {
  box-shadow: 20px 15px 0 #BBDEFB;
  border: 10px solid #fff;
}

/* triangle 装飾用三角形 */
.triangle-after01 {
  background: transparent;
  border-top: 3vw solid #E3F2FD;
  border-right: 110vw solid transparent;
  border-color: none;
}
.triangle-befor03 {
  background: transparent;
  border-bottom: 3vw solid #e3f2fd;
  border-right: 110vw solid transparent;
  border-color: none;
}
.triangle-after03 {
  background: transparent;
  border-top: 3vw solid #E3F2FD;
  border-right: 110vw solid transparent;
  border-color: none;
}

/* 色別テキストボックス装飾 */
.welcome-textbox-blue {
  box-shadow: 20px 15px 0 #BBDEFB;
}
.welcome-textbox-white {
  border: 10px solid #E3F2FD;
  box-shadow: 20px 15px 0 #BBDEFB;
}
.welcome-textbox {
  line-height: 1.75rem;
  letter-spacing: .1rem;
}
.txt-box-title-letter-spacing {
  letter-spacing: .5rem;
}

</style>
