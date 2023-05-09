<template>
  <div class="footer">
    {{ $t('Footer') }}
  </div>
</template>

<style>
  .footer{
    font-family: Noto Sans JP;
    @apply
      mt-auto
      flex
      justify-center
      items-center
      border-t-2
      text-xs
      font-light
      leading-5;
  }
</style>
