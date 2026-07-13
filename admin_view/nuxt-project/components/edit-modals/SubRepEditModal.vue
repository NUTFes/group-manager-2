<template>
  <EditModal @close="$emit('close')" title="副代表の編集">
    <template v-slot:form>
      <div>
        <h3>氏名</h3>
        <input v-model="name" placeholder="入力してください" />
      </div>
      <div>
        <h3>学籍番号</h3>
        <input v-model="studentId" placeholder="入力してください" />
      </div>
      <div>
        <h3>学科</h3>
        <select v-model="departmentId">
          <option disabled value="">選択してください</option>
          <option v-for="department in departmentList" :key="department.id" :value="department.id">
            {{ department.name }}
          </option>
        </select>
      </div>
      <div>
        <h3>学年</h3>
        <select v-model="gradeId">
          <option disabled value="">選択してください</option>
          <option v-for="grade in gradeList" :key="grade.id" :value="grade.id">
            {{ grade.name }}
          </option>
        </select>
      </div>
      <div>
        <h3>電話番号</h3>
        <input v-model="tel" placeholder="入力してください" />
      </div>
      <div>
        <h3>メールアドレス</h3>
        <input v-model="email" placeholder="入力してください" />
      </div>
    </template>
    <template v-slot:method>
      <CommonButton iconName="edit" :on_click="edit">登録</CommonButton>
    </template>
  </EditModal>
</template>

<script>
import { departmentList, gradeList } from "../../utils/constants";

export default {
  props: {
    subRep: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      groupId: null,
      name: null,
      studentId: null,
      departmentId: "",
      gradeId: "",
      tel: null,
      email: null,
      departmentList,
      gradeList,
    };
  },
  watch: {
    subRep: {
      immediate: true,
      handler() {
        const sr = this.getSubRep();
        this.groupId = sr.group_id || this.$route.params.id;
        this.name = sr.name || null;
        this.studentId = sr.student_id || null;
        this.departmentId = sr.department_id || "";
        this.gradeId = sr.grade_id || "";
        this.tel = sr.tel || null;
        this.email = sr.email || null;
      },
    },
  },
  methods: {
    getSubRep() {
      return this.subRep?.sub_rep || this.subRep || {};
    },
    async edit() {
      const sr = this.getSubRep();
      const data = {
        group_id: String(this.groupId ?? this.$route.params.id),
        name: this.name ?? "",
        student_id: this.studentId ?? "",
        department_id: String(this.departmentId ?? ""),
        grade_id: String(this.gradeId ?? ""),
        tel: this.tel ?? "",
        email: this.email ?? "",
      };
      const response = sr.id
        ? await this.$axios.$put(`/sub_reps/${sr.id}`, data)
        : await this.$axios.$post(`/sub_reps`, data);

      this.$emit("saved", response.data.id);
      this.$emit("close");
    },
  },
};
</script>
