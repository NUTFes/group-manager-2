<template>
  <div class="main-content">
    <SubHeader pageTitle="ユーザー一覧">
      <CommonButton v-if="this.$role(roleID).users.create" iconName="add_circle" :on_click="openAddModal">
        追加
      </CommonButton>
    </SubHeader>

    <SubSubHeader>
      <template v-slot:refinement>
        <SearchDropDown
          :nameList="roles"
          :on_click="refinementUsers"
          value="name"
        >
          {{ refRole }}
        </SearchDropDown>
      </template>
      <template v-slot:search>
        <SearchBar>
          <input
            v-model="searchText"
            @keypress.enter="searchUsers"
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
            v-for="(user, index) in users"
            @click="
              () =>
                $router.push({
                  path: `/users/` + user.user.id,
                })
            "
            :key="index"
          >
            <td>{{ user.user.id }}</td>
            <td>{{ user.user.name }}</td>
            <td>{{ user.role.name }}</td>
          </tr>
        </template>
      </Table>
    </Card>
     
    <AddModal
      @close="closeAddModal"
      v-if="isOpenAddModal"
      title="ユーザーの追加"
    >
      <template v-slot:form>
        <div>
          <h3>名前</h3>
          <input v-model="createName" placeholder="入力してください" />
        </div>
        <div>
          <h3>学籍番号</h3>
          <input v-model="createStudentId" maxlength="8" placeholder="入力してください" />
        </div>
        <div>
          <h3>メールアドレス</h3>
          <input v-model="createEmail" placeholder="～@～.～" />
        </div>
        <div>
          <h3>TEL</h3>
          <input v-model="createTel" maxlength="11" placeholder="ハイフンなし" />
        </div>
        <div>
          <h3>学科</h3>
          <select v-model="createDepartmentId">
            <option disabled value="">選択してください</option>
            <option v-for="department in departmentList" :key="department.id" :value="department.id">
              {{ department.name }}
            </option>
          </select>
        </div>
        <div>
          <h3>学年</h3>
          <select v-model="createGradeId">
            <option disabled value="">選択してください</option>
            <option v-for="grade in gradeList" :key="grade.id" :value="grade.id">
              {{ grade.name }}
            </option>
          </select>
        </div>
        <div>
          <h3>パスワード</h3>
          <input v-model="createPassword" type="password" placeholder="６文字以上" />
        </div>
        <div>
          <h3>パスワード再確認</h3>
          <input v-model="createPasswordConfirmation" type="password" placeholder="６文字以上" />
          <p v-if="createPasswordConfirmation !== '' && createPassword !== createPasswordConfirmation">パスワードが一致しません</p>
        </div>
      </template>
      <template v-slot:method>
        <CommonButton v-if="
          createName !== null && createName !== '' &&
          createStudentId !== null && createStudentId !== '' &&
          createEmail !== null && createEmail !== '' &&
          createTel !== null && createTel !== '' &&
          createDepartmentId !== null &&
          createGradeId !== null &&
          createPassword !== null && createPassword !== '' &&
          createPasswordConfirmation !== null && createPasswordConfirmation !== '' &&
          createPassword === createPasswordConfirmation
          "
          iconName="add_circle" :on_click="simplyUserCreate">登録</CommonButton>
        <CommonButton v-else iconName="add_circle" disabled :on_click="simplyUserCreate">登録</CommonButton>
      </template>
    </AddModal>

    <SnackBar
      v-if="isOpenSnackBar"
      @close="closeSnackBar"
    >
      {{ message }}
    </SnackBar>

  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  watchQuery: ["page"],
  data() {
    return {
      headers: ["ID", "名前", "権限"],
      roles: [
        { id: 1, name: "developer" }, //　開発者( GM2開発者と局長/副局長 全権限を与える)
        { id: 2, name: "manager" }, // 管理者( 参加団体部門長にユーザ画面制御の権限のみを与える )
        { id: 3, name: "user" },  // 参加団体( 権限を与えない )
        { id: 4, name: "member" },  // 実行委員/その他の部門長 (閲覧権限のみ与える)
      ],
      departmentList: [
        { id: 1,  name: "機械創造工学課程" },
        { id: 2,  name: "電気電子情報工学課程" },
        { id: 3,  name: "物質材料工学課程/生物機能工学課程" },
        { id: 4,  name: "環境社会基盤工学課程" },
        { id: 5,  name: "情報・経営システム工学課程" },
        { id: 6,  name: "機械創造工学専攻" },
        { id: 7,  name: "電気電子情報工学専攻" },
        { id: 8,  name: "物質材料工学専攻/生物機能工学専攻" },
        { id: 9, name: "環境社会基盤工学専攻" },
        { id: 10, name: "情報・経営システム工学専攻" },
        { id: 11, name: "原子力システム安全工学専攻" },
        { id: 12, name: "システム安全専攻" },
        { id: 13, name: "技術科学イノベーション専攻" },
        { id: 14, name: "情報・制御工学専攻" },
        { id: 15, name: "材料工学専攻" },
        { id: 16, name: "エネルギー・環境工学専攻" },
        { id: 17, name: "生物統合工学専攻" },
        { id: 18, name: "その他" },
      ],
      gradeList: [
        { id : 1,  name: "B1[学部1年]" },
        { id : 2,  name: "B2[学部2年]" },
        { id : 3,  name: "B3[学部3年]" },
        { id : 4,  name: "B4[学部4年]" },
        { id : 5,  name: "M1[修士1年]" },
        { id : 6,  name: "M2[修士2年]" },
        { id : 7,  name: "D1[博士1年]" },
        { id : 8,  name: "D2[博士2年]" },
        { id : 9,  name: "D3[博士3年]" },
        { id : 10, name: "GD1[イノベ1年]" },
        { id : 11, name: "GD2[イノベ2年]" },
        { id : 12, name: "GD3[イノベ3年]" },
        { id : 13, name: "GD4[イノベ4年]" },
        { id : 14, name: "GD5[イノベ5年]" },
        { id : 15, name: "教員" },
        { id : 16, name: "その他" },
      ],
      refRole: "Role",
      refRoleID: 0,
      searchText: "",
      users: [],
      isOpenAddModal: false,
      isOpenSnackBar: false,
      createName: null,
      createEmail: null,
      createStudentId: null,
      createTel: null,
      createDepartmentId: null,
      createGradeId: null,
      createPassword: null,
      createPasswordConfirmation: null,
      createUserId: null,
      createRoleId: 2,
    };
  },
  async asyncData({ $axios }) {
    const url = "/api/v1/get_user_index_for_admin_view";
    const userRes = await $axios.$get(url);
    const yearsUrl = "/fes_years";
    const yearsRes = await $axios.$get(yearsUrl);
    return {
      users: userRes.data,
      yearList: yearsRes.data,
    };
  },
  computed: {
    ...mapState({
      roleID: (state) => state.users.role,
    }),
  },
  methods: {
    openAddModal() {
      this.isOpenAddModal = false;
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
    async refinementUsers(item_id, name_list) {
      this.refRoleID = item_id
      if (item_id == 0){
        this.refRole = "ALL";
      } else {
        this.refRole = name_list[item_id - 1].name;
      }
      this.users = [];
      const refUrl = "/api/v1/get_refinement_users?role_id=" + this.refRoleID;
      const refRes = await this.$axios.$post(refUrl);
      for (const res of refRes.data){
        this.users.push(res)
      }
    },
    async searchUsers(){
      this.users = []
      const searchUrl = "/api/v1/get_search_users?word=" + this.searchText;
      const refRes = await this.$axios.$post(searchUrl);
      for (const res of refRes.data) {
        this.users.push(res);
      }
    },
    async simplyUserCreate() {
      const simply_user_create_url = "/users/simply_user_create"
      var simply_user_create_params = {
          name: this.createName,
          email: this.createEmail,
          password: this.createPassword,
          password_confirmation: this.createPasswordConfirmation,
          role_id: this.createRoleId
        };
      this.$axios.$post(simply_user_create_url, simply_user_create_params).then((response) => {
        if(response.status.code === 201){
          this.createUserId = response.data.id;
          const user_detail_url = "/user_details"
          var user_detail_params = {
              student_id: this.createStudentId,
              tel: this.createTel,
              department_id: this.createDepartmentId,
              grade_id: this.createGradeId,
              user_id: this.createUserId,
          };
          this.$axios.$post(user_detail_url, user_detail_params).then((response) => {
            this.openSnackBar(this.createName + "を追加しました");
            this.closeAddModal();
            this.createName = null;
            this.createEmail = null;
            this.createStudentId = null;
            this.createTel = null;
            this.createDepartmentId = null;
            this.createGradeId = null;
            this.createPassword = null;
            this.createPasswordConfirmation =  null;
            this.createUserId = null;
          });
        }else if(response.status.code === 500){
          this.openSnackBar("ERROR 失敗しました");
        }
      });
    },
  },
};
</script>

<style>
.card {
  padding-left: 1%;
  padding-right: 5%;
}
</style>
