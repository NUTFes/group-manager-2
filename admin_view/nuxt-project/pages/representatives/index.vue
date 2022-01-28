<template>
  <div class="main-content">
    <SubHeader pageTitle="代表者一覧">
      <CommonButton iconName="add_circle"> 追加 </CommonButton>
    </SubHeader>
    <SubSubHeader>
      <SearchDropDown> All Years </SearchDropDown>
      <SearchDropDown> All Categories </SearchDropDown>
    </SubSubHeader>
    <Card width="100%"> 
      <table>
        <thead>
          <th v-for="(header, index) in headers" v-bind:key="index">
            {{ header }}
          </th>
        </thead>
        <tbody>
          <tr
            v-for="(representative, index) in representatives"
            @click="
              () =>
                $router.push({
                  path: `/representatives/` + representative.user.id,
                })
            "
            :key="index"
          >
            <td>{{ representative.user.id }}</td>
            <td>{{ representative.group.name }}</td>
            <td>{{ representative.user.name }}</td>
            <td>{{ representative.sub_rep.name }}</td>
            <td>{{ representative.user.created_at | formatDate }}</td>
            <td>{{ representative.user.updated_at | formatDate }}</td>
          </tr>
        </tbody>
      </table>
    </Card>
  </div>
</template>

<script>
export default {
  watchQuery: ["page"],
  data() {
    return {
      headers: [
        "ID",
        "参加団体",
        "代表者",
        "副代表",
        "登録日時",
        "編集日時",
      ],
    }
  },
  async asyncData({ $axios }) {
    const url = "/api/v1/get_representative_index_for_admin_view";
    const representativesRes = await $axios.$get(url);
    const yearsUrl = "/fes_years";
    const yearsRes = await $axios.$get(yearsUrl);
    return {
      representatives: representativesRes.data,
      yearList: yearsRes.data,
    };
  },
  methods: {
    reload: function () {
      this.$axios
        .get("/sub_reps", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          this.sub_reps = response.data;
        });
    },
    adjustHeight() {
      const textarea = this.$refs.activity;
      const resetHeight = new Promise(function (resolve) {
        resolve((textarea.style.height = "auto"));
      });
      resetHeight.then(function () {
        textarea.style.height = textarea.scrollHeight + "px";
      });
    },
    register: function () {
      this.$axios.defaults.headers.common["Content-Type"] = "application/json";
      var params = new URLSearchParams();
      params.append("name", this.subRepName);
      params.append("student_id", this.subRepSutudentId);
      params.append("grade_id", this.subRepGradeId);
      params.append("group_id", this.Group);
      params.append("department_id", this.subRepDepartmentId);
      params.append("tel", this.subRepTel);
      params.append("email", this.subRepEmail);
      this.$axios.post("/sub_reps", params).then((response) => {
        console.log(response);
        this.dialog = false;
        this.reload();
        this.subRepName = "";
        this.subRepSutudentId = "";
        this.subRepGradeId = "";
        this.groupCategoryId = "";
        this.subRepTel = "";
        this.subRepEmail = "";
      });
    },
  },
};
</script>
