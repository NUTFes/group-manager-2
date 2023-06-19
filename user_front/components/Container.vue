<script lang="ts" setup>
const router = useRouter()

interface Props {
  name: string
}

const group = withDefaults(defineProps<Props>(), {
  name: ''
})
</script>

<template>
  <div class="font-sans">
    <div class="flex justify-between m-4 bg-white-100 text-xl font-bold">
      <div class="flex-auto ml-8">{{ $t('RegistInfo.registAndEdit') }}</div>
      <div class="bg-gray-100 tracking-wide">{{ group.name }}</div>
    </div>
    <slot name="tabs"></slot>
    <div class="min-h-[100vh] w-full bg-gray-200 pb-3">
      <slot name="body"/>
    </div>
  </div>
</template>
