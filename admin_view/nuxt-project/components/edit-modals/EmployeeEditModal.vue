<template>
  <EditModal @close="$emit('close')" title="従業員の編集">
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
        <h3>検便</h3>
        <select v-model="stoolTestID">
          <option disabled value="">選択してください</option>
          <option v-for="list in stoolTestList" :key="list.id" :value="list.id">
            {{ list.value }}
          </option>
        </select>
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
    employee: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      groupId: null,
      name: null,
      studentId: null,
      stoolTestID: "",
      stoolTestList: [
        { id: 1, value: "検便準備中" },
        { id: 2, value: "検便無" },
        { id: 3, value: "検便有" },
      ],
    };
  },
  watch: {
    employee: {
      immediate: true,
      handler() {
        const employee = this.getEmployee();
        this.groupId = employee.group_id || this.$route.params.id;
        this.name = employee.name || null;
        this.studentId = employee.student_id || null;
        this.stoolTestID = this.resolveStoolTestId(employee) || "";
      },
    },
  },
  methods: {
    getEmployee() {
      return this.employee?.employee || this.employee || {};
    },
    resolveStoolTestId(employee) {
      if (employee.stool_test_id) return employee.stool_test_id;

      const statusToId = {
        検便準備中: 1,
        検便無: 2,
        検便有: 3,
      };
      const status =
        employee.stool_test ||
        this.employee?.stool_test?.status ||
        this.employee?.stool_test_status;
      return statusToId[status] || null;
    },
    async edit() {
      const employee = this.getEmployee();
      const data = {
        group_id: String(this.groupId ?? this.$route.params.id),
        name: this.name ?? "",
        student_id: this.studentId ?? "",
        stool_test_id: String(this.stoolTestID ?? ""),
      };
      try {
        const response = employee.id
          ? await this.$axios.$put(`/employees/${employee.id}`, data)
          : await this.$axios.$post(`/employees`, data);
        const savedId = response?.data?.id;

        if (typeof savedId === "undefined") {
          console.error("従業員申請の保存レスポンスに id がありませんでした", response);
          this.$emit("error", "保存に失敗しました");
          return;
        }

        this.$emit("saved", savedId);
        this.$emit("close");
      } catch (error) {
        console.error("従業員申請の編集に失敗しました", error);
        this.$emit("error", error?.response?.data?.message || error?.message || "保存に失敗しました");
      }
    },
  },
};
</script>
