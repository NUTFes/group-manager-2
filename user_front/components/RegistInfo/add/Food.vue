<script lang="ts" setup>
import { useField, useForm } from 'vee-validate'
import { editFoodSchema } from '~/utils/validate'
const config = useRuntimeConfig()

const { meta, isSubmitting } = useForm({
  validationSchema: editFoodSchema,
})
const { handleChange: handleDishName, errorMessage: dishNameError } = useField('dishName')
const { handleChange: handleNumFirstDay, errorMessage: numFirstDayError } = useField('numFirstDay')
const { handleChange: handleNumSecondDay, errorMessage: numSecondDayError } = useField('numSecondDay')

interface Props {
  groupId: number | null
}
const props = withDefaults(defineProps<Props>(), {
  groupId: null,
})

interface Emits {
  (e: 'update:addFood', isAddFood: boolean): void
  (e: 'reloadFood', reload: null): void
}
const emits = defineEmits<Emits>()

const dishName = ref<string>("")
const numFirstDay = ref<number | null>(null)
const numSecondDay = ref<number | null>(null)
const isCooking = ref<boolean>(false)

const addFoodClose = () => {
  emits('update:addFood', false)
}
const reloadFood = () => {
  emits('reloadFood', null)
}

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
  })
  reloadFood()
  addFoodClose()
}

const reset = () => {
  dishName.value = ""
  numFirstDay.value = null
  numSecondDay.value = null
  isCooking.value = false
}
</script>

<template>
  <Modal title="販売食品の追加">
    <template #close>
      <div class="flex justify-end">
        <button @click="addFoodClose()" class="hover:text-black hover:opacity-75">✖</button>
      </div>
    </template>
    <template #form>
      <div class="text">料理名</div>
      <input class="entry" v-model="dishName" @change="handleDishName" :class="{'error_border': dishNameError}"/>
      <div class="error_msg">{{ dishNameError }}</div>
      <div class="text">調理の有無</div>
      <select class="entry" v-model="isCooking">
        <option value="" disabled selected>選択してください</option>
        <option value="true">調理する</option>
        <option value="false">調理しない</option>
      </select>
      <div class="text">1日目の販売予定数</div>
      <input type="number" class="entry" v-model="numFirstDay" @change="handleNumFirstDay" :class="{ 'error_border': numFirstDayError }"/>
      <div class="error_msg">{{ numFirstDayError }}</div>
      <div class="text">2日目の販売予定数</div>
      <input type="number" class="entry" v-model="numSecondDay" @change="handleNumSecondDay" :class="{'error_border': numSecondDayError}"/>
      <div class="error_msg">{{ numSecondDayError }}</div>
      <div class="flex justify-between mt-8 mx-8">
        <RegistPageButton text="リセット" @click="reset()" />
        <RegistPageButton :disabled="!meta.valid || isSubmitting" text="✓追加" @click="addFood()" />
      </div>
    </template>
  </Modal>
</template>

<style scoped>
.error_msg {
  @apply mx-[10%] text-rose-600
}
.error_border {
  @apply border-2 border-rose-600
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
  width:80%;
}
</style>
