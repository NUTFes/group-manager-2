<script lang="ts" setup>
import { useField, useForm } from "vee-validate";
import { editPowerSchema } from "~~/utils/validate";
const config = useRuntimeConfig();

interface Props {
  groupId: number | null;
  id: number | null;
  item: string;
  power: number | null;
  manufacturer: string;
  model: string;
  url: string;
  totalPower: number;
}
const props = withDefaults(defineProps<Props>(), {
  groupId: null,
  id: null,
  item: "",
  power: null,
  manufacturer: "",
  model: "",
  url: "",
  totalPower: 0,
});

interface Emits {
  (e: "update:edit-power", isEditPower: boolean): void;
  (e: "reloadPower", v: null): void;
}
const emits = defineEmits<Emits>();

const { meta, isSubmitting } = useForm({
  validationSchema: editPowerSchema,
  initialValues: {
    productName: props.item,
    maxPower: props.power,
    manufacturer: props.manufacturer,
    model: props.model,
    url: props.url,
  },
});
const { handleChange: handleItem, errorMessage: itemError } =
  useField("productName");
const { handleChange: handlePower, errorMessage: powerError } =
  useField("maxPower");
const { handleChange: handleManufacturer, errorMessage: manufacturerError } =
  useField("manufacturer");
const { handleChange: handleModel, errorMessage: modelError } =
  useField("model");
const { handleChange: handleUrl, errorMessage: urlError } = useField("url");

const newItem = ref<Props["item"]>(props.item);
const newPower = ref<Props["power"]>(props.power);
const newManufacturer = ref<Props["manufacturer"]>(props.manufacturer);
const newModel = ref<Props["model"]>(props.model);
const newUrl = ref<Props["url"]>(props.url);

const closeEditPower = () => {
  emits("update:edit-power", false);
};

const reloadPower = () => {
  emits("reloadPower", null);
};

const editPower = async () => {
  if (props.id === null) {
    await useFetch(config.APIURL + "/power_orders", {
      method: "POST",
      params: {
        group_id: props.groupId,
        item: newItem.value,
        power: newPower.value,
        manufacturer: newManufacturer.value,
        model: newModel.value,
        item_url: newUrl.value,
      },
    });
  } else {
    await useFetch(config.APIURL + "/power_orders/" + props.id, {
      method: "PUT",
      params: {
        group_id: props.groupId,
        item: newItem.value,
        power: newPower.value,
        manufacturer: newManufacturer.value,
        model: newModel.value,
        item_url: newUrl.value,
      },
    });
  }
  reloadPower();
  closeEditPower();
};

const reset = () => {
  newItem.value = "";
  newPower.value = null;
  newManufacturer.value = "";
  newModel.value = "";
  newUrl.value = "";
  handleItem(newItem.value);
  handlePower(newPower.value);
  handleManufacturer(newManufacturer.value);
  handleModel(newModel.value);
  handleUrl(newUrl.value);
};

// 電力の合計が1500W以上なら追加させない
function istotalOverPower(newPower: number | null | undefined, power: number | null){
  return (newPower == null ? false : newPower - power! + props.totalPower > 1500)
}

</script>

<template>
  <Modal :title="$t('Power.editPower')">
    <template #close>
      <div class="flex justify-end">
        <button
          @click="closeEditPower()"
          class="hover:text-black hover:opacity-75"
        >
          ✖
        </button>
      </div>
    </template>
    <template #form>
      <div class="text">{{ $t("Power.name") }}</div>
      <input
        class="entry"
        v-model="newItem"
        @change="handleItem"
        :class="{ error_border: itemError }"
      />
      <div class="error_msg">{{ itemError }}</div>
      <div class="text">{{ $t("Power.maximum") }}</div>
      <input
        type="number"
        class="entry"
        v-model="newPower"
        @change="handlePower"
        :class="{ error_border: powerError }"
      />
      <div class="error_msg">{{ powerError }}</div>
      <div class="error_msg" :style="{'display': istotalOverPower(newPower, props.power) ? 'block' : 'none'}">電力の合計が1500[W]を超えています</div>
      <div class="text">{{ $t("Power.maker") }}</div>
      <input
        class="entry"
        v-model="newManufacturer"
        @change="handleManufacturer"
        :class="{ error_border: manufacturerError }"
      />
      <div class="error_msg">{{ manufacturerError }}</div>
      <div class="text">{{ $t("Power.model") }}</div>
      <input
        class="entry"
        v-model="newModel"
        @change="handleModel"
        :class="{ error_border: modelError }"
      />
      <div class="error_msg">{{ modelError }}</div>
      <div class="text">{{ $t("Power.URL") }}</div>
      <input
        class="entry"
        placeholder="https://sample.com"
        v-model="newUrl"
        @change="handleUrl"
        :class="{ error_border: urlError }"
      />
      <div class="error_msg">{{ urlError }}</div>
      <div class="flex justify-between mt-8 mx-8">
        <RegistPageButton
          :text="$t('Button.reset')"
          @click="reset()"
        ></RegistPageButton>
        <RegistPageButton
          :disabled="!meta.valid || isSubmittin || istotalOverPower(newPower, props.power)"
          :text="$t('Button.edit')"
          @click="editPower()"
        ></RegistPageButton>
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
