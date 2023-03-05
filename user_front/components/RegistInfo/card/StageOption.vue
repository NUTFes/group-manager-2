<script lang="ts" setup>

interface Props {
  groupId: number | null
  id: number | null
  ownEquipment: boolean | null
  bgm: boolean | null
  cameraPermission: boolean | null
  loudSound: boolean | null
  stageContent: string
  setting: boolean | null
}

const option = withDefaults(defineProps<Props>(), {
  groupId: null,
  id: null,
  ownEquipment: null,
  bgm: null,
  cameraPermission: null,
  loudSound: null,
  stageContent: '',
  setting: null
})
const isShow = ref<boolean>()

</script>

<template>
  <div class="tracking-wide">
    <RegistInfoWideCard>
      <template #body>
        <div class="ml-8 mr-4 h-24">
        <div class="upper">機器▾</div>
        <div class="lower">{{ option.ownEquipment ? "使用" : "不使用" }}</div>
      </div>
      <RegistInfoDivideBar />
      <div class="h-24">
        <div class="upper">音楽▾</div>
        <div class="lower">{{ option.bgm ? "使用" : "不使用" }}</div>
      </div>
      <RegistInfoDivideBar />
      <div class="h-24">
        <div class="upper">撮影▾</div>
        <div class="lower">{{ option.cameraPermission ? "許可" : "禁止" }}</div>
      </div>
      <RegistInfoDivideBar />
      <div class="h-24">
        <div class="upper">騒音▾</div>
        <div class="lower">{{ option.loudSound ? "有" : "無" }}</div>
      </div>
      <RegistInfoDivideBar />
      <div class="h-24">
        <div class="upper">ステージ内容▾</div>
        <div class="w-80 break-normal">{{ option.stageContent }}</div>
      </div>
    </template>
    <template #method>
      <div class="absolute right-8">
        <EditButton @click="isShow = true" />
      </div>
    </template>
  </RegistInfoWideCard>
  </div>
  <RegistInfoEditStage v-model:visible="isShow" />
</template>

<style>
.upper {
  @apply
    text-[18px]
    text-left;
}
.lower {
  @apply
    text-[35px]
    text-center;
}
</style>
