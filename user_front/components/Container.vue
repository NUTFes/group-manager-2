<script lang="ts" setup>
const router = useRouter()

interface Props {
  name: string
}

const group = withDefaults(defineProps<Props>(),{
  name: ''
})

</script>

<template>
  <div class="font-sans">
    <div class="flex justify-between m-4 bg-white-100 text-xl font-bold">
      <button @click="router.push('/mypage')" class="bg-gray-100 text-pink-500 hover:bg-gray-200 hover:shadow-lg">
        マイページに戻る
      </button>
      <div class="flex-auto ml-8">参加団体登録・編集ページ</div>
      <div class="bg-gray-100 tracking-wide">{{ group.name }}</div>
    </div>
    <!-- <ul class="flex">
      <li v-for="order in orderList" :key="order.title">
        <div :class="{ clickBtn: tabController === order.tab }" @click="tabController = order.tab" class="title">
          {{ order.title }}
        </div>
      </li>
    </ul> -->
      <div class="height">
        <slot name="body"/>
      </div>
  </div>
</template>

<style>
.title {
  @apply
    bg-gray-100
    inline-block
    py-2
    px-4
    rounded-t-xl
    font-semibold
    hover:bg-gray-200
    hover:shadow-lg
    cursor-pointer
}

.height {
  @apply
    min-h-[100vh]
    w-full
    bg-gray-200
}

.clickBtn {
  background-color: darkorchid;
}
</style>
