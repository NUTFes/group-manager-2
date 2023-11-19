<template>
<div>
  <transition name="fade" appear>
    <div class="account-modal" @click.self="$emit('close')">
      <div class="account-modal__container" @click.self="$emit('close')">
        <div class="account-modal__box">
          <Row justify="start">
            <slot></slot>
          </Row>
          <h6 v-if="user.role_id == 1" class="developer">Developer</h6>
          <h6 v-if="user.role_id == 2">Manager</h6>
          <h6 v-if="user.role_id == 3">User</h6>
          <h6 v-if="user.role_id == 4">Member</h6>
          <h3>{{ user.name }}</h3>
          <p>{{ user.email }}</p>
          <IconButton icon_name="edit" :on_click="openEditModal" />
          <IconButton icon_name="logout" :on_click="logout" />
        </div>
      </div>
    </div>
  </transition>
    <EditModal
      v-if="isOpenEditModal"
      @close="closeEditModal"
      title="ユーザーの個人設定"
    >
      <template v-slot:form>
        <div>
          <h3>名前</h3>
          <input v-model="name" placeholder="入力してください" />
        </div>
        <div>
          <h3>メールアドレス</h3>
          <input v-model="email" placeholder="入力してください" />
        </div>
        <div>
          <h3>学籍番号</h3>
          <input v-model="studentID" placeholder="入力してください" />
        </div>
        <div>
          <h3>学年</h3>
          <select v-model="gradeID">
            <option disabled value="">選択してください</option>
            <option
              v-for="list in gradesList"
              :key="list.id"
              :value="list.id"
            >
              {{ list.name }}
            </option>
          </select>
        </div>
        <div>
          <h3>学科</h3>
          <select v-model="departmentID">
            <option disabled value="">選択してください</option>
            <option
              v-for="list in departmentsList"
              :key="list.id"
              :value="list.id"
            >
              {{ list.name }}
            </option>
          </select>
        </div>
        <div>
          <h3>電話番号</h3>
          <input v-model="tel" placeholder="入力してください" />
        </div>
      </template>
      <template v-slot:method>
        <CommonButton iconName="edit" :on_click="edit"
          >修正</CommonButton
        >
      </template>
    </EditModal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: [],
      isOpenEditModal: false,
      departmentsList: [
        { id: 1, name: '機械創造工学分野 '},
        { id: 2, name: '電気電子情報工学分野'},
        { id: 3, name: '情報・経営システム工学分野'},
        { id: 4, name: '物質生物工学分野'},
        { id: 5, name: '環境社会基盤工学分野'},
        { id: 6, name: '機械創造工学課程' },
        { id: 7, name: '電気電子情報工学課程' },
        { id: 8, name: '物質材料工学課程' },
        { id: 9, name: '環境社会基盤工学課程' },
        { id: 10, name: '生物機能工学課程' },
        { id: 11, name: '情報・経営システム工学課程' },
        { id: 12, name: '機械創造工学専攻' },
        { id: 13, name: '電気電子情報工学専攻' },
        { id: 14, name: '物質材料工学専攻' },
        { id: 15, name: '環境社会基盤工学専攻' },
        { id: 16, name: '生物機能工学専攻' },
        { id: 17, name: '情報・経営システム工学専攻' },
        { id: 18, name: '原子力システム安全工学専攻' },
        { id: 19, name: 'システム安全専攻' },
        { id: 20, name: '技術科学イノベーション専攻' },
        { id: 21, name: '情報・制御工学専攻' },
        { id: 22, name: '材料工学専攻' },
        { id: 23, name: 'エネルギー・環境工学専攻' },
        { id: 24, name: '生物統合工学専攻' },
        { id: 25, name: 'その他' },
      ],
      gradesList: [
        { name: "B1[学部1年]", id: 1 },
        { name: "B2[学部2年]", id: 2 },
        { name: "B3[学部3年]", id: 3 },
        { name: "B4[学部4年]", id: 4 },
        { name: "M1[修士1年]", id: 5 },
        { name: "M2[修士2年]", id: 6 },
        { name: "D1[博士1年]", id: 7 },
        { name: "D2[博士2年]", id: 8 },
        { name: "D3[博士3年]", id: 9 },
        { name: "GD1[イノベ1年]", id: 10 },
        { name: "GD2[イノベ2年]", id: 11 },
        { name: "GD3[イノベ3年]", id: 12 },
        { name: "GD4[イノベ4年]", id: 13 },
        { name: "GD5[イノベ5年]", id: 14 },
        { name: "その他", id: 15 },
      ],
    };
  },
  async mounted() {
    const currentUserUrl = "/api/v1/current_user";
    const CurrentUser = await this.$axios.get(currentUserUrl, {
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("access-token"),
        "client": localStorage.getItem("client"),
        "uid": localStorage.getItem("uid"),
      },
    });
    this.user = CurrentUser.data.data.user;
    this.userDetail = CurrentUser.data.data.user_detail;
  },
  methods: {
    openEditModal() {
      this.name = this.user.name
      this.email = this.user.email
      this.studentID = this.userDetail.student_id
      this.gradeID = this.userDetail.grade_id
      this.departmentID = this.userDetail.department_id
      this.tel = this.userDetail.tel
      this.isOpenEditModal = false;
      this.isOpenEditModal = true;
    },
    closeEditModal() {
      this.isOpenEditModal = false;
    },
    edit() {
      const userUrl = "/api/v1/users/edit_user_info"
      var params = {
        user_id: this.user.id,
        name: this.name,
        student_id: this.studentID,
        grade_id: this.gradeID,
        department_id: this.departmentID,
        tel: this.tel,
        email: this.email,
      };
      this.$axios.post(userUrl, params).then(() => {
        localStorage.setItem("uid", this.email);
        this.closeEditModal()
      });
    },
    logout() {
      this.$auth.logout();
      localStorage.removeItem("access-token");
      localStorage.removeItem("client");
      localStorage.removeItem("uid");
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.account-modal_content h3 {
  font-size: 16px;
  font-weight: 300;
}

.account-modal_content div {
  display: flex;
  align-items: start;
  justify-content: center;
  flex-flow: column;
  gap: 10px;
}

.default-option {
  color: red;
}

.account-modal {
  top: 0;
  right: 0;
  position: fixed;
  height: 100%;
  padding-top: 60px;
  width: 100%;
  z-index: 11;
}
.account-modal__container {
  height: 100%;
  width: 100%;
  min-height: 100%;
  display: flex;
  justify-content: end;
  align-items: start;
}

.account-modal__box {
  width: 400px;
  display: flex;
  justify-content: start;
  align-items: center;
  flex-flow: column;
  padding: 30px 15px;
  z-index: 15;
  color: #fff;
  background: radial-gradient(
    ellipse at top left,
    rgba(51, 51, 51, 0.9),
    rgba(51, 51, 51, 0.8)
  );
  backdrop-filter: blur(4px);
  gap: 30px;
}

.fade-enter-active,
.fade-leave-active {
  will-change: opacity;
  transition: opacity 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
