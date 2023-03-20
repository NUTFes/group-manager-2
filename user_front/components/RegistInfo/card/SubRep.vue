<script lang="ts" setup>

interface Props {
  id: number | null
  groupId: number | null
  name: string
  department: number | null
  grade: string
  tel: string
  email: string
  studentId: number | null
  setting: boolean | null
}

const sub = withDefaults(defineProps<Props>(), {
  id: null,
  groupId: null,
  name: '',
  department: null,
  grade: '',
  tel: '',
  email: '',
  studentId: null,
  setting: null
})
const isEditSubRep = ref<boolean>(false)

const openEditSubRep = () => {
  isEditSubRep.value = true
}

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
        <div class="flex items-center">分野‣{{ sub.department }}</div>
        <div class="flex items-center">学年‣{{ sub.grade }}</div>
        <div class="flex items-center">学籍‣{{ sub.studentId }}</div>
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
        <EditButton @click="openEditSubRep()" />
      </div>
    </template>
  </RegistInfoWideCard>
  <RegistInfoEditSubRep
    v-if="isEditSubRep"
    v-model:edit-sub-rep="isEditSubRep"
    :id="sub.id"
    :group-id="sub.groupId"
    :name="sub.name"
    :department_id="sub.department"
    :grade_id="sub.studentId"
  />
</template>
