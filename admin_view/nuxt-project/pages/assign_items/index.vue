<template>
  <div class="assign_items">
    <SubHeader pageTitle="物品割り当て"></SubHeader>
    <div class="SearchContainer">
      <div class="SearchContainer-left">
        <SearchDropDown
        :nameList="yearList"
        :on_click="refinementGroups"
        value="year_num"
        >
        {{ refYears }}
        </SearchDropDown>
      </div>
      <CommonButton class="btn-primary" 
        iconName="edit" :on_click="openModal">
        対象物品を設定
      </CommonButton>
    </div>

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
              <th>選択</th>
              <th>物品名</th>
              <th>標準割り当て</th>
              <th>個数</th>
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
              <td>
                <AssignModeDropDown
                  :nameList="ruleOptions"
                  :on_click="(id) => modalSettings[item.id].rule = id"
                  value="label">
                  {{ modalSettings[item.id].rule === 'fixed' ? '固定値' : '申請数' }}
                </AssignModeDropDown>
              </td>
              <td>
                <input 
                  type="number" 
                  min="0"
                  v-model.number="modalSettings[item.id].fixedValue"
                  :disabled="!modalSettings[item.id].selected || modalSettings[item.id].rule !== 'fixed'"
                  class="num-input"
                >
              </td>
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

     <div v-if="isLoading" class="loading-area">
      <p>読み込み中...</p>
     </div>

    <main v-else class="main-layout">
      <aside class="order-group">
        <div class="order-group-header">
          <div class="SearchContainer">
            <h2>参加団体</h2>
           <SearchDropDown
             :nameList="groupCategories"
             :on_click="refinementGroups"
             value="name"
             >
             {{ refGroupCategories }}
             </SearchDropDown>
          </div>
        </div>
        <div class="order-group-content">
          <div 
            v-for="group in filteredGroups" 
            :key="group.id" 
            draggable="true" 
            @dragstart="handleDragStartGroup($event, group)" 
            class="group-card"
            :class="{ 'is-fulfilled': isGroupFulfilled(group) }"
           >
           <div class="group-name">{{ group.name }}</div>

           <div class="group-requests" v-if="!isGroupFulfilled(group)">
              <div v-for="itemId in activeItemIds" :key="itemId" class="request-badge">
                <span class="badge-label">{{ getItemName(itemId) }}</span>
                <span class="badge-value" :class="getUnassigned(group, itemId) > 0 ? 'text-danger' : 'text-success'">
                  {{ getUnassigned(group, itemId) }}
                </span>
                <span class="badge-total">
                  / {{ group.requests[itemId] || 0 }}
                </span>
              </div>
           </div>
           <div class="group-fulfilled-summary" v-if="getGroupAssignmentDetails(group.id).length > 0">
            <div 
              class="assign-result" 
              @click="toggleDetails(group.id)"
            >
          <span class="assign-result">搬入元内訳</span>
          <span>{{ expandedGroupIds.includes(group.id) ? 'を閉じる' : 'を見る' }}</span>
        </div>
        <div class="assign-result-container">
          <table v-show="expandedGroupIds.includes(group.id)">
            <thead>
              <tr>
                <th>搬入元</th>
                <th v-for="itemId in activeItemIds" :key="itemId">{{ getItemName(itemId) }}</th>
              </tr>
            </thead>
            <tbody class="text-center">
              <tr v-for="info in getGroupAssignmentDetails(group.id)" :key="info.roomName">
                <td>{{ info.roomName }}</td>
                <td class="text-center" v-for="itemId in activeItemIds" :key="itemId">
                  {{ info.counts[itemId] }}
                </td>
              </tr>
            </tbody>
          </table>
          </div>
          </div>
          </div>
        </div>
      </aside>

      <section class="stock-area">
        <div class="order-group-header">
          <h2>割り当て先</h2>
        </div>
      <div class="cards">
        <div 
          v-for="stock in stocks" 
          :key="stock.id" 
          @dragover.prevent 
          @drop="handleDropOnStock($event, stock)" 
          class="stock-card"
        >
          <div class="stock-info">
            <h3>{{ stock.name }}</h3>
            <div class="stock-inventory">
              <div v-for="itemId in activeItemIds" :key="itemId" class="inventory-item">
                <span class="inventory-label">{{ getItemName(itemId) }}</span>
                <span  class = "inventory-value" :class="getRemainingStock(stock, itemId) < 0 ? 'text-danger' : 'text-normal'">
                  {{ getRemainingStock(stock, itemId) }}<span class="inventory-total">/{{ stock.inventory[itemId] || 0 }}</span>
                </span>
              </div>
            </div>
          </div>

          <div class="assignment-list">
            <div v-if="getStockAssignments(stock.id).length === 0" class="empty-state">
              ここにドロップ
            </div>
            <div 
              v-else 
              v-for="assign in getStockAssignments(stock.id)"
              :key="assign.id" 
              class="assignment-item"
            >
              <div class="assign-group-name">{{ getGroupName(assign.groupId) }}</div>
              <div class="assign-inputs">
                <div v-for="itemId in activeItemIds" :key="itemId" class="assign-input-group">
                  <span class="input-label">{{ getItemName(itemId) }}</span>
                  <input
                    type="number"
                    min="0"
                    :value="assign.assigned[itemId] || 0"
                    @blur="updateManualAssign($event, assign, itemId)"
                    @keyup.enter="$event.target.blur()"
                    class="num-input highlight"
                  >
                </div>
                <button class="btn-delete"  @click="openAssignDeleteModal(assign.id)">✕</button>
              </div>
          </div>
        </div>
      </div>
     </div>
     </section>
    </main>

    <DeleteModal
      @close="closeAssignDeleteModal"
      v-if="isOpenAssignDeleteModal && $role(roleID).assign_items.delete"
      title="割当の削除"
    >
      <template v-slot:method>
        <YesButton iconName="delete" :on_click="deleteAssign">はい</YesButton>
        <NoButton iconName="close" :on_click="closeAssignDeleteModal">いいえ</NoButton>
      </template>
    </DeleteModal>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'FestManagerDynamic',
  data() {
    return {
      isLoading: true,
      isModalOpen: false,
      searchText: "",
      items: [],
      groups: [],
      stocks: [],
      assignments: [],
      modalSettings: {},
      activeSettings: {},
      isOpenAssignDeleteModal: false,
      assignRentalItemDeleteId: null,
      yearList: [],
      groupCategories: [],
      refYearID: 0,
      refYears: "Year",
      refCategoryID: 0,
      refGroupCategories: "ALL",
      ruleOptions: [
      { id: 'requested', label: '申請数' },
      { id: 'fixed', label: '固定値' }
      ],
      expandedGroupIds: [],
      oldEditingValue: 0,
    };
  },

 // 初期マスターデータの取得 (年度とカテゴリー)
  async asyncData({ $axios }) {
    const currentYearRes = await $axios.$get("/user_page_settings/1");
    const yearsRes = await $axios.$get("/fes_years");
    const categoryRes = await $axios.$get("/group_categories");

    const currentYearData = yearsRes.data.find(
      (y) => y.id === currentYearRes.data.fes_year_id
    );

    return {
      yearList: yearsRes.data,
      groupCategories: categoryRes.data,
      refYearID: currentYearRes.data.fes_year_id,
      refYears: currentYearData ? currentYearData.year_num : "Year",
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
      );
    },
    filteredGroups() {
      let result = this.groups;

      // カテゴリーIDで絞り込み
      if (this.refCategoryID !== 0) {
         result = result.filter(g => g.group_category_id === this.refCategoryID);
      }

      // 年度IDで絞り込み
      if (this.refYearID !== 0) {
        result = result.filter(g => g.fes_year_id === this.refYearID);
      }

      return result;
  }
  },

  mounted() {
    // ローカルストレージから絞り込み状態を復元
    const storedYearID = localStorage.getItem(this.$route.path + "RefYear");
    if (storedYearID !== null) {
      this.refYearID = Number(storedYearID);
      this.updateFilters(this.refYearID, this.yearList);
    }
    const storedCategoryID = localStorage.getItem(this.$route.path + "RefCategory");
    if (storedCategoryID !== null) {
      this.refCategoryID = Number(storedCategoryID);
      this.updateFilters(this.refCategoryID, this.groupCategories);
    }

    this.fetchDataFromDB();
  },

  methods: {
    async fetchDataFromDB() {
      this.isLoading = true;
      try {
        // 貸出物品の種類
        const itemsRes = await this.$axios.$get('/rental_items');
        this.items = Array.isArray(itemsRes) ? itemsRes : itemsRes.data;

        // モーダルの初期設定
        if (Object.keys(this.modalSettings).length === 0) {
          const settings = {};
          this.items.forEach(item => {
            const isDefault = item.id === 1 || item.id === 3; // 机と椅子
            settings[item.id] = { selected: isDefault, rule: 'requested', fixedValue: 0 };
          });
          this.modalSettings = JSON.parse(JSON.stringify(settings));
          this.activeSettings = JSON.parse(JSON.stringify(settings));
        }

        // 基本データの取得
        const [groupsRes, ordersRes, stockerItemRes, stockerPlaceRes, assignRes, rentableItemRes] = await Promise.all([
          this.$axios.$get('/groups'),
          this.$axios.$get('/rental_orders'),
          this.$axios.$get('/stocker_items'),
          this.$axios.$get('/stocker_places'),
          this.$axios.$get('/assign_rental_items'),
          this.$axios.$get('/rentable_items')
        ]);

        const groupRaw = Array.isArray(groupsRes) ? groupsRes : groupsRes.data;
        const rawOrders = Array.isArray(ordersRes) ? ordersRes : ordersRes.data;
        const stockerItems = Array.isArray(stockerItemRes) ? stockerItemRes : stockerItemRes.data;
        const places = Array.isArray(stockerPlaceRes) ? stockerPlaceRes : stockerPlaceRes.data;
        const assigns = Array.isArray(assignRes) ? assignRes : assignRes.data;
        const rentableItems = Array.isArray(rentableItemRes) ? rentableItemRes : rentableItemRes.data;

        this.groups = this.formatGroups(rawOrders, groupRaw, this.items);
      this.stocks = this.formatStocks(stockerItems, places, this.items);
      this.assignments = this.formatAssignments(assigns, rawOrders, rentableItems, this.items, groupRaw);

    } catch (error) {
      console.error("データの取得に失敗", error);
    } finally {
      this.isLoading = false;
    }
  },

    toggleDetails(groupId) {
      const index = this.expandedGroupIds.indexOf(groupId);
      if (index > -1) {
        // すでに開いている場合は配列から削除（閉じる）
        this.expandedGroupIds.splice(index, 1);
      } else {
        // 閉じている場合は配列に追加（開く）
        this.expandedGroupIds.push(groupId);
      }
    },

     formatGroups(rentalOrders, groups, items) {
       if (!groups || !items) return [];
       const groupMap = {};
       groups.forEach(g => {
        groupMap[g.id] = { 
          id: g.id, 
          name: g.name, 
          group_category_id: g.group_category_id,
          fes_year_id: g.fes_year_id,
          requests: {} };
      });
      (rentalOrders || []).forEach(order => {
         const g = groupMap[order.group_id];
         if (!g) return;
         const itemKey = String(order.rental_item_id);
         g.requests[itemKey] = (g.requests[itemKey] || 0) + order.num;    
      });
      return Object.values(groupMap);
   },

    formatStocks(stockerItems, places, items) {
      const stockMap = {};
      stockerItems.forEach(s => {
        const placeId = s.stocker_place_id;
        if (!stockMap[placeId]) {
          const place = places.find(p => p.id === placeId);
          stockMap[placeId] = { id: placeId, name: place ? place.name : '不明', inventory: {} };
        }
        stockMap[placeId].inventory[s.rental_item_id] = s.num;
      });
      return Object.values(stockMap);
    },

    formatAssignments(assigns, rentalOrders, rentableItems, items, groups) {
      const assignMap = {};
      assigns.forEach(a => {
        
        let groupId = a.group_id;
        let stockId = a.stocker_place_id;
        let itemKey = a.rental_item_id;

        // rental_order 経由の紐付け
        if (!groupId && a.rental_order_id) {
          const order = rentalOrders.find(o => Number(o.id) === Number(a.rental_order_id));
          if (order) groupId = order.group_id;
        }
        // rentable_item 経由の紐付け
        if (!stockId && a.rentable_item_id) {
          const rentable = rentableItems.find(r => Number(r.id) === Number(a.rentable_item_id));
          if (rentable) {
            stockId = rentable.stocker_place_id;
            itemKey = rentable.rental_item_id;
          }
        }

        if (!groupId || !stockId || !itemKey) return;

        const key = `${groupId}_${stockId}`;

        if (!assignMap[key]) {
          const groupInfo = groups.find(g => Number(g.id) === Number(groupId));
          assignMap[key] = { 
            id: key, 
            groupId: Number(groupId), 
            stockId: Number(stockId), 
            groupName: groupInfo ? groupInfo.name : '不明',
            assigned: {},
            dbIds: [] 
          };
        }
        
        // 数量を加算
        assignMap[key].assigned[itemKey] = (assignMap[key].assigned[itemKey] || 0) + Number(a.num || 0);

        if (a.id) {
          assignMap[key].dbIds.push({
            id: a.id,
            itemId: itemKey
          });
        }
      });
      return Object.values(assignMap);
    },

    // ドラッグ＆ドロップと保存処理
    handleDragStartGroup(e, group) {
      e.dataTransfer.setData('type', 'GROUP');
      e.dataTransfer.setData('groupId', group.id);
    },

    async handleDropOnStock(e, stock) {
      const type = e.dataTransfer.getData('type');
      if (type !== 'GROUP') return;
      
      const groupId = e.dataTransfer.getData('groupId');
      const group = this.groups.find(g => g.id === Number(groupId));
      if (!group) return;
      const newAssignment = {
        id: `temp-${Date.now()}`,
        groupId: group.id,
        groupName: group.name,
        stockId: stock.id,
        assigned: {}
      };

      this.activeItemIds.forEach(itemId => {
        const setting = this.activeSettings[itemId];
        const unassigned = this.getUnassigned(group, itemId);
        const currentStock = this.getRemainingStock(stock, itemId);

        if (setting.rule === 'requested') {
          newAssignment.assigned[itemId] = Math.min(unassigned, currentStock);
        } else if (setting.rule === 'fixed') {
          newAssignment.assigned[itemId] = Math.min(setting.fixedValue, currentStock);
        }
      });

      this.items.forEach(item => {
        if (newAssignment.assigned[item.id] === undefined) newAssignment.assigned[item.id] = 0;
      });

      this.assignments.push(newAssignment);

      try {
        const postRequests = this.activeItemIds.map(itemId => {
          const assignedNum = newAssignment.assigned[itemId];
          if (assignedNum > 0) {
            const payload = {
              items: [{ group_id: newAssignment.groupId, num: assignedNum }],
              rentalItemId: Number(itemId),
              stockerPlaceId: newAssignment.stockId
            };
            return this.$axios.$post('/assign_rental_items', payload)
             .then(res => ({ itemId, res: res.data}));
          }
        }).filter(p => p !== undefined);

        // if (postRequests.length === 0) {
        // this.assignments = this.assignments.filter(a => a.id !== newAssignment.id);
        // return;
        // }

                  const results = await Promise.all(postRequests);
              //バックエンドの作成結果からdbIdsを埋める
       newAssignment.dbIds = [];
          results.forEach(({ itemId, res }) => {
            (Array.isArray(res) ? res : [res]).forEach(record => {
              if (record && record.id) {
                newAssignment.dbIds.push({ id: record.id, itemId: Number(itemId) });
              }
            });
          });
        //temp idから確定idに置き換え
       newAssignment.id = `${newAssignment.groupId}_${newAssignment.stockId}`;
      } catch (error) {
        // エラー時は再取得して同期
        await this.fetchDataFromDB();
        this.assignments = this.assignments.filter(a => a.id !== newAssignment.id);
      }
    },
    // 数の手動変更と保存処理
    async updateManualAssign(e, assign, itemId) {
     let newValue = parseInt(e.target.value, 10);
      if (isNaN(newValue) || newValue < 0) {
        newValue = 0;
      }

      const oldValue = assign.assigned[itemId] || 0;
      if (newValue === oldValue) return; // 変更がなければ終了
     
      this.$set(assign.assigned, itemId, newValue);

      // 編集対象のレコード（dbId）を探す
      const dbRecord = assign.dbIds.find(db => Number(db.itemId) === Number(itemId));

      try {
        if (newValue === 0 && dbRecord) {
          // パターンA: 0になったら割り当て解除（DELETE）
          await this.$axios.$delete(`/assign_rental_items/${dbRecord.id}`);
          assign.dbIds = assign.dbIds.filter(db => db.id !== dbRecord.id);

        } else if (dbRecord) {
          // PUT処理
          const putPayload = {
            group_id: assign.groupId,
            num: newValue,
            rental_item_id: Number(itemId),
            stocker_place_id: assign.stockId
          };

          // 🚨 ここで送信直前のデータをブラウザのコンソールで確認！
          console.log("PUT URL ID:", dbRecord.id);
          console.log("PUT Payload:", putPayload);

          await this.$axios.$put(`/assign_rental_items/${dbRecord.id}`, putPayload);

        } else if (!dbRecord && newValue > 0) {
          // これまで0だったところに新規で数を入力した場合（POST）
          const postPayload = {
            items: [{ group_id: assign.groupId, num: newValue }],
            rentalItemId: Number(itemId),
            stockerPlaceId: assign.stockId
          };
          const res = await this.$axios.$post('/assign_rental_items', postPayload);
          
          // 新しく生成された dbId を保存
          const resData = Array.isArray(res.data) ? res.data[0] : res.data;
          if (resData && resData.id) {
            assign.dbIds.push({ id: resData.id, itemId: Number(itemId) });
          }
        }
      } catch (error) {
        console.error("更新エラー詳細:", error.response ? error.response.data : error);
        this.$set(assign.assigned, itemId, oldValue);
        e.target.value = oldValue;
        console.error("数の更新に失敗しました", error);
        // エラー時は画面の表示を元の数字に戻す
        assign.assigned[itemId] = oldValue;
        alert("更新に失敗しました。在庫数の上限を超えていないか等を確認してください。");
      }
    },

    // 削除処理
    async deleteAssign() {
      const targetAssign = this.assignments.find(a => a.id === this.assignRentalItemDeleteId);

      if (targetAssign && targetAssign.dbIds && targetAssign.dbIds.length > 0) {
        const activeIds = this.activeItemIds.map(Number);
        const targetDbItems = targetAssign.dbIds.filter(dbItem => activeIds.includes(Number(dbItem.itemId)));
        const deletePromises = targetDbItems.map(dbItem => 
          this.$axios.$delete("/assign_rental_items/" + dbItem.id)
        );
        // 削除対象のカードのID
        this.assignments = this.assignments.filter(assign => assign.id !== this.assignRentalItemDeleteId);
        
        try {
          await Promise.all(deletePromises);
        } catch (error) {
          console.error("削除に失敗しました", error);
          return;
        }

        activeIds.forEach(itemId => {
          if (targetAssign.assigned[itemId]) {
            targetAssign.assigned[itemId] = 0;
          }
        });
        targetAssign.dbIds = targetAssign.dbIds.filter(dbItem => !activeIds.includes(Number(dbItem.itemId)));

      } else {
        this.assignments = this.assignments.filter(a => a.id !== this.assignRentalItemDeleteId);
      }

      this.closeAssignDeleteModal();
    },
    openAssignDeleteModal(id) {
      this.assignRentalItemDeleteId = id;
      this.isOpenAssignDeleteModal = false;
      this.isOpenAssignDeleteModal = true;
    },
    closeAssignDeleteModal() {
      this.isOpenAssignDeleteModal = false;
    },

    // モーダル制御
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

    // 絞り込み制御
    refinementGroups(item_id, name_list) {
      this.updateFilters(item_id, name_list);
      localStorage.setItem(this.$route.path + "RefYear", this.refYearID);
      localStorage.setItem(this.$route.path + "RefCategory", this.refCategoryID);

      this.fetchDataFromDB(); 
    },

    updateFilters(item_id, name_list) {
      if (name_list.toString() === this.yearList.toString()) {
        this.refYearID = item_id;
        this.refYears = item_id === 0 ? "ALL" : name_list[item_id - 1].year_num;
      } else if (name_list.toString() === this.groupCategories.toString()) {
        this.refCategoryID = item_id;
        this.refGroupCategories = item_id === 0 ? "ALL" : name_list[item_id - 1].name;
      }
    },

    getItemName(itemId) {
      const item = this.items.find(i => i.id === Number(itemId));
      return item ? item.name : '不明';
    },
  getGroupName(groupId) {
      const group = this.groups.find(g => g.id === Number(groupId));
      return group ? group.name : '不明';
    },
    getUsedStock(stockId, itemId) {
      return this.assignments
        .filter(a => a.stockId === Number(stockId))
        .reduce((sum, assign) => sum + (assign.assigned[Number(itemId)] || 0), 0);
    },
    getRemainingStock(stock, itemId) {
      const total = stock.inventory[Number(itemId)] || 0;
      const used = this.getUsedStock(stock.id, Number(itemId));
      return Math.max(total - used);
    },
    getGroupAssignedTotal(groupId, itemId) {
      return this.assignments
        .filter(a => a.groupId === Number(groupId))
        .reduce((sum, assign) => sum + (assign.assigned[Number(itemId)] || 0), 0);
    },
    getUnassigned(group, itemId) {
      const req = group.requests[Number(itemId)] || 0;
      const assigned = this.getGroupAssignedTotal(group.id, Number(itemId));
      return Math.max(0, req - assigned);
    },
    getStockAssignments(stockId) {
      return this.assignments.filter(assign => {
        if (assign.stockId !== stockId) return false;
        
        return true;
      });
    },
    isGroupFulfilled(group) {
     return this.activeItemIds.every(itemId => {
      return this.getUnassigned(group, Number(itemId)) === 0;
     });
    },
    getGroupAssignmentDetails(groupId) {
  // この団体の割り当てデータを抽出
  const groupAllocs = this.assignments.filter(
    (a) => Number(a.groupId) === Number(groupId)
  );

  // 現在選択中の対象物品のIDリスト
  const activeIds = this.activeItemIds.map(Number);

  return groupAllocs.map((alloc) => {
    // 場所の名前を取得
    const place = this.stocks.find(
      (s) => Number(s.id) === Number(alloc.stockId)
    );
    
    // 対象物品のうち、1つでも割り当てがあるかチェック
    const hasAssignment = activeIds.some(itemId => alloc.assigned[itemId] > 0);
    
    // 割り当てが1つもない搬入元は表示しない
    if (!hasAssignment) return null;

    // テーブルのセルに入れるための各物品ごとの割り当て数を取得
    const counts = {};
    activeIds.forEach(itemId => {
      counts[itemId] = alloc.assigned[itemId] || 0;
    });

    return {
      roomName: place ? place.name : '不明',
      counts: counts
    };
  }).filter(a => a !== null);
  },
  },
};
</script>

<style scoped>
/* 全体のリセットとベース設定 */
.assign_items {
  display: flex;
  flex-direction: column;
  height: 100vh;
  z-index: 1;
}

/* ヘッダー */
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

/* ボタン類 */
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

/* モーダル */
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
.modal-info {
  margin-bottom: 8px;
  font-size: 12px;
  color: #64748b;
}

/* スクロールコンテナとテーブル */
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
  justify-content: flex-end;
  gap: 8px;
}
.assign-result-container {
  overflow-x: auto;
  border-left: 1px solid #e2e8f0;
  border-right: 1px solid #e2e8f0;
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

/* 入力フォーム類 */
.num-input {
  width: 60px;
  padding: 4px;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  text-align: right;
}
.num-input.highlight {
  background-color: #eef7d8;
  border-color: #bcd98a;
  font-weight: bold;
}
.num-input:disabled {
  background-color: #f1f5f9;
  color: #94a3b8;
}

/* メインレイアウト */
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

/* 左側：団体 */
.order-group {
  width: 40%;
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
  border-color: #999999;
  opacity: 0.6;
}
.group-name {
  font-weight: bold;
  margin-bottom: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.group-requests {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
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
.badge-total{
  font-size: 12px;
  color: #94a3b8;
}
.text-danger { color: #d33838; }
.text-success { color: #16a34a; }
.text-nomal { color: #333333;}

.assign-result {
  font-weight: bold;
  font-size: 14px;
  color: #16a34a;
  margin-top: 8px;
  margin-bottom: 4px;
}
.assigned {  
  font-size: 14px;
  background-color: #f1f5f9;
  border: 2px solid #16a34a;
  border-radius: 4px;
  padding: 8px;
  margin: 8px;
}

/* 右側：在庫エリア */
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
  gap: 12px;
}
.stock-card {
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 12px;
  border: 1px solid #999999;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  height: auto;
}
.stock-info {
  width: 100%;
  background-color: #ebebeb;
  padding: 12px;
  border-right: 1px solid #e0e7ff;
  border-radius: 12px 12px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.stock-info h3 {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #333333;
}
.stock-inventory {
  display: flex;
  flex-direction: row;
  gap: 12px;
}
.inventory-item {
  display : flex;
  flex: 1;
  flex-direction: column;
  flex-wrap: wrap;
  max-width: 300px;
  text-align: center;
  background-color: white;
  padding: 4px 12px;
  border: 1px solid #e0e7ff;
  border-radius: 4px;
  font-size: 12px;
}
.inventory-room-name {
  font-weight: bold;
  font-size: 12px;
}
.inventory-label { color: #333333; font-size: 14px; }
.inventory-value { font-weight: bold; }
.inventory-total { color: #94a3b8; font-size: 12px; font-weight: normal; }

/* 割り当てリスト */
.assignment-list {
  flex: 1;
  background-color: white;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-radius: 12px;
}
.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 12px;
  border: 2px dashed #cbd5e1;
  border-radius: 4px;
}
.assignment-item {
  display: flex;
  align-items: center;
  background-color: white;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
.assign-group-name {
  flex: 1;
  font-weight: bold;
  font-size: 14px;
  color: #1e293b;
  padding-left: 12px;
}
.assign-inputs {
  display: flex;
  flex: 1;
  gap: 8px;
  margin-right: 12px;
  justify-content: flex-end;
}
.assign-input-group {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.input-label {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 4px;
}
</style>