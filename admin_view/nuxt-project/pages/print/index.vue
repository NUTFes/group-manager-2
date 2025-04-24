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
          <td>保健所提出書類（調理計画・従事者）</td>
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
  </div>
  <h1 v-else>閲覧権限がありません</h1>
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
  mounted() {
    window.addEventListener("scroll", this.saveScrollPosition);
    this.$nextTick(() => {
      window.scrollTo(
        0,
        parseInt(localStorage.getItem("scrollPosition-" + this.$route.path))
      );
    });
    // 認証ヘッダー付き Axios インスタンスを作成
    const accessToken = localStorage.getItem("access-token") || "";
    const client = localStorage.getItem("client") || "";
    const uid = localStorage.getItem("uid") || "";
    const expiry = localStorage.getItem("expiry") || "";
    const tokenType = localStorage.getItem("token-type") || "Bearer";

    this.authAxios = this.$axios.create({
      headers: {
        "access-token": accessToken,
        client,
        uid,
        expiry,
        "token-type": tokenType,
      },
      withCredentials: true,
    });
  },
  methods: {
    saveScrollPosition() {
      localStorage.setItem(
        "scrollPosition-" + this.$route.path,
        window.scrollY
      );
    },
    async downloadFile(endpoint, fileName, fileType = 'application/pdf') {
      try {
        const response = await this.authAxios.get(
          endpoint,
          { responseType: 'blob' }
        );

        const blob = new Blob([response.data], { type: fileType });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;

        link.setAttribute('download', `${fileName}_${Date.now()}.${fileType.split('/')[1]}`);

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.URL.revokeObjectURL(url);

        return true;
      } catch (error) {
        console.error("エラーが発生しました", error);
        // マジ親切にユーザーにも教えてあげる
        this.openSnackBar && this.openSnackBar(`${fileName}のダウンロード失敗`);
        return false;
      }
    },
    async downloadPowerPDF() {
      const endpoint = `/print_pdf/power/${this.currentYearID}/output.pdf`;
      await this.downloadFile(endpoint, '使用電力リスト');
    },
    async downloadEmployeePDF() {
      const endpoint = `/print_pdf/employees/${this.currentYearID}/output.pdf`;
      await this.downloadFile(endpoint, '従業員リスト');
    },
    async downloadRentalItemsPDF() {
      const endpoint = `/print_pdf/rental_items_list/${this.currentYearID}/output.pdf`;
      await this.downloadFile(endpoint, '貸出物品リスト');
    },
    async downloadFoodProductsPDF() {
      const endpoint = `/print_pdf/food_products/${this.currentYearID}/output.pdf`;
      await this.downloadFile(endpoint, '販売品リスト');
    },
    async downloadContactsPDF() {
      const endpoint = `/print_pdf/contacts/${this.currentYearID}/output.pdf`;
      await this.downloadFile(endpoint, '連絡先リスト');
    },
    async downloadGroupInfoPDF() {
      const endpoint = `/print_pdf/all_groups_info/${this.currentYearID}/output.pdf`;
      await this.downloadFile(endpoint, '参加団体情報リスト');
    },
    async downloadRentalItemsAllPDF() {
      const endpoint = `/print_pdf/group_all/${this.currentYearID}/output.pdf`;
      await this.downloadFile(endpoint, '物品貸し出し表まとめ');
    },
    async downloadHealthOfficeDocumentsPDF() {
      const endpoint = `/print_pdf/health_office_documents/${this.currentYearID}/output.pdf`;
      await this.downloadFile(endpoint, '保健所提出書類（調理計画・従事者）');
    },
    async downloadPowerCSV() {
      const endpoint = `/api/v1/get_power_orders_csv/${this.refYearID}`;
      await this.downloadFile(endpoint, '使用電力リスト_CSV', 'text/csv');
    },
    async downloadEmployeeCSV() {
      const endpoint = `/api/v1/get_employees_csv/${this.refYearID}`;
      await this.downloadFile(endpoint, '従業員リスト_CSV', 'text/csv');
    },
    async downloadRentalItemsCSV() {
      const endpoint = `/api/v1/get_rental_orders_csv/${this.refYearID}`;
      await this.downloadFile(endpoint, '貸出物品リスト_CSV', 'text/csv');
    },
    async downloadFoodProductsCSV() {
      const endpoint = `/api/v1/get_food_products_csv/${this.refYearID}`;
      await this.downloadFile(endpoint, '販売品リスト_CSV', 'text/csv');
    },
    async downloadContactsCSV() {
      const endpoint = `/api/v1/get_users_csv/${this.currentYearID}`;
      await this.downloadFile(endpoint, '連絡先リスト_CSV', 'text/csv');
    },
    async downloadGroupInfoCSV() {
      const endpoint = `/api/v1/get_groups_csv/${this.refYearID}`;
      await this.downloadFile(endpoint, '参加団体情報リスト_CSV', 'text/csv');
    },
    async downloadRentalItemsAllCSV() {
      const endpoint = `/api/v1/get_assign_rental_items_csv/${this.refYearID}`;
      await this.downloadFile(endpoint, '物品貸し出し表まとめ_CSV', 'text/csv');
    },
  },
};
</script>
