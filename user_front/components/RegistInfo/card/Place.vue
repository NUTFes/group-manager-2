<script lang="ts" setup>

interface Props {
  regist: string
  placeOrderId: number | null
  place: string
  remark: string
  n: number | null
  setting: boolean | null
}

const item = withDefaults(defineProps<Props>(), {
  regist: '',
  placeOrderId: null,
  place: '',
  remark: '',
  n: null,
  setting: null
})
</script>

<template>
  <div class="text-[#333333] font-light tracking-widest">
    <RegistInfoWideCard>
      <template #body>
        <div class="w-[15%] h-[90%] ml-8 text-3xl">
          第{{ item.n }}希望
        </div>
        <RegistInfoDivideBar />
        <div class="w-[40%] text-center text-4xl">
          {{ item.place }}
        </div>
        <div class="w-[7%] h-[80%] text-base">追記：</div>
          <div class="w-[30%] h-[80%] pr-1 break-normal">
            {{ item.remark }}
          </div>
      </template>
      <template #method>
        <div class="mx-4">
          <EditButton />
        </div>
      </template>
    </RegistInfoWideCard>
  </div>
</template>
