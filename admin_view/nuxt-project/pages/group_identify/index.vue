<template>
  <div class="main-content" v-if="this.$role(roleID).group_identify.read">
    <SubHeader pageTitle="識別番号" />
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
          :nameList="groupCategories"
          :on_click="refinementGroups"
          value="name"
        >
          {{ refGroupCategories }}
        </SearchDropDown>
      </template>
    </SubSubHeader>
    <Card width="100%">
      <Table>
        <template v-slot:table-header>
          <th v-for="(header, index) in headers" v-bind:key="index">
            {{ header }}
          </th>
        </template>
        <template v-slot:table-body>
          <tr
            v-for="gi in groupIdentifications"
            :key="gi.id"
            @click="openAddModal(gi.id, gi.group_id, gi.name, gi.number)"
          >
            <td>{{ gi.group_id }}</td>
            <td>{{ gi.name }}</td>
            <td>{{ gi.group_category }}</td>
            <td>{{ gi.number }}</td>
            <td>{{ gi.place }}</td>
            <td>{{ gi.stage }}</td>
            <td>{{ gi.created_at | formatDate }}</td>
            <td>{{ gi.updated_at | formatDate }}</td>
          </tr>
        </template>
      </Table>
    </Card>
    <AddModal @close="closeAddModal" v-if="isAddModal" title="識別番号の設定">
      <template v-slot:form>
        <span style="color: #333"
          ><b>{{ targetGroupName }}</b> の識別番号の設定</span
        >
        <div>
          <h3>識別番号</h3>
          <input v-model="num" type="number" placeholder="入力してください" />
        </div>
      </template>
      <template v-slot:method>
        <CommonButton
          v-if="num != null"
          iconName="add_circle"
          :on_click="submit"
          >登録</CommonButton
        >
      </template>
    </AddModal>
    <AddModal @close="closeAddModal" v-if="isEditModal" title="識別番号の編集">
      <template v-slot:form>
        <span style="color: #333"
          ><b>{{ targetGroupName }}</b> の識別番号の編集</span
        >
        <div>
          <h3>識別番号</h3>
          <input v-model="num" type="number" placeholder="入力してください" />
        </div>
      </template>
      <template v-slot:method>
        <CommonButton v-if="num != null" iconName="edit" :on_click="edit"
          >修正</CommonButton
        >
      </template>
    </AddModal>
  </div>
  <h1 v-else>閲覧権限がありません</h1>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      headers:["参加団体ID", "団体名", "カテゴリ", "識別番号", "会場", "ステージ", "登録日時", "編集日時"],
      groupCategories: [],
      num: null,
      isAddModal: false,
      isEditModal: false,
      targetId: null,
      targetGroupId: null,
      targetGroupName: null,
      groupIdentifications: null,
      yearList: null,
      refYearID: null,
      refYears: null,
      refGroupCategories: "Categories",
      refCategoryID: 0,
    };
  },
  async asyncData({ $axios }) {
    const currentYearUrl = "/user_page_settings/1";
    const currentYearRes = await $axios.$get(currentYearUrl);
    const groupCategoryRes = await $axios.$get('group_categories');
    const url =
      "/group_identification?fes_year_id=" +
      currentYearRes.data.fes_year_id +
      "&group_category_id=0";
    const groupRes = await $axios.$get(url);
    const yearsUrl = "/fes_years";
    const yearsRes = await $axios.$get(yearsUrl);
    const currentYears = yearsRes.data.filter(function (element) {
      return element.id == currentYearRes.data.fes_year_id;
    });
    return {
      groupIdentifications: groupRes.data,
      yearList: yearsRes.data,
      groupCategories: groupCategoryRes.data,
      refYearID: currentYearRes.data.fes_year_id,
      refYears: currentYears[0].year_num,
    };
  },
  computed: {
    ...mapState({
      roleID: (state) => state.users.role,
    }),
    mounted() {
      window.addEventListener('scroll', this.saveScrollPosition);
      
      const storedYearID = localStorage.getItem(this.$route.path + 'RefYear');
      if (storedYearID) {
        this.refYearID = Number(storedYearID);
        this.updateFilters(this.refYearID, this.yearList);
      } else {
        this.refYears = 'Year';
      }
  
      const storedCategoryID = localStorage.getItem(this.$route.path + 'RefCategory');
      if (storedCategoryID) {
        this.refCategoryID = Number(storedCategoryID);
        this.updateFilters(this.refCategoryID, this.groupCategories);
      } else {
        this.refGroupCategories = 'Category';
      }
      this.fetchFilteredData();
    },
  },
  methods: {
    saveScrollPosition() {
      localStorage.setItem(
        "scrollPosition-" + this.$route.path,
        window.scrollY
      );
    },

    openAddModal(id, groupId, name, number) {
      this.targetId = id;
      this.targetGroupId = groupId;
      this.targetGroupName = name;
      this.num = number;
      if (number === null) {
        this.isAddModal = true;
      } else {
        this.isEditModal = true;
      }
    },
    closeAddModal() {
      this.isAddModal = false;
      this.isEditModal = false;
    },
    reload() {
      const url =
        "/group_identification?fes_year_id=" +
        this.refYearID +
        "&group_category_id=0";
      this.$axios.$get(url).then((res) => {
        this.groupIdentifications = res.data;
      });
    },
    submit() {
      const url =
        "/group_identification?group_id=" +
        this.targetGroupId +
        "&number=" +
        this.num;
      this.$axios.$post(url).then(() => {
        this.reload();
        this.closeAddModal();
        this.targetGroupId = null;
        this.targetGroupName = null;
      });
    },
    edit() {
      const url =
        "/group_identification/" +
        this.targetId +
        "?group_id=" +
        this.targetGroupId +
        "&number=" +
        this.num;
      this.$axios.$put(url).then(() => {
        this.reload();
        this.closeAddModal();
        this.targetGroupId = null;
        this.targetGroupName = null;
      });
    },
    async refinementGroups(item_id, name_list) {
      this.updateFilters(item_id, name_list);
      localStorage.setItem(this.$route.path + "RefYear", this.refYearID);
      localStorage.setItem(
        this.$route.path + "RefCategory",
        this.refCategoryID
      );
      this.fetchFilteredData();
    },
    updateFilters(item_id, name_list) {
      // fes_yearで絞り込むとき
      if (name_list.toString() == this.yearList.toString()) {
        this.refYearID = item_id;
        // ALLの時
        if (item_id == 0) {
          this.refYears = "ALL";
        } else {
          this.refYears = name_list[item_id - 1].year_num;
        }
        // group_categoryで絞り込むとき
      } else if (name_list.toString() == this.groupCategories.toString()) {
        this.refCategoryID = item_id;
        // ALLの時
        if (item_id == 0) {
          this.refGroupCategories = "ALL";
        } else {
          this.refGroupCategories = name_list[item_id - 1].name;
        }
      }
    },
    async fetchFilteredData() {
      this.groupIdentifications = [];
      const refUrl =
        "/group_identification?fes_year_id=" +
        this.refYearID +
        "&group_category_id=" +
        this.refCategoryID;
      console.log(refUrl);
      const refRes = await this.$axios.$get(refUrl);
      for (const res of refRes.data) {
        this.groupIdentifications.push(res);
      }
      this.$nextTick(() => {
        window.scrollTo(
          0,
          parseInt(localStorage.getItem("scrollPosition-" + this.$route.path))
        );
      });
    },
  },
};
</script>
