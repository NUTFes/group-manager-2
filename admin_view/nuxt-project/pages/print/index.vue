<template>
  <div class="main-content">
    <SubHeader pageTitle="書類印刷"></SubHeader>
    <Card width="100%">
      <VerticalTable>
        <tr>
          <td>使用電力リスト</td>
          <td><InTableButton iconName="file_download" :on_click="downloadPowerPDF">ダウンロード</InTableButton></td>
        </tr>
        <tr>
          <td>従業員リスト</td>
          <td><InTableButton iconName="file_download" :on_click="downloadEmployeePDF">ダウンロード</InTableButton></td>
        </tr>
        <tr>
          <td>貸出物品リスト</td>
          <td><InTableButton iconName="file_download" :on_click="downloadRentalItemsPDF">ダウンロード</InTableButton></td>
        </tr>
        <tr>
          <td>販売食品リスト</td>
          <td><InTableButton iconName="file_download" :on_click="downloadFoodProductsPDF">ダウンロード</InTableButton></td>
        </tr>
        <tr>
          <td>連絡先リスト</td>
          <td><InTableButton iconName="file_download" :on_click="downloadContactsPDF">ダウンロード</InTableButton></td>
        </tr>
        <tr>
          <td>参加団体情報リストまとめ</td>
          <td><InTableButton iconName="file_download" :on_click="downloadGroupInfoPDF">ダウンロード</InTableButton></td>
        </tr>
        <tr>
          <td>物品貸し出し表まとめ</td>
          <td><InTableButton iconName="file_download" :on_click="downloadRentalItemsAllPDF">ダウンロード</InTableButton></td>
        </tr>
      </VerticalTable>
    </Card>
  </div>
</template>

<script>
export default {
  watchQuery: ["page"],
  async asyncData({ $axios }){
    const currentYearUrl = "/user_page_settings/1";
    const currentYearRes = await $axios.$get(currentYearUrl);
    return {
      currentYearID: currentYearRes.data.fes_year_id,
    };
  },
  methods: {
    downloadPowerPDF: function () {
      window.open(
        "http://localhost:3000" + "/print_pdf/power/" + this.currentYearID + "/output.pdf",
        "使用電力リスト"
      );
    },
    downloadEmployeePDF: function () {
      window.open(
        "http://localhost:3000" + "/print_pdf/employees/" + this.currentYearID + "/output.pdf",
        "従業員リスト"
      );
    },
    downloadRentalItemsPDF: function () {
      window.open(
        "http://localhost:3000" + "/print_pdf/rental_items_list/" + this.currentYearID + "/output.pdf",
        "貸出物品リスト"
      );
    },
    downloadFoodProductsPDF: function () {
      window.open(
        "http://localhost:3000" + "/print_pdf/food_products/" + this.currentYearID + "/output.pdf",
        "従業員リスト"
      );
    },
    downloadContactsPDF: function () {
      window.open(
        "http://localhost:3000" + "/print_pdf/contacts/" + this.currentYearID + "/output.pdf",
        "連絡先リスト"
      );
    },
    downloadGroupInfoPDF: function () {
      window.open(
        "http://localhost:3000" + "/print_pdf/all_groups_info/" + this.currentYearID + "/output.pdf",
        "参加団体情報リスト"
      );
    },
    downloadRentalItemsAllPDF: function () {
      window.open(
        "http://localhost:3000" + "/print_pdf/group_all/" + this.currentYearID + "/output.pdf",
        "物品貸し出し表まとめ"
      );
    },
  },
};
</script>
