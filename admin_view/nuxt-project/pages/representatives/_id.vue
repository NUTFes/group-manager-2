<template>
  <div class="main-content">
    <SubHeader
      v-bind:pageTitle="representative.user.name"
      pageSubTitle="代表者一覧"
    >
      <CommonButton
        v-if="representative.sub_rep.id != null && $role(roleID).representatives.update"
        iconName="edit"
        :on_click="openEditModal"
      >
        編集
      </CommonButton>
      <CommonButton
        v-if="representative.sub_rep.id != null && $role(roleID).representatives.delete"
        iconName="delete"
        :on_click="openDeleteModal"
      >
        削除
      </CommonButton>
    </SubHeader>
    <Row>
      <Card padding="40px 150px" gap="20px">
        <Row justify="start">
          <h4>基本情報</h4>
        </Row>
        <VerticalTable>
          <tr>
            <th>ID</th>
            <td>{{ representative.user.id }}</td>
          </tr>
          <tr>
            <th>参加団体</th>
            <td>{{ representative.group.name }}</td>
          </tr>
          <tr>
            <th>代表者</th>
            <td>{{ representative.user.name }}</td>
          </tr>
          <tr>
            <th>副代表</th>
            <td>{{ representative.sub_rep.name }}</td>
          </tr>
          <tr>
            <th>登録日時</th>
            <td>{{ representative.user.created_at | formatDate }}</td>
          </tr>
          <tr>
            <th>編集日時</th>
            <td>{{ representative.user.updated_at | formatDate }}</td>
          </tr>
        </VerticalTable>
      </Card>
    </Row>

    <EditModal
      @close="closeEditModal"
      v-if="isOpenEditModal"
      title="副代表の編集"
    >
      <template v-slot:form>
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
        <CommonButton iconName="edit" :on_click="edit">編集</CommonButton>
      </template>
    </EditModal>

    <DeleteModal
      @close="closeDeleteModal"
      v-if="isOpenDeleteModal"
      title="副代表の削除"
    >
      <template v-slot:method>
        <YesButton iconName="delete" :on_click="destroy">はい</YesButton>
        <NoButton iconName="close" :on_click="closeDeleteModal"
          >いいえ</NoButton
        >
      </template>
    </DeleteModal>

    <SnackBar v-if="isOpenSnackBar" @close="closeSnackBar">
      {{ message }}
    </SnackBar>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  watchQuery: ["page"],
  filters: {
    formatDate(value) {
      if (!value) return '';
      const date = new Date(value);
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
    }
  },
  data() {
    return {
      isOpenEditModal: false,
      isOpenDeleteModal: false,
      isOpenSnackBar: false,
      departmentList: [
        { id: 1,  name: "機械工学分野/機械創造工学課程" },
        { id: 2,  name: "電気電子情報工学分野/電気電子情報工学課程" },
        { id: 3,  name: "物質生物工学分野/物質材料工学課程/生物機能工学課程" },
        { id: 4,  name: "環境社会基盤工学分野/環境社会基盤工学課程" },
        { id: 5,  name: "情報・経営システム工学分野/情報・経営システム工学課程" },
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
      representative: {
        user: {},
        group: {},
        sub_rep: {}
      },
      routeId: null,

      // モーダル制御
      message: "",

      // 編集用フォーム
      name: null,
      departmentID: null,
      gradeID: null,
      email: null,
      tel: null,
      studentID: null,

      //  認証付きAxiosインスタンス
      authAxios: null
    };
  },
  computed: {
    ...mapState({
      roleID: (state) => state.users.role
    })
  },
  mounted() {
    // ルートIDを取得
    this.routeId = this.$route.params.id;

    // データ取得
    this.fetchInitialData();
  },
  methods: {
    async fetchInitialData() {
      const url = `/api/v1/get_representative_show_for_admin_view/${this.routeId}`;
      const res = await this.$axios.$get(url);
      this.representative = res.data;
      window.scrollTo(0, 0);
      // フィルタ・検索・スクロール復元
      const storedRoleID = localStorage.getItem(
        this.$route.path + "RefRole"
      );
      if (storedRoleID) {
        this.refRoleID = Number(storedRoleID);
        this.updateFilters(this.refRoleID, this.roles);
      }
      this.fetchFilteredData();
    },
    async fetchFilteredData() {
      this.users = [];
      const refUrl = "/api/v1/get_refinement_users?role_id=" + this.refRoleID;
      const refRes = await this.$axios.$post(refUrl);
      for (const res of refRes.data){
        this.users.push(res)
      }
      const storedSearchText = localStorage.getItem(
        this.$route.path + "SearchText"
      );
      if (storedSearchText) {
        this.searchText = storedSearchText;
        this.searchUsers();
      }
      this.$nextTick(() => {
        window.scrollTo(0, parseInt(localStorage.getItem('scrollPosition-' + this.$route.path)))
      });
    },
    openEditModal() {
      const sub = this.representative.sub_rep;
      this.name         = sub.name;
      this.departmentID = sub.department_id;
      this.gradeID      = sub.grade_id;
      this.email        = sub.email;
      this.tel          = sub.tel;
      this.studentID    = sub.student_id;
      this.isOpenEditModal = true;
    },
    closeEditModal() {
      this.isOpenEditModal = false;
    },
    openDeleteModal() {
      this.isOpenDeleteModal = true;
    },
    closeDeleteModal() {
      this.isOpenDeleteModal = false;
    },
    openSnackBar(msg) {
      this.message = msg;
      this.isOpenSnackBar = true;
      setTimeout(() => (this.isOpenSnackBar = false), 2000);
    },
    closeSnackBar() {
      this.isOpenSnackBar = false;
    },
    async reload() {
      const url =
        "/api/v1/get_representative_show_for_admin_view/" + this.routeId;
      console.log(url);
      const response = await this.$axios.$get(url);
      this.representative = response.data;
    },
    async edit() {
      const sub = this.representative.sub_rep;
      const url = `/sub_reps/${sub.id}`;
      await this.$axios.$put(url, {
        group_id:      this.representative.group.id,
        name:          this.name,
        department_id: this.departmentID,
        grade_id:      this.gradeID,
        email:         this.email,
        tel:           this.tel,
        student_id:    this.studentID
      });
      this.openSnackBar("副代表を編集しました");
      this.closeEditModal();
      await this.fetchInitialData();
    },
    async destroy() {
      const sub = this.representative.sub_rep;
      await this.$axios.$delete(`/sub_reps/${sub.id}`);
      this.openSnackBar("副代表を削除しました");
      this.closeDeleteModal();
      this.$router.push("/representatives");
    }
  }
};
</script>
