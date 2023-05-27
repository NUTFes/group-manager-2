<script lang="ts" setup>
import { FesYear, RainStage, SunnyStage } from '@/types/regist/stage'
import { useField, useForm } from 'vee-validate'
const config = useRuntimeConfig()

const { meta, isSubmitting } = useForm({
  validationSchema: stageSchema,
})

const { handleChange: handleFesDate, errorMessage: fesDateError } = useField('fesDate')
const { handleChange: handleFirst, errorMessage: firstError } = useField('first')
const { handleChange: handleSecond, errorMessage: secondError } = useField('second')
const { handleChange: handlePerformanceTime, errorMessage: performanceTimeError } = useField('performanceTime')
const { handleChange: handlePreparationTime, errorMessage: preparationTimeError } = useField('preparationTime')
const { handleChange: handleCleanUpTime, errorMessage: cleanUpTimeError } = useField('cleanUpTime')

interface Props {
  groupId: number | null
}
interface Emits {
  (e: 'update:add-stage', isEditStage: boolean): void
  (e: 'reloadStage', reload: null): void
}

const props = withDefaults(defineProps<Props>(), {
  groupId: null,
})

const emits = defineEmits<Emits>()

const isSunny = ref<boolean>(true)
const fesDateId = ref<number>(0)
const firstPreference = ref<number>(0)
const secondPreference = ref<number>(0)
const performanceTime = ref<string>('')
const preparationTime = ref<string>('')
const cleanUpTime = ref<string>('')

const state = reactive({
  groupId: 0,
});

const fesDateList = ref<FesYear[]>([]);
const rainStageList = ref<RainStage[]>([]);
const sunnyStageList = ref<SunnyStage[]>([]);
const weather = ref<string>('')
const weatherList = ref<string[]>(['sunny', 'rain'])

onMounted(async ()=>{
  state.groupId = Number(localStorage.getItem("group_id"));

  const fesDate = await $fetch<{data : FesYear[]}>(
    config.APIURL + "/api/v1/get_current_fes_dates"
  );
  fesDateList.value = fesDate.data;

  const rainStage = await $fetch<{data: RainStage[]}>(
    config.APIURL + "/rainy/stages"
  )
  rainStageList.value = rainStage.data;

  const sunnyStage = await $fetch<{data:SunnyStage[]}>(
    config.APIURL + "/sunny/stages"
  )
  sunnyStageList.value = sunnyStage.data;
})


const addStageClose = () => {
  emits('update:add-stage', false)
}
const reloadStage = () => {
  emits('reloadStage', null)
}
const addStage = async () => {
  await useFetch(config.APIURL + "/stage_orders", {
    method: "POST",
    params: {
      group_id: props.groupId,
      is_sunny: isSunny.value,
      fes_date_id: fesDateId.value,
      stage_first: firstPreference.value,
      stage_second: secondPreference.value,
      use_time_interval: performanceTime.value,
      prepare_time_interval: preparationTime.value,
      cleanup_time_interval: cleanUpTime.value,
    },
  })
  reloadStage()
  addStageClose()
}

const reset = () => {
  isSunny.value = true
  fesDateId.value = 0
  firstPreference.value = 0
  secondPreference.value = 0
  performanceTime.value = ''
  preparationTime.value = ''
  cleanUpTime.value = ''
}

// wetherがsunnyならisSunnyをtrueに、rainならfalseにする
watch(weather, (newVal) => {
  if (newVal === 'sunny') {
    isSunny.value = true
  } else {
    isSunny.value = false
  }
})
</script>

<template>
  <Modal :title="$t('RegistInfo.stage')">
    <template #close>
      <div class="flex justify-end">
        <button @click="addStageClose()" class="hover:text-black hover:opacity-75">✖</button>
      </div>
    </template>
    <template #form>
      <div class="text">{{ $t('Stage.weather') }}</div>
      <select class="entry" style="width:180px;" v-model="weather">
        <option value="" selected disabled></option>
        <option v-for = "weather in weatherList" :value="weather">{{weather}}</option>
      </select>

      <div class="text">{{ $t('Stage.date') }}</div>
      <select class="entry" style="width:180px;" v-model="fesDateId" @change="handleFesDate">
        <option value="" selected disabled></option>
        <option v-for = "fesDate in fesDateList" :value="fesDate.id">{{fesDate.date}}</option>
      </select>

      <div v-if="weather==='sunny'">
        <div class="text">{{ $t('Stage.firstPreference') }}</div>
        <select class="entry" style="width:180px;" v-model="firstPreference" @change="handleFirst">
          <option value="" selected disabled></option>
          <option v-for="sunnyStage in sunnyStageList" :value="sunnyStage.id">{{sunnyStage.name}}</option>
        </select>
        <div class="text">{{ $t('Stage.secondPreference') }}</div>
        <select class="entry" style="width:180px;" v-model="secondPreference" @change="handleSecond">
          <option value="" selected disabled></option>
          <option v-for="sunnyStage in sunnyStageList" :value="sunnyStage.id">{{sunnyStage.name}}</option>
        </select>
      </div>
      <div v-else>
        <div class="text">{{ $t('Stage.firstPreference') }}</div>
        <select class="entry" style="width:180px;" v-model="firstPreference" @change="handleFirst">
          <option value="" selected disabled></option>
          <option v-for="rainStage in rainStageList" :value="rainStage.id">{{rainStage.name}}</option>
        </select>
        <div class="text">{{ $t('Stage.secondPreference') }}</div>
        <select class="entry" style="width:180px;" v-model="secondPreference"  @change="handleSecond">
          <option value="" selected disabled></option>
          <option v-for="rainStage in rainStageList" :value="rainStage.id">{{rainStage.name}}</option>
        </select>
      </div>

      <div class="text">{{ $t('Stage.performanceTime') }}[min]</div>
        <input class="entry" v-model="performanceTime" @change="handlePerformanceTime">

      <div class="text">{{ $t('Stage.preparationTime') }}[min]</div>
        <input class="entry" v-model="preparationTime" @change="handlePreparationTime">

      <div class="text">{{ $t('Stage.cleanUpTime') }}[min]</div>
        <input class="entry" v-model="cleanUpTime" @change="handleCleanUpTime">

      <div class="flex justify-between mt-8 mx-8">
        <RegistPageButton :text="$t('Button.reset')" @click="reset()" />
        <RegistPageButton :disabled="!meta.valid || isSubmitting" :text="$t('Button.add')" @click="addStage()" />
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
  border-top : solid 1px #717171;
  border-bottom : solid 1px #e0e0e0;
  border-radius: 5px;
  background-color: white;
}
</style>
