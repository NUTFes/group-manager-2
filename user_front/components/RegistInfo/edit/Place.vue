<script lang="ts" setup>
import { Place, PlaceList } from "~~/types/regist/place";
import { useField, useForm } from "vee-validate";
import { placeSchema } from "~~/utils/validate";
const config = useRuntimeConfig();

interface Props {
  id: number | null;
  first: number | null;
  second: number | null;
  third: number | null;
  remark: string;
}

const props = withDefaults(defineProps<Props>(), {
  id: null,
  first: null,
  second: null,
  third: null,
  remark: "",
});
interface Emits {
  (e: "update:editPlace", isEditePlace: boolean): void;
  (e: "reloadPlace", v: null): void;
}
const emits = defineEmits<Emits>();

const { meta, isSubmitting } = useForm({
  validationSchema: placeSchema,
  initialValues: {
    first: props.first,
    second: props.second,
    third: props.third,
  },
});
const { handleChange: handleFirstPlace, errorMessage: firstPlaceError } =
  useField("first");
const { handleChange: handleSecondPlace, errorMessage: secondPlaceError } =
  useField("second");
const { handleChange: handleThirdPlace, errorMessage: thirdPlaceError } =
  useField("third");

const placeList = ref<PlaceList[]>([]);
const newFirst = ref<Props["first"]>(props.first);
const newSecond = ref<Props["second"]>(props.second);
const newThird = ref<Props["third"]>(props.third);
const newRemark = ref<Props["remark"]>(props.remark);

const isDuplicate = computed(() => {
  if (
    newFirst.value === newSecond.value ||
    newFirst.value === newThird.value ||
    newSecond.value === newThird.value
  ) {
    return true;
  } else {
    return false;
  }
});

const reloadPlace = () => {
  emits("reloadPlace", null);
};

const closeEditPlace = () => {
  emits("update:editPlace", false);
};

onMounted(async () => {
  const placeData = await $fetch<Place>(config.APIURL + "/places");
  !!placeData.data &&
    placeData.data.forEach((place) => {
      placeList.value.push(place);
    });
});

const editPlace = async () => {
  if (isDuplicate.value) {
    alert("同じ会場を選択しています。");
    return;
  }

  await useFetch(config.APIURL + "/place_orders/" + props.id, {
    method: "PUT",
    params: {
      first: newFirst.value,
      second: newSecond.value,
      third: newThird.value,
      remark: newRemark.value,
    },
  });
  reloadPlace();
  closeEditPlace();
};

const reset = () => {
  newFirst.value = null;
  newSecond.value = null;
  newThird.value = null;
  newRemark.value = "";
};
</script>

<template>
  <Modal title="会場申請の編集">
    <template #close>
      <div class="flex justify-end">
        <button
          @click="closeEditPlace()"
          class="hover:text-black hover:opacity-75"
        >
          ✖
        </button>
      </div>
    </template>
    <template #form>
      <div class="text">第1希望</div>
      <select
        class="entry"
        v-model="newFirst"
        @change="handleFirstPlace"
        :class="{ error_border: firstPlaceError }"
      >
        <option v-for="place in placeList" :value="place.id" :key="place.id">
          {{ place.name }}
        </option>
      </select>
      <div class="error_msg">{{ firstPlaceError }}</div>
      <div class="text">第2希望</div>
      <select
        class="entry"
        v-model="newSecond"
        @change="handleSecondPlace"
        :class="{ error_border: secondPlaceError }"
      >
        <option v-for="place in placeList" :value="place.id" :key="place.id">
          {{ place.name }}
        </option>
      </select>
      <div class="error_msg">{{ secondPlaceError }}</div>
      <div class="text">第3希望</div>
      <select
        class="entry"
        v-model="newThird"
        @change="handleThirdPlace"
        :class="{ error_border: thirdPlaceError }"
      >
        <option v-for="place in placeList" :value="place.id" :key="place.id">
          {{ place.name }}
        </option>
      </select>
      <div class="error_msg">{{ thirdPlaceError }}</div>
      <div class="text">追記することがあればこちらにお書きください</div>
      <textarea class="entry" v-model="newRemark" />
      <div class="flex justify-between mt-8 mx-8">
        <RegistPageButton text="リセット" @click="reset()"></RegistPageButton>
        <RegistPageButton
          :disabled="!meta.valid || isSubmitting"
          text="✓編集"
          @click="editPlace()"
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
