<template>
  <div class="main-content">
    <SubHeader pageTitle="開催年">
      <CommonButton v-if="this.$role(roleID).fes_years.create" iconName="add_circle" :on_click="openAddModal">
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
            v-for="(fesYear, index) in fesYears"
            :key="index"
            @click="
              () =>
                $router.push({
                  path: `/fes_years/` + fesYear.id,
                })
            "
          >
            <td>{{ fesYear.id }}</td>
            <td>{{ fesYear.year_num }}</td>
          </tr>
        </template>
      </Table>
    </Card>

    <AddModal @close="closeAddModal" v-if="isOpenAddModal" title="開催年の追加">
      <template v-slot:form>
        <div>
          <h3>開催年</h3>
          <input
            v-model="year_num"
            type="number"
            placeholder="入力してください"
          />
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
      headers: ["ID", "開催年"],
      isOpenAddModal: false,
      isOpenSnackBar: false,
      year_num: null,
      fesYears: [],
    };
  },
  async asyncData({ $axios }) {
    const fesYearUrl = "/fes_years";
    const fesYearsRes = await $axios.$get(fesYearUrl);
    return {
      fesYears: fesYearsRes.data,
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
      const reUrl = "/fes_years/" + id;
      this.$axios.$get(reUrl).then((response) => {
        this.fesYears.push(response.data);
      });
    },
    async submit() {
      const url = "/fes_years?year_num=" + this.year_num;
      this.$axios.$post(url).then((response) => {
        this.openSnackBar("登録情報を追加しました");
        this.year_num = null;
        this.reload(response.data.id);
        this.closeAddModal();
      });
    },
  },
};
</script>
