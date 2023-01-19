<template>
  <div class="card">
    <span class="red" />
    <div class="box"></div>
    <span class="line" />
    <div>
      <button class="ed_btn">
        <p class="edit">編集</p>
      </button>
      <button class="del_btn">
        <p class="delete">削除</p>
      </button>
    </div>
  </div>
</template>

<style>
  .card{
    width: 1026px;
    box-shadow: 0px 4px 10px 1px rgb(0 0 0 / 25%);
    @apply
      flex
      items-center
      relative
      mt-0.5
      h-36
      bg-white;
  }

  .red{
    @apply
      absolute
      left-0
      inline-block
      w-4
      h-full
      bg-red-600;
  }

  .box{
    @apply
      w-32;
  }

  .line{
    width: 1px;
    @apply
      inline-block
      h-24
    bg-gray-700;
  }



  .ed_btn{
    @apply
      flex
      items-center
      justify-center
      w-20
      h-8
      m-3
    bg-blue-400
      rounded;
  }

  .edit{
    letter-spacing: 0.3em;
    @apply
      font-normal
      text-lg
      leading-6
    text-white;
  }

  .del_btn{
    @apply
      flex
      items-center
      justify-center
      w-20
      h-8
      m-3
    bg-red-600
      rounded;
  }

  .delete{
    letter-spacing: 0.3em;
    @apply
      font-normal
      text-lg
      leading-6
    text-white;
  }
</style>
