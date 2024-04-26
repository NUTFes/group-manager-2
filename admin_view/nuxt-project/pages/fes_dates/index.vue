<template>
  <div class="main-content">
    <SubHeader pageTitle="開催日">
      <CommonButton v-if="this.$role(roleID).fes_dates.create" iconName="add_circle" :on_click="openAddModal">
        追加
      </CommonButton>
    </SubHeader>

    <Card width="100%">
      <Table>
        <template v-slot:table-header>
          <th v-for="(header, index) in headers" :key="index">
            {{ header }}
          </th>
        </template>
        <template v-slot:table-body>
          <tr
            v-for="(fesDate, index) in fesDates"
            :key="index"
            @click="
              () =>
                $router.push({
                  path: `/fes_dates/` + fesDate.fes_date.id,
                })
            "
          >
            <td>{{ fesDate.fes_date.id }}</td>
            <td>{{ fesDate.fes_year.year_num }}</td>
            <td>{{ fesDate.fes_date.days_num }}</td>
            <td>{{ fesDate.fes_date.date }}</td>
            <td>{{ fesDate.fes_date.day }}</td>
          </tr>
        </template>
      </Table>
    </Card>

    <AddModal @close="closeAddModal" v-if="isOpenAddModal" title="開催日の追加">
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
        <CommonButton iconName="add_circle" :on_click="submit"
          >登録</CommonButton
        >
      </template>
    </AddModal>
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
      headers: [
        "ID",
        "開催年",
        "何日目",
        "開催日",
        "曜日",
      ],
      daysNumList: [
        { id: 1, text: "準備日", value: 0 },
        { id: 2, text: "1日目", value: 1 },
        { id: 3, text: "2日目", value: 2 },
        { id: 4, text: "片付け日", value: 3 },
      ],
      isOpenAddModal: false,
      isOpenSnackBar: false,
      fesYearID: null,
      date: null,
      day: null,
      daysNum: null,
    };
  },
  async asyncData({ $axios }) {
    const yearsUrl = "/fes_years";
    const yearsRes = await $axios.$get(yearsUrl);
    const fesDateUrl = "/fes_dates";
    const fesDatesRes = await $axios.$get(fesDateUrl);
    return {
      fesDates: fesDatesRes.data,
      yearsList: yearsRes.data,
    };
  },
  computed: {
    ...mapState({
      roleID: (state) => state.users.role,
    }),
  },
  mounted() {
    window.addEventListener('scroll', this.saveScrollPosition);
    this.$nextTick(() => {
      window.scrollTo(0, parseInt(localStorage.getItem('scrollPosition-' + this.$route.path)))
    });
  },
  methods: {
    saveScrollPosition() {
      localStorage.setItem('scrollPosition-' + this.$route.path, window.scrollY);
    },
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
    reload(id) {
      const refUrl = "/fes_dates/" + id;
      this.$axios.$get(refUrl).then((response) => {
        this.fesDates.push(response.data);
      });
    },
    async submit() {
      const url =
        "/fes_dates?fes_year_id=" +
        this.fesYearID +
        "&date=" +
        this.date +
        "&day=" +
        this.day +
        "&days_num=" +
        this.daysNum;
      console.log(url);
      this.$axios.$post(url).then((response) => {
        this.openSnackBar("登録情報を追加しました");
        this.fesYearID = null;
        this.date = null;
        this.day = null;
        this.daysNum = null;
        this.reload(response.data.id);
        this.closeAddModal();
      });
    },
  },
};
</script>
