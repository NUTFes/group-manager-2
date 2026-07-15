<template>
  <div class="assign_items">
    <SubHeader pageTitle="物品貸出場所調整"></SubHeader>
    <div class="SearchContainer">
      <div class="SearchContainer-left">
        <SearchDropDown
          :nameList="yearList"
          :on_click="refinementYears"
          value="year_num"
        >
          {{ refYears }}
        </SearchDropDown>
      </div>
      <CommonButton class="btn-primary" iconName="edit" :on_click="openModal">
        対象物品を設定
      </CommonButton>
    </div>

    <!-- 物品設定モーダル -->
    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h2>対象物品の選択 (最大5つ)</h2>
        <div class="modal-info">
          現在選択中: <strong>{{ selectedItemCount }}</strong> / 5
        </div>
        <div class="table-container"> 
          <table class="item-table">
            <thead>
              <tr>
                <th class="text-center">選択</th>
                <th>物品名</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in items" :key="item.id">
                <td class="text-center">
                  <input 
                    type="checkbox" 
                    v-model="modalSettings[item.id].selected"
                    :disabled="!modalSettings[item.id].selected && selectedItemCount >= 5"
                  >
                </td>
                <td>{{ item.name }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="modal-actions">
          <NoButton class="btn-secondary" iconName="close" :on_click="closeModal">キャンセル</NoButton>
          <YesButton class="btn-primary" iconName="add_circle" :on_click="applyModalSettings">決定</YesButton>
        </div>
      </div>
    </div>

    <!-- 削除確認モーダル -->
    <div v-if="isDeleteModalOpen" class="modal-overlay" @click.self="closeDeleteModal">
      <div class="delete-modal-content">
        <h2>割り当ての削除</h2>
        <h4>
          本当にこの団体の割り当てを削除しますか？<br>
        </h4>
        <div class="modal-actions">
          <YesButton  iconName="delete" :on_click="confirmDelete">削除する</YesButton>
          <NoButton  iconName="close" :on_click="closeDeleteModal">キャンセル</NoButton>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="loading-area">
      <p>読み込み中...</p>
    </div>

    <main v-else class="main-layout">
      <!-- 左側：割り当て済み団体リスト -->
      <aside class="order-group">
        <div class="order-group-header">
          <h2>割り当て済み団体</h2>
          <SearchDropDown
          :nameList="groupCategoryList"
          :on_click="refinementCategories"
          value="name"
        >
          {{ refCategoryName }}
        </SearchDropDown>
        </div>
        <div class="order-group-content">
          <div 
            v-for="group in activeAssignedGroups" 
            :key="group.id" 
            draggable="true" 
            @dragstart="handleDragStartGroup($event, group)" 
            class="group-card"
            :class="{ 'is-fulfilled': getGroupRentalPlace(group.id) }"
          >
            <div class="group-name">
              {{ group.name }}
              <span class="assigned" v-if="getGroupRentalPlace(group.id)">
                {{ getPlaceName(getGroupRentalPlace(group.id)) }}へ
              </span>
            </div>
            <!-- 左側にも搬入元内訳を簡易表示 -->
            <div class="assign-result-container">
              <table>
                <tbody>
                  <tr v-for="source in getGroupSourceBreakdown(group.id)" :key="source.id">
                    <td>{{ source.name }}より</td>
                    <td v-for="itemId in activeItemIds" :key="itemId">
                      {{ getItemName(itemId) }}: {{ source.items[itemId] || 0 }}
                    </td>
                  </tr>
                  <tr class="total-row">
                    <td><strong>合計</strong></td>
                    <td v-for="itemId in activeItemIds" :key="itemId">
                      <strong>{{ getItemName(itemId) }}: {{ getGroupTotalItem(group.id, itemId) }}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </aside>

      <!-- 右側：貸出場所エリア -->
      <section class="stock-area">
        <div class="order-group-header">
          <h2>貸出場所</h2>
        </div>
        <div class="cards">
          <div 
            v-for="place in places" 
            :key="place.id" 
            @dragover.prevent 
            @drop="handleDropOnPlace($event, place)" 
            class="stock-card"
          >
            <!-- 貸出場所情報（テーブルによる合計・内訳の常時表示） -->
            <div class="stock-info">
              <h3>{{ place.name }}</h3>
              
              <div class="stock-info-tables">
                <!-- 貸出合計テーブル -->
                <div class="assign-result-container">
                  <div class="assign-result">貸出合計</div>
                  <table>
                    <thead>
                      <tr>
                        <th v-for="itemId in activeItemIds" :key="itemId">{{ getItemName(itemId) }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td class="text-center" v-for="itemId in activeItemIds" :key="itemId">
                          <span class="badge-value">
                            {{ getPlaceTotalItem(place.id, itemId) }}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- 搬入元内訳テーブル -->
                <div class="assign-result-container">
                  <div class="assign-result">搬入元内訳</div>
                  <table>
                    <thead>
                      <tr>
                        <th>搬入元</th>
                        <th v-for="itemId in activeItemIds" :key="itemId">{{ getItemName(itemId) }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="source in getPlaceSourceBreakdown(place.id)" :key="source.id">
                        <td>{{ source.name }}</td>
                        <td class="text-center" v-for="itemId in activeItemIds" :key="itemId">
                          {{ source.items[itemId] || 0 }}
                        </td>
                      </tr>
                      <tr v-if="getPlaceSourceBreakdown(place.id).length === 0">
                        <td :colspan="activeItemIds.length + 1" class="text-center">
                          割り当てがありません
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- ドロップされた団体のリスト -->
            <div class="assignment-list">
              <div v-if="getGroupsInPlace(place.id).length === 0" class="empty-state">
                割り当て済み団体をここにドロップ
              </div>
              <div 
                v-else 
                v-for="group in getGroupsInPlace(place.id)"
                :key="group.id" 
                class="assignment-item"
              >
                <div class="assign-group-name">
                  {{ group.name }}
                  <div class="import-source">
                    <span v-for="source in getGroupSourceBreakdown(group.id)" :key="source.id">
                      {{ source.name }}より: 
                      <template v-for="itemId in activeItemIds">
                        <span v-if="source.items[itemId] > 0" :key="itemId" style="margin-right: 8px;">
                          {{ getItemName(itemId) }}{{ source.items[itemId] }}
                        </span>
                      </template>
                    </span>
                  </div>
                </div>
                <div class="assign-inputs">
                  <div v-for="itemId in activeItemIds" :key="itemId" class="assign-input-group">
                    <span class="input-label">
                      {{ getItemName(itemId) }} {{ getGroupTotalItem(group.id, itemId) }}
                    </span>
                  </div>
                </div>
                <button class="btn-delete" @click="openDeleteModal(group.id)">✕</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'FestManagerLocationDynamic',
  data() {
    return {
      isLoading: true,
      isModalOpen: false,
      isDeleteModalOpen: false,
      targetDeleteGroupId: null,
      items: [],
      groups: [],
      places: [],
      assignments: [],
      modalSettings: {},
      activeSettings: {},
      yearList: [],
      refYearID: 0,
      refYears: "ALL",
      groupCategoryList: [], 
      refCategoryID: 0,      
      refCategoryName: "ALL",
    };
  },

  async asyncData({ $axios }) {
    const [yearsRes, categoriesRes] = await Promise.all([
      $axios.$get("/fes_years").catch(() => ({ data: [] })),
      $axios.$get("/group_categories").catch(() => ({ data: [] }))
    ]);

    return {
      yearList: yearsRes.data || [],
      groupCategoryList: categoriesRes.data || [],
      refYearID: 0,
      refYears: "ALL",
      refCategoryID: 0,
      refCategoryName: "ALL",
    };
  },

  computed: {
    ...mapState({
      roleID: (state) => state.users.role,
    }),
    selectedItemCount() {
      return Object.values(this.modalSettings).filter((s) => s.selected).length;
    },
    activeItemIds() {
      return Object.keys(this.activeSettings).filter(
        (id) => this.activeSettings[id].selected
      ).map(Number);
    },
    activeAssignedGroups() {
      return this.groups.filter(g => {
        // 年度での絞り込み
        if (this.refYearID !== 0 && Number(g.fes_year_id) !== this.refYearID) return false;
        
        // 団体のカテゴリーでの絞り込み
        if (this.refCategoryID !== 0 && Number(g.group_category_id) !== this.refCategoryID) return false;
        
        const groupAssigns = this.assignments.filter(a => Number(a.group_id) === Number(g.id));
        if (groupAssigns.length === 0) return false;

        return this.activeItemIds.some(itemId => {
          const total = groupAssigns
            .filter(a => Number(a.rental_item_id) === itemId)
            .reduce((sum, a) => sum + Number(a.num || 0), 0);
          return total > 0;
        });
      });
    }
  },

  mounted() {
    this.fetchDataFromDB();
  },

  methods: {
    async fetchDataFromDB() {
      this.isLoading = true;
      try {
        const [itemsRes, groupsRes, placesRes, assignRes] = await Promise.all([
          this.$axios.$get('/rental_items'),
          this.$axios.$get('/groups'),
          this.$axios.$get('/stocker_places'), 
          this.$axios.$get('/assign_rental_items')
        ]);

        this.items = Array.isArray(itemsRes) ? itemsRes : itemsRes.data;
        this.groups = Array.isArray(groupsRes) ? groupsRes : groupsRes.data;
        this.places = Array.isArray(placesRes) ? placesRes : placesRes.data;
        this.assignments = Array.isArray(assignRes) ? assignRes : assignRes.data;

        if (Object.keys(this.modalSettings).length === 0) {
          const settings = {};
          this.items.forEach(item => {
            const isDefault = item.id === 1 || item.id === 3;
            settings[item.id] = { selected: isDefault };
          });
          this.modalSettings = JSON.parse(JSON.stringify(settings));
          this.activeSettings = JSON.parse(JSON.stringify(settings));
        }

      } catch (error) {
      } finally {
        this.isLoading = false;
      }
    },

    // ----------------------------
    // ドラッグ＆ドロップ制御
    // ----------------------------
    handleDragStartGroup(e, group) {
      e.dataTransfer.setData('type', 'GROUP_LOCATION');
      e.dataTransfer.setData('groupId', group.id);
    },

    async handleDropOnPlace(e, rentalPlace) {
      const type = e.dataTransfer.getData('type');
      if (type !== 'GROUP_LOCATION') return;
      
      const groupId = e.dataTransfer.getData('groupId');
      if (!groupId) return;

      const groupAssignments = this.assignments.filter(a => Number(a.group_id) === Number(groupId));
      if (groupAssignments.length === 0) return;

      try {
        const promises = groupAssignments.map(assign => {
          const payload = {
            group_id: assign.groupId,
            rentalItemId: assign.rentalItemId,
            num: assign.num,
            stockerPlaceId: assign.stockerPlaceId,
            rental_place_id: rentalPlace.id
          };
          return this.$axios.$put(`/assign_rental_items/${assign.id}`, payload);
        });

        await Promise.all(promises);

        groupAssignments.forEach(a => {
          a.rental_place_id = rentalPlace.id;
        });
        
        this.assignments = [...this.assignments];
      } catch (error) {
        alert("貸出場所の割り当てに失敗しました。");
        await this.fetchDataFromDB();
      }
    },

    // ----------------------------
    // 削除確認モーダルの制御
    // ----------------------------
    openDeleteModal(groupId) {
      this.targetDeleteGroupId = groupId;
      this.isDeleteModalOpen = true;
    },
    closeDeleteModal() {
      this.isDeleteModalOpen = false;
      this.targetDeleteGroupId = null;
    },
    async confirmDelete() {
      if (!this.targetDeleteGroupId) return;
      await this.removeGroupFromPlace(this.targetDeleteGroupId);
      this.closeDeleteModal();
    },

    async removeGroupFromPlace(groupId) {
      const groupAssignments = this.assignments.filter(a => Number(a.group_id) === Number(groupId) && a.rental_place_id);
      
      try {
        const promises = groupAssignments.map(assign => {
          const payload = {
            group_id: assign.groupId,
            rentalItemId: assign.rentalItemId,
            num: assign.num,
            stockerPlaceId: assign.stockerPlaceId,
            rental_place_id: null
          };
          return this.$axios.$put(`/assign_rental_items/${assign.id}`, payload);
        });

        await Promise.all(promises);

        groupAssignments.forEach(a => {
          a.rental_place_id = null;
        });
        
        this.assignments = [...this.assignments];
      } catch (error) {
        alert("割り当ての解除に失敗しました。");
      }
    },

    // ----------------------------
    // 計算・表示用メソッド
    // ----------------------------
    getItemName(itemId) {
      const item = this.items.find(i => Number(i.id) === Number(itemId));
      return item ? item.name : '不明';
    },

    getPlaceName(placeId) {
      const place = this.places.find(p => Number(p.id) === Number(placeId));
      return place ? place.name : '不明';
    },

    getGroupRentalPlace(groupId) {
      const assign = this.assignments.find(a => Number(a.group_id) === Number(groupId) && a.rental_place_id);
      return assign ? assign.rental_place_id : null;
    },

    getGroupsInPlace(placeId) {
      const groupIdsInPlace = [...new Set(
        this.assignments
          .filter(a => Number(a.rental_place_id) === Number(placeId))
          .map(a => Number(a.group_id))
      )];
      
      return this.groups.filter(g => {
        if (!groupIdsInPlace.includes(Number(g.id))) return false;

        return this.activeItemIds.some(itemId => {
          return this.getGroupTotalItem(g.id, itemId) > 0;
        });
      });
    },

    getGroupTotalItem(groupId, itemId) {
      return this.assignments
        .filter(a => Number(a.group_id) === Number(groupId) && Number(a.rental_item_id) === Number(itemId))
        .reduce((sum, a) => sum + Number(a.num || 0), 0);
    },

    getPlaceTotalItem(placeId, itemId) {
      return this.assignments
        .filter(a => Number(a.rental_place_id) === Number(placeId) && Number(a.rental_item_id) === Number(itemId))
        .reduce((sum, a) => sum + Number(a.num || 0), 0);
    },

    getGroupSourceBreakdown(groupId) {
      const assigns = this.assignments.filter(a => Number(a.group_id) === Number(groupId));
      return this._calculateSourceBreakdown(assigns);
    },

    getPlaceSourceBreakdown(placeId) {
      const assigns = this.assignments.filter(a => Number(a.rental_place_id) === Number(placeId));
      return this._calculateSourceBreakdown(assigns);
    },

    _calculateSourceBreakdown(assignRecords) {
      const sourcesMap = {};

      assignRecords.forEach(a => {
        const sourceId = Number(a.stocker_place_id);
        const itemId = Number(a.rental_item_id);

        if (!this.activeItemIds.includes(itemId)) return;

        if (!sourcesMap[sourceId]) {
          sourcesMap[sourceId] = {
            id: sourceId,
            name: this.getPlaceName(sourceId),
            items: {}
          };
        }

        sourcesMap[sourceId].items[itemId] = (sourcesMap[sourceId].items[itemId] || 0) + Number(a.num || 0);
      });

      return Object.values(sourcesMap).filter(source => {
        return Object.values(source.items).some(count => count > 0);
      });
    },

    // ----------------------------
    // モーダル＆絞り込み制御
    // ----------------------------
    openModal() {
      this.modalSettings = JSON.parse(JSON.stringify(this.activeSettings));
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    applyModalSettings() {
      this.activeSettings = JSON.parse(JSON.stringify(this.modalSettings));
      this.isModalOpen = false;
    },
    
    // 年度の絞り込み
    refinementYears(item_id, name_list) {
      if (name_list === this.yearList) {
        this.refYearID = item_id;
        const found = name_list.find(x => x.id === item_id);
        this.refYears = item_id === 0 ? "ALL" : (found ? found.year_num : "Year");
      }
    },

    // カテゴリーの絞り込み
    refinementCategories(item_id, name_list) {
      if (name_list === this.groupCategoryList) {
        this.refCategoryID = item_id;
        const found = name_list.find(x => x.id === item_id);
        this.refCategoryName = item_id === 0 ? "ALL" : (found ? found.name : "Category");
      }
    }
  }
};
</script>

<style scoped>
.assign_items {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.SearchContainer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  color: white;
  padding: 8px 18px;
}
.SearchContainer h1 {
  margin: 0;
  font-size: 16px;
}
.SearchContainer-left {
  display: flex; 
  gap: 16px;
}
.btn-delete {
  background: none;
  border: none;
  color: #cbd5e1;
  font-size: 16px;
  cursor: pointer;
  padding: 12px;
}
.btn-delete:hover {
  color: #ef4444;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
}
.modal-content {
  background-color: white;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 20px 24px -4px rgba(0, 0, 0, 0.1);
}
.modal-content h2 {
  color: #000000;
  margin-bottom: 16px;
}
.modal-content p {
  margin-bottom: 24px; 
  font-size: 14px; 
  color: #334155;
}
.modal-content p span {
  font-size: 12px; 
  color: #64748b;
}
.modal-info {
  margin-bottom: 8px;
  font-size: 12px;
  color: #64748b;
}
.delete-modal-content {
  width: 600px;
  height: 400px;
  z-index: 15;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  padding: 50px 50px;
  color: #fff;
  background: radial-gradient(ellipse at top left, rgba(251, 251, 251, 0.9), rgba(251, 251, 251, 0.8));
  backdrop-filter: blur(4px);
  gap: 30px;
}
.delete-modal-content h2 {
  color: #666666;
}
.delete-modal-content h4 {
  color: #666666;
  font-size: 16px;
  padding: 50px;
}
.table-container {
  max-height: 50vh; 
  overflow-y: auto;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  margin-bottom: 18px;
}
.item-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  border: 1px solid #e2e8f0;
}
.item-table th {
  position: sticky;
  top: 0;
  background-color:#f8fafc;
  font-weight: bold;
  border-top: 1px solid #e2e8f0;
  border-bottom: 2px solid #cbd5e1;
  padding: 10px;
  text-align: left;
}
.item-table td {
  border-bottom: 1px solid #e2e8f0;
  padding: 10px;
  text-align: left;
  background-color: white;
}
.text-center {
  text-align: center;
  font-size: 14px;
}
.modal-actions {
  display: flex;
  justify-content: center; 
  gap: 16px;
}
.assign-result-container {
  overflow-x: auto;
  border-left: 1px solid #e2e8f0;
  border-right: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-top: 10px;
  flex: 1; 
  background: white; 
}
.assign-result-container table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}
.assign-result-container th {
  background-color:#f8fafc;
  font-weight: bold;
  border-top: 1px solid #e2e8f0;
  border-bottom: 2px solid #cbd5e1;
  padding: 10px;
  white-space: nowrap;
}
.assign-result-container td {
  padding: 8px;
  background-color: white;
  border-bottom: 1px solid #e2e8f0;
}
.loading-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #64748b;
}
.main-layout {
  flex: 1;
  display: flex;
  overflow: hidden;
  margin: 0%;
  padding: 0%;
  flex-direction: row;
  align-items: stretch;
  border: 1px solid #ebebeb;
}
.order-group {
  width: 35%;
  background-color: white;
  display: flex;
  flex-direction: column;
  scrollbar-width: thin;
}
.order-group-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 80px;
  background-color: #ffffff;
  border-bottom: 1px solid #000000;
}
.order-group-header h2 {
  margin: 0;
  padding: 12px;
  font-size: 16px;
  color: #334155;
}
.order-group-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  scrollbar-width: thin;
}
.group-card {
  padding: 10px;
  border: 1px solid #999999;
  border-radius: 12px;
  background-color: white;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  cursor: grab;
  transition: all 0.2s;
}
.group-card:active {
  cursor: grabbing;
}
.group-card:hover {
  border-color: #4c4c4c;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
}
.group-card.is-fulfilled {
  background-color: #f0fdf4;
  border-color: #16a34a;
  opacity: 0.6;
}
.group-name {
  font-weight: bold;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.total-row td {
  border-top: 2px solid #94a3b8;
  background-color: #f1f5f9;    
  color: #0f172a;
}
.request-badge {
  flex: 1;
  min-width: 60px;
  background-color: #f1f5f9;
  padding: 4px;
  border-radius: 4px;
  text-align: center;
  font-size: 12px;
}
.badge-label {
  display: block;
  color: #64748b;
  font-size: 12px;
}
.badge-value {
  font-weight: bold;
  font-size: 12px;
}
.text-success { 
  color: #16a34a; 
  font-weight: bold;
}

.assign-result {
  font-weight: bold;
  font-size: 13px;
  color: #16a34a;
  padding-top: 8px;
  padding-bottom: 4px;
  padding-left: 8px;
}
.assigned {  
  font-size: 12px;
  background-color: #e2e8f0;
  border-radius: 10px;
  padding: 4px 8px;
  color: #000000;
}
.stock-area {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}
.cards {
  padding: 16px;
  scrollbar-width: thin;
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.stock-card {
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 12px;
  border: 1px solid #d1d5db;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
  min-height: 200px;
  flex-shrink: 0;
}
.stock-info {
  padding: 16px;
  border-right: 1px solid #e0e7ff;
  display: flex;
  align-items: flex-start; 
  flex-direction: column; 
  background-color: #EBEBEB;
}
.stock-info h3 {
  margin: 0 0 12px 0;
  color: #000000; 
  font-size: 16px;
}
.stock-info-tables {
  display: flex; 
  gap: 16px; 
  width: 100%;
}
.assignment-list {
  flex: 1;
  background-color: white;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 14px;
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
}
.assignment-item {
  display: flex;
  align-items: center;
  background-color: white;
  padding: 12px;
  border: 1px solid #16a34a;
  border-radius: 8px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
.assign-group-name {
  flex: 1;
  font-weight: bold;
  font-size: 14px;
  color: #1e293b;
  padding-left: 8px;
}
.assign-inputs {
  display: flex;
  gap: 8px;
  margin-right: 12px;
  justify-content: flex-end;
}
.assign-input-group {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.input-label {
  font-size: 13px;
  background-color: #dcfce7; 
  padding: 2px 8px; 
  border-radius: 10px; 
  color: #16a34a; 
  font-weight: bold;
}
.import-source {
  font-size: 11px; 
  font-weight: normal; 
  color: #64748b; 
  margin-top: 4px;
}
.import-source span {
  margin-right: 4px;
}
</style>