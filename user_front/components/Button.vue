<template>
  <div>
    <button class="btn">
      <p class="plus">
        +
      </p>
      {{ $t('Button.request') }}
      </button>
  </div>
</template>

<style>
.btn{
	border-radius: 50%;
  background: linear-gradient(-30deg, #032030, #1f4174);
  @apply
    /* tracking-widest */
    font-sans
    not-italic
    font-medium
    text-2xl
    text-gray-100
    w-28
    h-28;
}

.plus{
  @apply
    tracking-widest
    font-sans
    not-italic
    font-medium
    text-5xl
    text-gray-100
}
</style>
