<template>
  <div class="main-content">
    <SubHeader
      v-bind:pageTitle="representative.user.name"
      pageSubTitle="代表者一覧"
    >
      <CommonButton
        v-if="representative.sub_rep.id != null && this.$role(this.roleID).representatives.update"
        iconName="edit"
        :on_click="openEditModal"
      >
        編集
      </CommonButton>
      <CommonButton
        v-if="representative.sub_rep.id != null && this.$role(this.roleID).representatives.delete"
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
  data() {
    return {
      isOpenEditModal: false,
      isOpenDeleteModal: false,
      isOpenSnackBar: false,
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
    };
  },
  async asyncData({ $axios, route }) {
    const routeId = route.path.replace("/representatives/", "");
    const url = "/api/v1/get_representative_show_for_admin_view/" + routeId;
    const response = await $axios.$get(url);
    return {
      routeId: routeId,
      representative: response.data,
      route: url,
      groupID: null,
      name: null,
      departmentID: null,
      gradeID: null,
      email: null,
      tel: null,
      studentID: null,
    };
  },
  computed: {
    ...mapState({
      roleID: (state) => state.users.role,
    }),
  },
  mounted() {
    window.scrollTo(0, 0);
  },
  methods: {
    openEditModal() {
      this.groupID = this.representative.group.id;
      this.name = this.representative.sub_rep.name;
      this.departmentID = this.representative.sub_rep.department_id;
      this.gradeID = this.representative.sub_rep.grade_id;
      this.tel = this.representative.sub_rep.tel;
      this.email = this.representative.sub_rep.email;
      this.studentID = this.representative.sub_rep.student_id;
      this.isOpenEditModal = true;
    },
    closeEditModal() {
      this.isOpenEditModal = false;
    },
    openDeleteModal() {
      this.isOpenDeleteModal = false;
      this.isOpenDeleteModal = true;
    },
    closeDeleteModal() {
      this.isOpenDeleteModal = false;
    },
    openSnackBar(message) {
      this.message = message;
      this.isOpenSnackBar = true;
      setTimeout(this.closeSnackBar, 2000);
    },
    closeSnackBar() {
      this.isOpenSnackBar = false;
    },
    async reload() {
      const url =
        "/api/v1/get_representative_show_for_admin_view/" + this.routeId;
      console.log(url);
      const response = await $axios.$get(url);
      this.representative = response.data;
    },
    async edit() {
      const url =
        "/sub_reps/" +
        this.representative.sub_rep.id +
        "?group_id=" +
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

      this.$axios.$put(url);
      this.closeEditModal();
      this.openSnackBar("副代表を編集しました");
      this.reload();
    },
    async destroy() {
      const delUrl = "/sub_reps/" + this.representative.sub_rep.id;
      await this.$axios.$delete(delUrl);
      this.openSnackBar("副代表を削除しました");
      this.$router.push("/representatives");
    },
  },
};
</script>
