<template>
	<div class="main-content">
	<SubHeader pageTitle="書類印刷"></SubHeader>
	<Card width="100%">
		<table>
        <tr>
          <td>使用電力リスト</td>
          <td><CommonButton iconName="file_download" :on_click="downloadPowerPDF">ダウンロード</CommonButton></td>
        </tr>
        <tr>
          <td>従業員リスト</td>
          <td><CommonButton iconName="file_download" :on_click="downloadEmployeePDF">ダウンロード</CommonButton></td>
        </tr>
        <tr>
          <td>貸出物品リスト</td>
          <td><CommonButton iconName="file_download" :on_click="downloadRentalItemsPDF">ダウンロード</CommonButton></td>
        </tr>
        <tr>
          <td>販売食品リスト</td>
          <td><CommonButton iconName="file_download" :on_click="downloadFoodProductsPDF">ダウンロード</CommonButton></td>
        </tr>
        <tr>
          <td>連絡先リスト</td>
          <td><CommonButton iconName="file_download" :on_click="downloadContactsPDF">ダウンロード</CommonButton></td>
        </tr>
        <tr>
          <td>参加団体情報リストまとめ</td>
          <td><CommonButton iconName="file_download" :on_click="downloadGroupInfoPDF">ダウンロード</CommonButton></td>
        </tr>
        <tr>
          <td>物品貸し出し表まとめ</td>
          <td><CommonButton iconName="file_download" :on_click="downloadRentalItemsAllPDF">ダウンロード</CommonButton></td>
        </tr>
		</table>	
	</Card>	
  </div>
</template>

<script>
export default {
  methods: {
    downloadPowerPDF: function () {
      window.open(
        "http://localhost:3000" + "/print_pdf/power/" + 1 + "/output.pdf",
        "使用電力リスト"
      );
    },
    downloadEmployeePDF: function () {
      window.open(
        "http://localhost:3000" + "/print_pdf/employees/" + 1 + "/output.pdf",
        "従業員リスト"
      );
    },
    downloadRentalItemsPDF: function () {
      window.open(
        "http://localhost:3000" + "/print_pdf/rental_items_list/" + 1 + "/output.pdf",
        "貸出物品リスト"
      );
    },
    downloadFoodProductsPDF: function () {
      window.open(
        "http://localhost:3000" + "/print_pdf/food_products/" + 1 + "/output.pdf",
        "従業員リスト"
      );
    },
    downloadContactsPDF: function () {
      window.open(
        "http://localhost:3000" + "/print_pdf/contacts/" + 1 + "/output.pdf",
        "連絡先リスト"
      );
    },
    downloadGroupInfoPDF: function () {
      window.open(
        "http://localhost:3000" + "/print_pdf/all_groups_info/" + 1 + "/output.pdf",
        "参加団体情報リスト"
      );
    },
    downloadRentalItemsAllPDF: function () {
      window.open(
        "http://localhost:3000" + "/print_pdf/group_all/" + 1 + "/output.pdf",
        "物品貸し出し表まとめ"
      );
    },
  },
};
</script>
