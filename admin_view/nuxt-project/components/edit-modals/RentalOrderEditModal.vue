<template>
  <EditModal @close="$emit('close')" title="物品申請の編集">
    <template v-slot:form>
      <div>
        <h3>物品</h3>
        <select v-model="rentalItemID">
          <option disabled value="">選択してください</option>
          <option v-for="item in rentableItemList" :key="item.id" :value="item.id">
            {{ item.name }}
          </option>
        </select>
      </div>
      <div>
        <h3>個数</h3>
        <input v-model="num" type="number" placeholder="入力してください" />
      </div>
    </template>
    <template v-slot:method>
      <CommonButton iconName="edit" :on_click="edit">編集</CommonButton>
    </template>
  </EditModal>
</template>

<script>
export default {
  props: {
    rentalOrder: {
      type: Object,
      required: true,
    },
    rentalItems: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      rentalItemID: null,
      num: null,
      rentableItemList: [],
    };
  },
  watch: {
    rentalOrder: {
      immediate: true,
      handler() {
        const rentalOrder = this.getRentalOrder();
        this.rentalItemID = rentalOrder.rental_item_id ?? null;
        this.num = rentalOrder.num ?? null;
      },
    },
    rentalItems: {
      immediate: true,
      handler(value) {
        this.rentableItemList = value;
      },
    },
  },
  mounted() {
    if (this.rentableItemList.length === 0) {
      this.fetchRentableItems();
    }
  },
  methods: {
    getRentalOrder() {
      return this.rentalOrder?.rental_item?.rental_item || this.rentalOrder?.rental_item || this.rentalOrder?.rental_order || this.rentalOrder || {};
    },
    async fetchRentableItems() {
      const resRentableItems = await this.$axios.$get("/api/v1/get_all_rentable_items");
      this.rentableItemList = resRentableItems.data || [];
    },
    async edit() {
      const rentalOrder = this.getRentalOrder();
      const groupId = rentalOrder.group_id || this.$route.params.id;
      const url =
        "/rental_orders/" +
        rentalOrder.id +
        "?group_id=" +
        groupId +
        "&rental_item_id=" +
        this.rentalItemID +
        "&num=" +
        this.num;

      try {
        await this.$axios.$put(url);
        this.$emit("saved", ro.id);
        this.$emit("close");
      } catch (e) {
        // TODO: surface error to user (e.g. emit an "error" event or show a snackbar)
        console.error("物品申請の編集に失敗しました", e);
      }
    },
  },
};
</script>
