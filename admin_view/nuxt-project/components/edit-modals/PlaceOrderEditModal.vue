<template>
  <EditModal @close="$emit('close')" title="会場申請の編集">
    <template v-slot:form>
      <div>
        <h3>第1希望 (会場ID)</h3>
        <input v-model="first" type="number" placeholder="入力してください" />
      </div>
      <div>
        <h3>第2希望 (会場ID)</h3>
        <input v-model="second" type="number" placeholder="入力してください" />
      </div>
      <div>
        <h3>第3希望 (会場ID)</h3>
        <input v-model="third" type="number" placeholder="入力してください" />
      </div>
      <div>
        <h3>備考</h3>
        <input v-model="remark" placeholder="入力してください" />
      </div>
    </template>
    <template v-slot:method>
      <CommonButton iconName="edit" :on_click="edit">登録</CommonButton>
    </template>
  </EditModal>
</template>

<script>
export default {
  props: {
    placeOrder: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      groupId: null,
      first: null,
      second: null,
      third: null,
      remark: null,
    };
  },
  watch: {
    placeOrder: {
      immediate: true,
      handler() {
        const po = this.getPlaceOrder();
        this.groupId = po.group_id || this.$route.params.id;
        this.first = po.first || null;
        this.second = po.second || null;
        this.third = po.third || null;
        this.remark = po.remark || null;
      },
    },
  },
  methods: {
    getPlaceOrder() {
      return (
        this.placeOrder?.place_order?.place_order ||
        this.placeOrder?.place_order ||
        this.placeOrder ||
        {}
      );
    },
    async edit() {
      const po = this.getPlaceOrder();
      const data = {
        group_id: String(this.groupId ?? this.$route.params.id),
        first: String(this.first ?? ""),
        second: String(this.second ?? ""),
        third: String(this.third ?? ""),
        remark: this.remark ?? "",
      };
      const url = `/place_orders/${po.id}`;

      await this.$axios.$put(url, data).then(() => {
        this.$emit("saved", po.id);
        this.$emit("close");
      });
    },
  },
};
</script>
