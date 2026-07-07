<template>
  <EditModal @close="$emit('close')" title="電力申請の編集">
    <template v-slot:form>
      <div>
        <h3>製品名</h3>
        <input v-model="item" placeholder="入力してください" />
      </div>
      <div>
        <h3>電力(W)</h3>
        <input v-model="power" type="number" placeholder="入力してください" />
      </div>
      <div>
        <h3>メーカー</h3>
        <input v-model="manufacturer" placeholder="入力してください" />
      </div>
      <div>
        <h3>型番</h3>
        <input v-model="model" placeholder="入力してください" />
      </div>
      <div>
        <h3>URL</h3>
        <input v-model="itemUrl" placeholder="入力してください" />
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
    powerOrder: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      groupId: null,
      item: null,
      power: null,
      manufacturer: null,
      model: null,
      itemUrl: null,
    };
  },
  watch: {
    powerOrder: {
      immediate: true,
      handler() {
        const po = this.getPowerOrder();
        this.groupId = po.group_id || this.$route.params.id;
        this.item = po.item || null;
        this.power = po.power || null;
        this.manufacturer = po.manufacturer || null;
        this.model = po.model || null;
        this.itemUrl = po.item_url || null;
      },
    },
  },
  methods: {
    getPowerOrder() {
      return this.powerOrder?.power_order || this.powerOrder || {};
    },
    async edit() {
      const po = this.getPowerOrder();
      const data = {
        group_id: String(this.groupId ?? this.$route.params.id),
        item: this.item ?? "",
        power: String(this.power ?? ""),
        manufacturer: this.manufacturer ?? "",
        model: this.model ?? "",
        item_url: this.itemUrl ?? "",
      };
      const url = `/api/v1/admin/power_orders/${po.id}`;

      await this.$axios.$put(url, data).then(() => {
        this.$emit("saved", po.id);
        this.$emit("close");
      });
    },
  },
};
</script>
