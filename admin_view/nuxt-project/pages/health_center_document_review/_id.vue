<template>
  <div class="main-content">
    <SubHeader v-bind:pageTitle="group.group.name" pageSubTitle="保健所提出団体一覧">
    </SubHeader>
    <Row align="start" justify="start">
      <Column width="100%" align="start" justify="start" gap="8px">
        <p>企画名: {{ group.group.project_name }}</p>
        <p>代表者: {{ group.user.name }}</p>
        <p>メール: <a class="mail-link" :href="'mailto:' + group.user.email">{{ group.user.email }}</a></p>
      </Column>
    </Row>

    <Row wrap="nowrap" align="start" justify="space-between">
      <Column width="70%" height="800px" align="start" justify="start">
        <Card width="100%" style="overflow: scroll; align-items: flex-start;">
          <h2>調理工程申請</h2>
          <VerticalTable v-for="order in cookingProcessOrders" :key="order.id">
            <tr>
              <th colspan="3">{{ getFoodProductName(order.food_product_id) }}</th>
            </tr>
            <tr>
              <th>調理場</th>
              <td>営業前：{{ order.pre_open_kitchen ? "使用する" : "使用しない" }}</td>
              <td>営業中：{{ order.during_open_kitchen ? "使用する" : "使用しない" }}</td>
            </tr>
            <tr>
              <th>調理工程</th>
              <td colspan="2">
                <div style="white-space: pre-line">{{ order.tent || "未入力" }}</div>
              </td>
            </tr>
          </VerticalTable>
          <p v-if="cookingProcessOrders.length === 0">未登録</p>
          <HorizontalRule />

          <h2>販売品申請</h2>
          <VerticalTable v-if="foodProducts.length > 0">
            <tr>
              <th>品目</th>
              <th>1日目</th>
              <th>2日目</th>
            </tr>
            <tr v-for="foodProduct in foodProducts" :key="foodProduct.id">
              <td>{{ foodProduct.name }}</td>
              <td>{{ foodProduct.first_day_num }}</td>
              <td>{{ foodProduct.second_day_num }}</td>
            </tr>
          </VerticalTable>
          <p v-else>未登録</p>
          <HorizontalRule />

          <h2>購入品申請</h2>
          <VerticalTable
            v-for="purchaseGroup in purchaseListsByFoodProduct"
            :key="purchaseGroup.foodProductId"
          >
            <tr>
              <th colspan="5">{{ purchaseGroup.foodProductName }}</th>
            </tr>
            <tr>
              <th>品目</th>
              <th>購入日</th>
              <th>なまもの</th>
              <th>購入先</th>
              <th>備考</th>
            </tr>
            <tr v-for="purchaseList in purchaseGroup.items" :key="purchaseList.id">
              <td>{{ purchaseList.items }}</td>
              <td>{{ purchaseList.purchase_date }}</td>
              <td>{{ purchaseList.is_fresh ? "〇" : "×" }}</td>
              <td>{{ getShopName(purchaseList.shop_id) }}</td>
              <td>{{ purchaseList.remark || "-" }}</td>
            </tr>
          </VerticalTable>
          <p v-if="purchaseListsByFoodProduct.length === 0">未登録</p>
          <HorizontalRule />

          <h2>従業員申請</h2>
          <VerticalTable v-if="employees.length > 0">
            <tr>
              <th>氏名</th>
              <th>学籍番号</th>
              <th>検便</th>
            </tr>
            <tr v-for="employee in employees" :key="employee.id">
              <td>{{ employee.name }}</td>
              <td>{{ employee.student_id }}</td>
              <td>{{ formatStoolTest(employee.stool_test_status) }}</td>
            </tr>
          </VerticalTable>
          <p v-else>未登録</p>
          <HorizontalRule />

          <h2>平面図申請</h2>
          <img v-if="venueMap && venueMap.picture_path" :src="venueMap.picture_path" alt="平面図" class="venue-map-image" />
          <p v-else>未登録</p>
          <HorizontalRule />

          <h2>物品申請</h2>
          <VerticalTable v-if="rentalOrders.length > 0">
            <tr>
              <th>品目</th>
              <th>数量</th>
            </tr>
            <tr v-for="rentalOrder in rentalOrders" :key="rentalOrder.id">
              <td>{{ getRentalItemName(rentalOrder.rental_item_id) }}</td>
              <td>{{ rentalOrder.num }}</td>
            </tr>
          </VerticalTable>
          <p v-else>未登録</p>
        </Card>
      </Column>
      <Column width="30%" height="800px" align="start" justify="start">
        <Card width="100%" style="overflow: scroll; align-items: flex-start;">
          <form class="comment-form">
            <textarea class="comment-textarea" placeholder="メールで送信するコメント"></textarea>
            <input type="submit" value="送信" />
          </form>
        </Card>
      </Column>
    </Row>

    <EditModal @close="closeEditModal" v-if="isOpenEditModal" title="参加団体申請の編集">
      <template v-slot:form>
        <div>
          <h3>団体名</h3>
          <input v-model="groupName" placeholder="入力してください" />
        </div>
        <div>
          <h3>申請者</h3>
          <select v-model="committee">
            <option disabled value="">選択してください</option>
            <option v-for="applicant in applicantList" :key="applicant.id" :value="applicant.bool">
              {{ applicant.value }}
            </option>
          </select>
        </div>
        <div>
          <h3>カテゴリー</h3>
          <select v-model="groupCategoryId">
            <option disabled value="">選択してください</option>
            <option v-for="category in groupCategories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        <div>
          <h3>国際</h3>
          <input type="checkbox" v-model="international" />
        </div>
        <div>
          <h3>学外</h3>
          <input type="checkbox" v-model="external" />
        </div>
        <div v-if="external">
          <h3>実行委員担当者</h3>
          <input v-model="contactPersonName" placeholder="入力してください" />
        </div>
        <div v-if="external">
          <h3>実行委員担当者メールアドレス</h3>
          <input v-model="contactPersonEmail" placeholder="入力してください" />
        </div>
        <div>
          <h3>企画名</h3>
          <input v-model="projectName" placeholder="入力してください" />
        </div>
        <div class="textarea-container">
          <h3>活動内容</h3>
          <textarea v-model="activity" class="modal-textarea" placeholder="入力してください" />
        </div>
        <div>
          <h3>開催年</h3>
          <select v-model="fesYearId">
            <option disabled value="">選択してください</option>
            <option v-for="year in yearList" :key="year.id" :value="year.id">
              {{ year.year_num }}
            </option>
          </select>
        </div>
      </template>
      <template v-slot:method>
        <CommonButton iconName="edit" :on_click="editGroup">登録</CommonButton>
      </template>
    </EditModal>

    <DeleteModal @close="closeDeleteModal" v-if="isOpenDeleteModal" title="参加団体申請の削除">
      <template v-slot:method>
        <YesButton iconName="delete" :on_click="deleteGroup">はい</YesButton>
        <NoButton iconName="close" :on_click="closeDeleteModal">いいえ</NoButton>
      </template>
    </DeleteModal>

    <SnackBar v-if="isOpenSnackBar" @close="closeSnackBar">
      {{ message }}
    </SnackBar>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { downloadFile } from '~/utils/download-file';


export default {
  watchQuery: ["page"],
  data() {
    return {
      data: [],
      detail_data: [],
      group: [],
      foodProducts: [],
      purchaseLists: [],
      cookingProcessOrders: [],
      employees: [],
      venueMap: null,
      rentalOrders: [],
      shops: [],
      rentalItems: [],

      // v-model
      groupName: "",
      projectName: [],
      activity: [],
      groupCategoryId: "",
      fesYearId: "",
      committee: "",
      international: false,
      external: false,
      contactPersonName: "",
      contactPersonEmail: "",

      isOpenEditModal: false,
      isOpenDeleteModal: false,
      isOpenSnackBar: false,

      groupCategories: [],
      yearList: [],
      applicantList: [
        { id: 1, value: "実行委員", bool: true },
        { id: 2, value: "参加団体", bool: false },
      ],
    };
  },
  computed: {
    ...mapState({
      selfRoleId: (state) => state.users.role,
      roleID: (state) => state.users.role,
    }),
    purchaseListsByFoodProduct() {
      const groups = this.purchaseLists.reduce((acc, purchaseList) => {
        const foodProductID = purchaseList.food_product_id;
        if (!acc[foodProductID]) {
          acc[foodProductID] = [];
        }
        acc[foodProductID].push(purchaseList);
        return acc;
      }, {});

      return Object.keys(groups).map((foodProductID) => ({
        foodProductId: Number(foodProductID),
        foodProductName: this.getFoodProductName(Number(foodProductID)),
        items: groups[foodProductID],
      }));
    },
  },
  async asyncData({ $axios, route }) {
    const routeId = route.params.id;

    const getOrEmpty = async (url, fallbackValue) => {
      try {
        const res = await $axios.$get(url);
        return res.data;
      } catch (error) {
        return fallbackValue;
      }
    };

    const groupUrl = "/api/v1/get_group_show_for_admin_view/" + routeId;
    const groupRes = await $axios.$get(groupUrl);
    console.log(groupRes.data);

    const catUrl = "/group_categories";
    const catRes = await $axios.$get(catUrl);

    const yearsUrl = "/fes_years";
    const yearsRes = await $axios.$get(yearsUrl);

    const contactPersonUrl = "/contact_persons";
    let contactPersonRes = null;
    await $axios.get(contactPersonUrl)
      .then((response) => {
        const contactPersons = response.data;
        contactPersonRes = contactPersons.find((cp) => cp.group_id == parseInt(routeId));
      })
      .catch((error) => {
        console.error("Error fetching contact persons: ", error);
      });

    const [
      foodProducts,
      cookingProcessOrders,
      employees,
      venueMap,
      rentalOrders,
      shops,
      rentalItems,
    ] = await Promise.all([
      getOrEmpty(`/food_products/group/${routeId}`, []),
      getOrEmpty(`/cooking_process_orders/group/${routeId}`, []),
      getOrEmpty(`/employees/group/${routeId}`, []),
      getOrEmpty(`/venue_maps/group/${routeId}`, null),
      getOrEmpty(`/rental_orders/group/${routeId}`, []),
      getOrEmpty(`/shops`, []),
      getOrEmpty(`/rental_items`, []),
    ]);

    const purchaseListsNested = await Promise.all(
      foodProducts.map((foodProduct) =>
        getOrEmpty(`/purchase_lists/food_product?food_product_ids=${foodProduct.id}`, [])
      )
    );
    const purchaseLists = purchaseListsNested.flat();

    const employeesWithStoolTest = await Promise.all(
      employees.map(async (employee) => {
        const employeeDetail = await getOrEmpty(
          `/api/v1/get_employee_show_for_admin_view/${employee.id}`,
          null
        );
        return {
          ...employee,
          stool_test_status: employeeDetail?.stool_test?.status || null,
        };
      })
    );

    return {
      group: groupRes.data,
      foodProducts: foodProducts,
      purchaseLists: purchaseLists,
      cookingProcessOrders: cookingProcessOrders,
      employees: employeesWithStoolTest,
      venueMap: venueMap,
      rentalOrders: rentalOrders,
      shops: shops,
      rentalItems: rentalItems,
      committee: groupRes.data.committee,
      groupName: groupRes.data.group.name,
      projectName: groupRes.data.group.project_name,
      international: groupRes.data.group.is_international,
      external: groupRes.data.group.is_external,
      contactPersonName: contactPersonRes ? contactPersonRes.name : "",
      contactPersonEmail: contactPersonRes ? contactPersonRes.email : "",
      activity: groupRes.data.group.activity,
      groupCategoryId: groupRes.data.group.group_category_id,
      fesYearId: groupRes.data.group.fes_year_id,
      groupCategories: catRes.data,
      yearList: yearsRes.data,
      groupUrl: groupUrl,
    };
  },
  mounted() {
    window.scrollTo(0, 0);
  },
  methods: {
    openEditModal() {
      this.isOpenEditModal = false;
      this.isOpenEditModal = true;
    },
    closeEditModal() {
      this.isOpenEditModal = false;
    },
    openDeleteModal() {
      this.isOpenDeleteModal = false;
      this.isOpenDeleteModal = true;
    },
    closeDeleteModal() {
      this.isOpenDeleteModal = false;
    },
    openSnackBar(message) {
      this.message = message;
      this.isOpenSnackBar = true;
      setTimeout(this.closeSnackBar, 2000);
    },
    closeSnackBar() {
      this.isOpenSnackBar = false;
    },
    async reload() {
      const reUrl = this.groupUrl;
      const reGroupRes = await this.$axios.$get(reUrl);
      this.group = reGroupRes.data;
    },
    async editGroup() {
      const putGroupUrl =
        "/groups/" +
        this.group.group.id +
        "?name=" +
        this.groupName +
        "&committee=" +
        this.committee +
        "&project_name=" +
        this.projectName +
        "&group_category_id=" +
        this.groupCategoryId +
        "&activity=" +
        this.activity +
        "&fes_year_id=" +
        this.fesYearId +
        "&is_international=" +
        this.international +
        "&is_external=" +
        this.external;

      await this.$axios.$put(putGroupUrl).then((response) => {
        this.openSnackBar(this.groupName + "を編集しました");
        this.groupName = "";
        this.committee = "";
        this.projectName = "";
        this.activity = "";
        this.groupCategoryId = "";
        this.fesYearId = "";
        this.international = false;
        this.external = false;
        this.reload();
        this.closeEditModal();
      });
    },
    async deleteGroup() {
      const delUrl = "/groups/" + this.$route.params.id;
      const delRes = await this.$axios.$delete(delUrl);
      this.$router.push("/groups");
    },
    async printPDF() {
      const url =
        this.$config.apiURL +
        "/print_pdf/group_info/" +
        this.group.group.id +
        "/output.pdf";
      await downloadFile(this.$axios, url, this.group.group.name + "_PDF");
      this.openSnackBar("参加団体情報のPDFをダウンロードしました");
    },
    async printRentalItemsPDF() {
      const url =
        this.$config.apiURL +
        "/print_pdf/group/" +
        this.group.group.id +
        "/output.pdf";
      await downloadFile(this.$axios, url, this.group.group.name + "_PDF");
      this.openSnackBar("物品貸し出し表のPDFをダウンロードしました");
    },
    getShopName(shopID) {
      const shop = this.shops.find((item) => item.id === shopID);
      return shop ? shop.name : "-";
    },
    getRentalItemName(rentalItemID) {
      const rentalItem = this.rentalItems.find((item) => item.id === rentalItemID);
      return rentalItem ? rentalItem.name : "-";
    },
    getFoodProductName(foodProductID) {
      const foodProduct = this.foodProducts.find((item) => item.id === foodProductID);
      return foodProduct ? foodProduct.name : "販売品";
    },
    formatStoolTest(stoolTestStatus) {
      if (stoolTestStatus === "検便有") return "〇";
      if (stoolTestStatus === "検便無") return "×";
      return stoolTestStatus || "未登録";
    },
  },
};
</script>

<style scoped>
.comment-form {
  width: 100%;
  padding: 0;
  margin: 0;
}

.comment-textarea {
  width: 100%;
  height: 300px;
  padding: 12px;
  border: 1px solid var(--accent-2);
  border-radius: 4px;
  font-family: inherit;
  font-size: 14px;
  resize: vertical;
  box-sizing: border-box;
}

.comment-textarea:focus {
  outline: none;
  border-color: var(--button-primary);
}

.textarea-container {
  width: 100%;
}

.modal-textarea {
  width: 100%;
  height: 120px;
  padding: 12px;
  border: 1px solid var(--accent-2);
  border-radius: 4px;
  font-family: inherit;
  font-size: 14px;
  resize: vertical;
  box-sizing: border-box;
}

.modal-textarea:focus {
  outline: none;
  border-color: var(--button-primary);
}

.venue-map-image {
  display: block;
  width: min(100%, 560px);
  height: auto;
  object-fit: contain;
  border: 1px solid var(--accent-2);
  border-radius: 4px;
}

.mail-link {
  color: var(--accent-7);
  text-decoration: underline;
}
</style>
