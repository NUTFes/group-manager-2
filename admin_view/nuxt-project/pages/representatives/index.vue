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
export default {
  watchQuery: ["page"],
  data() {
    return {
      headers: ["ID", "参加団体", "代表者", "副代表"],
      departmentList: [
        { id: 1,  name: "機械工学分野/機械創造工学課程" },
        { id: 2,  name: "電気電子情報工学分野/電気電子情報工学過程" },
        { id: 3,  name: "物質生物工学分野/物質材料工学過程/生物機能工学過程" },
        { id: 4,  name: "環境社会基盤工学分野/環境社会基盤工学過程" },
        { id: 5,  name: "情報・経営システム工学分野/情報・経営システム工学過程" },
        { id: 6,  name: "機械工学分野/機械創造工学専攻" },
        { id: 7,  name: "電気電子情報工学分野/電気電子情報工学専攻" },
        { id: 8,  name: "物質生物工学分野/物質材料工学専攻/生物機能工学専攻" },
        { id: 9,  name: "環境社会基盤工学分野/環境社会基盤工学専攻" },
        { id: 10, name: "情報・経営システム工学分野/情報・経営システム工学専攻" },
        { id: 11, name: "量子・原子力統合工学分野/原子力システム安全工学専攻" },
        { id: 12, name: "システム安全工学専攻" },
        { id: 13, name: "技術科学イノベーション専攻" },
        { id: 14, name: "情報・制御工学分野/情報・制御工学専攻" },
        { id: 15, name: "材料工学分野/材料工学専攻" },
        { id: 16, name: "エネルギー工学分野/エネルギー・環境工学専攻" },
        { id: 17, name: "社会環境・生物機能工学分野/生物統合工学専攻" },
        { id: 18, name: "その他" },
      ],
      gradeList: [
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
        { id: 14, name: "GD5[イノベ5年]" },
        { id: 15, name: "その他" },
      ],
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
  async asyncData({ $axios }) {
    const currentYearUrl = "/user_page_settings/1";
    const currentYearRes = await $axios.$get(currentYearUrl);
    // const url = "/api/v1/get_representative_index_for_admin_view";

    const url =
      "/api/v1/get_refinement_representatives?fes_year_id=" +
      currentYearRes.data.fes_year_id;
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
      refYears: currentYears[0].year_num,
      currentYearID: currentYears,
    };
  },
  computed: {
    ...mapState({
      roleID: (state) => state.users.role,
    }),
  },
  mounted() {
    const storedYearID = localStorage.getItem(this.$route.path + 'RefYear');
    if (storedYearID) {
      this.refYearID = Number(storedYearID);
      this.updateFilters(this.refYearID, this.yearList);
    } else {
      this.refYears = 'Year';
    }
    this.fetchFilteredData();

    window.addEventListener('scroll', this.saveScrollPosition);
  },
  methods: {
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
