<template>
  <div class="main-content" v-if="this.$role(roleID).rental_items.read">
    <SubHeader pageTitle="物品一覧">
      <CommonButton
        v-if="this.$role(roleID).rental_items.create"
        iconName="add_circle"
        :on_click="openAddModal"
      >
        追加
      </CommonButton>
    </SubHeader>
    <Card width="100%">
      <Table>
        <template v-slot:table-header>
          <th v-for="(header, index) in headers" v-bind:key="index">
            {{ header }}
          </th>
        </template>
        <template v-slot:table-body>
          <tr
            v-for="(rentalItem, index) in rentalItems"
            @click="
              () =>
                $router.push({
                  path: `/rental_items/` + rentalItem.id,
                })
            "
            :key="index"
          >
            <td>{{ rentalItem.id }}</td>
            <td>{{ rentalItem.name }}</td>
            <td>{{ rentalItem.is_inside_shop_rentable }}</td>
            <td>{{ rentalItem.is_outside_shop_rentable }}</td>
            <td>{{ rentalItem.is_stage_rentable }}</td>
          </tr>
        </template>
      </Table>
    </Card>

    <AddModal @close="closeAddModal" v-if="isOpenAddModal" title="物品の追加">
      <template v-slot:form>
        <div>
          <h3>物品名</h3>
          <input v-model="name" placeholder="入力してください" />
        </div>
        <div>
          <h3>屋内模擬店貸出可否</h3>
          <select v-model="isInsideShopRentable">
            <option disabled value="">選択してください</option>
            <option v-for="r in isRentableList" :key="r" :value="r.value">
              {{ r.text }}
            </option>
          </select>
        </div>
        <div>
          <h3>屋外模擬店貸出可否</h3>
          <select v-model="isOutsideShopRentable">
            <option disabled value="">選択してください</option>
            <option v-for="r in isRentableList" :key="r" :value="r.value">
              {{ r.text }}
            </option>
          </select>
        </div>
        <div>
          <h3>ステージ貸出可否</h3>
          <select v-model="isStageRentable">
            <option disabled value="">選択してください</option>
            <option v-for="r in isRentableList" :key="r" :value="r.value">
              {{ r.text }}
            </option>
          </select>
        </div>
      </template>
      <template v-slot:method>
        <CommonButton iconName="add_circle" :on_click="submit"
          >登録</CommonButton
        >
      </template>
    </AddModal>
    <SnackBar v-if="isOpenSnackBar" @close="closeSnackBar">
      {{ message }}
    </SnackBar>
  </div>
  <h1 v-else>閲覧権限がありません</h1>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      headers: [
        "ID",
        "名前",
        "屋内模擬店貸出",
        "屋外模擬店貸出",
        "ステージ貸出",
      ],
      isRentableList: [
        { text: "貸出可能", value: true },
        { text: "貸出不可能", value: false },
      ],
      isOpenAddModal: false,
      isOpenSnackBar: false,
      name: "",
    };
  },
  async asyncData({ $axios }) {
    const url = "/rental_items";
    const rentalItemsRes = await $axios.$get(url);
    const yearsUrl = "/fes_years";
    const yearsRes = await $axios.$get(yearsUrl);
    return {
      rentalItems: rentalItemsRes.data,
      yearList: yearsRes.data,
    };
  },
  computed: {
    ...mapState({
      roleID: (state) => state.users.role,
    }),
  },
  mounted() {
    window.addEventListener('scroll', this.saveScrollPosition);
    this.$nextTick(() => {
      window.scrollTo(0, parseInt(localStorage.getItem('scrollPosition-' + this.$route.path)))
    });
  },
  methods: {
    saveScrollPosition() {
      localStorage.setItem('scrollPosition-' + this.$route.path, window.scrollY);
    },
    openAddModal() {
      this.isOpenAddModal = false;
      this.isOpenAddModal = true;
    },
    closeAddModal() {
      this.isOpenAddModal = false;
    },
    openSnackBar(message) {
      this.message = message;
      this.isOpenSnackBar = true;
      setTimeout(this.closeSnackBar, 2000);
    },
    closeSnackBar() {
      this.isOpenSnackBar = false;
    },
    reload(id) {
      const url = "/rental_items/" + id;
      this.$axios.$get(url).then((response) => {
        this.rentalItems.push(response.data);
      });
    },
    async submit() {
      const url =
        "/rental_items/" +
        "?name=" +
        this.name +
        "&is_inside_shop_rentable=" +
        this.isInsideShopRentable +
        "&is_outside_shop_rentable=" +
        this.isOutsideShopRentable +
        "&is_stage_rentable=" +
        this.isStageRentable;

      this.$axios.$post(url).then((response) => {
        this.openSnackBar(response.data.name + "を追加しました");
        this.name = "";
        this.isInsideShopRentable = "";
        this.isOutsideShopRentable = "";
        this.isStageRentable = "";
        this.reload(response.data.id);
        this.closeAddModal();
      });
    },
  },
};
</script>
