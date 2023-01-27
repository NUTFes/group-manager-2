<script lang="ts" setup>
</script>

<template>
  <div class="bg-white">
    <div>
      <div>
        <div>
          <div>
            <p class="mt-16 text-center text-5xl whitespace-nowrap ">参加概要</p>
          </div>
          <div>
            <p class="mt-12 text-center text-4xl whitespace-nowrap ">開催日時：2022年9月10日(土) 11日(日)</p>
          </div>
        </div>
        <div>
            <p class="mt-16 text-center text-5xl whitespace-nowrap ">登録の流れ</p>
        </div>
        <div>
          <div class="step135">
            <img class=" w-1/3" src="../assets/following-step01.svg"/>
            <div class="step">STEP</div>
            <div class="num">
              <p>01</p>
              <p>ユーザー情報の登録</p>
            </div>
            <div class="text">
              代表の方の学籍番号、電話番号、学科、学年を入力してください。
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  .step135{
    @apply
    p-1
    bg-gray-200
    flex
    justify-center;
  }

  .step{
    @apply
    text-center
    text-5xl
    whitespace-nowrap;
  }

  .num{
    @apply
    p-1
    bg-gray-200
    flex
    justify-center;
  }

  .text{
    @apply
    p-1
    bg-gray-200
    flex
    justify-center;
  }
</style>
