<template>
  <div class="main-content" v-if="this.$role(roleID).representatives.read">
    <SubHeader pageTitle="代表者一覧">
      <CommonButton v-if="this.$role(roleID).representatives.create" iconName="add_circle" :on_click="openAddModal">
        副代表追加
      </CommonButton>
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
          <input
            v-model="searchText"
            @keypress.enter="searchRepresentatives"
            type="text"
            size="25"
            placeholder="search"
          />
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
                  path: `/representatives/` + representative.group.id,
                })
            "
            :key="index"
          >
            <td>{{ representative.group.id }}</td>
            <td>{{ representative.group.name }}</td>
            <td>{{ representative.user.name }}</td>
            <td>{{ representative.sub_rep.name }}</td>
          </tr>
        </template>
      </Table>
    </Card>

    <AddModal @close="closeAddModal" v-if="isOpenAddModal" title="副代表の追加">
      <template v-slot:form>
        <div>
          <h3>団体名</h3>
          <select v-model="groupID">
            <option disabled value="">選択してください</option>
            <option
              v-for="group in groupList"
              :key="group.id"
              :value="group.id"
            >
              {{ group.name }}
            </option>
          </select>
        </div>
        <div>
          <h3>氏名</h3>
          <input v-model="name" placeholder="入力してください" />
        </div>
        <div>
          <h3>課程・専攻</h3>
          <select v-model="departmentID">
            <option disabled value="">選択してください</option>
            <option
              v-for="department in departmentList"
              :key="department.id"
              :value="department.id"
            >
              {{ department.name }}
            </option>
          </select>
        </div>
        <div>
          <h3>学年</h3>
          <select v-model="gradeID">
            <option disabled value="">選択してください</option>
            <option
              v-for="grade in gradeList"
              :key="grade.id"
              :value="grade.id"
            >
              {{ grade.name }}
            </option>
          </select>
        </div>
        <div>
          <h3>メールアドレス</h3>
          <input v-model="email" placeholder="入力してください" />
        </div>
        <div>
          <h3>電話番号</h3>
          <input v-model="tel" placeholder="入力してください" />
        </div>
        <div>
          <h3>学籍番号</h3>
          <input v-model="studentID" placeholder="入力してください" />
        </div>
      </template>
      <template v-slot:method>
        <CommonButton iconName="add_circle" :on_click="submit"
          >登録</CommonButton
        >
      </template>
    </AddModal>

    <SnackBar v-if="isOpenSnackBar" @close="closeSnackBar">
      {{ message }}
    </SnackBar>
  </div>
  <h1 v-else>閲覧権限がありません</h1>
</template>

<script>
import { mapState } from "vuex";
import { departmentList, gradeList } from "~/utils/constants";
export default {
  watchQuery: ["page"],
  data() {
    return {
      headers: ["ID", "参加団体", "代表者", "副代表"],
      departmentList,
      gradeList,
      isOpenAddModal: false,
      isOpenSnackBar: false,
      refYears: "Year",
      refYearID: 0,
      searchText: "",
      representatives: [],
      name: null,
      groupID: null,
      departmentID: null,
      gradeID: null,
      tel: null,
      email: null,
      studentID: null,
    };
  },
  computed: {
    ...mapState({
      roleID: (state) => state.users.role,
    }),
  },
  mounted() {
    this.fetchInitialData().then(() => {
    // データ取得後にフィルター処理するの✨
    const storedYearID = localStorage.getItem(this.$route.path + 'RefYear');
    if (storedYearID) {
      this.refYearID = Number(storedYearID);
      this.updateFilters(this.refYearID, this.yearList);
    }
  });
    window.addEventListener('scroll', this.saveScrollPosition);

    // 初期データ取得
    this.fetchInitialData();
  },
  methods: {
    async fetchInitialData() {
      const currentYearUrl = "/user_page_settings/1";
      const currentYearRes = await this.$axios.$get(currentYearUrl);
      const url =
        "/api/v1/get_refinement_representatives?fes_year_id=" +
        currentYearRes.data.fes_year_id;
      const representativesRes = await this.$axios.$post(url);
      const yearsUrl = "/fes_years";
      const yearsRes = await this.$axios.$get(yearsUrl);
      const currentYears = yearsRes.data.filter(function (element) {
        return element.id == currentYearRes.data.fes_year_id;
      });
      this.representatives = representativesRes.data;
      this.yearList = yearsRes.data;
      this.refYearID = currentYearRes.data.fes_year_id;
      this.refYears = currentYears[0].year_num;
      this.currentYearID = currentYears;
      this.fetchFilteredData();
    },
    saveScrollPosition() {
      localStorage.setItem('scrollPosition-' + this.$route.path, window.scrollY);
    },
    async refinementRepresentatives(item_id, name_list) {
      this.updateFilters(item_id, name_list);
      localStorage.setItem(this.$route.path + 'RefYear', this.refYearID);
      this.fetchFilteredData();
    },
    updateFilters(item_id, name_list) {
      // fes_yearで絞り込むとき
      this.refYearID = item_id;
      // ALLの時
      if (item_id == 0) {
        this.refYears = "ALL";
      } else {
        this.refYears = name_list[item_id - 1].year_num;
      }
    },
    async fetchFilteredData() {
      this.representatives = [];
      const refUrl =
        "/api/v1/get_refinement_representatives?fes_year_id=" + this.refYearID;
      const refRes = await this.$axios.$post(refUrl);
      for (const res of refRes.data) {
        this.representatives.push(res);
      }
      const storedSearchText = localStorage.getItem(
        this.$route.path + "SearchText"
      );
      if (storedSearchText) {
        this.searchText = storedSearchText;
        this.searchRepresentatives();
      }
      this.$nextTick(() => {
        window.scrollTo(0, parseInt(localStorage.getItem('scrollPosition-' + this.$route.path)))
      });
    },
    async searchRepresentatives() {
      localStorage.setItem(this.$route.path + "SearchText", this.searchText);
      this.representatives = [];
      const searchUrl =
        "/api/v1/get_search_representatives?word=" + this.searchText;
      const refRes = await this.$axios.$post(searchUrl);
      for (const res of refRes.data) {
        this.representatives.push(res);
      }
    },
    async openAddModal() {
      const groupUrl = "/api/v1/get_groups_refinemented_by_current_fes_year";
      const resGroups = await this.$axios.$get(groupUrl);
      this.groupList = resGroups.data;

      this.isOpenAddModal = true;
    },
    closeAddModal() {
      this.isOpenAddModal = false;
    },
    openSnackBar(message) {
      this.message = message;
      this.isOpenSnackBar = true;
      setTimeout(this.closeSnackBar, 2000);
    },
    closeSnackBar() {
      this.isOpenSnackBar = false;
    },
    reload() {
      const url =
        "/api/v1/get_refinement_representatives?fes_year_id=" + this.refYearID;
      this.representatives = [];
      this.$axios.$post(url).then((response) => {
        this.representatives = response.data;
      });
    },
    submit() {
      const url =
        "/sub_reps?group_id=" +
        this.groupID +
        "&name=" +
        this.name +
        "&department_id=" +
        this.departmentID +
        "&grade_id=" +
        this.gradeID +
        "&email=" +
        this.email +
        "&tel=" +
        this.tel +
        "&student_id=" +
        this.studentID;

      this.$axios.$post(url).then((res) => {
        this.name = "";
        this.groupID = "";
        this.departmentID = "";
        this.gradeID = "";
        this.tel = "";
        this.email = "";
        this.studentID = "";
        this.openSnackBar(res.data.name + "を追加しました");
      });
      this.reload();
      this.closeAddModal();
    },
  },
};
</script>
