<script lang="ts" setup>
</script>

<template>
  <div class="regidt-card">
    <NuxtLink to="/mypage" class="regist-back-link">マイページへ</NuxtLink>
    <div class="reist-title-content">
      <div class="regist-title">参加団体の編集</div>
    </div>
    <div class="regist-card-content">
      <div class="regist-card-content-question">
        <div class="regist-card-content-question-label">団体名</div>
        <input
          class="input"
          id="group"
          type="text"
        />
      </div>
      <div class="regist-card-content-question">
        <div class="regist-card-content-question-label">企画名</div>
        <input
          class="input"
          id="project"
          type="text"
        />
      </div>
      <div class="regist-card-content-question">
        <div class="regist-card-content-question-label">カテゴリ</div>
        <select
          class="input"
          id="category"
        >
          <option>
            カテゴリ
          </option>
        </select>
      </div>
      <div class="regist-card-content-question">
        <div class="regist-card-content-question-label">活動内容</div>
        <input
          class="input"
          id="activity"
          type="text"
        />
      </div>
    </div>
    <div class="regist-button">
      <button class="regist-submit-button">編集する</button>
    </div>
    <div class="delete-button">
      <button class="regist-submit-button">
        参加団体を削除する
      </button>
    </div>
  </div>

</template>

<style>
.regidt-card {
  @apply
    w-[1000px]
    mx-auto;
}

.reist-title-content {
  @apply
    flex
    flex-col
    justify-center
    items-center;
}

.regist-back-link {
  @apply
    block
    text-lg
    text-[#e040fb]
    cursor-pointer
    w-fit
    mt-5;
}

.regist-back-link:hover {
  @apply
    font-bold
    text-[#e040fb];
}

.regist-title {
  @apply
    w-[1000px]
    text-2xl
    font-bold
    bg-[#eceff1]
    mt-[2%];
  padding: 1% 1% 1% 2%;
}

.regist-card-content {
  @apply
    mt-[2%];
  border: solid 1px #d3d3d3;
  padding: 5% 1% 5% 1%;
}

.regist-card-content-question {
  @apply
    text-center
    h-[86px]
    w-[800px]
    mb-[3%]
    mx-auto;
}

.regist-card-content-question-label {
  @apply
    text-lg
    text-left
    mb-[1%];
}


.input {
  @apply
    text-left
    p-[1%]
    h-[50px]
    w-[800px]
    rounded-[7px]
    text-lg
    align-top
    box-border;
}
.input:required {
  border: 1px solid red;
}
.input:invalid {
  border: 1px solid red;
}
.input:valid {
  border: 1px solid #333333;
}

.regist-button {
  @apply
    text-right;
}
.delete-button {
  @apply
    text-center
    mb-8;
}


.regist-submit-button {
  @apply
    text-xl
    text-[#333333]
    bg-[#eceff1]
    font-bold
    rounded-[5px]
    mt-[2%]
    py-[1%]
    px-[5%]
    cursor-pointer;
}
.regist-submit-button:hover {
  @apply
    text-[#333333];
  background-image: linear-gradient(90deg, rgba(247, 93, 139, 1), rgba(254, 220, 64, 1));
}
.regist-submit-button:active{
  @apply
    text-[#333333];
  box-shadow: inset 1px 1px 2px #BABECC, inset -1px -1px 2px #FFF;
}

</style>
