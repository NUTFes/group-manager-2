<template>
  <div class="main-content">
    <SubHeader pageTitle="書類印刷"></SubHeader>
    <Card width="100%">
      <VerticalTable>
        <tr>
          <td>使用電力リスト</td>
          <td>
            <InTableButton iconName="file_download" :on_click="downloadPowerPDF"
              >PDF</InTableButton
            >
            <InTableButton iconName="file_download" :on_click="downloadPowerCSV">
              CSV
            </InTableButton>
          </td>
        </tr>
        <tr>
          <td>従業員リスト</td>
          <td>
            <InTableButton
              iconName="file_download"
              :on_click="downloadEmployeePDF"
              >PDF</InTableButton
            >
            <InTableButton iconName="file_download" :on_click="downloadEmployeeCSV">
              CSV
            </InTableButton>
          </td>
        </tr>
        <tr>
          <td>貸出物品リストまとめ</td>
          <td>
            <InTableButton
              iconName="file_download"
              :on_click="downloadRentalItemsPDF"
              >PDF</InTableButton
            >
            <InTableButton iconName="file_download" :on_click="downloadRentalItemsCSV">
              CSV
            </InTableButton>
          </td>
        </tr>
        <tr>
          <td>販売食品リスト</td>
          <td>
            <InTableButton
              iconName="file_download"
              :on_click="downloadFoodProductsPDF"
              >PDF</InTableButton
            >
            <InTableButton iconName="file_download" :on_click="downloadFoodProductsCSV">
              CSV
            </InTableButton>
          </td>
        </tr>
        <tr>
          <td>連絡先リスト</td>
          <td>
            <InTableButton
              iconName="file_download"
              :on_click="downloadContactsPDF"
              >PDF</InTableButton
            >
            <InTableButton iconName="file_download" :on_click="downloadContactsCSV">
              CSV
            </InTableButton>
          </td>
        </tr>
        <tr>
          <td>参加団体情報リストまとめ</td>
          <td>
            <InTableButton
              iconName="file_download"
              :on_click="downloadGroupInfoPDF"
              >PDF</InTableButton
            >
            <InTableButton iconName="file_download" :on_click="downloadGroupInfoCSV">
              CSV
            </InTableButton>
          </td>
        </tr>
        <tr>
          <td>物品貸出表</td>
          <td>
            <InTableButton
              iconName="file_download"
              :on_click="downloadRentalItemsAllPDF"
              >PDF</InTableButton
            >
            <InTableButton iconName="file_download" :on_click="downloadRentalItemsAllCSV">
              CSV
            </InTableButton>
          </td>
        </tr>
        <tr>
          <td>保健所提出書類（調理計画・従事者）</td>
          <td>
            <InTableButton iconName="file_download" :on_click="downloadHealthOfficeDocumentsPDF">PDF</InTableButton>
          </td>
        </tr>
      </VerticalTable>
    </Card>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  watchQuery: ["page"],
  async asyncData({ $axios }) {
    const currentYearUrl = "/user_page_settings/1";
    const currentYearRes = await $axios.$get(currentYearUrl);
    return {
      currentYearID: currentYearRes.data.fes_year_id,
    };
  },
  computed: {
    ...mapState({
      roleID: (state) => state.users.role,
    }),
  },
  methods: {
    downloadPowerPDF: function () {
      window.open(
        this.$config.apiURL +
          "/print_pdf/power/" +
          this.currentYearID +
          "/output.pdf",
        "使用電力リスト"
      );
    },
    downloadEmployeePDF: function () {
      window.open(
        this.$config.apiURL +
          "/print_pdf/employees/" +
          this.currentYearID +
          "/output.pdf",
        "従業員リスト"
      );
    },
    downloadRentalItemsPDF: function () {
      window.open(
        this.$config.apiURL +
          "/print_pdf/rental_items_list/" +
          this.currentYearID +
          "/output.pdf",
        "貸出物品リスト"
      );
    },
    downloadFoodProductsPDF: function () {
      window.open(
        this.$config.apiURL +
          "/print_pdf/food_products/" +
          this.currentYearID +
          "/output.pdf",
        "販売食品リスト"
      );
    },
    downloadContactsPDF: function () {
      window.open(
        this.$config.apiURL +
          "/print_pdf/contacts/" +
          this.currentYearID +
          "/output.pdf",
        "連絡先リスト"
      );
    },
    downloadGroupInfoPDF: function () {
      window.open(
        this.$config.apiURL +
          "/print_pdf/all_groups_info/" +
          this.currentYearID +
          "/output.pdf",
        "参加団体情報リスト"
      );
    },
    downloadRentalItemsAllPDF: function () {
      window.open(
        this.$config.apiURL +
          "/print_pdf/group_all/" +
          this.currentYearID +
          "/output.pdf",
        "物品貸し出し表まとめ"
      );
    },
    downloadHealthOfficeDocumentsPDF: function () {
      window.open(
        this.$config.apiURL +
          "/print_pdf/health_office_documents/" +
          this.currentYearID +
          "/output.pdf",
        "保健所提出書類（調理計画・従事者）"
      );
    },
    async downloadPowerCSV() {
      const url =
        this.$config.apiURL + "/api/v1/get_power_orders_csv/" + this.refYearID;
      window.open(url, "使用電力リスト_CSV");
    },
    async downloadEmployeeCSV() {
      const url =
        this.$config.apiURL + "/api/v1/get_employees_csv/" + this.refYearID;
      window.open(url, "従業員リスト_CSV");
    },
    async downloadRentalItemsCSV() {
      const url =
        this.$config.apiURL + "/api/v1/get_rental_orders_csv/" + this.refYearID;
      window.open(url, "貸出物品リスト_CSV");
    },
    async downloadFoodProductsCSV() {
      const url =
        this.$config.apiURL + "/api/v1/get_food_products_csv/" + this.refYearID;
      window.open(url, "販売食品リスト_CSV");
    },
    async downloadContactsCSV() {
      const url =
        this.$config.apiURL + "/api/v1/get_users_csv/" + this.refYearID;
      window.open(url, "連絡先リスト_CSV");
    },
    async downloadGroupInfoCSV() {
      const url =
        this.$config.apiURL + "/api/v1/get_assign_rental_items_csv/" + this.refYearID;
      window.open(url, "参加団体情報リスト_CSV");
    },
    async downloadRentalItemsAllCSV() {
      const url =  //無し
        this.$config.apiURL + "/api/v1/get_groups_csv/" + this.refYearID;
      window.open(url, "物品貸し出し表まとめ_CSV");
    },
  },
};
</script>
