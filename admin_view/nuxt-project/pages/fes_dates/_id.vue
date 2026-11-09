<template>
  <div class="main-content">
    <SubHeader
      v-bind:pageTitle="fesDate.fes_date.date"
      pageSubTitle="開催日一覧"
    >
      <CommonButton v-if="this.$role(this.roleID).fes_dates.update" iconName="edit" :on_click="openEditModal">
        編集
      </CommonButton>
      <CommonButton v-if="this.$role(this.roleID).fes_dates.delete" iconName="delete" :on_click="openDeleteModal">
        削除
      </CommonButton>
    </SubHeader>
    <Row>
      <Card padding="40px 150px" gap="20px">
        <Row justify="start">
          <h4>基本情報</h4>
          <VerticalTable>
            <tr>
              <th>ID</th>
              <td>{{ fesDate.fes_date.id }}</td>
            </tr>
            <tr>
              <th>開催年</th>
              <td>{{ fesDate.fes_year.year_num }}</td>
            </tr>
            <tr>
              <th>何日目</th>
              <td>{{ fesDate.fes_date.days_num }}</td>
            </tr>
            <tr>
              <th>開催日</th>
              <td>{{ fesDate.fes_date.date }}</td>
            </tr>
            <tr>
              <th>曜日</th>
              <td>{{ fesDate.fes_date.day }}</td>
            </tr>
            <tr>
              <th>登録日時</th>
              <td>{{ fesDate.fes_date.created_at | formatDate }}</td>
            </tr>
            <tr>
              <th>編集日時</th>
              <td>{{ fesDate.fes_date.updated_at | formatDate }}</td>
            </tr>
          </VerticalTable>
        </Row>
      </Card>
    </Row>

    <EditModal
      @close="closeEditModal"
      v-if="isOpenEditModal"
      title="開催日の編集"
    >
      <template v-slot:form>
        <div>
          <h3>開催年</h3>
          <select v-model="fesYearID">
            <option disabled value="">選択してください</option>
            <option v-for="year in yearsList" :key="year.id" :value="year.id">
              {{ year.year_num }}
            </option>
          </select>
        </div>
        <div>
          <h3>開催日</h3>
          <input v-model="date" type="text" placeholder="入力してください" />
        </div>
        <div>
          <h3>曜日</h3>
          <input v-model="day" placeholder="入力してください" />
        </div>
        <div>
          <h3>何日目</h3>
          <select v-model="daysNum">
            <option disabled value="">選択してください</option>
            <option
              v-for="daysNum in daysNumList"
              :key="daysNum.id"
              :value="daysNum.value"
            >
              {{ daysNum.text }}
            </option>
          </select>
        </div>
      </template>
      <template v-slot:method>
        <CommonButton iconName="edit" :on_click="edit">編集</CommonButton>
      </template>
    </EditModal>

    <DeleteModal
      @close="closeDeleteModal"
      v-if="isOpenDeleteModal"
      title="参加団体申請の削除"
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
      fesDate: [],
      fesYearID: null,
      date: null,
      day: null,
      daysNum: null,
      daysNumList: [
        { id: 1, text: "準備日", value: 0 },
        { id: 2, text: "1日目", value: 1 },
        { id: 3, text: "2日目", value: 2 },
        { id: 4, text: "片付け日", value: 3 },
      ],
    };
  },
  async asyncData({ $axios, route }) {
    const yearsUrl = "/fes_years";
    const yearsRes = await $axios.$get(yearsUrl);
    const routeId = route.path.replace("/fes_dates/", "");
    const fesDateUrl = "/fes_dates/" + routeId;
    const fesDateRes = await $axios.$get(fesDateUrl);
    return {
      fesDate: fesDateRes.data,
      yearsList: yearsRes.data,
      routeId: routeId,
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
      this.fesYearID = this.fesDate.fes_date.fes_year_id;
      this.date = this.fesDate.fes_date.date;
      this.day = this.fesDate.fes_date.day;
      this.daysNum = this.fesDate.fes_date.days_num;
      console.log(this.fesYearID);
      this.isOpenEditModal = false;
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
    async reload(id) {
      const reUrl = "/fes_dates/" + id;
      const resFesDate = await this.$axios.$get(reUrl);
      this.fesDate = resFesDate.data;
    },
    async edit() {
      const url =
        "/fes_dates/" +
        this.routeId +
        "?fes_year_id=" +
        this.fesYearID +
        "&date=" +
        this.date +
        "&day=" +
        this.day +
        "&days_num=" +
        this.daysNum;

      await this.$axios.$put(url).then((res) => {
        this.openSnackBar("登録情報を編集しました");
        this.fesYearID = null;
        this.date = null;
        this.day = null;
        this.daysNum = null;
        this.reload(res.data.id);
        this.closeEditModal();
      });
    },
    async destroy() {
      const delUrl = "/fes_dates/" + this.routeId;
      await this.$axios.$delete(delUrl);
      this.$router.push("/fes_dates");
    },
  },
};
</script>
