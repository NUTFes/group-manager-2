<script lang="ts" setup>
import { Setting } from '~~/types'

interface Props {
  groupId: number | null
  id: number | null
  item: string
  power: number | null
  manufacturer: string
  model: string
  url: string
  setting: boolean | null
  totalPower: number | null;
}
const props = withDefaults(defineProps<Props>(), {
  groupId: null,
  id: null,
  item: '',
  power: null,
  manufacturer: '',
  model: '',
  url: '',
  setting: null,
  totalPower: 0,
})

interface Emits {
  (e: 'reloadPower', v: null): void
}
const emits = defineEmits<Emits>()
const reloadPower = () => {
  emits('reloadPower', null)
}

const config = useRuntimeConfig();
const isEditPowerOrder = ref<boolean>();
onMounted(async()=>{
const setting = await $fetch<Setting>(config.APIURL+ "/user_page_settings") || null
  isEditPowerOrder.value = setting.data[0].is_edit_power_order
});

const isEditModal = ref<boolean>(false);
const openEditModal = () => {
  isEditModal.value = true
}
const isDeleteModal = ref<boolean>(false);
const openDeleteModal = () => {
  isDeleteModal.value = true
}
</script>

<template>
  <div class="tracking-widest font-light">
    <RegistInfoWideCard>
      <template #body>
        <div class="w-[37%] text-center pl-8 text-4xl font-light truncate hover:text-clip">
        {{ props.item }}
        </div>
        <RegistInfoDivideBar />
        <div class="flex w-28 justify-end m-4 text-center ml-8">
          <div class="text-5xl font-light">{{ props.power }}</div>
          <div class="mt-12 font-light text-ms">[W]</div>
        </div>
        <RegistInfoDivideBar />
        <div>
          <div class="flex items-center text-lg">
            <div class="w-20">{{ $t('Power.maker') }}</div>
            <RegistInfoTriangle />
            <div class="w-40 truncate hover:text-clip">{{ props.manufacturer }}</div>
          </div>
          <div class="flex items-center">
            <div class="w-20 h-6 ">{{ $t('Power.model') }}</div>
            <RegistInfoTriangle />
            <div class="w-40 break-normal truncate hover:text-clip">{{ props.model }}</div>
          </div>
        </div>
      </template>
      <template v-if="isEditPowerOrder" #method>
        <div class="absolute right-4">
          <div class="my-2">
            <EditButton @click="openEditModal()" />
          </div>
          <DeleteButton @click="openDeleteModal()" />
        </div>
      </template>
    </RegistInfoWideCard>
    <RegistInfoEditPower
      v-if="isEditModal"
      v-model:edit-power="isEditModal"
      :group-id="groupId"
      :id="id"
      :item="item"
      :power="power"
      :manufacturer="manufacturer"
      :model="model"
      :url="url"
      :total-power="totalPower"
      @reload-power="reloadPower()"
    />
    <RegistInfoDeletePower
      v-if="isDeleteModal"
      v-model:delete-power="isDeleteModal"
      :id="id"
      @reload-power="reloadPower()"
    />
  </div>
</template>
