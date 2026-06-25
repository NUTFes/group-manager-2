<template>
  <div class="main-content">
    <SubHeader v-bind:pageTitle="group.group.name" pageSubTitle="保健所提出団体一覧">
    </SubHeader>
    <Row align="start" justify="start">
      <Column width="100%" align="start" justify="start" gap="8px">
        <p>企画名: {{ group.group.project_name }}</p>
        <p>代表者: {{ group.user.name }}</p>
        <p>メール: <a class="mail-link" :href="'mailto:' + group.user.email">{{ group.user.email }}</a></p>
        <div class="submission-summary" role="status" aria-live="polite">
          <template v-if="unapprovedSubmissionCount > 0">
            <div class="submission-summary-main">未承認 <span class="submission-count">{{ unapprovedSubmissionCount }}</span> 件</div>
            <div class="submission-breakdown">
              <div class="submission-summary-item">
                <span class="submission-label">再提出</span>
                <span class="submission-count">{{ reSubmissionCount }}</span>
                <span class="submission-suffix">件,</span>
              </div>
              <div class="submission-summary-item">
                <span class="submission-label">未確認</span>
                <span class="submission-count">{{ unconfirmedCount }}</span>
                <span class="submission-suffix">件,</span>
              </div>
              <div class="submission-summary-item">
                <span class="submission-label">未提出</span>
                <span class="submission-count">{{ unsubmittedCount }}</span>
                <span class="submission-suffix">件</span>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="submission-only-approved">承認済み</div>
          </template>
        </div>
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
          <div class="section-header-with-button">
            <h2>調理工程申請</h2>
            <div
              class="status-select-with-icon"
              :class="getStatusSelectClass(getSubmissionStatusValue('cooking_process_order'))"
            >
              <span class="material-icons status-icon">
                {{ getStatusMeta(getSubmissionStatusValue('cooking_process_order')).icon }}
              </span>
              <div class="select-wrapper">
                <select
                  class="status-select"
                  :class="getStatusSelectClass(getSubmissionStatusValue('cooking_process_order'))"
                  :value="getSubmissionStatusValue('cooking_process_order')"
                  @change="onStatusChange('cooking_process_order', $event.target.value)"
                  aria-label="調理工程申請のステータス"
                >
                  <option
                    v-for="option in statusOptions"
                    :key="option.value"
                    :value="option.value"
                    :disabled="option.value === 'unsubmitted'"
                  >
                    {{ option.label }}
                  </option>
                </select>
                <span class="material-icons select-caret" aria-hidden="true">expand_more</span>
              </div>
            </div>
          </div>
          <Card
            width="100%"
            style="align-items: flex-start;"
            v-for="order in cookingProcessOrders"
            :key="order.id"
            class="selectable-card"
            :class="{ 'row-interactive-card--on': enableInteractiveRows }"
          >
            <div class="selectable-card-body" @click="openCookingProcessOrderModal(order)">
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
                    <div style="white-space: pre-line">
                      <template v-if="order.tent_ja">
                        {{ order.tent_ja }}<br><br>
                        {{ '<翻訳前の原文>' }}
                        {{ order.tent || "未入力" }}
                      </template>
                      <template v-else>
                        {{ order.tent || "未入力" }}
                      </template>
                    </div>
                  </td>
                </tr>
              </VerticalTable>
            </div>
          </Card>
          <p v-if="cookingProcessOrders.length === 0">未登録</p>
          <HorizontalRule />

          <div class="section-header-with-button">
            <h2>販売品申請</h2>
            <div
              class="status-select-with-icon"
              :class="getStatusSelectClass(getSubmissionStatusValue('food_product'))"
            >
              <span class="material-icons status-icon">
                {{ getStatusMeta(getSubmissionStatusValue('food_product')).icon }}
              </span>
              <div class="select-wrapper">
                <select
                  class="status-select"
                  :class="getStatusSelectClass(getSubmissionStatusValue('food_product'))"
                  :value="getSubmissionStatusValue('food_product')"
                  @change="onStatusChange('food_product', $event.target.value)"
                  aria-label="販売品申請のステータス"
                >
                  <option
                    v-for="option in statusOptions"
                    :key="option.value"
                    :value="option.value"
                    :disabled="option.value === 'unsubmitted'"
                  >
                    {{ option.label }}
                  </option>
                </select>
                <span class="material-icons select-caret" aria-hidden="true">expand_more</span>
              </div>
            </div>
          </div>
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
              @click="openFoodProductModal(foodProduct)"
            >
              <td>{{ foodProduct.name }}</td>
              <td>{{ foodProduct.first_day_num }}</td>
              <td>{{ foodProduct.second_day_num }}</td>
            </tr>
          </VerticalTable>
          <template v-else>
            <p v-if="hasEquipmentApplication">未登録</p>
            <p v-else>物品申請は行わない</p>
          </template>
          <HorizontalRule />

          <div class="section-header-with-button">
            <h2>購入品申請</h2>
              <div
                class="status-select-with-icon"
                :class="getStatusSelectClass(getSubmissionStatusValue('purchase_list'))"
              >
                <span class="material-icons status-icon">
                  {{ getStatusMeta(getSubmissionStatusValue('purchase_list')).icon }}
                </span>
                <div class="select-wrapper">
                  <select
                    class="status-select"
                    :class="getStatusSelectClass(getSubmissionStatusValue('purchase_list'))"
                    :value="getSubmissionStatusValue('purchase_list')"
                    @change="onStatusChange('purchase_list', $event.target.value)"
                    aria-label="購入品申請のステータス"
                  >
                    <option
                      v-for="option in statusOptions"
                      :key="option.value"
                      :value="option.value"
                      :disabled="option.value === 'unsubmitted'"
                    >
                      {{ option.label }}
                    </option>
                  </select>
                  <span class="material-icons select-caret" aria-hidden="true">expand_more</span>
                </div>
              </div>
          </div>
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
              @click="openPurchaseListModal(purchaseList)"
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

          <div class="section-header-with-button">
            <h2>従業員申請</h2>
            <div
              class="status-select-with-icon"
              :class="getStatusSelectClass(getSubmissionStatusValue('employee'))"
            >
              <span class="material-icons status-icon">
                {{ getStatusMeta(getSubmissionStatusValue('employee')).icon }}
              </span>
              <div class="select-wrapper">
                <select
                  class="status-select"
                  :class="getStatusSelectClass(getSubmissionStatusValue('employee'))"
                  :value="getSubmissionStatusValue('employee')"
                  @change="onStatusChange('employee', $event.target.value)"
                  aria-label="従業員申請のステータス"
                >
                  <option
                    v-for="option in statusOptions"
                    :key="option.value"
                    :value="option.value"
                    :disabled="option.value === 'unsubmitted'"
                  >
                    {{ option.label }}
                  </option>
                </select>
                <span class="material-icons select-caret" aria-hidden="true">expand_more</span>
              </div>
            </div>
          </div>
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
              @click="openEmployeeModal(employee)"
            >
              <td>{{ employee.name }}</td>
              <td>{{ employee.student_id }}</td>
              <td>{{ formatStoolTest(employee.stool_test_status) }}</td>
            </tr>
          </VerticalTable>
          <template v-else>
            <p v-if="hasEquipmentApplication">未登録</p>
            <p v-else>物品申請は行わない</p>
          </template>
          <HorizontalRule />

          <div class="section-header-with-button">
            <h2>平面図申請</h2>
              <div class="section-actions">
              <CommonButton iconName="edit" :on_click="openVenueMapModal">
                編集
              </CommonButton>
              <div
                class="status-select-with-icon"
                :class="getStatusSelectClass(getSubmissionStatusValue('venue_map'))"
              >
                <span class="material-icons status-icon">
                  {{ getStatusMeta(getSubmissionStatusValue('venue_map')).icon }}
                </span>
                <div class="select-wrapper">
                  <select
                    class="status-select"
                    :class="getStatusSelectClass(getSubmissionStatusValue('venue_map'))"
                    :value="getSubmissionStatusValue('venue_map')"
                    @change="onStatusChange('venue_map', $event.target.value)"
                    aria-label="平面図申請のステータス"
                  >
                    <option
                      v-for="option in statusOptions"
                      :key="option.value"
                      :value="option.value"
                      :disabled="option.value === 'unsubmitted'"
                    >
                      {{ option.label }}
                    </option>
                  </select>
                  <span class="material-icons select-caret" aria-hidden="true">expand_more</span>
                </div>
              </div>
            </div>
          </div>
          <img v-if="venueMap && venueMap.picture_path" :src="venueMap.picture_path" alt="平面図" class="venue-map-image" />
          <p v-else>未登録</p>
          <HorizontalRule />

          <div class="section-header-with-button">
            <h2>物品申請</h2>
            <div
              class="status-select-with-icon"
              :class="getStatusSelectClass(getSubmissionStatusValue('equipment'))"
            >
              <span class="material-icons status-icon">
                {{ getStatusMeta(getSubmissionStatusValue('equipment')).icon }}
              </span>
              <div class="select-wrapper">
                <select
                  class="status-select"
                  :class="getStatusSelectClass(getSubmissionStatusValue('equipment'))"
                  :value="getSubmissionStatusValue('equipment')"
                  @change="onStatusChange('equipment', $event.target.value)"
                  aria-label="物品申請のステータス"
                >
                  <option
                    v-for="option in statusOptions"
                    :key="option.value"
                    :value="option.value"
                    :disabled="option.value === 'unsubmitted'"
                  >
                    {{ option.label }}
                  </option>
                </select>
                <span class="material-icons select-caret" aria-hidden="true">expand_more</span>
              </div>
            </div>
          </div>
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
              @click="openRentalOrderModal(rentalOrder)"
            >
              <td>{{ getRentalItemName(rentalOrder.rental_item_id) }}</td>
              <td>{{ rentalOrder.num }}</td>
            </tr>
          </VerticalTable>
          <template v-else>
            <p v-if="hasEquipmentApplication">未登録</p>
            <p v-else>物品申請は行わない</p>
          </template>
        </Card>
      </Column>
      <Column width="30%" align="start" justify="start" class="sticky-right-column">
        <Card width="100%" height="800px" style="overflow-y: auto; align-items: flex-start;">
          <div class="comment-header">
            <h3>メッセージ</h3>
          </div>
          <div class="comment-form">
            <div class="message-template-panel">
              <label class="message-template-label" for="message-template-select">
                テンプレート
              </label>
              <select
                id="message-template-select"
                class="message-template-select"
                v-model="selectedMessageTemplateId"
              >
                <option value="">テンプレートを選択</option>
                <option
                  v-for="template in messageTemplates"
                  :key="template.id"
                  :value="String(template.id)"
                >
                  {{ template.name }}（{{ template.locale }}）
                </option>
              </select>
              <p
                v-if="messageSendResult"
                class="message-send-result"
                role="status"
              >
                {{ messageSendResult }}
              </p>
            </div>
            <textarea
              class="comment-textarea"
              placeholder="メールで送信するコメント"
              v-model="commentBody"
              :disabled="!selectedMessageTemplate || isSendingMessage"
            ></textarea>
            <CommonButton
              iconName="send"
              :on_click="openMessagePreview"
              :disabled="isSendingMessage || !canSendMessage"
            >
              送信
            </CommonButton>
          </div>

          <div class="comment-history">
            <h4>送信履歴</h4>
            <details
              v-for="comment in sortedComments"
              :key="comment.id"
              class="comment-accordion"
            >
              <summary>
                {{ formatCommentTimestamp(comment.created_at) }}
                <span
                  class="mail-delivery-status"
                  :class="mailDeliveryStatusClass(comment.mail_delivery_status)"
                >
                  {{ mailDeliveryStatusLabel(comment.mail_delivery_status) }}
                </span>
              </summary>
              <p class="comment-body">{{ comment.body }}</p>
              <CommonButton
                v-if="comment.mail_delivery_status === 'failed'"
                iconName="send"
                :on_click="() => resendCommentMail(comment)"
                :disabled="isSendingMessage || resendingCommentId === comment.id"
              >
                {{ resendingCommentId === comment.id ? "再送信中" : "再送信" }}
              </CommonButton>
            </details>
            <p v-if="sortedComments.length === 0">送信履歴はまだありません</p>
          </div>
        </Card>
      </Column>
    </Row>

    <EditModalsFoodProductEditModal
      v-if="isOpenEditModal && activeEditType === 'food_product' && selectedFoodProduct"
      :food-product="selectedFoodProduct"
      @close="closeEditModal"
      @saved="onEditorSaved"
    />

    <EditModalsPurchaseListEditModal
      v-if="isOpenEditModal && activeEditType === 'purchase_list' && selectedPurchaseList"
      :purchase-list="selectedPurchaseList"
      :shops="shops"
      @close="closeEditModal"
      @saved="onEditorSaved"
    />

    <EditModalsEmployeeEditModal
      v-if="isOpenEditModal && activeEditType === 'employee' && selectedEmployee"
      :employee="selectedEmployee"
      @close="closeEditModal"
      @saved="onEditorSaved"
    />

    <EditModalsVenueMapEditModal
      v-if="isOpenEditModal && activeEditType === 'venue_map' && venueMap"
      :venue-map="venueMap"
      @close="closeEditModal"
      @saved="onEditorSaved"
    />

    <EditModalsRentalOrderEditModal
      v-if="isOpenEditModal && activeEditType === 'rental_order' && selectedRentalOrder"
      :rental-order="selectedRentalOrder"
      :rental-items="rentalItems"
      @close="closeEditModal"
      @saved="onEditorSaved"
    />

    <EditModalsCookingProcessOrderEditModal
      v-if="isOpenEditModal && activeEditType === 'cooking_process_order' && selectedCookingProcessOrder"
      :cooking-process-order="selectedCookingProcessOrder"
      @close="closeEditModal"
      @saved="onEditorSaved"
      @error="openEditError"
    />

    <EditModal
      v-if="isPreviewModalOpen"
      title="送信内容の確認"
      @close="closeMessagePreview"
    >
      <template v-slot:form>
        <div class="mail-preview-field">
          <h3>宛先</h3>
          <p>{{ group.user.email }}</p>
        </div>
        <div class="mail-preview-field">
          <h3>件名</h3>
          <p>{{ renderedMessageSubject }}</p>
        </div>
        <div class="mail-preview-field">
          <h3>本文</h3>
          <pre>{{ renderedMessageBody }}</pre>
        </div>
      </template>
      <template v-slot:method>
        <div class="mail-preview-actions">
          <CommonButton
            iconName="close"
            :on_click="closeMessagePreview"
            :disabled="isSendingMessage"
          >
            キャンセル
          </CommonButton>
          <CommonButton
            iconName="send"
            :on_click="confirmMessageSend"
            :disabled="isSendingMessage"
          >
            {{ isSendingMessage ? "送信中" : "送信する" }}
          </CommonButton>
        </div>
      </template>
    </EditModal>

  </div>
</template>

<script>
const HEALTH_CENTER_REFINEMENT_ENDPOINT =
  "/api/v1/get_health_center_submission_status_index_for_admin_view";
const LEGACY_REFINEMENT_ENDPOINT = "/api/v1/get_refinement_order_status_check";
const HEALTH_CENTER_SHOW_ENDPOINT =
  "/api/v1/get_health_center_submission_status_show_for_admin_view/";
const HEALTH_CENTER_STATUS_UPDATE_ENDPOINT =
  "/api/v1/upsert_health_center_submission_status";
const HEALTH_CENTER_COMMENT_MAIL_CREATE_ENDPOINT =
  "/api/v1/create_health_center_submission_status_comment_mail";
const HEALTH_CENTER_COMMENT_MAIL_RESEND_ENDPOINT =
  "/api/v1/resend_health_center_submission_status_comment_mail";
const MESSAGE_TEMPLATES_ENDPOINT = "/api/v1/message_templates";
const BULK_MESSAGE_APPLICATION_TYPE = "food_product";

async function fetchHealthCenterDocumentReviewData($axios, routeId) {
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
  const submissionStatusRes = await $axios.$get(
    HEALTH_CENTER_SHOW_ENDPOINT + routeId
  );

  const currentYearRes = await $axios.$get("/user_page_settings/1");
  let foodSalesGroupsRes;
  try {
    foodSalesGroupsRes = await $axios.$get(HEALTH_CENTER_REFINEMENT_ENDPOINT);
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
    .filter((item) => {
      const categoryId =
        typeof item.group_category === "number"
          ? item.group_category
          : item.group_category?.id;
      const yearId = item.group?.fes_year_id || item.fes_year?.id;

      return categoryId === 1 && yearId === currentYearRes.data.fes_year_id;
    })
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
    unRegisteredGroupsRes,
  ] = await Promise.all([
    getOrEmpty(`/food_products/group/${routeId}`, []),
    getOrEmpty(`/cooking_process_orders/group/${routeId}`, []),
    getOrEmpty(`/employees/group/${routeId}`, []),
    getOrEmpty(`/venue_maps/group/${routeId}`, null),
    getOrEmpty(`/rental_orders/group/${routeId}`, []),
    getOrEmpty(`/shops`, []),
    getOrEmpty(`/rental_items`, []),
    getOrEmpty(`/un_registered_groups?group_id=${routeId}`, []),
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
    foodProducts,
    purchaseLists,
    cookingProcessOrders,
    employees: employeesWithStoolTest,
    venueMap,
    rentalOrders,
    shops,
    rentalItems,
    unRegisteredGroups: unRegisteredGroupsRes,
    foodSalesGroupIds,
    submissions: submissionStatusRes.data?.submissions || [],
  };
}

export default {
  watchQuery: ["page"],
  data() {
    return {
      group: {
        group: {
          id: null,
          name: "",
          project_name: "",
        },
        user: {
          name: "",
          email: "",
        },
      },
      foodProducts: [],
      purchaseLists: [],
      cookingProcessOrders: [],
      employees: [],
      venueMap: null,
      rentalOrders: [],
      shops: [],
      rentalItems: [],
      unRegisteredGroups: [],
      enableInteractiveRows: true,
      selectedFoodProductId: null,
      selectedPurchaseListId: null,
      selectedEmployeeId: null,
      selectedRentalOrderId: null,
      foodSalesGroupIds: [],
      selectedFoodProduct: null,
      selectedPurchaseList: null,
      selectedEmployee: null,
      selectedRentalOrder: null,
      selectedCookingProcessOrder: null,
      activeEditType: null,
      isOpenEditModal: false,
      submissions: [],
      statusOptions: [
        { value: "unapproved", label: "未確認" },
        { value: "waiting_resubmission", label: "再提出待ち" },
        { value: "approved", label: "承認済み" },
        { value: "unsubmitted", label: "未提出" },
      ],
      commentBody: "",
      messageTemplates: [],
      selectedMessageTemplateId: "",
      isSendingMessage: false,
      resendingCommentId: null,
      messageSendResult: "",
      isPreviewModalOpen: false,
    };
  },
  watch: {
    "$route.params.id": {
      async handler() {
        await this.reloadPageData();
      },
    },
    selectedMessageTemplateId() {
      this.applySelectedMessageTemplate();
    },
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
    sortedComments() {
      return this.submissions
        .flatMap((submission) =>
          (submission.comments || []).map((comment) => ({
            ...comment,
            application_type: submission.application_type,
          }))
        )
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    },
    unapprovedSubmissionCount() {
      return this.submissions.filter((submission) => submission.status !== "approved")
        .length;
    },
    reSubmissionCount() {
      return this.submissions.filter((submission) => submission.status === "waiting_resubmission").length;
    },
    unconfirmedCount() {
      return this.submissions.filter((submission) => submission.status === "unapproved").length;
    },
    unsubmittedCount() {
      return this.submissions.filter((submission) => submission.status === "unsubmitted").length;
    },
    hasEquipmentApplication() {
      return this.unRegisteredGroups.some((item) => item.order_type === 0);
    },
    approvedCount() {
      return this.submissions.filter((submission) => submission.status === "approved").length;
    },
    selectedMessageTemplate() {
      return this.messageTemplates.find(
        (template) => String(template.id) === String(this.selectedMessageTemplateId)
      );
    },
    canSendMessage() {
      return Boolean(
        this.group.user.email &&
          this.selectedMessageTemplate &&
          this.commentBody.trim()
      );
    },
    messageTemplateValues() {
      return {
        group_name: this.group.group.name,
        user_name: this.group.user.name,
      };
    },
    renderedMessageSubject() {
      if (!this.selectedMessageTemplate) return "";
      return this.renderTemplateText(
        this.selectedMessageTemplate.subject,
        this.messageTemplateValues
      );
    },
    renderedMessageBody() {
      return this.commentBody.trim();
    },
  },
  async mounted() {
    await this.reloadPageData();
    await this.loadMessageTemplates();
    window.scrollTo(0, 0);
  },
  methods: {
    async reloadPageData() {
      try {
        const freshData = await fetchHealthCenterDocumentReviewData(
          this.$axios,
          this.$route.params.id
        );
        Object.assign(this, freshData);
      } catch (error) {
        if (error?.response?.status === 401) {
          this.$router.push("/reauthentication_required");
          return;
        }
        throw error;
      }
    },
    async loadMessageTemplates() {
      try {
        const response = await this.$axios.$get(MESSAGE_TEMPLATES_ENDPOINT);
        this.messageTemplates = response.data || [];
        this.selectedMessageTemplateId = "";
      } catch (error) {
        this.messageTemplates = [];
        this.selectedMessageTemplateId = "";
      }
    },
    onPrevGroup() {
      if (!this.prevGroupId) return;
      this.$router.push(`/health_center_document_review/${this.prevGroupId}`);
    },
    onNextGroup() {
      if (!this.nextGroupId) return;
      this.$router.push(`/health_center_document_review/${this.nextGroupId}`);
    },
    getSubmission(applicationType) {
      return this.submissions.find(
        (submission) => submission.application_type === applicationType
      );
    },
    getSubmissionStatusValue(applicationType) {
      const submission = this.getSubmission(applicationType);
      const status = submission?.status;
      // statusが null, undefined, または空文字列の場合は「未提出」を返す
      return this.normalizeStatus(status);
    },
    normalizeStatus(value) {
      if (value === false || value === null || value === undefined || value === "") {
        return "unsubmitted";
      }
      return value;
    },
    getStatusMeta(status) {
      const statusMap = {
        unapproved: {
          icon: "notification_important",
          label: "未確認",
        },
        waiting_resubmission: {
          icon: "autorenew",
          label: "再提出待ち",
        },
        approved: {
          icon: "check",
          label: "承認済み",
        },
        unsubmitted: {
          icon: "close",
          label: "未提出",
        },
      };

      return statusMap[status] || statusMap.unapproved;
    },
    getStatusSelectClass(value) {
      const classMap = {
        unapproved: "status-select--unapproved",
        waiting_resubmission: "status-select--waiting-resubmission",
        approved: "status-select--approved",
        unsubmitted: "status-select--unsubmitted",
      };

      return classMap[value] || classMap.unapproved;
    },
    mailDeliveryStatusLabel(status) {
      if (status === "sent") return "送信済み";
      if (status === "not_send") return "送信しない";

      return "未送信または送信失敗";
    },
    mailDeliveryStatusClass(status) {
      if (status === "sent") return "mail-delivery-status--sent";
      if (status === "not_send") return "mail-delivery-status--not-send";

      return "mail-delivery-status--failed";
    },
    async onStatusChange(applicationType, status) {
      const submission = this.getSubmission(applicationType);
      const payload = {
        group_id: this.group.group.id,
        application_type: applicationType,
        status,
      };

      if (submission?.id) {
        payload.health_center_submission_status_id = submission.id;
      }

      const response = await this.$axios.$post(
        HEALTH_CENTER_STATUS_UPDATE_ENDPOINT,
        payload
      );

      const savedSubmission = this.getSubmission(applicationType);
      if (savedSubmission) {
        savedSubmission.id = response.data.id;
        savedSubmission.status = response.data.status;
      }
    },
    renderTemplateText(text, values) {
      return String(text || "").replace(
        /\{(group_name|user_name)\}/g,
        (_, key) => String(values[key] || "")
      );
    },
    applySelectedMessageTemplate() {
      if (!this.selectedMessageTemplate) {
        this.commentBody = "";
        return;
      }

      this.commentBody = this.renderTemplateText(
        this.selectedMessageTemplate.body,
        this.messageTemplateValues
      );
      this.messageSendResult = "";
    },
    openMessagePreview() {
      if (!this.canSendMessage || this.isSendingMessage) return;
      this.messageSendResult = "";
      this.isPreviewModalOpen = true;
    },
    closeMessagePreview() {
      if (this.isSendingMessage) return;
      this.isPreviewModalOpen = false;
    },
    async confirmMessageSend() {
      const succeeded = await this.onSubmitComment();
      if (succeeded) {
        this.isPreviewModalOpen = false;
      }
    },
    async onSubmitComment() {
      const submission = this.getSubmission(BULK_MESSAGE_APPLICATION_TYPE);
      const body = this.commentBody.trim();

      if (!this.canSendMessage || this.isSendingMessage) return false;

      this.isSendingMessage = true;
      this.messageSendResult = "";

      try {
        const commentRes = await this.$axios.$post(
          HEALTH_CENTER_COMMENT_MAIL_CREATE_ENDPOINT,
          {
            group_id: this.group.group.id,
            application_type: BULK_MESSAGE_APPLICATION_TYPE,
            message_template_id: this.selectedMessageTemplate.id,
            body,
          }
        );

        if (submission && !submission.id && commentRes.data?.commentable_id) {
          submission.id = commentRes.data.commentable_id;
        }

        this.upsertCommentInSubmission(commentRes.data);
        this.commentBody = "";
        this.selectedMessageTemplateId = "";
        this.messageSendResult = "メッセージを送信しました";
        return true;
      } catch (error) {
        const savedComment = error?.response?.data?.data;
        if (savedComment?.id) {
          this.upsertCommentInSubmission(savedComment);
          this.commentBody = "";
          this.selectedMessageTemplateId = "";
          this.isPreviewModalOpen = false;
        }
        this.messageSendResult = "メッセージの送信に失敗しました";
        return false;
      } finally {
        this.isSendingMessage = false;
      }
    },
    async resendCommentMail(comment) {
      if (!comment?.id || this.isSendingMessage || this.resendingCommentId) {
        return;
      }

      this.resendingCommentId = comment.id;
      this.messageSendResult = "";
      try {
        const response = await this.$axios.$post(
          `${HEALTH_CENTER_COMMENT_MAIL_RESEND_ENDPOINT}/${comment.id}`
        );
        this.upsertCommentInSubmission(response.data);
        this.messageSendResult = "メッセージを再送信しました";
      } catch (error) {
        const savedComment = error?.response?.data?.data;
        if (savedComment?.id) {
          this.upsertCommentInSubmission(savedComment);
        }
        this.messageSendResult = "メッセージの再送信に失敗しました";
      } finally {
        this.resendingCommentId = null;
      }
    },
    upsertCommentInSubmission(comment) {
      if (!comment?.id) return;

      let targetSubmission = this.submissions.find(
        (submission) => submission.id === comment.commentable_id
      );
      if (!targetSubmission) {
        targetSubmission = this.getSubmission(BULK_MESSAGE_APPLICATION_TYPE);
      }
      if (!targetSubmission) return;
      if (!targetSubmission.id && comment.commentable_id) {
        targetSubmission.id = comment.commentable_id;
      }

      const comments = targetSubmission.comments || [];
      const commentIndex = comments.findIndex((item) => item.id === comment.id);
      if (commentIndex >= 0) {
        comments.splice(commentIndex, 1, { ...comments[commentIndex], ...comment });
      } else {
        comments.push(comment);
      }
      targetSubmission.comments = [...comments];
    },
    openFoodProductModal(foodProduct) {
      if (!foodProduct?.id) return;
      this.selectedFoodProductId = foodProduct.id;
      this.selectedFoodProduct = foodProduct;
      this.activeEditType = "food_product";
      this.isOpenEditModal = true;
    },
    openPurchaseListModal(purchaseList) {
      if (!purchaseList?.id) return;
      this.selectedPurchaseListId = purchaseList.id;
      this.selectedPurchaseList = purchaseList;
      this.activeEditType = "purchase_list";
      this.isOpenEditModal = true;
    },
    openEmployeeModal(employee) {
      if (!employee?.id) return;
      this.selectedEmployeeId = employee.id;
      this.selectedEmployee = employee;
      this.activeEditType = "employee";
      this.isOpenEditModal = true;
    },
    openRentalOrderModal(rentalOrder) {
      if (!rentalOrder?.id) return;
      this.selectedRentalOrderId = rentalOrder.id;
      this.selectedRentalOrder = rentalOrder;
      this.activeEditType = "rental_order";
      this.isOpenEditModal = true;
    },
    openCookingProcessOrderModal(order) {
      if (!order?.id) return;
      this.selectedCookingProcessOrder = order;
      this.activeEditType = "cooking_process_order";
      this.isOpenEditModal = true;
    },
    openVenueMapModal() {
      if (!this.group?.group?.id) return;
      this.activeEditType = "venue_map";
      this.isOpenEditModal = true;
    },
    closeEditModal() {
      this.isOpenEditModal = false;
      this.activeEditType = null;
    },
    async onEditorSaved() {
      await this.reloadPageData();
    },
    openEditError(message) {
      // TODO: 既存のコメント欄に依存せず、必要なら snackbar を追加する
      // 一旦は alert 相当の最低限の通知に留める
      if (message) {
        window.alert(message);
      }
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
    formatCommentTimestamp(timestamp) {
      if (!timestamp) return "送信日時不明";
      const date = new Date(timestamp);
      if (Number.isNaN(date.getTime())) return "送信日時不明";
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      const hh = String(date.getHours()).padStart(2, "0");
      const mi = String(date.getMinutes()).padStart(2, "0");
      const ss = String(date.getSeconds()).padStart(2, "0");
      return `${yyyy}/${mm}/${dd} ${hh}:${mi}:${ss}`;
    },
  },
};
</script>

<style scoped>
.main-content {
  position: relative;
}

.side-nav {
  position: fixed;
  top: 50vh;
  transform: translateY(-50%);
  z-index: 20;
}

.side-nav-left {
  left: calc(260px + 60px - 56px);
}

.side-nav-right {
  right: calc(60px - 56px);
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

.comment-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.comment-history {
  width: 100%;
  margin-top: 16px;
}

.message-template-panel {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  margin-bottom: 12px;
}

.message-template-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--accent-8);
}

.message-template-select {
  width: 100%;
  min-height: 40px;
  padding: 8px 10px;
  border: 1px solid var(--accent-2);
  border-radius: 4px;
  box-sizing: border-box;
  font-family: inherit;
  font-size: 14px;
}

.message-template-select:focus {
  outline: none;
  border-color: var(--button-primary);
}

.message-send-result {
  margin: 0;
  font-size: 13px;
  color: var(--accent-8);
}

.comment-accordion {
  width: 100%;
  border: 1px solid var(--accent-2);
  border-radius: 6px;
  padding: 8px 10px;
  margin-top: 8px;
  background: #fff;
}

.comment-accordion summary {
  cursor: pointer;
  font-weight: 600;
}

.comment-body {
  white-space: pre-wrap;
  margin: 10px 0 4px;
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

.comment-textarea:disabled {
  background: #f5f5f5;
  color: #777;
  cursor: not-allowed;
}

.mail-preview-field {
  width: 100%;
}

.mail-preview-field p,
.mail-preview-field pre {
  width: 500px;
  overflow-y: auto;
  margin: 0;
  padding: 12px;
  border: 1px solid var(--accent-2);
  border-radius: 4px;
  background: #fafafa;
  color: #222;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.65;
  white-space: pre-wrap;
  word-break: break-word;
}

.mail-preview-field p {
  min-height: 20px;
}

.mail-preview-field pre {
  min-height: 220px;
  max-height: 380px;
}

.mail-preview-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
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

.section-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-select-with-icon {
  min-width: 170px;
  height: 34px;
  border: 1px solid var(--accent-2);
  border-radius: 4px;
  padding: 0 8px;
  background: #fff;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.status-icon {
  font-size: 18px;
  color: var(--accent-7);
}

.status-select {
  min-width: 130px;
  height: 34px;
  border: none;
  padding: 0 2px;
  background: transparent;
  color: #222 !important;
  -webkit-text-fill-color: #222;
}

.status-select:focus {
  outline: none;
}

.status-select option {
  color: #222;
  background: #ffffff;
}

.status-select-with-icon.status-select--unapproved {
  background: #e53935 !important;
  color: #fff !important;
}

.status-select-with-icon.status-select--waiting-resubmission {
  background: #2e7d32 !important;
  color: #fff !important;
}

.status-select-with-icon.status-select--approved {
  /* approved: no background (transparent) to use default container look) */
  background: transparent !important;
  color: #111827 !important;
}

.status-select-with-icon.status-select--unsubmitted {
  background: #ffb300 !important;
  color: #fff !important;
}

/* セレクト内の文字色をコンテナの色に合わせる（オプションは除く） */
.status-select-with-icon.status-select--unapproved .status-select {
  color: #fff !important;
  -webkit-text-fill-color: #fff !important;
}
.status-select-with-icon.status-select--waiting-resubmission .status-select {
  color: #fff !important;
  -webkit-text-fill-color: #fff !important;
}
.status-select-with-icon.status-select--unsubmitted .status-select {
  color: #fff !important;
  -webkit-text-fill-color: #fff !important;
}
.status-select-with-icon.status-select--approved .status-select {
  color: inherit !important;
  -webkit-text-fill-color: inherit !important;
  background: transparent !important;
}

/* カスタムセレクトの矢印とレイアウト */
.select-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.select-wrapper .status-select {
  -webkit-appearance: none;
  appearance: none;
  padding-right: 20px; /* 矢印分の余白 */
}

.select-caret {
  position: absolute;
  right: 6px;
  pointer-events: none;
  color: #6b7280;
  font-size: 18px;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border-radius: 6px;
  padding: 2px 6px;
}

.select-wrapper:hover .select-caret {
  background: #e6e9ee;
  color: #374151;
}

/* セレクトの状態に合わせて矢印アイコンも同じ配色にする */
.status-select-with-icon.status-select--unapproved .select-caret,
.status-select-with-icon.status-select--unapproved .status-icon {
  background: transparent !important;
  color: #fff !important;
}

.status-select-with-icon.status-select--waiting-resubmission .select-caret,
.status-select-with-icon.status-select--waiting-resubmission .status-icon {
  background: transparent !important;
  color: #fff !important;
}

.status-select-with-icon.status-select--unsubmitted .select-caret,
.status-select-with-icon.status-select--unsubmitted .status-icon {
  background: transparent !important;
  color: #fff !important;
}

.status-select-with-icon.status-select--approved .select-caret,
.status-select-with-icon.status-select--approved .status-icon {
  background: transparent !important;
  color: #111827 !important;
}

/* 未承認サマリーのスタイル（横並びで見やすく） */
.submission-summary {
  display: flex;
  flex-direction: row;
  gap: 18px;
  margin-top: 8px;
  align-items: baseline;
}

.submission-summary-item {
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
}

.submission-label {
  font-size: 14px;
  color: #374151;
}

.submission-count {
  font-size: 20px;
  font-weight: 800;
  color: #111827;
}

.submission-suffix {
  font-size: 14px;
  color: #374151;
}

.submission-breakdown {
  display: flex;
  flex-direction: row;
  gap: 12px;
  margin-left: 8px;
}

.submission-only-approved {
  font-size: 16px;
  color: #065f46; /* 落ち着いた緑で承認済を示す */
  font-weight: 700;
}

/* 未承認メインの件数を赤にする */
.submission-summary-main .submission-count {
  color: #b91c1c;
}

/* 未承認ヘッダ全体を赤にする */
.submission-summary-main {
  color: #b91c1c;
  font-weight: 700;
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

.mail-delivery-status {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  margin-left: 8px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0;
}

.mail-delivery-status--sent {
  background: #e7f5ec;
  color: #1f7a3f;
}

.mail-delivery-status--failed {
  background: #fff3dc;
  color: #9a5b00;
}

.mail-delivery-status--not-send {
  background: #eeeeee;
  color: #555;
}

@media (max-width: 900px) {
  .sticky-right-column {
    position: static;
    top: auto;
  }

  .side-nav-left {
    left: 8px;
  }

  .side-nav-right {
    right: 8px;
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
