<template>
  <EditModal @close="$emit('close')" title="火気設備申請の編集">
    <template v-slot:form>
      <div>
        <h3>火気設備名</h3>
        <input v-model="name" placeholder="入力してください" />
      </div>
      <div>
        <h3>数量</h3>
        <input v-model="quantity" type="number" placeholder="入力してください" />
      </div>
      <div>
        <h3>燃料 (1:ガスボンベ, 2:LPガス, 3:炭)</h3>
        <select v-model="fuel">
          <option :value="1">ガスボンベ</option>
          <option :value="2">LPガス</option>
          <option :value="3">炭</option>
          <option :value="0">その他</option>
        </select>
      </div>
      <div>
        <h3>使用目的</h3>
        <input v-model="usage" placeholder="入力してください" />
      </div>
      <div>
        <h3>持ち帰り</h3>
        <select v-model="isTakeaway">
          <option :value="true">〇</option>
          <option :value="false">×</option>
        </select>
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
    fireEquipmentOrder: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      groupId: null,
      name: null,
      quantity: null,
      fuel: null,
      usage: null,
      isTakeaway: false,
      remark: null,
    };
  },
  watch: {
    fireEquipmentOrder: {
      immediate: true,
      handler() {
        const feo = this.getFireEquipmentOrder();
        this.groupId = feo.group_id || this.$route.params.id;
        this.name = feo.name || null;
        this.quantity = feo.quantity || null;
        
        let fuelVal = 0;
        if (feo.fuel === "gas_bottle" || feo.fuel === 1) fuelVal = 1;
        else if (feo.fuel === "lp_gas" || feo.fuel === 2) fuelVal = 2;
        else if (feo.fuel === "charcoal" || feo.fuel === 3) fuelVal = 3;
        this.fuel = fuelVal;

        this.usage = feo.usage || null;
        this.isTakeaway = feo.is_takeaway ?? false;
        this.remark = feo.remark || null;
      },
    },
  },
  methods: {
    getFireEquipmentOrder() {
      return this.fireEquipmentOrder?.fire_equipment_order || this.fireEquipmentOrder || {};
    },
    async edit() {
      const feo = this.getFireEquipmentOrder();
      const params = new URLSearchParams({
        group_id: String(this.groupId ?? this.$route.params.id),
        name: this.name ?? "",
        quantity: String(this.quantity ?? ""),
        fuel: String(this.fuel ?? ""),
        usage: this.usage ?? "",
        is_takeaway: String(this.isTakeaway),
        remark: this.remark ?? "",
      });
      const url = `/fire_equipment_orders/${feo.id}?${params.toString()}`;

      await this.$axios.$put(url).then(() => {
        this.$emit("saved", feo.id);
        this.$emit("close");
      });
    },
  },
};
</script>
