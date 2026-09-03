<template>
  <div class="main-content">
    <SubHeader pageTitle="火気使用申請一覧">
      <CommonButton iconName="add_circle" :on_click="openAddModal">
        追加
      </CommonButton>
      <CommonButton iconName="file_download" :on_click="downloadCSV">
        CSV
      </CommonButton>
    </SubHeader>

    <SubSubHeader>
      <template v-slot:refinement>
        <SearchDropDown
          :nameList="yearList"
          :on_click="refinement"
          value="year_num"
        >
          {{ refYears }}
        </SearchDropDown>
      </template>
    </SubSubHeader>

    <Card width="100%">
      <Table>
        <template v-slot:table-header>
          <th v-for="header in headers" :key="header">{{ header }}</th>
        </template>
        <template v-slot:table-body>
          <tr
            v-for="order in fireEquipmentOrders"
            @click="
              () =>
                $router.push({
                  path: `/fire_equipment_orders/` + order.id,
                })
            "
            :key="order.id"
          >
            <td>{{ order.id }}</td>
            <td>{{ order.group.name }}</td>
            <td>{{ order.name }}</td>
            <td>{{ order.quantity }}</td>
            <td>{{ order.fuel_japanese }}</td>
            <td>{{ order.usage }}</td>
            <td>{{ order.is_takeaway ? "はい" : "いいえ" }}</td>
            <td>{{ order.remark }}</td>
          </tr>
        </template>
      </Table>
    </Card>

    <AddModal
      @close="closeAddModal"
      v-if="isOpenAddModal"
      title="火気使用申請の追加"
    >
      <template v-slot:form>
        <div>
          <h3>団体名</h3>
          <select v-model="groupId">
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
          <h3>火気の名称</h3>
          <input v-model="name" placeholder="入力してください" />
        </div>
        <div>
          <h3>火気の台数</h3>
          <input
            v-model="quantity"
            type="number"
            placeholder="入力してください"
          />
        </div>
        <div>
          <h3>燃料</h3>
          <select v-model="fuel">
            <option value="">選択してください</option>
            <option value="gas_bottle">ガスボンベ</option>
            <option value="lp_gas">LPガス</option>
            <option value="charcoal">炭</option>
          </select>
        </div>
        <div>
          <h3>使用用途</h3>
          <input v-model="usage" placeholder="入力してください" />
        </div>
        <div>
          <h3>持ち帰り</h3>
          <input type="checkbox" v-model="isTakeaway" />
        </div>
        <div>
          <h3>備考</h3>
          <textarea v-model="remark" placeholder="入力してください"></textarea>
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
  data() {
    return {
      fireEquipmentOrders: [],
      headers: [
        "ID",
        "団体名",
        "火気の名称",
        "火気の台数",
        "燃料",
        "使用用途",
        "持ち帰り",
        "備考",
      ],
      isOpenAddModal: false,
      isOpenSnackBar: false,
      message: "",
      // for modal
      groupList: [],
      groupId: null,
      name: "",
      quantity: 1,
      fuel: "",
      usage: "",
      isTakeaway: false,
      remark: "",
      // for filter
      groups: [],
      yearList: [],
      refYears: "Years",
      refYearID: 0,
    };
  },
  async asyncData({ $axios }) {
    const currentYearUrl = "/user_page_settings/1";
    const currentYearRes = await $axios.$get(currentYearUrl);
    const yearsUrl = "/fes_years";
    const yearsRes = await $axios.$get(yearsUrl);

    const initialYearId = currentYearRes.data.fes_year_id;
    const groupsUrl = `/groups?fes_year_id=${initialYearId}`;
    const groupsRes = await $axios.$get(groupsUrl);

    const ordersUrl = `/api/v1/fire_equipment_orders?fes_year_id=${initialYearId}`;
    const ordersRes = await $axios.$get(ordersUrl);

    const currentYear = yearsRes.data.find((y) => y.id === initialYearId);

    return {
      fireEquipmentOrders: ordersRes.data,
      groups: groupsRes.data,
      yearList: yearsRes.data,
      refYearID: initialYearId,
      refYears: currentYear ? currentYear.year_num : "Year",
    };
  },
  computed: {
    ...mapState({
      roleID: (state) => state.users.role,
    }),
  },
  methods: {
    async openAddModal() {
      const url = `/api/v1/get_groups_for_fire_equipment_order?fes_year_id=${this.refYearID}`;
      const response = await this.$axios.$get(url);
      this.groupList = response.data;
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
    async refinement(yearId) {
      this.refYearID = yearId;
      if (yearId === 0) {
        this.refYears = "ALL";
      } else {
        const year = this.yearList.find((y) => y.id === yearId);
        this.refYears = year ? year.year_num : "Year";
      }

      const ordersUrl = `/api/v1/fire_equipment_orders?fes_year_id=${this.refYearID}`;
      const ordersRes = await this.$axios.$get(ordersUrl);
      this.fireEquipmentOrders = ordersRes.data;

      const groupsUrl = `/groups?fes_year_id=${this.refYearID}`;
      const groupsRes = await this.$axios.$get(groupsUrl);
      this.groups = groupsRes.data;
    },

    async submit() {
      const url = `/api/v1/fire_equipment_orders`;
      const params = {
        fire_equipment_order: {
          group_id: this.groupId,
          name: this.name,
          quantity: this.quantity,
          fuel: this.fuel,
          usage: this.usage,
          is_takeaway: this.isTakeaway,
          remark: this.remark,
        },
      };
      await this.$axios.$post(url, params);
      await this.refinement(this.refYearID);
      this.closeAddModal();
      this.openSnackBar("申請を追加しました");
      // フォームの内容をリセット
      this.groupId = null;
      this.name = "";
      this.quantity = 1;
      this.fuel = "";
      this.usage = "";
      this.isTakeaway = false;
      this.remark = "";
    },
    async downloadCSV() {
      const url =
        this.$config.apiURL +
        "/api/v1/get_fire_equipment_orders_csv/" +
        this.refYearID;
      const { data } = await this.$axios.get(url, { responseType: "blob" });
      const blob = new Blob([data], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `火気使用申請一覧_${this.refYears}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
      this.openSnackBar("火気使用申請のCSVをダウンロードしました");
    },
  },
};
</script>
