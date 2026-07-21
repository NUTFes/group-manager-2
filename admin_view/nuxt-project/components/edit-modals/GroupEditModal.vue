<template>
  <EditModal @close="$emit('close')" title="参加団体申請の編集">
    <template v-slot:form>
      <div>
        <h3>団体名</h3>
        <input v-model="groupName" placeholder="入力してください" />
      </div>
      <div>
        <h3>申請者</h3>
        <select v-model="committee">
          <option disabled value="">選択してください</option>
          <option
            v-for="applicant in applicantList"
            :key="applicant.id"
            :value="applicant.bool"
          >
            {{ applicant.value }}
          </option>
        </select>
      </div>
      <div>
        <h3>カテゴリー</h3>
        <select v-model="groupCategoryId">
          <option disabled value="">選択してください</option>
          <option
            v-for="category in groupCategories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
      </div>
      <div>
        <h3>国際</h3>
        <input type="checkbox" v-model="international" />
      </div>
      <div>
        <h3>学外</h3>
        <input type="checkbox" v-model="external" />
      </div>
      <div>
        <h3>企画名</h3>
        <input v-model="projectName" placeholder="入力してください" />
      </div>
      <div>
        <h3>活動内容</h3>
        <textarea v-model="activity" placeholder="入力してください" />
      </div>
      <div>
        <h3>開催年</h3>
        <select v-model="fesYearId">
          <option disabled value="">選択してください</option>
          <option v-for="year in yearList" :key="year.id" :value="year.id">
            {{ year.year_num }}
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
    group: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      groupName: "",
      projectName: "",
      activity: "",
      groupCategoryId: "",
      fesYearId: "",
      committee: false,
      international: false,
      external: false,
      groupCategories: [],
      yearList: [],
      applicantList: [
        { id: 1, value: "実行委員", bool: true },
        { id: 2, value: "参加団体", bool: false },
      ],
    };
  },
  watch: {
    group: {
      immediate: true,
      handler() {
        const g = this.getGroup();
        this.groupName = g.name || "";
        this.projectName = g.project_name || "";
        this.activity = g.activity || "";
        this.groupCategoryId = g.group_category_id || "";
        this.fesYearId = g.fes_year_id || "";
        this.committee = g.committee || false;
        this.international = g.is_international || false;
        this.external = g.is_external || false;
      },
    },
  },
  async mounted() {
    try {
      const [catRes, yearsRes] = await Promise.all([
        this.$axios.$get("/group_categories"),
        this.$axios.$get("/fes_years"),
      ]);
      this.groupCategories = catRes.data || [];
      this.yearList = yearsRes.data || [];
    } catch (e) {
      console.error(e);
    }
  },
  methods: {
    getGroup() {
      // In _id.vue we pass group.group, so it's directly the group object.
      return this.group || {};
    },
    async edit() {
      const g = this.getGroup();
      const data = {
        name: this.groupName,
        committee: this.committee,
        project_name: this.projectName,
        group_category_id: this.groupCategoryId,
        activity: this.activity,
        fes_year_id: this.fesYearId,
        is_international: this.international,
        is_external: this.external,
      };
      const url = `/groups/${g.id}`;

      try {
        await this.$axios.$put(url, data);
        this.$emit("saved", g.id);
        this.$emit("close");
      } catch (e) {
        console.error(e);
      }
    },
  },
};
</script>
