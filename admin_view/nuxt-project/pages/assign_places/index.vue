<template>
  <div class="assign_items" v-if="$role(roleID).assign_items.read">
    <SubHeader pageTitle="会場割り当て"></SubHeader>
    
    <!-- 絞り込み検索コンテナ -->
    <div class="SearchContainer">
      <div class="SearchContainer-left">
        <SearchDropDown :nameList="yearList" :on_click="refinementYears" value="year_num">
          {{ refYears }}
        </SearchDropDown>
      </div>
    </div>

    <!-- 削除確認モーダル -->
    <div v-if="isDeleteModalOpen" class="modal-overlay" @click.self="closeDeleteModal">
      <div class="delete-modal-content">
        <h2>割り当ての削除</h2>
        <h4>本当にこの場所からこの団体の割り当てを削除しますか？</h4>
        <div class="modal-actions">
          <YesButton v-if="$role(roleID).assign_items.delete" iconName="delete" :on_click="confirmDelete">削除する</YesButton>
          <NoButton iconName="close" :on_click="closeDeleteModal">キャンセル</NoButton>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="loading-area">
      <p>読み込み中...</p>
    </div>

    <main v-else class="main-layout">
      <!-- 左側：申請団体リスト -->
      <aside class="order-group">
        <div class="order-group-header">
          <h2>申請団体</h2>
          <SearchDropDown :nameList="groupCategoryList" :on_click="refinementCategories" value="name">
            {{ refCategoryName }}
          </SearchDropDown>
        </div>
        <div class="order-group-content">
          <template v-for="group in activeGroups">
            <div
              :key="group.id"
              draggable="true"
              @dragstart="handleDragStartGroup($event, group)"
              class="group-card"
              :class="{ 'is-fulfilled': isGroupAssignedAnywhere(group.id) }"
            >
              <div class="group-name">
                {{ group.name }}
                <span class="total-power-badge">{{ getGroupTotalPower(group.id) }} W</span>
              </div>
              
              <!-- 電力申請された機器の内訳 -->
              <div class="item-summary">
                <span v-for="(device, index) in getGroupPowerDevices(group.id)" :key="index" class="item-chip">
                  {{ device.item || device.name }}: {{ device.power }}W
                </span>
                <div v-if="getGroupPowerDevices(group.id).length === 0" class="empty-text">
                  電力申請なし
                </div>
              </div>
              
              <!-- 現在割り当てられている場所の表示 -->
              <div class="assign-result-container" v-if="getGroupAssignedPlaces(group.id).length > 0">
                <div class="assign-result">割り当て先</div>
                <div class="assigned-places-list">
                  <span v-for="place in getGroupAssignedPlaces(group.id)" :key="place.id" class="place-tag">
                    {{ place.name }}
                  </span>
                </div>
              </div>
            </div>
          </template>
        </div>
      </aside>

      <!-- 右側：会場（貸出場所）エリア -->
      <section class="stock-area">
        <div class="order-group-header">
          <h2>会場</h2>
          <SearchDropDown :nameList="placeCategoryList" :on_click="refinementPlaces" value="formatted_name">
            {{ refPlaces }}
          </SearchDropDown>
        </div>
        <div class="cards">
          <template v-for="place in filteredPlaces">
            <div
              :key="place.id" 
              @dragover.prevent
              @drop="handleDropOnPlace($event, place)"
              class="stock-card"
            >
              <div class="stock-info">
                <h3>{{ place.name }}</h3>
                <div class="place-total-power">
                  合計電力: <strong>{{ getPlaceTotalPower(place.id) }} W</strong>
                </div>
              </div>

              <div class="assignment-list">
                <div v-if="getGroupsInPlace(place.id).length === 0" class="empty-state">
                  申請団体をここにドロップ
                </div>
                <template v-else>
                  <div v-for="group in getGroupsInPlace(place.id)" :key="group.id" class="assignment-item">
                    <div class="assign-group-name">{{ group.name }}</div>
                    <div class="assign-inputs">
                      <span class="input-label">{{ getGroupTotalPower(group.id) }} W</span>
                    </div>
                    <button v-if="$role(roleID).assign_items.delete" class="btn-delete" @click="openDeleteModal(group.id, place.id)">✕</button>
                  </div>
                </template>
              </div>
            </div>
          </template>
        </div>
      </section>
    </main>
  </div>
  <h1 v-else>閲覧権限がありません</h1>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'FestManagerPowerLocationDynamic',
  data() {
    return {
      isLoading: true,
      isDeleteModalOpen: false,
      targetDeleteAssignId: null, // 削除用のID (assign_group_place.id)
      
      groups: [],
      places: [],
      powerOrders: [],       
      placeOrders: [],       // New: 会場申請データ
      assignGroupPlaces: [], // 会場割り当てデータ

      yearList: [],
      refYearID: 0,
      refYears: "ALL",
      groupCategoryList: [], 
      refCategoryID: 0,      
      refCategoryName: "ALL",
      placeCategoryList: [],
      refPlaceID: 0,
      refPlaces: "ALL",
      
      updatingRelations: false
    };
  },

  async asyncData({ $axios }) {
    const [yearsRes, categoriesRes, placeCategoriesRes] = await Promise.all([
      $axios.$get("/fes_years").catch(() => ({ data: [] })),
      $axios.$get("/group_categories").catch(() => ({ data: [] })),
      $axios.$get("/place_categories").catch(() => ({ data: [] }))
    ]);
    return {
      yearList: yearsRes.data || [],
      groupCategoryList: categoriesRes.data || [],
      placeCategoryList: placeCategoriesRes.data || [],
    };
  },

  computed: {
    ...mapState({
      roleID: (state) => state.users.role,
    }),
    
    validPlaceCategoryIds() {
      if (this.refPlaceID === 0) return [];
      const category = this.placeCategoryList.find(placeCategory => Number(placeCategory.id) === this.refPlaceID);
      if (!category) return [this.refPlaceID];
      return [this.refPlaceID, ...(category.descendant_ids || [])].map(Number);
    },
    
    filteredPlaces() {
      if (this.refPlaceID === 0) return this.places;
      return this.places.filter(place => this.validPlaceCategoryIds.includes(Number(place.place_category_id)));
    },
    
    activeGroups() {
      return this.groups.filter(g => {
        if (this.refYearID !== 0 && Number(g.fes_year_id) !== this.refYearID) return false;
        if (this.refCategoryID !== 0 && Number(g.group_category_id) !== this.refCategoryID) return false;
        return true;
      });
    },

    // キャッシュ用Map
    powerOrdersByGroupId() {
      const map = new Map();
      this.powerOrders.forEach(po => {
        const groupId = Number(po.group_id);
        if (!map.has(groupId)) map.set(groupId, []);
        map.get(groupId).push(po);
      });
      return map;
    },
    
    assignmentsByPlaceId() {
      const map = new Map();
      this.assignGroupPlaces.forEach(a => {
        const placeId = Number(a.stocker_place_id); // APIにあわせて変更
        if (!map.has(placeId)) map.set(placeId, []);
        map.get(placeId).push(a);
      });
      return map;
    },
  },

  mounted() {
    if (!this.$role(this.roleID).assign_items.read) return;
    this.fetchDataFromDB();
  },

  methods: {
    async fetchDataFromDB() {
      this.isLoading = true;
      try {
        const [groupsRes, placesRes, powerRes, assignRes, placeOrdersRes] = await Promise.all([
          this.$axios.$get('/groups').catch(() => ({ data: [] })),
          this.$axios.$get('/stocker_places').catch(() => ({ data: [] })),
          this.$axios.$get('/power_orders').catch(() => ({ data: [] })),
          this.$axios.$get('/assign_group_places').catch(() => ({ data: [] })),
          this.$axios.$get('/place_orders').catch(() => ({ data: [] })) // 会場申請取得用
        ]);

        this.groups = Array.isArray(groupsRes) ? groupsRes : groupsRes.data || [];
        this.places = Array.isArray(placesRes) ? placesRes : placesRes.data || [];
        this.powerOrders = Array.isArray(powerRes) ? powerRes : powerRes.data || [];
        this.assignGroupPlaces = Array.isArray(assignRes) ? assignRes : assignRes.data || [];
        this.placeOrders = Array.isArray(placeOrdersRes) ? placeOrdersRes : placeOrdersRes.data || [];
      } catch (error) {
        console.error("データの取得に失敗しました", error);
      } finally {
        this.isLoading = false;
      }
    },

    // ----------------------------
    // ID 相互変換ヘルパー
    // ----------------------------
    getPlaceOrderIdByGroupId(groupId) {
      const po = this.placeOrders.find(p => {
        // APIの戻り値がネストしているか判定
        const gId = p.place_order ? p.place_order.group_id : p.group_id;
        return Number(gId) === Number(groupId);
      });
      return po ? (po.place_order ? po.place_order.id : po.id) : null;
    },

    getGroupIdByPlaceOrderId(placeOrderId) {
      const po = this.placeOrders.find(p => {
        const id = p.place_order ? p.place_order.id : p.id;
        return Number(id) === Number(placeOrderId);
      });
      return po ? (po.place_order ? po.place_order.group_id : po.group_id) : null;
    },

    // ----------------------------
    // 電力計算・表示用メソッド
    // ----------------------------
    getGroupPowerDevices(groupId) {
      return this.powerOrdersByGroupId.get(Number(groupId)) || [];
    },
    getGroupTotalPower(groupId) {
      const devices = this.getGroupPowerDevices(groupId);
      return devices.reduce((sum, device) => sum + Number(device.power || 0), 0);
    },
    getPlaceTotalPower(placeId) {
      const groupsInPlace = this.getGroupsInPlace(placeId);
      return groupsInPlace.reduce((sum, group) => sum + this.getGroupTotalPower(group.id), 0);
    },
    getGroupsInPlace(placeId) {
      const assigns = this.assignmentsByPlaceId.get(Number(placeId)) || [];
      const placeOrderIds = assigns.map(a => Number(a.place_order_id));
      const groupIds = placeOrderIds.map(poId => this.getGroupIdByPlaceOrderId(poId)).filter(id => id !== null);
      return this.groups.filter(g => groupIds.includes(Number(g.id)));
    },
    getGroupAssignedPlaces(groupId) {
      const placeOrderId = this.getPlaceOrderIdByGroupId(groupId);
      if (!placeOrderId) return [];
      
      const placeIds = this.assignGroupPlaces
        .filter(a => Number(a.place_order_id) === Number(placeOrderId))
        .map(a => Number(a.stocker_place_id));
      return this.places.filter(p => placeIds.includes(Number(p.id)));
    },
    isGroupAssignedAnywhere(groupId) {
      const placeOrderId = this.getPlaceOrderIdByGroupId(groupId);
      if (!placeOrderId) return false;
      return this.assignGroupPlaces.some(a => Number(a.place_order_id) === Number(placeOrderId));
    },

    // ----------------------------
    // ドラッグ＆ドロップ制御 (API連動)
    // ----------------------------
    handleDragStartGroup(e, group) {
      e.dataTransfer.setData('type', 'GROUP_POWER');
      e.dataTransfer.setData('groupId', group.id);
    },

    async handleDropOnPlace(e, place) {
      if (!this.$role(this.roleID).assign_items.update) return;
      const type = e.dataTransfer.getData('type');
      if (type !== 'GROUP_POWER') return;

      const groupId = Number(e.dataTransfer.getData('groupId'));
      if (!groupId) return;

      if (this.updatingRelations) return;
      this.updatingRelations = true;

      try {
        // 1. 団体の place_order_id を取得
        let placeOrderId = this.getPlaceOrderIdByGroupId(groupId);

        // 2. 会場未申請の団体の場合、自動で place_order を新規作成
        if (!placeOrderId) {
          const newPoRes = await this.$axios.$post('/place_orders', {
            place_order: { group_id: groupId }
          });
          const newPo = newPoRes.data || newPoRes;
          
          // フロントの配列に追加して placeOrderId を更新
          this.placeOrders.push(newPo);
          placeOrderId = newPo.id || (newPo.place_order && newPo.place_order.id);
        }

        // 3. 重複割り当てのチェック
        const isAlreadyAssigned = this.assignGroupPlaces.some(
          a => Number(a.place_order_id) === Number(placeOrderId) && Number(a.stocker_place_id) === Number(place.id)
        );
        if (isAlreadyAssigned) return;

        // 4. 会場割り当てを保存
        const response = await this.$axios.$post('/assign_group_places', {
          assign_group_place: {
            place_order_id: placeOrderId,
            stocker_place_id: place.id
          }
    });
    
    this.assignGroupPlaces.push(response.data || response);
  } catch (error) {
    alert("会場の割り当てに失敗しました。");
    console.error(error);
  } finally {
    this.updatingRelations = false;
  }
},

    // ----------------------------
    // 削除確認モーダルの制御 (API連動)
    // ----------------------------
    openDeleteModal(groupId, placeId) {
      if (!this.$role(this.roleID).assign_items.delete) return;
      
      const placeOrderId = this.getPlaceOrderIdByGroupId(groupId);
      const assignRecord = this.assignGroupPlaces.find(
        a => Number(a.place_order_id) === placeOrderId && Number(a.stocker_place_id) === placeId
      );

      if (assignRecord) {
        this.targetDeleteAssignId = assignRecord.id;
        this.isDeleteModalOpen = true;
      }
    },
    
    closeDeleteModal() {
      this.isDeleteModalOpen = false;
      this.targetDeleteAssignId = null;
    },
    
    async confirmDelete() {
      if (!this.$role(this.roleID).assign_items.delete || !this.targetDeleteAssignId) return;
      
      try {
        // DELETEメソッド呼び出し
        await this.$axios.$delete(`/assign_group_places/${this.targetDeleteAssignId}`);
        // 成功したらフロントの配列から削除
        this.assignGroupPlaces = this.assignGroupPlaces.filter(a => a.id !== this.targetDeleteAssignId);
      } catch (error) {
        alert("割り当ての解除に失敗しました。");
      }
      this.closeDeleteModal();
    },

    // ----------------------------
    // 絞り込み制御
    // ----------------------------
    refinementYears(item_id, name_list) {
      if (name_list === this.yearList) {
        this.refYearID = item_id;
        const found = name_list.find(x => x.id === item_id);
        this.refYears = item_id === 0 ? "ALL" : (found ? found.year_num : "Year");
      }
    },
    refinementCategories(item_id, name_list) {
      if (name_list === this.groupCategoryList) {
        this.refCategoryID = item_id;
        const found = name_list.find(x => x.id === item_id);
        this.refCategoryName = item_id === 0 ? "ALL" : (found ? found.name : "Category");
      }
    },
    refinementPlaces(item_id, name_list) {
      if (name_list === this.placeCategoryList) {
        this.refPlaceID = item_id;
        const matchedPlace = name_list.find(x => x.id === item_id);
        this.refPlaces = item_id === 0 ? "ALL" : (matchedPlace ? matchedPlace.name : "Place");
      }
    }
  }
};
</script>

<style scoped>
/* 前回と同じCSSを適用 */
.assign_items { display: flex; flex-direction: column; height: 100vh; }
.SearchContainer { display: flex; flex-direction: row; justify-content: space-between; align-items: center; padding: 8px 18px; }
.SearchContainer-left { display: flex; gap: 16px; }
.btn-delete { background: none; border: none; color: #cbd5e1; font-size: 16px; cursor: pointer; padding: 8px 12px; }
.btn-delete:hover { color: #ef4444; }
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 3; }
.delete-modal-content { width: 600px; height: 400px; z-index: 15; display: flex; justify-content: center; align-items: center; flex-flow: column; padding: 50px; background: white; border-radius: 12px; gap: 30px; }
.modal-actions { display: flex; justify-content: center; gap: 16px; }
.loading-area { flex: 1; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #64748b; }
.main-layout { flex: 1; display: flex; overflow: hidden; margin: 0; padding: 0; flex-direction: row; align-items: stretch; border: 1px solid #ebebeb; }

/* 左側エリア */
.order-group { width: 35%; background-color: white; display: flex; flex-direction: column; }
.order-group-header { display: flex; justify-content: flex-start; align-items: center; height: 80px; background-color: #ffffff; border-bottom: 1px solid #000000; padding: 0 12px; }
.order-group-header h2 { margin: 0; padding-right: 12px; font-size: 16px; color: #334155; }
.order-group-content { flex: 1; overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 10px; }
.group-card { padding: 12px; border: 1px solid #999999; border-radius: 8px; background-color: white; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1); cursor: grab; transition: all 0.2s; }
.group-card:active { cursor: grabbing; }
.group-card:hover { border-color: #4c4c4c; box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15); }
.group-card.is-fulfilled { background-color: #f8fafc; border-color: #cbd5e1; }
.group-name { font-weight: bold; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; }
.total-power-badge { background-color: #ef4444; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
.item-summary { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; }
.item-chip { font-size: 11px; background-color: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 4px; padding: 4px 6px; }
.empty-text { font-size: 11px; color: #94a3b8; }
.assign-result-container { margin-top: 8px; padding-top: 8px; border-top: 1px dashed #e2e8f0; }
.assign-result { font-size: 11px; color: #64748b; margin-bottom: 4px; }
.assigned-places-list { display: flex; flex-wrap: wrap; gap: 4px; }
.place-tag { font-size: 11px; background-color: #dbeafe; color: #1e3a8a; padding: 2px 6px; border-radius: 4px; }

/* 右側エリア */
.stock-area { flex: 1; overflow-y: auto; display: flex; flex-direction: column; background-color: #f8fafc; }
.cards { padding: 16px; flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; }
.stock-card { display: flex; flex-direction: column; background-color: white; border-radius: 8px; border: 1px solid #d1d5db; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); min-height: 150px; }
.stock-info { padding: 12px 16px; background-color: #f1f5f9; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
.stock-info h3 { margin: 0; font-size: 16px; color: #0f172a; }
.place-total-power { font-size: 14px; color: #334155; }
.place-total-power strong { color: #ef4444; font-size: 16px; }
.assignment-list { padding: 12px; display: flex; flex-direction: column; gap: 8px; flex: 1; }
.empty-state { flex: 1; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-size: 13px; border: 2px dashed #e2e8f0; border-radius: 6px; min-height: 80px; }
.assignment-item { display: flex; align-items: center; background-color: white; padding: 8px 12px; border: 1px solid #cbd5e1; border-left: 4px solid #3b82f6; border-radius: 6px; }
.assign-group-name { flex: 1; font-weight: bold; font-size: 14px; color: #1e293b; }
.assign-inputs { display: flex; gap: 8px; margin-right: 12px; }
.input-label { font-size: 12px; background-color: #fee2e2; padding: 4px 8px; border-radius: 12px; color: #b91c1c; font-weight: bold; }
</style>