<script lang="ts" setup>

const config = useRuntimeConfig();

interface Emits {
  (e: 'update:editSubRep', isEditSubRep: boolean): void
}

interface Props {
  id: number
  groupId: number
  name: string
  department_id: number
  grade_id: number
  tel: string
  email: string
  student_id: number
}

const props = withDefaults(defineProps<Props>(), {
  id: 0,
  groupId: 0,
  name: '',
  department_id: 0,
  grade_id: 0,
  tel: '',
  email: '',
  student_id: 0,
})

const emits = defineEmits<Emits>()

const closeEditSubRep = () => {
  emits('update:editSubRep', false)
}

const newName = ref<string>('')
const newDepartment = ref<number>()
const newGrade = ref<string>('')
const newTel = ref<string>('')
const newEmail = ref<string>('')
const newStudentId = ref<number>()
// const newSetting = ref<boolean>()

// TODO 共通化させたい utils/, plugins/
const departmentList = [
  { id: 1, name: "機械創造工学課程" },
  { id: 2, name: "電気電子情報工学課程" },
  { id: 3, name: "物質材料工学課程" },
  { id: 4, name: "環境社会基盤工学課程" },
  { id: 5, name: "生物機能工学課程" },
  { id: 6, name: "情報・経営システム工学課程" },
  { id: 7, name: "機械創造工学専攻" },
  { id: 8, name: "電気電子情報工学専攻" },
  { id: 9, name: "物質材料工学専攻" },
  { id: 10, name: "環境社会基盤工学専攻" },
  { id: 11, name: "生物機能工学専攻" },
  { id: 12, name: "情報・経営システム工学専攻" },
  { id: 13, name: "原子力システム安全工学専攻" },
  { id: 14, name: "システム安全専攻" },
  { id: 15, name: "技術科学イノベーション専攻" },
  { id: 16, name: "情報・制御工学専攻" },
  { id: 17, name: "材料工学専攻" },
  { id: 18, name: "エネルギー・環境工学専攻" },
  { id: 19, name: "生物統合工学専攻" },
  { id: 20, name: "その他" },
];
const gradeList = [
  { id: 1, name: "B1[学部1年]" },
  { id: 2, name: "B2[学部2年]" },
  { id: 3, name: "B3[学部3年]" },
  { id: 4, name: "B4[学部4年]" },
  { id: 5, name: "M1[修士1年]" },
  { id: 6, name: "M2[修士2年]" },
  { id: 7, name: "D1[博士1年]" },
  { id: 8, name: "D2[博士2年]" },
  { id: 9, name: "D3[博士3年]" },
  { id: 10, name: "GD1[イノベ1年]" },
  { id: 11, name: "GD2[イノベ2年]" },
  { id: 12, name: "GD3[イノベ3年]" },
  { id: 13, name: "GD4[イノベ4年]" },
  { id: 14, name: "GD4[イノベ5年]" },
  { id: 15, name: "その他" },
];


// TODO props.id(sub_rep.id)が取得できるようにapiを修正
const editSubRep = async () => {
  await useFetch(config.APIURL + "/sub_reps/" + props.id, {
    method: "PUT",
    params: {
      group_id: props.groupId,
      name: newName.value,
      department_id: newDepartment.value,
      grade_id: newGrade.value,
      tel: newTel.value,
      email: newEmail.value,
      student_id: newStudentId.value,
    },
  })
  closeEditSubRep()
};

</script>

<template>
  <Modal title="副代表の編集">
    <template #close>
      <div class="flex justify-end">
        <button @click="closeEditSubRep()" class="hover:text-black hover:opacity-75"
        >✖</button>
      </div>
    </template>
    <template #form>
      <div class="text">名前</div>
      <input class="entry" v-model="newName" />
      <div class="text">学科</div>
      <select class="entry" v-model="newDepartment">
        <option
          v-for="department in departmentList"
          :value="department.id"
          :key="department.id"
        >
          {{ department.name }}
        </option>
      </select>
      <div class="text">学年</div>
      <select class="entry" v-model="newGrade">
        <option
          v-for="grade in gradeList"
          :value="grade.id"
          :key="grade.id"
        >
          {{ grade.name }}
        </option>
      </select>
      <div class="text">電話番号</div>
      <input class="entry" v-model="newTel" />
      <div class="text">メールアドレス</div>
      <input class="entry" v-model="newEmail" />
      <div class="text">学籍番号</div>
      <input class="entry" v-model="newStudentId" />
      <div class="flex justify-between mt-8 mx-8">
        <RegistPageButton text="reset"></RegistPageButton>
        <RegistPageButton text="register" @click="editSubRep()"></RegistPageButton>
      </div>
    </template>
  </Modal>
</template>

<style scoped>
.text {
  margin: 3% 10% 0%;
}
.entry {
  margin: 0% 10%;
  border: 1px solid silver;
  border-top : solid 1px #717171;
  border-bottom : solid 1px #e0e0e0;
  border-radius: 5px;
  background-color: white;
}
</style>
