<script lang="ts" setup>
</script>

<template>
  <div class="bg-white ">
    <div>
      <div>
        <div class="stroke mt-16 text-center text-5xl whitespace-nowrap " >{{ $t('Welcome.overview') }}</div>
        <div class="mt-12 text-center text-4xl whitespace-nowrap ">{{ $t('Welcome.overviewDetails') }}</div>
        <div class="stroke mt-24 mb-4 text-center text-5xl whitespace-nowrap ">{{ $t('Welcome.regist') }}</div>

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
            <div class="mt-20 text-5xl whitespace-nowrap">{{ $t('Welcome.regist1') }}</div>
            <div class="mt-14 mr-14">{{ $t('Welcome.regist1Details') }}</div>
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
            <div class="mt-20 text-5xl whitespace-nowrap">{{ $t('Welcome.regist2') }}</div>
            <div class="mt-14 mr-14">{{ $t('Welcome.regist2Details') }}</div>
          </div>
          <div class="w-5/12 flex">
            <img class="w-10/12 ml-32 p-2" src="../assets/following-step02.svg"/>
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
            <div class="mt-20 text-5xl whitespace-nowrap">{{ $t('Welcome.regist3') }}</div>
            <div class="mt-14 mr-14">{{ $t('Welcome.regist3Details') }}</div>
          </div>
          <div class="w-1/12"></div>
        </div>

        <!-- 04_会場・ステージ登録 -->
        <div class="p-1 h-80 bg-white flex justify-end">
          <div class="w-1/12"></div>
          <div>
            <div class="mt-9 text-3xl">STEP</div>
            <div class="text-6xl text-[#e040fb] ">04</div>
          </div>
          <div class="pl-1 w-4/12">
            <div class="mt-20 text-5xl whitespace-nowrap">{{ $t('Welcome.regist4') }}</div>
            <div class="mt-14 mr-14">{{ $t('Welcome.regist4Details') }}</div>
          </div>
          <div class="w-5/12 flex">
            <img class="w-10/12 ml-5 p-2" src="../assets/following-step04.svg"/>
          </div>
          <div class="w-1/12"></div>
        </div>

        <!-- 05_物品登録 -->
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
            <div class="mt-20 text-5xl whitespace-nowrap">{{ $t('Welcome.regist5') }}</div>
            <div class="mt-14 mr-14">{{ $t('Welcome.regist5Details') }}</div>
          </div>
          <div class="w-1/12"></div>
        </div>

        <!-- 06_電力申請 -->
        <div class="p-1 h-80 bg-white flex justify-end">
          <div class="w-1/12"></div>
          <div>
            <div class="mt-9 text-3xl">STEP</div>
            <div class="text-6xl text-[#e040fb] ">06</div>
          </div>
          <div class="pl-1 w-4/12">
            <div class="mt-20 text-5xl whitespace-nowrap">{{ $t('Welcome.regist6') }}</div>
            <div class="mt-14 mr-14">{{ $t('Welcome.regist6Details') }}</div>
          </div>
          <div class="w-5/12 flex">
            <img class="w-10/12 ml-8 p-2" src="../assets/following-step06.svg"/>
          </div>
          <div class="w-1/12"></div>
        </div>

        <!-- 07_従業員登録 -->
        <div class="p-1 h-80 bg-gray-200 flex">
          <div class="w-1/12"></div>
          <div class="w-5/12 flex">
            <img class="w-10/12 ml-11 p-2" src="../assets/following-step01.svg"/>
          </div>
          <div>
            <div class="mt-9 text-3xl">STEP</div>
              <div class="text-6xl text-[#e040fb] ">07</div>
          </div>
          <div class="pl-1 w-4/12">
            <div class="mt-20 text-5xl whitespace-nowrap">{{ $t('Welcome.regist7') }}</div>
            <div class="mt-14 mr-14">{{ $t('Welcome.regist7Details') }}</div>
          </div>
          <div class="w-1/12"></div>
        </div>

        <!-- 08_販売食品登録 -->
        <div class="p-1 h-80 bg-white flex justify-end">
          <div class="w-1/12"></div>
          <div>
            <div class="mt-9 text-3xl">STEP</div>
            <div class="text-6xl text-[#e040fb] ">08</div>
          </div>
          <div class="pl-1 w-4/12">
            <div class="mt-20 text-5xl whitespace-nowrap">{{ $t('Welcome.regist8') }}</div>
            <div class="mt-14 mr-14">{{ $t('Welcome.regist8Details') }}</div>
          </div>
          <div class="w-5/12 flex">
            <img class="w-10/12 ml-5 p-2" src="../assets/following-step02.svg"/>
          </div>
          <div class="w-1/12"></div>
        </div>

        <!-- 09_購入品登録 -->
        <div class="p-1 h-80 bg-gray-200 flex">
          <div class="w-1/12"></div>
          <div class="w-5/12 flex">
            <img class="w-10/12 ml-11 p-2" src="../assets/following-step03.svg"/>
          </div>
          <div>
            <div class="mt-9 text-3xl">STEP</div>
              <div class="text-6xl text-[#e040fb] ">09</div>
          </div>
          <div class="pl-1 w-4/12">
            <div class="mt-20 text-5xl whitespace-nowrap">{{ $t('Welcome.regist9') }}</div>
            <div class="mt-14 mr-14">{{ $t('Welcome.regist9Details') }}</div>
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
