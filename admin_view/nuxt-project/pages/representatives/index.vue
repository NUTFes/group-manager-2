<template>
  <div class="main-content">
    <SubHeader pageTitle="代表者一覧">
      <CommonButton iconName="add_circle"> 副代表追加 </CommonButton>
    </SubHeader>
    <SubSubHeader>
      <SearchDropDown> All Years </SearchDropDown>
      <SearchDropDown> All Categories </SearchDropDown>
    </SubSubHeader>

    <SubSubHeader>
      <template v-slot:refinement>
      <SearchDropDown
        :nameList="yearList"
        :on_click="refinementRepresentatives"
        value="year_num"
      >
        {{ refYears }}
      </SearchDropDown>
      </template>
      <template v-slot:search>
        <SearchBar>
          <input v-model="searchText" @keypress.enter="searchRepresentatives" type="text" size="25" placeholder="search" />
        </SearchBar>
      </template>
    </SubSubHeader>

    <Card width="100%"> 
      <Table>
        <template v-slot:table-header>
          <th v-for="(header, index) in headers" v-bind:key="index">
            {{ header }}
          </th>
      </template>
      <template v-slot:table-body>
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
      </template>
        </Table>
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
      refYears: "Year",
      refYearID: 0,
      searchText: '',
      representatives: []
    }
  },
  async asyncData({ $axios }) {
    const currentYearUrl = "/user_page_settings/1";
    const currentYearRes = await $axios.$get(currentYearUrl);
    // const url = "/api/v1/get_representative_index_for_admin_view";

    const url = "/api/v1/get_refinement_representatives?fes_year_id=" + currentYearRes.data.fes_year_id;
    const representativesRes = await $axios.$post(url);
    const yearsUrl = "/fes_years";
    const yearsRes = await $axios.$get(yearsUrl);
    const currentYears = yearsRes.data.filter(function (element) {
      return element.id == currentYearRes.data.fes_year_id;
    });
    return {
      representatives: representativesRes.data,
      yearList: yearsRes.data,
      refYearID: currentYearRes.data.fes_year_id,
      refYears: currentYears[0].year_num
    };
  },
  methods: {
    async refinementRepresentatives(item_id, name_list) {
      // fes_yearで絞り込むとき
      this.refYearID = item_id
      // ALLの時
      if (item_id == 0){
        this.refYears = "ALL"
      }else{
        this.refYears = name_list[item_id - 1].year_num
      }
      this.representatives = []
      const refUrl = "/api/v1/get_refinement_representatives?fes_year_id=" + this.refYearID;
      const refRes = await this.$axios.$post(refUrl);
      for (const res of refRes.data){
        this.representatives.push(res)
      }
    },
    async searchRepresentatives(){
      this.representatives = []
      const searchUrl = "/api/v1/get_search_representatives?word=" + this.searchText
      const refRes = await this.$axios.$post(searchUrl);
      for (const res of refRes.data){
        this.representatives.push(res)
      }
    },
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
