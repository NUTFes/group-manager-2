<template>
  <div class="main-content">
    <SubHeader v-bind:pageTitle="user.user.name" pageSubTitle="ユーザー一覧">
      <CommonButton v-if="this.$role(this.roleID).users.update" iconName="edit" :on_click="openEditModal">
        権限編集
      </CommonButton>
      <CommonButton v-if="this.$role(this.roleID).users.update" iconName="edit" :on_click="openResetModal">
        パスワード再設定
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
            <td>{{ user.user.id }}</td>
          </tr>
          <tr>
            <th>名前</th>
            <td>{{ user.user.name }}</td>
          </tr>
          <tr>
            <th>権限</th>
            <td>{{ user.role.name }}</td>
          </tr>
          <tr>
            <th>メールアドレス</th>
            <td>{{ user.user.email }}</td>
          </tr>
          <tr>
            <th>電話番号</th>
            <td>{{ user.user_detail.tel }}</td>
          </tr>
          <tr>
            <th>学籍番号</th>
            <td>{{ user.user_detail.student_id }}</td>
          </tr>
          <tr>
            <th>課程・専攻</th>
            <td>{{ user.user_detail_info.department }}</td>
          </tr>
          <tr>
            <th>学年</th>
            <td>{{ user.user_detail_info.grade }}</td>
          </tr>
          <tr>
            <th>登録日時</th>
            <td>{{ user.user.created_at | formatDate }}</td>
          </tr>
          <tr>
            <th>編集日時</th>
            <td>{{ user.user.updated_at | formatDate }}</td>
          </tr>
        </VerticalTable>
      </Card>
    </Row>

    <EditModal
      @close="closeEditModal"
      v-if="isOpenEditModal"
      title="権限の編集"
    >
      <template v-slot:form>
        <label for="developer" style="color:black">Developer</label>
        <input type="radio" id="developer" value="1" v-model="picked" />
        <label for="participant" style="color:black">Participant</label>
        <input type="radio" id="participant" value="2" v-model="picked" />
        <label for="inventory_management" style="color:black">Inventory_Management</label>
        <input type="radio" id="inventory_management" value="3" v-model="picked" />
        <label for="venue_power" style="color:black">Venue_Power</label>
        <input type="radio" id="venue_power" value="4" v-model="picked" />
        <label for="sanitation_management" style="color:black">Sanitation_Management</label>
        <input type="radio" id="sanitation_management" value="5" v-model="picked" />
        <label for="staff" style="color:black">Staff</label>
        <input type="radio" id="staff" value="6" v-model="picked" />
        <label for="user" style="color:black">User</label>
        <input type="radio" id="user" value="7" v-model="picked" />
        <span style="color:black">{{ roles[role-1].name }} → {{ roles[picked-1].name }}</span>
      </template>
      <template v-slot:method>
        <CommonButton iconName="edit" :on_click="editRole">編集</CommonButton>
      </template>
    </EditModal>

    <EditModal
      @close="closeResetModal"
      v-if="isOpenResetModal"
      title="パスワード再設定"
    >
      <template v-slot:form>
        <div>
          <h3>新しいパスワード</h3>
          <input v-model="password" type="password" placeholder="入力してください" />
        </div>
        <div>
          <h3>新しいパスワード再確認</h3>
          <input v-model="passwordConfirm" type="password" placeholder="入力してください" />
          <p v-if="passwordConfirm !== '' && password !== passwordConfirm">パスワードが一致しません</p>
        </div>
      </template>
      <template v-slot:method>
        <CommonButton v-if="password === passwordConfirm" iconName="edit" :on_click="editPassword">編集</CommonButton>
        <CommonButton v-else iconName="edit" disabled :on_click="editPassword">編集</CommonButton>
      </template>
    </EditModal>

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
  computed: {
    ...mapState({
      selfRoleId: (state) => state.users.role,
      uid: (state) => state.users.uid,
    }),
  },
  data() {
    return {
      isOpenEditModal: false,
      isOpenResetModal: false,
      picked: '',
      password: '',
      passwordConfirm: '',
      isOpenSnackBar: false,
      roles: [
        { id: 1, name: "developer" },
        { id: 2, name: "participant" }, 
        { id: 3, name: "inventory_management" }, 
        { id: 4, name: "venue_power" }, 
        { id: 5, name: "sanitation_management" }, 
        { id: 6, name: "staff" }, 
        { id: 7, name: "user" },
      ],
    };
  },
  async asyncData({ $axios, route }) {
    const routeId = route.path.replace("/users/", "");
    const url = "/api/v1/get_user_show_for_admin_view/" + routeId;
    const response = await $axios.$get(url);
    return {
      user: response.data,
      role: response.data.role.id,
      routeId: routeId,
      route: url,
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
      this.isOpenEditModal = false;
      this.isOpenEditModal = true;
      this.picked = this.role
    },
    closeEditModal() {
      this.isOpenEditModal = false;
    },
    openResetModal() {
      this.isOpenResetModal = false;
      this.isOpenResetModal = true;
    },
    closeResetModal() {
      this.isOpenResetModal = false;
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
      const url = "/api/v1/get_user_show_for_admin_view/" + this.routeId;
      const reUserRes = await this.$axios.$get(url);
      this.user = reUserRes.data;
    },
    async editRole() {
      const url = "/users/" + this.routeId + "?role_id=" + this.picked
      await this.$axios.$put(url).then((res) => {
        this.role = res.data.role_id
        this.reload();
        this.closeEditModal();
        this.openSnackBar("権限を編集しました");
      });
    },
    async editPassword() {
      const url = "/api/v1/users/reset_password?user_id=" + this.routeId + "&password=" + this.password + "&password_confirmation=" + this.passwordConfirm
      await this.$axios.$post(url).then((res) => {
        this.closeResetModal();
        this.openSnackBar("パスワードを変更しました");
      });
    },
  },
};
</script>

<style scoped>
td {
  width: 70%;
}
th {
  width: 30%;
}
</style>

<style>
.card {
  padding-left: 1%;
  padding-right: 5%;
}
</style>
