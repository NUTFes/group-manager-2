<script lang="ts" setup>
import { useField, useForm } from "vee-validate";
import { editFoodSchema } from "~/utils/validate";
const config = useRuntimeConfig();

const { meta, isSubmitting } = useForm({
  validationSchema: editFoodSchema,
});
const { handleChange: handleDishName, errorMessage: dishNameError } =
  useField("dishName");
const { handleChange: handleNumFirstDay, errorMessage: numFirstDayError } =
  useField("numFirstDay");
const { handleChange: handleNumSecondDay, errorMessage: numSecondDayError } =
  useField("numSecondDay");

interface Props {
  groupId: number | null;
  groupCategoryId: number;
}
const props = withDefaults(defineProps<Props>(), {
  groupId: null,
});

interface Emits {
  (e: "update:addFood", isAddFood: boolean): void;
  (e: "reloadFood", reload: null): void;
}
const emits = defineEmits<Emits>();

const dishName = ref<string>("");
const numFirstDay = ref<number | null>(null);
const numSecondDay = ref<number | null>(null);
const isCooking = ref<boolean>(false);

const addFoodClose = () => {
  emits("update:addFood", false);
};
const reloadFood = () => {
  emits("reloadFood", null);
};

const addFood = async () => {
  await useFetch(config.APIURL + "/food_products", {
    method: "POST",
    params: {
      group_id: props.groupId,
      is_cooking: isCooking.value,
      name: dishName.value,
      first_day_num: numFirstDay.value,
      second_day_num: numSecondDay.value,
    },
  });
  reloadFood();
  addFoodClose();
};

const reset = () => {
  dishName.value = "";
  numFirstDay.value = null;
  numSecondDay.value = null;
  isCooking.value = false;
  handleDishName(dishName.value);
  handleNumFirstDay(numFirstDay.value);
  handleNumSecondDay(numSecondDay.value);
};
</script>

<template>
  <Modal
    :title=" $t('Product.addProduct') "
  >
    <template #close>
      <div class="flex justify-end">
        <button
          @click="addFoodClose()"
          class="hover:text-black hover:opacity-75"
        >
          ✖
        </button>
      </div>
    </template>
    <template #form>
      <div class="text">
        {{  $t("Product.name") }}
      </div>
      <input
        class="entry"
        v-model="dishName"
        @change="handleDishName"
        :class="{ error_border: dishNameError }"
      />
      <div class="error_msg">{{ dishNameError }}</div>
      <div v-if="groupCategoryId === 1">
        <div class="text">{{ $t("Product.cook") }}</div>
        <select class="entry" v-model="isCooking">
          <option value="" disabled selected>{{ $t("Product.select") }}</option>
          <option value="true">{{ $t("Product.yes") }}</option>
          <option value="false">{{ $t("Product.no") }}</option>
        </select>
      </div>
      <div class="text">{{ $t("Product.numberFirstDay") }}</div>
      <input
        type="number"
        class="entry"
        v-model="numFirstDay"
        @change="handleNumFirstDay"
        :class="{ error_border: numFirstDayError }"
      />
      <div class="error_msg">{{ numFirstDayError }}</div>
      <div class="text">{{ $t("Product.numberSecondDay") }}</div>
      <input
        type="number"
        class="entry"
        v-model="numSecondDay"
        @change="handleNumSecondDay"
        :class="{ error_border: numSecondDayError }"
      />
      <div class="error_msg">{{ numSecondDayError }}</div>
      <div class="flex justify-between mt-8 mx-8">
        <RegistPageButton :text="$t('Button.reset')" @click="reset()" />
        <RegistPageButton
          :disabled="!meta.valid || isSubmitting"
          :text="$t('Button.add')"
          @click="addFood()"
        />
      </div>
    </template>
  </Modal>
</template>

<style scoped>
.error_msg {
  @apply mx-[10%] text-rose-600;
}
.error_border {
  @apply border-2 border-rose-600;
}
.text {
  margin: 3% 10% 0%;
}
.entry {
  margin: 0% 10%;
  border: 1px solid silver;
  border-top: solid 1px #717171;
  border-bottom: solid 1px #e0e0e0;
  border-radius: 5px;
  background-color: white;
}
</style>
