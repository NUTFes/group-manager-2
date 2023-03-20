<script lang="ts" setup>
</script>

<template>
  <div class="bg-white ">
    <div>
      <div>
        <div class="stroke mt-16 text-center text-5xl whitespace-nowrap " >参加概要</div>
        <div class="mt-12 text-center text-4xl whitespace-nowrap ">開催日時：2023年9月16日(土) 17日(日)</div>
        <div class="stroke mt-24 mb-4 text-center text-5xl whitespace-nowrap ">登録の流れ</div>

        <!-- 01_ユーザー情報の登録 -->
        <div class="p-1 h-80 bg-gray-200 flex">
          <div class="w-1/12"></div>
          <div class="w-5/12 flex">
            <img class="w-10/12 ml-11 p-2" src="../assets/following-step01.svg"/>
          </div>
          <div>
              <div class="mt-9 text-3xl">STEP</div>
              <div class="text-6xl text-[#e040fb] ">01</div>
          </div>
          <div class="pl-1 w-4/12">
            <div class="mt-20 text-5xl whitespace-nowrap">ユーザー情報の登録</div>
            <div class="mt-14 mr-14">代表の方の学籍番号、電話番号、学科、学年を入力してください。</div>
          </div>
          <div class="w-1/12"></div>
        </div>

        <!-- 02_参加団体登録 -->
        <div class="p-1 h-80 bg-white flex justify-end">
          <div class="w-1/12"></div>
          <div>
            <div class="mt-9 text-3xl">STEP</div>
            <div class="text-6xl text-[#e040fb] ">02</div>
          </div>
          <div class="pl-1 w-4/12">
            <div class="mt-20 text-5xl whitespace-nowrap">参加団体登録</div>
            <div class="mt-14 mr-14">あなたの団体名、カテゴリ、活動内容、企画名を登録してください。</div>
          </div>
          <div class="w-5/12 flex">
            <img class="w-10/12 ml-5 p-2" src="../assets/following-step02.svg"/>
          </div>
          <div class="w-1/12"></div>
        </div>

        <!-- 03_副代表登録 -->
        <div class="p-1 h-80 bg-gray-200 flex">
          <div class="w-1/12"></div>
          <div class="w-5/12 flex">
            <img class="w-10/12 ml-11 p-2" src="../assets/following-step03.svg"/>
          </div>
          <div>
              <div class="mt-9 text-3xl">STEP</div>
              <div class="text-6xl text-[#e040fb] ">03</div>
          </div>
          <div class="pl-1 w-4/12">
            <div class="mt-20 text-5xl whitespace-nowrap">副代表登録</div>
            <div class="mt-14 mr-14">副代表の方の名前、学籍番号、学科、学年、電話番号、メールアドレスを登録してください。</div>
          </div>
          <div class="w-1/12"></div>
        </div>

        <!-- 04_物品登録 -->
        <div class="p-1 h-80 bg-white flex justify-end">
          <div class="w-1/12"></div>
          <div>
            <div class="mt-9 text-3xl">STEP</div>
            <div class="text-6xl text-[#e040fb] ">04</div>
          </div>
          <div class="pl-1 w-4/12">
            <div class="mt-20 text-5xl whitespace-nowrap">物品登録</div>
            <div class="mt-14 mr-14">あなたの団体の借りたい物品の種類・数を登録してください。</div>
          </div>
          <div class="w-5/12 flex">
            <img class="w-10/12 ml-5 p-2" src="../assets/following-step04.svg"/>
          </div>
          <div class="w-1/12"></div>
        </div>

        <!-- 05_電力申請 -->
        <div class="p-1 h-80 bg-gray-200 flex">
          <div class="w-1/12"></div>
          <div class="w-5/12 flex">
            <img class="w-10/12 ml-11 p-2" src="../assets/following-step05.svg"/>
          </div>
          <div>
              <div class="mt-9 text-3xl">STEP</div>
              <div class="text-6xl text-[#e040fb] ">05</div>
          </div>
          <div class="pl-1 w-4/12">
            <div class="mt-20 text-5xl whitespace-nowrap">電力申請</div>
            <div class="mt-14 mr-14">あなたの団体が技大祭当日に使用する製品の製品名・消費電力量・メーカー・型番・製品URLを登録してください。</div>
          </div>
          <div class="w-1/12"></div>
        </div>

        <!-- 06_会場登録 -->
        <div class="p-1 h-80 bg-white flex justify-end">
          <div class="w-1/12"></div>
          <div>
            <div class="mt-9 text-3xl">STEP</div>
            <div class="text-6xl text-[#e040fb] ">06</div>
          </div>
          <div class="pl-1 w-4/12">
            <div class="mt-20 text-5xl whitespace-nowrap">会場・ステージ登録</div>
            <div class="mt-14 mr-14">あなたの団体の第一希望から第三希望までの出店希望場所を登録してください。</div>
          </div>
          <div class="w-5/12 flex">
            <img class="w-10/12 ml-5 p-2" src="../assets/following-step06.svg"/>
          </div>
          <div class="w-1/12"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  .stroke {
    color: rgba(0 0 0 / 0);
    letter-spacing: 0.1em;
    -webkit-text-stroke: 1px #333;
    text-shadow: 2px 2px 0 #e040fb;
}
</style>
