<script lang="ts" setup>

interface Props {
  groupId: number | null
  id: number | null
  item: string
  power: number | null
  manufacturer: string
  model: string
  url: string
  setting: boolean | null
}

const power = withDefaults(defineProps<Props>(), {
  groupId: null,
  id: null,
  item: '',
  power: null,
  manufacturer: '',
  model: '',
  url: '',
  setting: null
})

const isEditPower = ref<boolean>(false)
const isDeletePower = ref<boolean>(false)

const openEditPower = () => {
  isEditPower.value = true
}

const openDeletePower = () => {
  isDeletePower.value = true
}
</script>

<template>
  <div class="tracking-widest font-light">
    <RegistInfoWideCard>
      <template #body>
        <div class="w-[37%] text-center pl-8 text-5xl font-light">
        {{ power.item }}
      </div>
      <RegistInfoDivideBar />
      <div class="flex w-28 justify-end m-4 text-center">
        <div class="text-6xl font-light">{{ power.power }}</div>
        <div class="mt-12 font-light text-ms">[W]</div>
      </div>
      <RegistInfoDivideBar />
      <div>
        <div class="flex items-center text-lg">
          <div class="w-20 ">メーカー</div>
          <RegistInfoTriangle />
          <div class="w-32 ">{{ power.manufacturer }}</div>
        </div>
        <div class="flex items-center">
          <div class="w-20 h-6">型番</div>
          <RegistInfoTriangle />
          <div class="w-32 break-normal">{{ power.model }}</div>
        </div>
      </div>
    </template>
    <template #method>
      <div class="absolute right-4">
        <div class="my-2">
          <EditButton @click="openEditPower()" />
        </div>
        <DeleteButton @click="openDeletePower()" />
      </div>
    </template>
  </RegistInfoWideCard>
  <RegistInfoEditPower
    v-if="isEditPower"
    v-model:edit-power="isEditPower"
  />
  <RegistInfoDeletePower
    v-if="isDeletePower"
    v-model:delete-power="isDeletePower"
  />

</div>
</template>