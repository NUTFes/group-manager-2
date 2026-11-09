<script lang="ts" setup>
import { Setting } from '~~/types'

interface Props {
  id: number | null
  groupId: number | null
  name: string
  department: string
  department_id: number | null
  grade: string
  grade_id: number | null
  tel: string
  email: string
  studentId: number | null
  setting: boolean | null
  rep_user_id: number | null
}
const sub = withDefaults(defineProps<Props>(), {
  id: null,
  groupId: null,
  name: '',
  department: '',
  department_id: null,
  grade: '',
  grade_id: null,
  tel: '',
  email: '',
  studentId: null,
  setting: null,
  rep_user_id: null
})

interface Emits {
  (e: 'reloadSubRep', v: null): void
}
const emits = defineEmits<Emits>()
const reloadSubRep = () => {
  emits('reloadSubRep', null)
}

const config = useRuntimeConfig();
const isEditSubRep = ref<boolean>();
onMounted(async()=>{
const setting = await $fetch<Setting>(config.APIURL+ "/user_page_settings") || null
  isEditSubRep.value = setting.data[0].is_edit_sub_rep
});

const isEditModal = ref<boolean>(false);
const openEditModal = () => {
  isEditModal.value = true
}
</script>

<template>
  <RegistInfoWideCard>
    <template #body>
      <div class="mx-10 pb-8 font-medium">
        {{ $t('Subrep.name') }}
        <div class="text-2xl">
          {{ sub.name }}
        </div>
      </div>
        <RegistInfoDivideBar />
      <div class="m-2 text-base">
        <p class="font-medium text-lg">{{ $t('Subrep.department') }}</p>
        <div class="flex items-center">{{ $t('Subrep.department') }}‣{{ sub.department }}</div>
        <div class="flex items-center">{{ $t('Subrep.grade') }}‣{{ sub.grade }}</div>
        <div class="flex items-center">{{ $t('Subrep.studentId') }}‣{{ sub.studentId }}</div>
      </div>
      <RegistInfoDivideBar />
      <div class="text-base mb-10">
        <p class="font-medium">{{ $t('Subrep.details') }}</p>
          <div class="character2">e-mail‣{{ sub.email }}</div>
          <div class="character2">tel‣{{ sub.tel }}</div>
      </div>
    </template>
    <template v-if="isEditSubRep" #method>
      <div class="absolute right-4">
        <EditButton @click="openEditModal()" />
      </div>
    </template>
  </RegistInfoWideCard>
  <RegistInfoEditSubRep
    v-if="isEditModal"
    v-model:edit-sub-rep="isEditModal"
    :id="sub.id"
    :group-id="sub.groupId"
    :name="sub.name"
    :department_id="sub.department_id"
    :grade_id="sub.grade_id"
    :student_id="sub.studentId"
    :email="sub.email"
    :tel="sub.tel"
    :rep_user_id="sub.rep_user_id"
    @reload-sub-rep="reloadSubRep"
  />
</template>
