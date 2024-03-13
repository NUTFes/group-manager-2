<script lang="ts" setup>
import { Setting } from '~~/types'

interface OrderList {
  first: number
  second: number
  third: number
}

interface Props {
  id: number | null
  regist: OrderList | null
  place: string
  remark: string
  n: number | null
  setting: boolean | null
}

interface Emits {
  (e: 'reloadPlace', v: null): void
}

const place = withDefaults(defineProps<Props>(), {
  id: null,
  regist: null,
  place: '',
  remark: '',
  n: null,
  setting: null
})

const emits = defineEmits<Emits>()
const reloadPlace = () => {
  emits('reloadPlace', null)
}

const config = useRuntimeConfig();
const isEditPlace = ref<boolean>();
onMounted(async()=>{
const setting = await $fetch<Setting>(config.APIURL+ "/user_page_settings") || null
  isEditPlace.value = setting.data[0].is_edit_place
});

const isEditModal = ref(false);
const openEditModal = () => {
  isEditModal.value = true
}
</script>

<template>
  <div class="text-[#333] font-light tracking-widest">
    <RegistInfoWideCard>
      <template #body>
        <div class="w-[13%] h-[90%] ml-8 text-3xl">
          {{ $t('Place.hope1') }}{{ place.n }}{{ $t('Place.hope2') }}
        </div>
        <RegistInfoDivideBar />
        <div class="w-[40%] text-center text-4xl">
          {{ place.place }}
        </div>
        <div class="w-[13%] h-[80%] text-base">{{ $t('Place.free') }}</div>
          <div class="w-[25%] h-[80%] pr-1 break-normal break-words text-ellipsis overflow-hidden">
            {{ place.remark }}
          </div>
      </template>
      <template v-if="isEditPlace" #method>
        <div class="mx-4">
          <EditButton @click="openEditModal()" />
        </div>
      </template>
    </RegistInfoWideCard>
  </div>
  <RegistInfoEditPlace
    v-if="isEditModal"
    v-model:edit-place="isEditModal"
    :id="place.id"
    :first="regist?.first"
    :second="regist?.second"
    :third="regist?.third"
    :remark="remark"
    @reload-place="reloadPlace()"
  />
</template>
