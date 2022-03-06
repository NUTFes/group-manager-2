<template>
  <div class="main-content">
    <SubHeader pageTitle="開催年">
      <CommonButton iconName="add_circle" :on_click="openAddModal">
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
            <td>{{ fesYear.created_at | formatDate }}</td>
            <td>{{ fesYear.updated_at | formatDate }}</td>
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
  </div>
</template>

<script>
export default {
  watchQuery: ["page"],
  data() {
    return {
      headers: ["ID", "開催年", "登録日時", "編集日時"],
      isOpenAddModal: false,
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
  methods: {
    openAddModal() {
      this.isOpenAddModal = false;
      this.isOpenAddModal = true;
    },
    closeAddModal() {
      this.isOpenAddModal = false;
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
        this.year_num = null;
        this.reload(response.data.id);
        this.closeAddModal();
      });
    },
  },
};
</script>
