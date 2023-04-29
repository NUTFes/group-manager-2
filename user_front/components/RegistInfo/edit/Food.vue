<script lang="ts" setup>
const config = useRuntimeConfig();

interface Regist {
  groupId: number | null
  id: number | null
  isCooking: boolean
  dishName: string
  firstDayNum: number | null
  secondDayNum: number | null
}

const props = withDefaults(defineProps<Regist>(), {
  groupId: null,
  id: null,
  dishName: "",
  isCooking: false,
  firstDayNum: null,
  secondDayNum: null
})

interface Emits {
  (e: 'update:editFood', isEditFood: boolean): void
}

const emits = defineEmits<Emits>()

const editFoodClose = () => {
  emits('update:editFood', false)
}

const newDishName = ref<string>(props.dishName)
const newIsCooking = ref<boolean>(props.isCooking)
const newNumFirstDay = ref<number | null>(props.firstDayNum)
const newNumSecondDay = ref<number | null>(props.secondDayNum)

const editFood = async () => {
  await useFetch(config.APIURL + "/food_products/" + props.id, {
    method: "PUT",
    params: {
      group_id: props.groupId,
      name: newDishName.value,
      is_cooking: newIsCooking.value,
      first_day_num: newNumFirstDay.value,
      second_day_num: newNumSecondDay.value,
    },
  })
  editFoodClose()
};

const reset = () => {
  newDishName.value = ""
  newIsCooking.value = false
  newNumFirstDay.value = null
  newNumSecondDay.value = null
}
</script>

<template>
  <Modal title="販売食品の編集">
    <template #close>
      <div class="flex justify-end">
        <button @click="editFoodClose()" class="hover:text-black hover:opacity-75">✖</button>
      </div>
    </template>
    <template #form>
      <div class="text">料理名</div>
      <input class="entry" v-model="newDishName"/>
      <div class="text">調理の有無</div>
      <select class="entry" v-model="newIsCooking">
        <option value="" disabled selected>選択してください</option>
        <option value="true">調理する</option>
        <option value="false">調理しない</option>
      </select>
      <div class="text">1日目の販売予定数</div>
      <input type="number" class="entry" v-model="newNumFirstDay"/>
      <div class="text">2日目の販売予定数</div>
      <input type="number" class="entry" v-model="newNumSecondDay"/>
      <div class="flex justify-between mt-8 mx-8">
        <RegistPageButton text="リセット" @click="reset()" />
        <RegistPageButton text="✓編集" @click="editFood()" />
      </div>
    </template>
  </Modal>
</template>

<style scoped>
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
