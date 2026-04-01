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

    <div class="side-nav side-nav-left">
      <button
        type="button"
        class="side-nav-button"
        :disabled="!prevGroupId"
        aria-label="前の食販団体へ移動"
        @click="onPrevGroup"
      >
        <span class="side-nav-icon">&lt;</span>
      </button>
    </div>
    <div class="side-nav side-nav-right">
      <button
        type="button"
        class="side-nav-button"
        :disabled="!nextGroupId"
        aria-label="次の食販団体へ移動"
        @click="onNextGroup"
      >
        <span class="side-nav-icon">&gt;</span>
      </button>
    </div>

    <Row wrap="nowrap" align="start" justify="space-between">
      <Column width="70%" align="start" justify="start">
        <Card width="100%" height="800px" style="overflow-y: auto; align-items: flex-start;">
          <h2>調理工程申請</h2>
          <Card
            width="100%"
            style="align-items: flex-start;"
            v-for="order in cookingProcessOrders"
            :key="order.id"
            class="selectable-card"
            :class="{ 'row-interactive-card--on': enableInteractiveRows }"
          >
            <div class="selectable-card-body" @click="onCookingProcessAction(order)">
              <VerticalTable>
                <tr>
                  <th colspan="3">
                    <div class="section-title-with-button">
                      <h2>
                        <span>{{ getFoodProductName(order.food_product_id) }}</span>
                      </h2>
                    </div>
                  </th>
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
            </div>
          </Card>
          <p v-if="cookingProcessOrders.length === 0">未登録</p>
          <HorizontalRule />

          <h2>販売品申請</h2>
          <VerticalTable
            v-if="foodProducts.length > 0"
            class="row-interactive-table"
            :class="{ 'row-interactive-table--on': enableInteractiveRows }"
          >
            <tr>
              <th>品目</th>
              <th>1日目</th>
              <th>2日目</th>
            </tr>
            <tr
              v-for="foodProduct in foodProducts"
              :key="foodProduct.id"
              class="selectable-row"
              :class="{ 'selected-row': selectedFoodProductId === foodProduct.id }"
              @click="onFoodProductAction(foodProduct)"
            >
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
            class="row-interactive-table"
            :class="{ 'row-interactive-table--on': enableInteractiveRows }"
          >
            <tr>
              <th colspan="5"><h2>{{ purchaseGroup.foodProductName }}</h2></th>
            </tr>
            <tr>
              <th>品目</th>
              <th>購入日</th>
              <th>なまもの</th>
              <th>購入先</th>
              <th>備考</th>
            </tr>
            <tr
              v-for="purchaseList in purchaseGroup.items"
              :key="purchaseList.id"
              class="selectable-row"
              :class="{ 'selected-row': selectedPurchaseListId === purchaseList.id }"
              @click="onPurchaseListAction(purchaseList)"
            >
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
          <VerticalTable
            v-if="employees.length > 0"
            class="row-interactive-table"
            :class="{ 'row-interactive-table--on': enableInteractiveRows }"
          >
            <tr>
              <th>氏名</th>
              <th>学籍番号</th>
              <th>検便</th>
            </tr>
            <tr
              v-for="employee in employees"
              :key="employee.id"
              class="selectable-row"
              :class="{ 'selected-row': selectedEmployeeId === employee.id }"
              @click="onEmployeeAction(employee)"
            >
              <td>{{ employee.name }}</td>
              <td>{{ employee.student_id }}</td>
              <td>{{ formatStoolTest(employee.stool_test_status) }}</td>
            </tr>
          </VerticalTable>
          <p v-else>未登録</p>
          <HorizontalRule />

          <div class="section-header-with-button">
            <h2>平面図申請</h2>
            <CommonButton iconName="edit" :on_click="onVenueMapAction">
              編集
            </CommonButton>
          </div>
          <img v-if="venueMap && venueMap.picture_path" :src="venueMap.picture_path" alt="平面図" class="venue-map-image" />
          <p v-else>未登録</p>
          <HorizontalRule />

          <h2>物品申請</h2>
          <VerticalTable
            v-if="rentalOrders.length > 0"
            class="row-interactive-table"
            :class="{ 'row-interactive-table--on': enableInteractiveRows }"
          >
            <tr>
              <th>品目</th>
              <th>数量</th>
            </tr>
            <tr
              v-for="rentalOrder in rentalOrders"
              :key="rentalOrder.id"
              class="selectable-row"
              :class="{ 'selected-row': selectedRentalOrderId === rentalOrder.id }"
              @click="onRentalOrderAction(rentalOrder)"
            >
              <td>{{ getRentalItemName(rentalOrder.rental_item_id) }}</td>
              <td>{{ rentalOrder.num }}</td>
            </tr>
          </VerticalTable>
          <p v-else>未登録</p>
        </Card>
      </Column>
      <Column width="30%" align="start" justify="start" class="sticky-right-column">
        <Card width="100%" height="800px" style="overflow-y: auto; align-items: flex-start;">
          <form class="comment-form" @submit.prevent="onSubmitComment">
            <textarea class="comment-textarea" placeholder="メールで送信するコメント"></textarea>
            <CommonButton iconName="send" :on_click="onSubmitComment">送信</CommonButton>
          </form>
        </Card>
      </Column>
    </Row>

  </div>
</template>

<script>
const HEALTH_CENTER_REFINEMENT_ENDPOINT =
  "/api/v1/get_refinement_health_center_document_status";
const LEGACY_REFINEMENT_ENDPOINT = "/api/v1/get_refinement_order_status_check";

export default {
  watchQuery: ["page"],
  data() {
    return {
      group: [],
      foodProducts: [],
      purchaseLists: [],
      cookingProcessOrders: [],
      employees: [],
      venueMap: null,
      rentalOrders: [],
      shops: [],
      rentalItems: [],
      enableInteractiveRows: true,
      selectedFoodProductId: null,
      selectedPurchaseListId: null,
      selectedEmployeeId: null,
      selectedRentalOrderId: null,
      foodSalesGroupIds: [],
    };
  },
  computed: {
    currentGroupId() {
      const id = Number(this.$route.params.id);
      return Number.isNaN(id) ? null : id;
    },
    currentGroupIndex() {
      if (!this.currentGroupId) return -1;
      return this.foodSalesGroupIds.indexOf(this.currentGroupId);
    },
    prevGroupId() {
      if (this.currentGroupIndex <= 0) return null;
      return this.foodSalesGroupIds[this.currentGroupIndex - 1];
    },
    nextGroupId() {
      if (this.currentGroupIndex < 0) return null;
      return this.foodSalesGroupIds[this.currentGroupIndex + 1] || null;
    },
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

    const currentYearRes = await $axios.$get("/user_page_settings/1");
    const refinementUrl =
      HEALTH_CENTER_REFINEMENT_ENDPOINT +
      "?fes_year_id=" +
      currentYearRes.data.fes_year_id;
    let foodSalesGroupsRes;
    try {
      foodSalesGroupsRes = await $axios.$post(refinementUrl);
    } catch (error) {
      if (error?.response?.status === 404) {
        const legacyUrl =
          LEGACY_REFINEMENT_ENDPOINT +
          "?fes_year_id=" +
          currentYearRes.data.fes_year_id;
        foodSalesGroupsRes = await $axios.$post(legacyUrl);
      } else {
        throw error;
      }
    }
    const foodSalesGroupIds = foodSalesGroupsRes.data
      .filter((item) => item.group_category === 1)
      .map((item) => item.group.id)
      .sort((a, b) => a - b);

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
      foodSalesGroupIds,
    };
  },
  mounted() {
    window.scrollTo(0, 0);
  },
  methods: {
    onPrevGroup() {
      if (!this.prevGroupId) return;
      this.$router.push(`/health_center_document_review/${this.prevGroupId}`);
    },
    onNextGroup() {
      if (!this.nextGroupId) return;
      this.$router.push(`/health_center_document_review/${this.nextGroupId}`);
    },
    onSubmitComment() {
      // TODO: コメント送信API連携時に処理を実装する
    },
    onFoodProductAction(foodProduct) {
      if (!foodProduct?.id) return;
      this.selectedFoodProductId = foodProduct.id;
      this.$router.push(`/food_products/${foodProduct.id}`);
    },
    onPurchaseListAction(purchaseList) {
      if (!purchaseList?.id) return;
      this.selectedPurchaseListId = purchaseList.id;
      this.$router.push(`/purchase_lists/${purchaseList.id}`);
    },
    onEmployeeAction(employee) {
      if (!employee?.id) return;
      this.selectedEmployeeId = employee.id;
      this.$router.push(`/employees/${employee.id}`);
    },
    onRentalOrderAction(rentalOrder) {
      if (!rentalOrder?.id) return;
      this.selectedRentalOrderId = rentalOrder.id;
      this.$router.push(`/rental_orders/${rentalOrder.id}`);
    },
    onCookingProcessAction(order) {
      if (!order?.id) return;
      this.$router.push(`/cooking_process_order/${order.id}`);
    },
    onVenueMapAction() {
      if (!this.group?.group?.id) return;
      this.$router.push(`/venue_maps/${this.group.group.id}`);
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
.main-content {
  position: relative;
}

.side-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 20;
}

.side-nav-left {
  left: -56px;
}

.side-nav-right {
  right: -56px;
}

.side-nav-button {
  min-width: 20px;
  width: 20px;
  height: 56px;
  padding: 0;
  letter-spacing: 0;
  gap: 0;
  font-size: 10px;
  border-radius: 10px;
  border: 1px solid #c9ccd1;
  box-shadow: none;
  backdrop-filter: none;
  color: #6b7280;
  background: #ffffff;
  opacity: 0.9;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.side-nav-icon {
  font-size: 14px;
  line-height: 1;
}

.side-nav-button:hover {
  background: #f3f4f6;
  border-color: #b8bcc2;
  color: #4b5563;
  opacity: 1;
}

.side-nav-button:disabled {
  background: #f9fafb;
  border-color: #e5e7eb;
  color: #9ca3af;
  opacity: 1;
  cursor: not-allowed;
}

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

.section-title-with-button,
.section-header-with-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.row-interactive-table--on .selectable-row {
  cursor: pointer;
}

.row-interactive-table--on .selectable-row td {
  transition: 0.2s;
}

.row-interactive-table--on .selectable-row:hover td {
  transform: translateY(-1px);
  background-color: white;
  box-shadow: 5px 5px 14px #f0f0f0, -5px -5px 14px #fafafa;
}

.row-interactive-table--on .selectable-row.selected-row td {
  background-color: var(--accent-1);
}

.selectable-card {
  transition: 0.2s;
}

.selectable-card-body {
  width: 100%;
}

.row-interactive-card--on {
  cursor: pointer;
}

.row-interactive-card--on:hover {
  transform: translateY(-1px);
  background-color: white;
  box-shadow: 5px 5px 14px #f0f0f0, -5px -5px 14px #fafafa;
}

.sticky-right-column {
  position: sticky;
  top: 16px;
}

@media (max-width: 900px) {
  .sticky-right-column {
    position: static;
    top: auto;
  }

  .side-nav-left {
    left: -12px;
  }

  .side-nav-right {
    right: -12px;
  }

  .side-nav-button {
    min-width: 18px;
    width: 18px;
    height: 46px;
    border-radius: 8px;
  }

  .side-nav-icon {
    font-size: 12px;
  }
}
</style>
