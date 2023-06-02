<script lang="ts" setup>
import { FesYear } from '@/types/regist/stage'
import { Stage } from '~~/types';
import { useField, useForm } from 'vee-validate'
import { editStageSchema } from '~~/utils/validate';
import { async } from '@firebase/util';
const config = useRuntimeConfig()

interface Props {
  id: number | null,
  groupId: number | null,
  isSunny: boolean | null,
  fesDateId: number | null,
  stageFirst: number | null,
  stageSecond: number | null,
  useTimeInterval: number | null,
  prepareTimeInterval: number | null,
  cleanupTimeInterval: number | null,
}
const props = withDefaults(defineProps<Props>(), {
  id: null,
  groupId: null,
  isSunny: null,
  fesDateId: null,
  date: '',
  stageFirst: null,
  stageSecond: null,
  useTimeInterval: null,
  prepareTimeInterval: null,
  cleanupTimeInterval: null,
})

interface Emits {
  (e: 'update:editStage', isEditStage: boolean): void
  (e: 'reloadStage', v: null): void
}
const emits = defineEmits<Emits>()

const { meta, isSubmitting } = useForm({
  validationSchema: editStageSchema,
  initialValues: {
    fesDate: props.fesDateId,
    first: props.stageFirst,
    second: props.stageSecond,
    performanceTime: props.useTimeInterval,
    preparationTime: props.prepareTimeInterval,
    cleanUpTime: props.cleanupTimeInterval
  }
})
const { handleChange: handleDate, errorMessage: dateError } = useField('fesDate')
const { handleChange: handleStageFirst, errorMessage: stageFirstError } = useField('first')
const { handleChange: handleStageSecond, errorMessage: stageSecondError } = useField('second')
const { handleChange: handleUseTimeInterval, errorMessage: useTimeIntervalError } = useField('performanceTime')
const { handleChange: handlePrepareTimeInterval, errorMessage: prepareTimeIntervalError } = useField('preparationTime')
const { handleChange: handleCleanupTimeInterval, errorMessage: cleanupTimeIntervalError } = useField('cleanUpTime')

const newStageDateId = ref<Props['fesDateId']>(props.fesDateId)
const newStageFirst = ref<Props['stageFirst']>(props.stageFirst)
const newStageSecond = ref<Props['stageSecond']>(props.stageSecond)
const newUseTimeInterval = ref<Props['useTimeInterval']>(props.useTimeInterval)
const newPrepareTimeInterval = ref<Props['prepareTimeInterval']>(props.prepareTimeInterval)
const newCleanupTimeInterval = ref<Props['cleanupTimeInterval']>(props.cleanupTimeInterval)

const closeEditStage = () => {
  emits('update:editStage', false)
}

const reloadStage = () => {
  emits('reloadStage', null)
}

const fesDateList = ref<FesYear[]>([]);
const rainStageList = ref<Stage[]>([]);
const sunnyStageList = ref<Stage[]>([]);
const stageList = ref<Stage[]>([]);

const weather = ref<string>(props.isSunny ? '[晴:sunny]': '[雨:rain]')
const title = ref<string>('ステージ編集:Stage Editing\n' + weather.value )

onMounted(async () => {
  const fesDate = await $fetch<{ data: FesYear[] }>(
    config.APIURL + "/api/v1/get_current_fes_dates"
  );
  fesDateList.value = fesDate.data;
  const rainStage = await $fetch<{ data: Stage[] }>(
    config.APIURL + "/rainy/stages"
  );
  rainStageList.value = rainStage.data;
  const sunnyStage = await $fetch<{ data: Stage[] }>(
    config.APIURL + "/sunny/stages"
  );
  sunnyStageList.value = sunnyStage.data
  stageList.value = props.isSunny ? sunnyStageList.value : rainStageList.value
})

const editStage = async () => {
  if (props.id === null) {
    await useFetch(config.APIURL + "/stage_orders/", {
      method: 'POST',
      params: {
        group_id: props.groupId,
        is_sunny: props.isSunny,
        fes_date_id: newStageDateId.value,
        stage_first: newStageFirst.value,
        stage_second: newStageSecond.value,
        use_time_interval: newUseTimeInterval.value,
        prepare_time_interval: newPrepareTimeInterval.value,
        cleanup_time_interval: newCleanupTimeInterval.value,
      }
    })
  }else{
    await useFetch(config.APIURL + "/stage_orders/" + props.id, {
      method: 'PUT',
      params: {
        group_id: props.groupId,
        is_sunny: props.isSunny,
        fes_date_id: newStageDateId.value,
        stage_first: newStageFirst.value,
        stage_second: newStageSecond.value,
        use_time_interval: newUseTimeInterval.value,
        prepare_time_interval: newPrepareTimeInterval.value,
        cleanup_time_interval: newCleanupTimeInterval.value,
      }
    })
  }
  reloadStage()
  closeEditStage()
}

const reset = () => {
  newStageDateId.value = null
  newStageFirst.value = null
  newStageSecond.value = null
  newUseTimeInterval.value = null
  newPrepareTimeInterval.value = null
  newCleanupTimeInterval.value = null
  handleDate(newStageDateId.value)
  handleStageFirst(newStageFirst.value)
  handleStageSecond(newStageSecond.value)
  handleUseTimeInterval(newUseTimeInterval.value)
  handlePrepareTimeInterval(newPrepareTimeInterval.value)
  handleCleanupTimeInterval(newCleanupTimeInterval.value)
}

const deleteStage = async() => {
  if (props.id !== null) {
    await useFetch(config.APIURL + "/stage_orders/" + props.id, {
      method: 'DELETE',
    })
  }
  reloadStage()
  closeEditStage()
}
</script>

<template>
  <Modal :title="title">
    <template #close>
      <div class="flex justify-end">
        <button @click="closeEditStage()" class="hover:text-black hover:opacity-75"
        >✖</button>
      </div>
    </template>
    <template #form>
      <div class="text">{{ $t('Stage.date') }}</div>
      <select class="entry" v-model="newStageDateId" @change="handleDate" :class="{'error_border': dateError}">
        <option
          v-for="fesDate in fesDateList"
          :value="fesDate.id"
          :key="fesDate.id"
        >
          {{ fesDate.date }}
        </option>
      </select>
      <div class="error_msg">{{ dateError }}</div>
      <div class="text">{{ $t('Stage.firstPreference') }}</div>
      <select class="entry" v-model="newStageFirst" @change="handleStageFirst" :class="{'error_border': stageFirstError}">
        <option
          v-for="stageFirst in stageList"
          :key="stageFirst.id"
          :value="stageFirst.id"
        >
          {{ stageFirst.name }}
        </option>
      </select>
      <div class="error_msg">{{ stageFirstError }}</div>
      <div class="text">{{ $t('Stage.secondPreference') }}</div>
      <select class="entry" v-model="newStageSecond" @change="handleStageSecond" :class="{'error_border': stageSecondError}">
        <option
          v-for="stageSecond in stageList"
          :key="stageSecond.id"
          :value="stageSecond.id"
        >
          {{ stageSecond.name }}
        </option>
      </select>
      <div class="error_msg">{{ stageSecondError }}</div>
      <div>
        <div class="text">{{ $t('Stage.preparationTime') }}[min]</div>
        <input type="number" class="entry" v-model="newPrepareTimeInterval" @change="handlePrepareTimeInterval" :class="{'error_border': prepareTimeInterval}" />
        <div class="error_msg">{{ prepareTimeIntervalError }}</div>
        <div class="text">{{ $t('Stage.performanceTime') }}[min]</div>
        <input type="number" class="entry" v-model="newUseTimeInterval" @change="handleUseTimeInterval" :class="{'error_border': useTimeIntervalError}" />
        <div class="error_msg">{{ useTimeIntervalError }}</div>
        <div class="text">{{ $t('Stage.cleanUpTime') }}[min]</div>
        <input type="number" class="entry" v-model="newCleanupTimeInterval" @change="handleCleanupTimeInterval" :class="{'error_border': cleanupTimeIntervalError}" />
        <div class="error_msg">{{ cleanupTimeIntervalError }}</div>
      </div>
      <div class="flex justify-between mt-8 mx-8">
        <RegistPageButton :text="$t('Button.delete')" @click="deleteStage()"></RegistPageButton>
        <RegistPageButton :text="$t('Button.reset')" @click="reset()"></RegistPageButton>
        <RegistPageButton :disabled="!meta.valid || isSubmitting" :text="$t('Button.edit')" @click="editStage()"></RegistPageButton>
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
