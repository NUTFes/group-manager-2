<script lang="ts" setup>
</script>

<template>
  <div class="regist-card">
    <NuxtLink to="/mypage" class="regist-back-link">マイページへ</NuxtLink>
    <div class="reist-title-content">
      <div class="user-info">パスワード再設定</div>
    </div>
    <div>
      <input type="password" placeholder="新しいパスワードを入力">
      <input type="password" placeholder="新しいパスワードの再入力">
    </div>
    <div class="regist-button">
      <button class="regist-submit-button" @click="submit">登録</button>
    </div>
  </div>
</template>

<style>
.regist-card {
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
    mt-5;
}

.regist-back-link:hover {
  @apply
    font-bold
    text-[#e040fb];
}

.user-info {
  @apply
    text-3xl
    font-bold
    mb-6;
  padding: 1% 1% 1% 2%;
}

select,
input {
  @apply
    text-left
    p-[1%]
    h-[50px]
    w-[1000px]
    mb-5
    rounded-[7px]
    text-lg
    align-top;
}
select,
input:required {
  border: 1px solid red;
}
select,
input:invalid {
  border: 1px solid red;
}
select,
input:valid {
  border: 1px solid #333333;
}

.regist-button {
  @apply
    text-right
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
