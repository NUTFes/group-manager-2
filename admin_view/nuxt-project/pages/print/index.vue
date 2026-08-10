<template>
  <div class="main-content" v-if="this.$role(roleID).print.read">
    <SubHeader pageTitle="書類印刷"></SubHeader>
    <Card width="100%">
      <VerticalTable>
        <tr>
          <td>使用電力リスト</td>
          <td>
            <InTableButton iconName="file_download" :on_click="downloadPowerPDF"
              >PDF</InTableButton
            >
            <InTableButton
              iconName="file_download"
              :on_click="downloadPowerCSV"
            >
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
            <InTableButton
              iconName="file_download"
              :on_click="downloadEmployeeCSV"
            >
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
            <InTableButton
              iconName="file_download"
              :on_click="downloadRentalItemsCSV"
            >
              CSV
            </InTableButton>
          </td>
        </tr>
        <tr>
          <td>販売品リスト</td>
          <td>
            <InTableButton
              iconName="file_download"
              :on_click="downloadFoodProductsPDF"
              >PDF</InTableButton
            >
            <InTableButton
              iconName="file_download"
              :on_click="downloadFoodProductsCSV"
            >
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
            <InTableButton
              iconName="file_download"
              :on_click="downloadContactsCSV"
            >
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
            <InTableButton
              iconName="file_download"
              :on_click="downloadGroupInfoCSV"
            >
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
            <InTableButton
              iconName="file_download"
              :on_click="downloadRentalItemsAllCSV"
            >
              CSV
            </InTableButton>
          </td>
        </tr>
        <tr>

          <td>物品貸出表（国際団体・英語版）</td>
          <td>
            <InTableButton
              iconName="file_download"
              :on_click="downloadRentalItemsAllPDFen"
              >PDF</InTableButton
            >
          </td>
        </tr>
        <tr>
          <td>保健所提出書類（調理計画・調理工程・従事者・平面図）</td>
          <td>
            <InTableButton
              iconName="file_download"
              :on_click="downloadHealthOfficeDocumentsPDF"
              >PDF</InTableButton
            >
          </td>
        </tr>
      </VerticalTable>
    </Card>
    <SnackBar v-if="isOpenSnackBar" @close="closeSnackBar">
      {{ snackBarMessage }}
    </SnackBar>
  </div>
  <h1 v-else>閲覧権限がありません</h1>
</template>

<script>
import { mapState } from "vuex";
import { downloadFile } from '~/utils/download-file';

export default {
  watchQuery: ["page"],
  async asyncData({ $axios }) {
    const currentYearUrl = "/user_page_settings/1";
    const currentYearRes = await $axios.$get(currentYearUrl);
    return {
      currentYearID: currentYearRes.data.fes_year_id,
      isOpenSnackBar: false,
      snackBarMessage: "",
    };
  },
  computed: {
    ...mapState({
      roleID: (state) => state.users.role,
    }),
  },
  mounted() {
    window.addEventListener("scroll", this.saveScrollPosition);
    this.$nextTick(() => {
      window.scrollTo(
        0,
        parseInt(localStorage.getItem("scrollPosition-" + this.$route.path))
      );
    });
  },
  methods: {
    saveScrollPosition() {
      localStorage.setItem(
        "scrollPosition-" + this.$route.path,
        window.scrollY
      );
    },
    openSnackBar(message) {
        this.snackBarMessage = message;
        this.isOpenSnackBar = true;
        setTimeout(this.closeSnackBar, 2000);
    },
    closeSnackBar() {
      this.isOpenSnackBar = false;
    },
    async downloadPowerPDF() {
      const endpoint = `/print_pdf/power/${this.currentYearID}/output.pdf`;
      await downloadFile(this.$axios,endpoint, '使用電力リスト');
      this.openSnackBar("使用電力リストをダウンロードしました");
    },
    async downloadEmployeePDF() {
      const endpoint = `/print_pdf/employees/${this.currentYearID}/output.pdf`;
      await downloadFile(this.$axios,endpoint, '従業員リスト');
      this.openSnackBar("従業員リストをダウンロードしました");
    },
    async downloadRentalItemsPDF() {
      const endpoint = `/print_pdf/rental_items_list/${this.currentYearID}/output.pdf`;
      await downloadFile(this.$axios,endpoint, '貸出物品リスト');
      this.openSnackBar("貸出物品リストをダウンロードしました");
    },
    async downloadFoodProductsPDF() {
      const endpoint = `/print_pdf/food_products/${this.currentYearID}/output.pdf`;
      await downloadFile(this.$axios,endpoint, '販売品リスト');
      this.openSnackBar("販売品リストをダウンロードしました");
    },
    async downloadContactsPDF() {
      const endpoint = `/print_pdf/contacts/${this.currentYearID}/output.pdf`;
      await downloadFile(this.$axios,endpoint, '連絡先リスト');
      this.openSnackBar("連絡先リストをダウンロードしました");
    },
    async downloadGroupInfoPDF() {
      const endpoint = `/print_pdf/all_groups_info/${this.currentYearID}/output.pdf`;
      await downloadFile(this.$axios,endpoint, '参加団体情報リスト');
      this.openSnackBar("参加団体情報リストをダウンロードしました");
    },
    async downloadRentalItemsAllPDF() {
      const endpoint = `/print_pdf/group_all/${this.currentYearID}/output.pdf?render_locale=ja`;
      await downloadFile(this.$axios,endpoint, '物品貸し出し表まとめ');
      this.openSnackBar("物品貸し出し表まとめをダウンロードしました");
    },
    async downloadRentalItemsAllPDFen() {
      const endpoint = `/print_pdf/group_all/${this.currentYearID}/output.pdf?locale=en&render_locale=en`;
      await downloadFile(this.$axios,endpoint, '物品貸し出し表まとめ（国際団体・英語版）');
      this.openSnackBar("物品貸し出し表まとめ（国際団体・英語版）をダウンロードしました");
    },
    async downloadHealthOfficeDocumentsPDF() {
      const endpoint = `/print_pdf/health_office_documents/${this.currentYearID}/output.pdf`;
      await downloadFile(this.$axios,endpoint, '保健所提出書類（調理計画・調理工程・従事者・平面図）');
      this.openSnackBar("保健所提出書類（調理計画・調理工程・従事者・平面図）をダウンロードしました");
    },
    async downloadPowerCSV() {
      const endpoint = `/api/v1/get_power_orders_csv/${this.currentYearID}`;
      await downloadFile(this.$axios,endpoint, '使用電力リスト', 'text/csv');
      this.openSnackBar("使用電力リストのCSVをダウンロードしました");
    },
    async downloadEmployeeCSV() {
      const endpoint = `/api/v1/get_employees_csv/${this.currentYearID}`;
      await downloadFile(this.$axios,endpoint, '従業員リスト', 'text/csv');
      this.openSnackBar("従業員リストのCSVをダウンロードしました");
    },
    async downloadRentalItemsCSV() {
      const endpoint = `/api/v1/get_rental_items_list_csv/${this.currentYearID}`;
      const succeeded = await downloadFile(this.$axios,endpoint, '貸出物品リスト', 'text/csv');
      this.openSnackBar(
        succeeded
          ? "貸出物品リストのCSVをダウンロードしました"
          : "貸出物品リストのCSVのダウンロードに失敗しました"
      );
    },
    async downloadFoodProductsCSV() {
      const endpoint = `/api/v1/get_food_products_csv/${this.currentYearID}`;
      await downloadFile(this.$axios,endpoint, '販売品リスト', 'text/csv');
      this.openSnackBar("販売品リストのCSVをダウンロードしました");
    },
    async downloadContactsCSV() {
      const endpoint = `/api/v1/get_users_csv/${this.currentYearID}`;
      await downloadFile(this.$axios,endpoint, '連絡先リスト', 'text/csv');
      this.openSnackBar("連絡先リストのCSVをダウンロードしました");
    },
    async downloadGroupInfoCSV() {
      const endpoint = `/api/v1/get_groups_csv/${this.currentYearID}`;
      await downloadFile(this.$axios,endpoint, '参加団体情報リスト', 'text/csv');
      this.openSnackBar("参加団体情報リストのCSVをダウンロードしました");
    },
    async downloadRentalItemsAllCSV() {
      const endpoint = `/api/v1/get_assign_rental_items_csv/${this.currentYearID}`;
      const succeeded = await downloadFile(this.$axios,endpoint, '物品貸し出し表まとめ', 'text/csv');
      this.openSnackBar(
        succeeded
          ? "物品貸し出し表まとめのCSVをダウンロードしました"
          : "物品貸し出し表まとめのCSVのダウンロードに失敗しました"
      );
    },
  },
};
</script>
