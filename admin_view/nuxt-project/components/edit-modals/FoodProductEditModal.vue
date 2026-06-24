<template>
  <EditModal @close="$emit('close')" title="販売品申請の編集">
    <template v-slot:form>
      <div>
        <h3>食品名</h3>
        <input v-model="name" placeholder="入力してください" />
      </div>
      <div>
        <h3>調理するか</h3>
        <select v-model="isCooking">
          <option disabled value="">選択してください</option>
          <option
            v-for="isCook in isCookingList"
            :key="isCook.id"
            :value="isCook.value"
          >
            {{ isCook.text }}
          </option>
        </select>
      </div>
      <div>
        <h3>1日目の個数</h3>
        <input v-model="first" type="number" placeholder="入力してください" />
      </div>
      <div>
        <h3>2日目の個数</h3>
        <input v-model="second" type="number" placeholder="入力してください" />
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
    foodProduct: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isCookingList: [
        { id: 1, text: "調理あり", value: true },
        { id: 2, text: "調理なし", value: false },
      ],
      name: "",
      isCooking: null,
      first: null,
      second: null,
    };
  },
  watch: {
    foodProduct: {
      immediate: true,
      handler() {
        const foodProduct = this.getFoodProduct();
        this.name = foodProduct.name || "";
        this.isCooking = foodProduct.is_cooking ?? null;
        this.first = foodProduct.first_day_num ?? null;
        this.second = foodProduct.second_day_num ?? null;
      },
    },
  },
  methods: {
    getFoodProduct() {
      return this.foodProduct?.food_product || this.foodProduct || {};
    },
    async edit() {
      const foodProduct = this.getFoodProduct();
      const name = this.name?.trim();

      if (!foodProduct.group_id) {
        this.$emit("error", "団体情報が取得できませんでした");
        return;
      }

      if (!name) {
        this.$emit("error", "食品名を入力してください");
        return;
      }

      const data = {
        group_id: String(foodProduct.group_id ?? ""),
        name,
        is_cooking: String(this.isCooking ?? ""),
        first_day_num: String(this.first ?? ""),
        second_day_num: String(this.second ?? ""),
      };
      const url = `/food_products/${foodProduct.id}`;

      try {
        const response = await this.$axios.$put(url, data);
        const savedId = response?.data?.id;

        if (typeof savedId === "undefined") {
          console.error("販売品申請の保存レスポンスに id がありませんでした", response);
          this.$emit("error", "保存に失敗しました");
          return;
        }

        this.$emit("saved", savedId);
        this.$emit("close");
      } catch (error) {
        console.error("販売品申請の編集に失敗しました", error);
        this.$emit("error", error?.response?.data?.message || error?.message || "保存に失敗しました");
      }
    },
  },
};
</script>
