<script lang="ts" setup>
import { gradeList, GradeWithDepartmentList } from "~/utils/list";
import { useField, useForm } from "vee-validate";
import { subRepSchema } from "~/utils/validate";
import { User, UserDetail } from "@/types/currentUser";
const config = useRuntimeConfig();

interface Props {
  id: number | null;
  groupId: number | null;
  name: string;
  department_id: number | null;
  grade_id: number | null;
  tel: string;
  email: string;
  student_id: number | null;
  rep_user_id: number | null;
}

const props = withDefaults(defineProps<Props>(), {
  id: null,
  groupId: null,
  name: "",
  department_id: null,
  grade_id: null,
  tel: "",
  email: "",
  student_id: null,
  rep_user_id: null,
});

const { meta, isSubmitting } = useForm({
  validationSchema: subRepSchema,
  initialValues: {
    name: props.name,
    studentId: props.student_id,
    tel: props.tel,
    email: props.email,
    department: props.department_id,
    grade: props.grade_id,
  },
});
const { handleChange: handleName, errorMessage: nameError } = useField("name");
const { handleChange: handleStudentId, errorMessage: studentIdError } =
  useField("studentId");
const { handleChange: handleTel, errorMessage: telError } = useField("tel");
const { handleChange: handleMail, errorMessage: mailError } = useField("email");
const { handleChange: handleDepartmentId, errorMessage: departmentIdError } =
  useField("department");
const { handleChange: handleGradeId, errorMessage: gradeIdError } =
  useField("grade");

const userData = ref<User | null>(null);
const userDetailData = ref<UserDetail | null>(null);

onMounted(async () => {
  console.log(props.tel);
  const res = await $fetch<{ data: User }>(
    config.APIURL + "/users/" + props.rep_user_id
  );
  userData.value = res.data;
  const resDetail = await $fetch<{ data: UserDetail }>(
    config.APIURL + "/user_details?user_id=" + props.rep_user_id
  );
  userDetailData.value = resDetail.data;

  checkNameOverlap();
  checkTelOverlap();
  checkEmailOverlap();
  checkStudentIdOverlap();
});

const checkNameOverlap = () => {
  if (newName.value == userData.value?.name) {
    handleName("false");
  } else {
    handleName(newName.value);
  }
};
const checkTelOverlap = () => {
  if (newTel.value == userDetailData.value?.tel) {
    handleTel("false");
  } else {
    handleTel(newTel.value);
  }
};
const checkEmailOverlap = () => {
  if (newEmail.value == userData.value?.email) {
    handleMail("false");
  } else {
    handleMail(newEmail.value);
  }
};
const checkStudentIdOverlap = () => {
  if (newStudentId.value == userDetailData.value?.student_id) {
    handleStudentId("false");
  } else {
    handleStudentId(newStudentId.value);
  }
};

interface Emits {
  (e: "update:editSubRep", isEditSubRep: boolean): void;
  (e: "reloadSubRep", v: null): void;
}
const emits = defineEmits<Emits>();
const closeEditSubRep = () => {
  emits("update:editSubRep", false);
};
const reloadSubRep = () => {
  emits("reloadSubRep", null);
};

const newName = ref<Props["name"]>(props.name);
const newDepartment = ref<Props["department_id"]>(props.department_id);
const newGrade = ref<Props["grade_id"]>(props.grade_id);
const newTel = ref<Props["tel"]>(props.tel);
const newEmail = ref<Props["email"]>(props.email);
const newStudentId = ref<Props["student_id"]>(props.student_id);
// const newSetting = ref<boolean>()

const editSubRep = async () => {
  if (props.id == null) {
    await useFetch(config.APIURL + "/sub_reps", {
      method: "POST",
      params: {
        group_id: props.groupId,
        name: newName.value,
        department_id: newDepartment.value,
        grade_id: newGrade.value,
        tel: newTel.value,
        email: newEmail.value,
        student_id: newStudentId.value,
      },
    });
  } else {
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
    });
  }
  reloadSubRep();
  closeEditSubRep();
};

const reset = () => {
  newName.value = "";
  newDepartment.value = null;
  newGrade.value = null;
  newTel.value = "";
  newEmail.value = "";
  newStudentId.value = null;
  handleName("");
  handleDepartmentId("");
  handleGradeId("");
  handleTel("");
  handleMail("");
  handleStudentId("");
};

const currentDepartmentList = ref<{ id: number; name: string }[]>([]);
const createCurrentDepartmentList = (e: any) => {
  currentDepartmentList.value = GradeWithDepartmentList.filter((grade) => {
    return grade.id === Number(e.target.value);
  })[0].departmentList;
};

onMounted(() => {
  if (props.grade_id != null) {
    createCurrentDepartmentList({ target: { value: props.grade_id } });
  }
});
</script>

<template>
  <Modal :title="$t('Subrep.editSubrepresentative')">
    <template #close>
      <div class="flex justify-end">
        <button
          @click="closeEditSubRep()"
          class="hover:text-black hover:opacity-75"
        >
          ✖
        </button>
      </div>
    </template>
    <template #form>
      <div class="text">{{ $t("Subrep.name") }}</div>
      <input
        class="entry"
        v-model="newName"
        @change="checkNameOverlap"
        :class="{ error_border: nameError }"
      />
      <div class="error_msg">{{ nameError }}</div>
      <div class="text">{{ $t("Subrep.studentId") }}</div>
      <input
        class="entry"
        v-model="newStudentId"
        maxlength="8"
        @change="checkStudentIdOverlap"
        :class="{ error_border: studentIdError }"
      />
      <div class="error_msg">{{ studentIdError }}</div>
      <div class="error_msg">{{ departmentIdError }}</div>
      <div class="text">{{ $t("Subrep.grade") }}</div>
      <select
        class="entry"
        v-model="newGrade"
        @change="
          (e) => {
            handleGradeId(e);
            createCurrentDepartmentList(e);
          }
        "
        :class="{ error_border: gradeIdError }"
      >
        <option v-for="grade in gradeList" :value="grade.id" :key="grade.id">
          {{ grade.name }}
        </option>
      </select>
      <div class="error_msg">{{ gradeIdError }}</div>
      <div class="text">{{ $t("Subrep.department") }}</div>
      <select
        class="entry"
        v-model="newDepartment"
        @change="handleDepartmentId"
        :class="{ error_border: departmentIdError }"
      >
        <option
          v-for="department in currentDepartmentList"
          :value="department.id"
          :key="department.id"
        >
          {{ department.name }}
        </option>
      </select>
      <div class="text">{{ $t("Subrep.mail") }}</div>
      <input
        class="entry"
        v-model="newEmail"
        @change="checkEmailOverlap"
        :class="{ error_border: mailError }"
      />
      <div class="error_msg">{{ mailError }}</div>
      <div class="text">{{ $t("Subrep.tel") }}</div>
      <input
        class="entry"
        v-model="newTel"
        @change="checkTelOverlap"
        maxlength="11"
        :class="{ error_border: telError }"
      />
      <div class="error_msg">{{ telError }}</div>
      <div class="flex justify-between mt-8 mx-8">
        <RegistPageButton
          :text="$t('Button.reset')"
          @click="reset()"
        ></RegistPageButton>
        <RegistPageButton
          :disabled="!meta.valid || isSubmitting"
          :text="$t('Button.edit')"
          @click="editSubRep()"
        ></RegistPageButton>
      </div>
    </template>
  </Modal>
</template>

<style scoped>
.error_msg {
  @apply mx-[10%] text-rose-600;
}
.error_border {
  @apply border-2 border-rose-600;
}
.text {
  margin: 3% 10% 0%;
}
.entry {
  margin: 0% 10%;
  border: 1px solid silver;
  border-top: solid 1px #717171;
  border-bottom: solid 1px #e0e0e0;
  border-radius: 5px;
  background-color: white;
}
</style>
