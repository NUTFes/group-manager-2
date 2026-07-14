<template>
  <EditModal @close="$emit('close')" title="火気設備申請の編集">
    <template v-slot:form>
      <div>
        <h3>火気設備名</h3>
        <input v-model="name" placeholder="入力してください" />
      </div>
      <div>
        <h3>数量</h3>
        <input
          v-model="quantity"
          type="number"
          placeholder="入力してください"
        />
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
        const fire_equipment_order = this.getFireEquipmentOrder();
        this.groupId = fire_equipment_order.group_id || this.$route.params.id;
        this.name = fire_equipment_order.name || null;
        this.quantity = fire_equipment_order.quantity || null;

        let fuelVal = 0;
        if (
          fire_equipment_order.fuel === "gas_bottle" ||
          fire_equipment_order.fuel === 1
        ) {
          fuelVal = 1;
        } else if (
          fire_equipment_order.fuel === "lp_gas" ||
          fire_equipment_order.fuel === 2
        ) {
          fuelVal = 2;
        } else if (
          fire_equipment_order.fuel === "charcoal" ||
          fire_equipment_order.fuel === 3
        ) {
          fuelVal = 3;
        }
        this.fuel = fuelVal;

        this.usage = fire_equipment_order.usage || null;
        this.isTakeaway = fire_equipment_order.is_takeaway ?? false;
        this.remark = fire_equipment_order.remark || null;
      },
    },
  },
  methods: {
    getFireEquipmentOrder() {
      return (
        this.fireEquipmentOrder?.fire_equipment_order ||
        this.fireEquipmentOrder ||
        {}
      );
    },
    async edit() {
      const fire_equipment_order = this.getFireEquipmentOrder();
      const data = {
        group_id: String(this.groupId ?? this.$route.params.id),
        name: this.name ?? "",
        quantity: String(this.quantity ?? ""),
        fuel: String(this.fuel ?? ""),
        usage: this.usage ?? "",
        is_takeaway: String(this.isTakeaway),
        remark: this.remark ?? "",
      };
      try {
        const response = fire_equipment_order.id
          ? await this.$axios.$put(
              `/api/v1/fire_equipment_orders/${fire_equipment_order.id}`,
              data
            )
          : await this.$axios.$post(`/api/v1/fire_equipment_orders`, data);
        const savedId = response?.data?.id;

        if (typeof savedId === "undefined") {
          console.error("火気設備申請の保存レスポンスに id がありませんでした", response);
          this.$emit("error", "保存に失敗しました");
          return;
        }

        this.$emit("saved", savedId);
        this.$emit("close");
      } catch (error) {
        console.error("火気設備申請の編集に失敗しました", error);
        this.$emit("error", error?.response?.data?.message || error?.message || "保存に失敗しました");
      }
    },
  },
};
</script>
