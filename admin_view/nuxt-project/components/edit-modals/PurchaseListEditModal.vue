<template>
  <EditModal @close="$emit('close')" title="購入品申請の編集">
    <template v-slot:form>
      <div>
        <h3>品名</h3>
        <input v-model="items" placeholder="入力してください" />
      </div>
      <div>
        <h3>購入店</h3>
        <select v-model="shopID">
          <option disabled value="">選択してください</option>
          <option v-for="list in shopList" :key="list.id" :value="list.id">
            {{ list.name }}
          </option>
        </select>
      </div>
      <div>
        <h3>購入日</h3>
        <input v-model="purchase_date" placeholder="入力してください" />
      </div>
      <div>
        <h3>なまものか</h3>
        <select v-model="isFresh">
          <option disabled value="">選択してください</option>
          <option
            v-for="list in isFreshList"
            :key="list.id"
            :value="list.value"
          >
            {{ list.text }}
          </option>
        </select>
      </div>
      <div>
        <h3>ネットで買った場合はURLを記入してください</h3>
        <input v-model="url" placeholder="入力してください" />
      </div>
      <div>
        <h3>備考</h3>
        <input v-model="remark" placeholder="入力してください" />
      </div>
    </template>
    <template v-slot:method>
      <CommonButton iconName="edit" :on_click="edit">編集</CommonButton>
    </template>
  </EditModal>
</template>

<script>
import { saveEditModal } from "~/utils/edit-modal-save";

export default {
  props: {
    purchaseList: {
      type: Object,
      required: true,
    },
    shops: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      isFreshList: [
        { id: 1, text: "はい", value: true },
        { id: 2, text: "いいえ", value: false },
      ],
      shopList: [],
      items: null,
      shopID: "",
      isFresh: "",
      purchase_date: null,
      url: null,
      remark: null,
    };
  },
  watch: {
    purchaseList: {
      immediate: true,
      handler() {
        const purchaseList = this.getPurchaseList();
        this.items = purchaseList.items || null;
        this.shopID = purchaseList.shop_id || "";
        this.isFresh = purchaseList.is_fresh ?? "";
        this.purchase_date = purchaseList.purchase_date || null;
        this.url = purchaseList.url || null;
        this.remark = purchaseList.remark || null;
      },
    },
    shops: {
      immediate: true,
      handler(value) {
        this.shopList = value;
      },
    },
  },
  mounted() {
    if (this.shopList.length === 0) {
      this.fetchShops();
    }
  },
  methods: {
    getPurchaseList() {
      return this.purchaseList?.purchase_list || this.purchaseList || {};
    },
    async fetchShops() {
      const res = await this.$axios.$get("/shops");
      this.shopList = res.data || [];
    },
    async edit() {
      const purchaseList = this.getPurchaseList();
      const data = {
        food_product_id: String(purchaseList.food_product_id ?? ""),
        shop_id: String(this.shopID ?? ""),
        purchase_date: String(this.purchase_date ?? ""),
        items: String(this.items ?? ""),
        is_fresh: String(this.isFresh ?? ""),
        url: String(this.url ?? ""),
        remark: String(this.remark ?? ""),
      };
      await saveEditModal({
        emit: this.$emit.bind(this),
        label: "購入品申請",
        request: () =>
          purchaseList.id
            ? this.$axios.$put(`/purchase_lists/${purchaseList.id}`, data)
            : this.$axios.$post(`/purchase_lists`, data),
      });
    },
  },
};
</script>
