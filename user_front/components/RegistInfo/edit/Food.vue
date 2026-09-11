<script lang="ts" setup>
import { useField, useForm } from "vee-validate";
import { editFoodSchema } from "~/utils/validate";
const config = useRuntimeConfig();

interface Regist {
  groupId: number | null;
  id: number | null;
  isCooking: boolean;
  dishName: string;
  firstDayNum: number | null;
  secondDayNum: number | null;
  groupCategoryId: number;
}
const props = withDefaults(defineProps<Regist>(), {
  groupId: null,
  id: null,
  dishName: "",
  isCooking: false,
  firstDayNum: null,
  secondDayNum: null,
});

const { meta, isSubmitting } = useForm({
  validationSchema: editFoodSchema,
  initialValues: {
    dishName: props.dishName,
    numFirstDay: props.firstDayNum,
    numSecondDay: props.secondDayNum,
  },
});
const { handleChange: handleDishName, errorMessage: dishNameError } =
  useField("dishName");
const { handleChange: handleNumFirstDay, errorMessage: numFirstDayError } =
  useField("numFirstDay");
const { handleChange: handleNumSecondDay, errorMessage: numSecondDayError } =
  useField("numSecondDay");

interface Emits {
  (e: "update:editFood", isEditFood: boolean): void;
  (e: "reloadFood", v: null): void;
}

const emits = defineEmits<Emits>();

const editFoodClose = () => {
  emits("update:editFood", false);
};

const editFoodReload = () => {
  emits("reloadFood", null);
};

const newDishName = ref<string>(props.dishName);
const newIsCooking = ref<boolean>(props.isCooking);
const newNumFirstDay = ref<number | null>(props.firstDayNum);
const newNumSecondDay = ref<number | null>(props.secondDayNum);

const editFood = async () => {
  if (props.id === null) {
    await useFetch(config.APIURL + "/food_products", {
      method: "POST",
      params: {
        group_id: props.groupId,
        name: newDishName.value,
        is_cooking: newIsCooking.value,
        first_day_num: newNumFirstDay.value,
        second_day_num: newNumSecondDay.value,
      },
    });
  } else {
    await useFetch(config.APIURL + "/food_products/" + props.id, {
      method: "PUT",
      params: {
        group_id: props.groupId,
        name: newDishName.value,
        is_cooking: newIsCooking.value,
        first_day_num: newNumFirstDay.value,
        second_day_num: newNumSecondDay.value,
      },
    });
  }
  editFoodReload();
  editFoodClose();
};

const reset = () => {
  newDishName.value = "";
  newIsCooking.value = false;
  newNumFirstDay.value = null;
  newNumSecondDay.value = null;
  handleDishName(newDishName.value);
  handleNumFirstDay(newNumFirstDay.value);
  handleNumSecondDay(newNumSecondDay.value);
};
</script>

<template>
  <Modal
    :title=" $t('Product.editProduct') "
  >
    <template #close>
      <div class="flex justify-end">
        <button
          @click="editFoodClose()"
          class="hover:text-black hover:opacity-75"
        >
          ✖
        </button>
      </div>
    </template>
    <template #form>
      <div class="text">
        {{ $t("Product.name")  }}
      </div>
      <input
        class="entry"
        v-model="newDishName"
        @change="handleDishName"
        :class="{ error_border: dishNameError }"
      />
      <div class="error_msg">{{ dishNameError }}</div>
      <div v-if="groupCategoryId === 1">
        <div class="text">{{ $t("Product.cook") }}</div>
        <select class="entry" v-model="newIsCooking">
          <option value="" disabled selected>{{ $t("Product.select") }}</option>
          <option value="true">{{ $t("Product.yes") }}</option>
          <option value="false">{{ $t("Product.no") }}</option>
        </select>
      </div>
      <div class="text">{{ $t("Product.numberFirstDay") }}</div>
      <input
        type="number"
        class="entry"
        v-model="newNumFirstDay"
        @change="handleNumFirstDay"
        :class="{ error_border: numFirstDayError }"
      />
      <div class="error_msg">{{ numFirstDayError }}</div>
      <div class="text">{{ $t("Product.numberSecondDay") }}</div>
      <input
        type="number"
        class="entry"
        v-model="newNumSecondDay"
        @change="handleNumSecondDay"
        :class="{ error_border: numSecondDayError }"
      />
      <div class="error_msg">{{ numSecondDayError }}</div>
      <div class="flex justify-between mt-8 mx-8">
        <RegistPageButton :text="$t('Button.reset')" @click="reset()" />
        <RegistPageButton
          :disabled="!meta.valid || isSubmitting"
          :text="$t('Button.edit')"
          @click="editFood()"
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
