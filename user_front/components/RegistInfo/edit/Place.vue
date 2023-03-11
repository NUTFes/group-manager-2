<script lang="ts" setup>
import { Place, PlaceList } from '~~/types/regist/place';
const config = useRuntimeConfig()

interface Props {
  groupId: number 
  id: number
  first: string
  second: string
  third: string
  remark: string
}

interface Emits {
  (e: 'update:editPlace', isEditePlace: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  id: 0,
  first: '',
  second: '',
  third: '',
  remark: '',
})

const emits = defineEmits<Emits>()

const placeList = ref<PlaceList[]>([])
const newFirst = ref<Props['first']>()
const newSecond = ref<Props['second']>()
const newThird = ref<Props['third']>()
const newRemark = ref<Props['remark']>()

const closeEditPlace = () => {
  emits('update:editPlace', false)
}

onMounted(async () => {
  const placeData = await $fetch<Place>(config.APIURL + "/places");
  !!placeData.data && placeData.data.forEach((place) => {
    placeList.value.push(place)
  })
})

const editPlace = async () => {
  await useFetch(config.APIURL + "/place_orders/" + props.id, {
    method: "PUT",
    params: {
      first: newFirst.value,
      second: newSecond.value,
      third: newThird.value,
      remark: newRemark.value,
    }
  })
  closeEditPlace()
}

const reset = () => {
  newFirst.value = ''
  newSecond.value = ''
  newThird.value = ''
  newRemark.value = ''
}

</script>

<template>
  <Modal title="会場申請の編集">
    <template #close>
      <div class="flex justify-end">
        <button @click="closeEditPlace()" class="hover:text-black hover:opacity-75"
        >✖</button>
      </div>
    </template>
    <template #form>
      <div class="text">第1希望</div>
      <select class="entry" v-model="newFirst">
        <option
          v-for="place in placeList"
          :value="place.id"
          :key="place.id"
        >
          {{ place.name }}
        </option>
      </select>
      <div class="text">第2希望</div>
      <select class="entry" v-model="newSecond">
        <option
          v-for="place in placeList"
          :value="place.id"
          :key="place.id"
        >
          {{ place.name }}
        </option>
      </select>
      <div class="text">第3希望</div>
      <select class="entry" v-model="newThird">
        <option
          v-for="place in placeList"
          :value="place.id"
          :key="place.id"
        >
          {{ place.name }}
        </option>
      </select>
      <div class="text">追記することがあればこちらにお書きください</div>
      <textarea class="entry" v-model="newRemark"/>
      <div class="flex justify-between mt-8 mx-8">
        <RegistPageButton text="reset" @click="reset()"></RegistPageButton>
        <RegistPageButton text="register" @click="editPlace()"></RegistPageButton>
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
