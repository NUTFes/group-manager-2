<script lang="ts" setup></script>

<template>
  <div class="bg-white">
    <div class="flex flex-col items-center gap-32">
      <div class="flex flex-col items-center gap-16">
        <div class="stroke text-xl sm:text-3xl md:text-5xl whitespace-nowrap">
          {{ $t("Welcome.overview") }}
        </div>
        <div class="text-sm sm:text-2xl md:text-4xl whitespace-nowrap">
          {{ $t("Welcome.overviewDetails") }}
        </div>
      </div>
      <div class="flex flex-col items-center">
        <div class="stroke mb-4 text-2xl sm:text-3xl md:text-5xl whitespace-nowrap">
          {{ $t("Welcome.regist") }}
        </div>

        <!-- 01_ユーザー情報の登録 -->
        <div class="w-full p-4 bg-gray-200 flex items-center justify-center">
          <div class="w-4/5 flex gap-16 my-8">
            <img class="w-1/2 opacity-50 md:opacity-100 md:w-1/3 absolute z-0 md:static" src="../assets/following-step01.svg" />
            <div class="relative z-10 flex flex-col">
              <p class="text-lg sm:text-3xl">STEP</p>
              <div class="flex items-center gap-4">
                <p class="text-3xl sm:text-6xl text-[#e040fb]">01</p>
                <p class="text-xl sm:text-5xl whitespace-nowrap">
                  {{ $t("Welcome.regist1") }}
                </p>
              </div>
              <div class="ml-24 mt-12">
                {{ $t("Welcome.regist1Details") }}
              </div>
            </div>
          </div>
        </div>

        <!-- 02_参加団体登録 -->
        <div class="w-full p-4 bg-white flex items-center justify-center">
          <div class="w-4/5 flex gap-16 my-8">
            <div class="relative z-10 flex flex-col">
              <p class="text-lg sm:text-3xl">STEP</p>
              <div class="flex items-center gap-4">
                <p class="text-3xl sm:text-6xl text-[#e040fb]">02</p>
                <p class="text-xl sm:text-5xl whitespace-nowrap">
                  {{ $t("Welcome.regist2") }}
                </p>
              </div>
              <div class="ml-24 mt-12">
                {{ $t("Welcome.regist2Details") }}
              </div>
            </div>
            <img
              class="w-1/2 opacity-50 md:opacity-100 md:w-1/3 absolute z-0 md:static"
              src="../assets/following-step02.svg"
            />
          </div>
        </div>

        <!-- 03_副代表登録 -->
        <div class="w-full p-4 bg-gray-200 flex items-center justify-center">
          <div class="w-4/5 flex gap-16 my-8">
            <img class="w-1/2 opacity-50 md:opacity-100 md:w-1/3 absolute z-0 md:static" src="../assets/following-step03.svg" />
            <div class="relative z-10 flex flex-col">
              <p class="text-lg sm:text-3xl">STEP</p>
              <div class="flex items-center gap-4">
                <p class="text-3xl sm:text-6xl text-[#e040fb]">03</p>
                <p class="text-xl sm:text-5xl whitespace-nowrap">
                  {{ $t("Welcome.regist3") }}
                </p>
              </div>
              <div class="ml-24 mt-12">
                {{ $t("Welcome.regist3Details") }}
              </div>
            </div>
          </div>
        </div>

        <!-- 04_会場・ステージ登録 -->
        <div class="w-full p-4 bg-white flex items-center justify-center">
          <div class="w-4/5 flex gap-16 my-8">
            <div class="relative z-10 flex flex-col">
              <p class="text-lg sm:text-3xl">STEP</p>
              <div class="flex items-center gap-4">
                <p class="text-3xl sm:text-6xl text-[#e040fb]">04</p>
                <p class="text-xl sm:text-5xl whitespace-nowrap">
                  {{ $t("Welcome.regist4") }}
                </p>
              </div>
              <div class="ml-24 mt-12">
                {{ $t("Welcome.regist4Details") }}
              </div>
            </div>
            <img class="w-1/2 opacity-50 md:opacity-100 md:w-1/3 absolute z-0 md:static" src="../assets/following-step04.svg" />
          </div>
        </div>

        <!-- 05_物品登録 -->
        <div class="w-full p-4 bg-gray-200 flex items-center justify-center">
          <div class="w-4/5 flex gap-16 my-8">
            <img class="w-1/2 opacity-50 md:opacity-100 md:w-1/3 absolute z-0 md:static" src="../assets/following-step05.svg" />
            <div class="relative z-10 flex flex-col">
              <p class="text-lg sm:text-3xl">STEP</p>
              <div class="flex items-center gap-4">
                <p class="text-3xl sm:text-6xl text-[#e040fb]">05</p>
                <p class="text-xl sm:text-5xl whitespace-nowrap">
                  {{ $t("Welcome.regist5") }}
                </p>
              </div>
              <div class="ml-24 mt-12">
                {{ $t("Welcome.regist5Details") }}
              </div>
            </div>
          </div>
        </div>

        <!-- 06_電力申請 -->
        <div class="w-full p-4 bg-white flex items-center justify-center">
          <div class="w-4/5 flex gap-16 my-8">
            <div class="relative z-10 flex flex-col">
              <p class="text-lg sm:text-3xl">STEP</p>
              <div class="flex items-center gap-4">
                <p class="text-3xl sm:text-6xl text-[#e040fb]">06</p>
                <p class="text-xl sm:text-5xl whitespace-nowrap">
                  {{ $t("Welcome.regist6") }}
                </p>
              </div>
              <div class="ml-24 mt-12">
                {{ $t("Welcome.regist6Details") }}
              </div>
            </div>
            <img class="w-1/2 opacity-50 md:opacity-100 md:w-1/3 absolute z-0 md:static" src="../assets/following-step06.svg" />
          </div>
        </div>

        <!-- 07_従業員登録 -->
        <div class="w-full p-4 bg-gray-200 flex items-center justify-center">
          <div class="w-4/5 flex gap-16 my-8">
            <img class="w-1/2 opacity-50 md:opacity-100 md:w-1/3 absolute z-0 md:static" src="../assets/following-step01.svg" />
            <div class="relative z-10 flex flex-col">
              <p class="text-lg sm:text-3xl">STEP</p>
              <div class="flex items-center gap-4">
                <p class="text-3xl sm:text-6xl text-[#e040fb]">07</p>
                <p class="text-xl sm:text-5xl whitespace-nowrap">
                  {{ $t("Welcome.regist7") }}
                </p>
              </div>
              <div class="ml-24 mt-12">
                {{ $t("Welcome.regist7Details") }}
              </div>
            </div>
          </div>
        </div>

        <!-- 08_販売品登録 -->
        <div class="w-full p-4 bg-white flex items-center justify-center">
          <div class="w-4/5 flex gap-16 my-8">
            <div class="relative z-10 flex flex-col">
              <p class="text-lg sm:text-3xl">STEP</p>
              <div class="flex items-center gap-4">
                <p class="text-3xl sm:text-6xl text-[#e040fb]">08</p>
                <p class="text-xl sm:text-5xl whitespace-nowrap">
                  {{ $t("Welcome.regist8") }}
                </p>
              </div>
              <div class="ml-24 mt-12">
                {{ $t("Welcome.regist8Details") }}
              </div>
            </div>
            <img class="w-1/2 opacity-50 md:opacity-100 md:w-1/3 absolute z-0 md:static" src="../assets/following-step02.svg" />
          </div>
        </div>

        <!-- 09_購入品登録 -->
        <div class="w-full p-4 bg-gray-200 flex items-center justify-center">
          <div class="w-4/5 flex gap-16 my-8">
            <img class="w-1/2 opacity-50 md:opacity-100 md:w-1/3 absolute z-0 md:static" src="../assets/following-step03.svg" />
            <div class="relative z-10 flex flex-col">
              <p class="text-lg sm:text-3xl">STEP</p>
              <div class="flex items-center gap-4">
                <p class="text-3xl sm:text-6xl text-[#e040fb]">09</p>
                <p class="text-xl sm:text-5xl whitespace-nowrap">
                  {{ $t("Welcome.regist9") }}
                </p>
              </div>
              <div class="ml-24 mt-12">
                {{ $t("Welcome.regist9Details") }}
              </div>
            </div>
          </div>
        </div>

        <!-- 10_PR文の申請 -->
        <div class="w-full p-4 bg-white flex items-center justify-center">
          <div class="w-4/5 flex gap-16 my-8">
            <div class="relative z-10 flex flex-col">
              <p class="text-lg sm:text-3xl">STEP</p>
              <div class="flex items-center gap-4">
                <p class="text-3xl sm:text-6xl text-[#e040fb]">10</p>
                <p class="text-xl sm:text-5xl whitespace-nowrap">
                  {{ $t("Welcome.regist10") }}
                </p>
              </div>
              <div class="ml-24 mt-12">
                {{ $t("Welcome.regist10Details") }}
              </div>
            </div>
            <img class="w-1/2 opacity-50 md:opacity-100 md:w-1/3 absolute z-0 md:static" src="../assets/following-step04.svg" />
          </div>
        </div>

        <!-- 11_アナウンス文の申請 -->
        <div class="w-full p-4 bg-gray-200 flex items-center justify-center">
          <div class="w-4/5 flex gap-16 my-8">
            <img class="w-1/2 opacity-50 md:opacity-100 md:w-1/3 absolute z-0 md:static" src="../assets/following-step05.svg" />
            <div class="relative z-10 flex flex-col">
              <p class="text-lg sm:text-3xl">STEP</p>
              <div class="flex items-center gap-4">
                <p class="text-3xl sm:text-6xl text-[#e040fb]">11</p>
                <p class="text-xl sm:text-5xl whitespace-nowrap">
                  {{ $t("Welcome.regist11") }}
                </p>
              </div>
              <div class="ml-24 mt-12">
                {{ $t("Welcome.regist11Details") }}
              </div>
            </div>
          </div>
        </div>

        <!-- 12_模擬店平面図の申請 -->
        <div class="w-full p-4 bg-white flex items-center justify-center">
          <div class="w-4/5 flex gap-16 my-8">
            <div class="relative z-10 flex flex-col">
              <p class="text-lg sm:text-3xl">STEP</p>
              <div class="flex items-center gap-4">
                <p class="text-3xl sm:text-6xl text-[#e040fb]">12</p>
                <p class="text-xl sm:text-5xl whitespace-nowrap">
                  {{ $t("Welcome.regist12") }}
                </p>
              </div>
              <div class="ml-24 mt-12">
                {{ $t("Welcome.regist12Details") }}
              </div>
            </div>
            <img class="w-1/2 opacity-50 md:opacity-100 md:w-1/3 absolute z-0 md:static" src="../assets/following-step06.svg" />
          </div>
        </div>

        <!-- 13_調理工程の申請 -->
        <div class="w-full p-4 bg-gray-200 flex items-center justify-center">
          <div class="w-4/5 flex gap-16 my-8">
            <img class="w-1/2 opacity-50 md:opacity-100 md:w-1/3 absolute z-0 md:static" src="../assets/following-step01.svg" />
            <div class="relative z-10 flex flex-col">
              <p class="text-lg sm:text-3xl">STEP</p>
              <div class="flex items-center gap-4">
                <p class="text-3xl sm:text-6xl text-[#e040fb]">13</p>
                <p class="text-xl sm:text-5xl whitespace-nowrap">
                  {{ $t("Welcome.regist13") }}
                </p>
              </div>
              <div class="ml-24 mt-12">
                {{ $t("Welcome.regist13Details") }}
              </div>
            </div>
          </div>
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
