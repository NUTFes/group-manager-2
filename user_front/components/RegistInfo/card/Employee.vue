<script lang="ts" setup>
import { Setting } from '~~/types'

interface Props {
  id: number
  groupId: number
  name: string
  studentId: number
  setting: boolean | null
}
interface Emits {
  (e: 'reloadEmployee', v: null): void
}

const employee = withDefaults(defineProps<Props>(), {
  id: 0,
  groupId: 0,
  name: '',
  studentId: 0,
  setting: null
})

const emits = defineEmits<Emits>()
const reloadEmployee = () => {
  emits('reloadEmployee', null)
}

const config = useRuntimeConfig();
const isEditEmployee = ref<boolean>();
onMounted(async()=>{
const setting = await $fetch<Setting>(config.APIURL+ "/user_page_settings") || null
  isEditEmployee.value = setting.data[0].is_edit_employee
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
  <RegistInfoNarrowCard>
    <template #body>
      <div class="h-[20%] flex py-4 mx-8 text-3xl tracking-wide">
        <div class="my-2">
          No.{{ employee.studentId }}
        </div>
        <div v-if="isEditEmployee" class="flex-col mx-8">
          <EditButton @click="openEditModal()" />
          <DeleteButton @click="openDeleteModal()" />
        </div>
      </div>
      <div class="h-[80%] pt-28 ml-5 mx-4 text-5xl text-center truncate hover:text-clip">
        {{ employee.name }}
      </div>
    </template>
  </RegistInfoNarrowCard>
  <RegistInfoDeleteEmployee
    v-if="isDeleteModal"
    v-model:delete-employee="isDeleteModal"
    :id="id"
    @reload-employee="reloadEmployee()"
  />
  <RegistInfoEditEmployee
    v-if="isEditModal"
    v-model:edit-employee="isEditModal"
    :id="id"
    :group-id="groupId"
    :name="name"
    :student-id="studentId"
    @reload-employee="reloadEmployee()"
  />
</template>
