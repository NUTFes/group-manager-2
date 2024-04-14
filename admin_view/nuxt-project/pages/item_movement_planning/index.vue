<template>
  <div class="main-content">
    <SubHeader pageTitle="物品移動計画"> </SubHeader>

    <SubSubHeader>
      <template v-slot:refinement>
        <!-- ここで日付を選択 -->
        <SearchDropDown
          :nameList="yearList"
          :on_click="refinementGroups"
          value="year_num"
        >
          {{ refYears }}
        </SearchDropDown>
      </template>
    </SubSubHeader>

    <div class="card-content">
      <Card width="30%">
        <SubHeader pageTitle="物品の在庫と場所"> </SubHeader>
        <Card>
          <SubHeader pageTitle="体育館"> </SubHeader>
          <template>
            <Table>
              <template v-slot:table-header>
                <th v-for="(header, index) in inventory_header" :key="index">
                  {{ header }}
                </th>
              </template>
              <template v-slot:table-body>
                <tr
                  v-for="(item, index) in gym_tableData"
                  :key="`item-${item.id}`"
                >
                  <td>{{ item.itemName }}</td>
                  <td>{{ item.place }}</td>
                  <td>{{ item.quantity }}</td>
                </tr>
              </template>
            </Table>
          </template>
        </Card>
        <Card>
          <SubHeader pageTitle="講義棟"> </SubHeader>
          <template>
            <Table>
              <template v-slot:table-header>
                <th v-for="(header, index) in inventory_header" :key="index">
                  {{ header }}
                </th>
              </template>
              <template v-slot:table-body>
                <tr
                  v-for="(item, index) in lec_tableData"
                  :key="`item-${item.id}`"
                >
                  <td>{{ item.itemName }}</td>
                  <td>{{ item.place }}</td>
                  <td>{{ item.quantity }}</td>
                </tr>
              </template>
            </Table>
          </template>
        </Card>
      </Card>
      <Card width="70%">
        <SubHeader pageTitle="">
          <SubSubHeader>
            <template v-slot:refinement>
              <SearchDropDown
                :nameList="yearList"
                :on_click="refinementGroups"
                value="year_num"
              >
                {{ refYears }}
              </SearchDropDown>
              <SearchDropDown
                :nameList="yearList"
                :on_click="refinementGroups"
                value="year_num"
              >
                {{ refYears }}
              </SearchDropDown>
              <SearchDropDown
                :nameList="yearList"
                :on_click="refinementGroups"
                value="year_num"
              >
                {{ refYears }}
              </SearchDropDown>
              <CommonButton iconName="add_circle" :on_click="openAddModal">
                追加
              </CommonButton>
            </template>
          </SubSubHeader>
        </SubHeader>

        <Card width="100%">
          <SubHeader pageTitle="移動計画作成"></SubHeader>
          <Table>
            <template v-slot:table-header>
              <th v-for="(header, index) in planning_header" :key="index">
                {{ header }}
              </th>
            </template>
            <template v-slot:table-body>
              <tr
                v-for="(item, index) in planning_tableData"
                :key="`item-${item.id}`"
              >
                <td>{{ item.source }}</td>
                <td>{{ item.destination }}</td>
                <td>{{ item.itemName }}</td>
                <td>{{ item.quantity }}</td>
                <td>{{ item.time }}</td>
              </tr>
            </template>
          </Table>
        </Card>
      </Card>

      <!-- 移動計画の追加モーダル -->
      <AddModal
        @clode="closeAddModal"
        v-if="isOpenAddModal"
        title="移動計画の追加"
      >
      </AddModal>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isOpenAddModal: false,

      newPlan: {
        source: "",
        destination: "",
        itemName: "",
        quantity: 0,
        time: "",
      },

      planning_header: ["移動元", "移動先", "物品名", "個数", "時間"],
      inventory_header: ["物品名", "場所", "在庫数"],
      planning_tableData: [
        // 仮のデータ
        {
          id: 1,
          source: "倉庫A",
          destination: "倉庫B",
          itemName: "アイテム1",
          quantity: 10,
          time: "10:00",
        },
        {
          id: 2,
          source: "倉庫C",
          destination: "倉庫D",
          itemName: "アイテム2",
          quantity: 5,
          time: "11:00",
        },
        {
          id: 3,
          source: "倉庫E",
          destination: "倉庫F",
          itemName: "アイテム3",
          quantity: 20,
          time: "12:00",
        },
      ],
      gym_tableData: [
        // 仮のデータ
        {
          id: 1,
          itemName: "長机",
          place: "倉庫A",
          quantity: 10,
        },
        {
          id: 2,
          itemName: "テント",
          place: "倉庫B",
          quantity: 30,
        },
        {
          id: 3,
          itemName: "掲示板",
          place: "倉庫D",
          quantity: 10,
        },
      ],
      lec_tableData: [
        // 仮のデータ
        {
          id: 1,
          itemName: "机",
          place: "教室A",
          quantity: 40,
        },
        {
          id: 2,
          itemName: "椅子",
          place: "教室G",
          quantity: 40,
        },
      ],
    };
  },
  methods: {
    openAddModal() {
      this.isOpenAddModal = true;
    },
    closeAddModal() {
      this.isOpenAddModal = false;
    },
    handleSubmit(newPlan) {
      // ここで新規移動計画の処理を行います
      // 例: API に POST リクエストを送信するなど
      console.log("新規移動計画が送信されました:", newPlan);
      this.closeAddModal();
    },
  },
};
</script>

<style>
.card-content {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 24px;
  align-self: stretch;
}

.form-group {
  margin-bottom: 20px;
}

.label {
  display: block;
  margin-bottom: 8px;
}

.select {
  color: var(--accent-7);
  border: 1px solid var(--accent-5);
  padding: 15px;
  width: 100%;
  transition: all 0.5s 0s ease;
}
</style>
