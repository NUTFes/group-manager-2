<script lang="ts" setup>

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

const isEditEmployee = ref<boolean>(false)
const isDeleteEmployee = ref<boolean>(false)

const openEditItem = () => {
  isEditEmployee.value = true
}
const openDeleteItem = () => {
  isDeleteEmployee.value = true
}
</script>

<template>
  <RegistInfoNarrowCard>
    <template #body>
      <div class="h-[20%] flex py-4 mx-8 text-3xl tracking-wide">
        <div class="my-2">
          No.{{ employee.studentId }}
        </div>
        <div class="flex-col mx-8">
          <EditButton @click="openEditItem()" />
          <DeleteButton @click="openDeleteItem()" />
        </div>
      </div>
      <div class="h-[80%] pt-28 ml-5 mx-4 text-5xl text-center truncate hover:text-clip">
        {{ employee.name }}
      </div>
    </template>
  </RegistInfoNarrowCard>
  <RegistInfoDeleteEmployee
    v-if="isDeleteEmployee"
    v-model:delete-employee="isDeleteEmployee"
    :id="id"
    @reload-employee="reloadEmployee()"
  />
  <RegistInfoEditEmployee
    v-if="isEditEmployee"
    v-model:edit-employee="isEditEmployee"
    :id="id"
    :group-id="groupId"
    :name="name"
    :student-id="studentId"
    @reload-employee="reloadEmployee()"
  />
</template>
