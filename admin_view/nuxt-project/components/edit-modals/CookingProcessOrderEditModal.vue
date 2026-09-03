<template>
  <EditModal @close="$emit('close')" title="調理工程申請の編集">
    <template v-slot:form>
      <div>
        <h3>調理場：営業前</h3>
        <div class="radio-group">
          <input
            id="preOpenKitchenYes"
            v-model="pre_open_kitchen"
            type="radio"
            :value="true"
          />
          <label for="preOpenKitchenYes">使用する</label>
        </div>
        <div class="radio-group">
          <input
            id="preOpenKitchenNo"
            v-model="pre_open_kitchen"
            type="radio"
            :value="false"
          />
          <label for="preOpenKitchenNo">使用しない</label>
        </div>
      </div>

      <div>
        <h3>調理場：営業中</h3>
        <div class="radio-group">
          <input
            id="duringOpenKitchenYes"
            v-model="during_open_kitchen"
            type="radio"
            :value="true"
          />
          <label for="duringOpenKitchenYes">使用する</label>
        </div>
        <div class="radio-group">
          <input
            id="duringOpenKitchenNo"
            v-model="during_open_kitchen"
            type="radio"
            :value="false"
          />
          <label for="duringOpenKitchenNo">使用しない</label>
        </div>
      </div>
      <div>
        <h3>調理工程</h3>
        <template v-if="hasTranslatedTent">
          <h4>原文</h4>
          <p style="color: black; white-space: pre-line">{{ tent }}</p>
          <h4>提出文章</h4>
          <textarea
            v-model="tent_ja"
            placeholder="入力してください"
            rows="4"
            style="width: 100%"
          ></textarea>
        </template>
        <template v-else>
          <textarea
            v-model="tent"
            placeholder="入力してください"
            rows="4"
            style="width: 100%"
          ></textarea>
        </template>
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
    cookingProcessOrder: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      food_product_id: null,
      pre_open_kitchen: null,
      during_open_kitchen: null,
      tent: "",
      tent_ja: "",
      hasTranslatedTent: false,
    };
  },
  watch: {
    cookingProcessOrder: {
      immediate: true,
      handler() {
        const cookingProcessOrder = this.getCookingProcessOrder();
        this.food_product_id =
          cookingProcessOrder.food_product_id ||
          this.cookingProcessOrder?.food_product?.id ||
          null;
        this.pre_open_kitchen = cookingProcessOrder.pre_open_kitchen ?? null;
        this.during_open_kitchen =
          cookingProcessOrder.during_open_kitchen ?? null;
        this.tent = cookingProcessOrder.tent || "";
        this.tent_ja = cookingProcessOrder.tent_ja || "";
        this.hasTranslatedTent = Boolean(cookingProcessOrder.tent_ja);
      },
    },
  },
  methods: {
    getCookingProcessOrder() {
      return (
        this.cookingProcessOrder?.cooking_process_order ||
        this.cookingProcessOrder ||
        {}
      );
    },
    async edit() {
      if (
        this.pre_open_kitchen === null ||
        this.during_open_kitchen === null ||
        this.tent === ""
      ) {
        this.$emit("error", "調理工程申請を全て入力してください");
        return;
      }

      const cookingProcessOrder = this.getCookingProcessOrder();
      const cookingProcessOrderData = {
        food_product_id: this.food_product_id,
        pre_open_kitchen: this.pre_open_kitchen,
        during_open_kitchen: this.during_open_kitchen,
        tent: this.tent,
        tent_ja: this.tent_ja,
      };

      try {
        if (
          this.cookingProcessOrder?.cooking_process_order ||
          cookingProcessOrder.id
        ) {
          const editUrl = `/cooking_process_orders/${cookingProcessOrder.id}`;
          await this.$axios.$put(editUrl, {
            cooking_process_order: cookingProcessOrderData,
          });
        } else {
          await this.$axios.$post(`/cooking_process_orders`, {
            cooking_process_order: cookingProcessOrderData,
          });
        }
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message ??
          error?.message ??
          "不明なエラーが発生しました";
        this.$emit("error", `エラーが発生しました: ${errorMessage}`);
        return;
      }

      this.$emit("saved", this.food_product_id);
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
h4 {
  color: var(--accent-5);
}

.radio-group {
  display: flex;
  align-items: center;
  justify-content: left;
  flex-flow: row nowrap;
  width: 500px;
}
</style>
