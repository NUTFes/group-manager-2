<script lang="ts" setup>

interface Props {
  groupId: number | null
  name: string
  department: string
  grade: string
  tel: string
  email: string
  student_id: number | null
  setting: boolean | null
}


const sub = withDefaults(defineProps<Props>(), {
  groupId: null,
  name: '',
  department: '',
  grade: '',
  tel: '',
  email: '',
  student_id: null,
  setting: null
})
const isShow = ref<boolean>(false)

</script>

<template>
  <RegistInfoWideCard>
    <template #body>
      <div class="mx-10 pb-8 font-medium">
        名前
        <div class="text-2xl">
          {{ sub.name }}
        </div>
      </div>
        <RegistInfoDivideBar />
      <div class="m-2 text-base">
        <p class="font-medium text-lg">所属</p>
        <!--　propsが読み込めなくなるので一旦削除 <RegistInfoTriangle /> -->
        <div class="flex items-center">分野‣{{ sub.department }}</div>
        <div class="flex items-center">学年‣{{ sub.grade }}</div>
        <div class="flex items-center">学籍‣{{ sub.student_id }}</div>
      </div>
      <RegistInfoDivideBar />
      <div class="text-base mb-10">
        <p class="font-medium">詳細情報</p>
          <div class="character2">{{ sub.email }}</div>
          <div class="character2">{{ sub.tel }}</div>
      </div>
    </template>
    <template #method>
      <div class="absolute right-4">
        <EditButton @click="isShow=true" />
      </div>
    </template>
  </RegistInfoWideCard>
  <!-- <RegistInfoEditSubRep v-model:visible="isShow" /> -->
</template>
