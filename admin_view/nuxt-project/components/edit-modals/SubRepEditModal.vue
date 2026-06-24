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
        <h3>学科ID</h3>
        <input v-model="departmentId" type="number" placeholder="入力してください" />
      </div>
      <div>
        <h3>学年ID</h3>
        <input v-model="gradeId" type="number" placeholder="入力してください" />
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
      departmentId: null,
      gradeId: null,
      tel: null,
      email: null,
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
        this.departmentId = sr.department_id || null;
        this.gradeId = sr.grade_id || null;
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
      const url = `/sub_reps/${sr.id}`;

      await this.$axios.$put(url, data).then(() => {
        this.$emit("saved", sr.id);
        this.$emit("close");
      });
    },
  },
};
</script>
