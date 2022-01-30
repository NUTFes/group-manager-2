<template>
  <div class="main-content">
    <SubHeader pageTitle="購入食品申請一覧">
      <CommonButton iconName="add_circle" :on_click="openAddModal">
        追加
      </CommonButton>
      <CommonButton iconName="file_download" :on_click="downloadCSV">
        CSVダウンロード
      </CommonButton>
    </SubHeader>
    <Card width="100%">
      <Table>
        <template v-slot:table-header>
          <th v-for="(header, index) in headers" v-bind:key="index">
            {{ header }}
          </th>
        </template>
        <template v-slot:table-body>
          <tr
            v-for="(purchaseList, index) in purchaseLists"
            @click="
              () =>
                $router.push({
                  path: `/purchase_lists/` + purchaseList.purchase_list.id,
                })
            "
            :key="index"
          >
            <td>{{ purchaseList.purchase_list.id }}</td>
            <td>{{ purchaseList.group.name }}</td>
            <td>{{ purchaseList.purchase_list_info.food_product }}</td>
            <td>{{ purchaseList.purchase_list.items }}</td>
            <td>{{ purchaseList.purchase_list.is_fresh }}</td>
            <td>{{ purchaseList.purchase_list.created_at | formatDate }}</td>
            <td>{{ purchaseList.purchase_list.updated_at | formatDate }}</td>
          </tr>
        </template>
      </Table>
    </Card>

    <AddModal
      @close="closeAddModal"
      v-if="isOpenAddModal"
      title="従業員申請の追加"
    >
      <template v-slot:form>
        <div>
          <h3>団体名</h3>
          <select v-model="appGroup">
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
          <input v-model="employeeName" placeholder="入力してください" />
        </div>
        <div>
          <h3>学籍番号</h3>
          <input v-model="employeeStudentId" placeholder="入力してください" />
        </div>
      </template>
      <template v-slot:method>
        <CommonButton iconName="add_circle" :on_click="submitEmployee"
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
      headers: [
        "ID",
        "参加団体",
        "販売食品",
        "購入品",
        "なまもの",
        "登録日時",
        "編集日時",
      ],
      isOpenAddModal: false,
    };
  },
  async asyncData({ $axios }) {
    const url = "/api/v1/get_purchase_list_index_for_admin_view";
    const purchaseListsRes = await $axios.$get(url);
    const yearsUrl = "/fes_years";
    const yearsRes = await $axios.$get(yearsUrl);
    return {
      purchaseLists: purchaseListsRes.data,
      yearList: yearsRes.data,
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
    reload() {
      const employeeId = this.employees.slice(-1)[0].employee.id + 1;
      const reUrl = "/api/v1/get_employee_show_for_admin_view/" + employeeId;
      this.$axios.$get(reUrl).then((response) => {
        this.employees.push(response.data);
      });
    },
    async submitEmployee() {
      const postEmployeeUrl =
        "/employees/" +
        "?group_id=" +
        this.appGroup +
        "&name=" +
        this.employeeName +
        "&student_id=" +
        this.employeeStudentId;

      this.$axios.$post(postEmployeeUrl).then((response) => {
        this.appGroup = "";
        this.employeeName = "";
        this.employeeStudentId = "";
        this.reload();
        this.closeAddModal();
      });
    },
    async downloadCSV() {
      const url =
        "http://localhost:3000" +
        "/api/v1/get_purchase_lists_csv/" +
        this.refYearID;
      window.open(url, "購入品申請_CSV");
    },
  },
};
</script>
