<script lang="ts" setup>
const config = useRuntimeConfig()

interface Props {
  id: number | null,
  groupId: number | null,
  isSunny: boolean | null,
  date: string,
  stageFirst: number | null,
  stageSecond: number | null,
  useTimeInterval: string,
  prepareTimeInterval: string,
  cleanupTimeInterval: string,
}

interface FesYear {
  created_at: string
  date: string
  day: string
  days_num: number
  fes_year_id: number
  id: number
  updated_at: string
}

interface Stage {
  created_at: string
  enable_rainy: boolean
  enable_sunny: boolean
  id: number
  name: string
  updated_at: string
}

interface Emits {
  (e: 'update:editStage', isEditStage: boolean): void
}

const emits = defineEmits<Emits>()
const props = withDefaults(defineProps<Props>(), {
  id: null,
  groupId: null,
  isSunny: null,
  date: '',
  stageFirst: null,
  stageSecond: null,
  useTimeInterval: '',
  prepareTimeInterval: '',
  cleanupTimeInterval: '',
})

const newStageDateId = ref<Props['date']>()
const newStageFirst = ref<Props['stageFirst']>()
const newStageSecond = ref<Props['stageSecond']>()
const newUseTimeInterval = ref<Props['useTimeInterval']>()
const newPrepareTimeInterval = ref<Props['prepareTimeInterval']>()
const newCleanupTimeInterval = ref<Props['cleanupTimeInterval']>()

const closeEditStage = () => {
  emits('update:editStage', false)
}

const fesDateList = ref<FesYear[]>([]);
const rainStageList = ref<Stage[]>([]);
const sunnyStageList = ref<Stage[]>([]);
const stageList = ref<Stage[]>([]);

const weather = ref<string>(props.isSunny ? '[晴]': '[雨]')
const title = ref<string>('ステージ編集' + weather.value)

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
  closeEditStage()
}

const reset = () => {
  newStageDateId.value = ''
  newStageFirst.value = null
  newStageSecond.value = null
  newUseTimeInterval.value = ''
  newPrepareTimeInterval.value = ''
  newCleanupTimeInterval.value = ''
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
      <div class="text">日程</div>
      <select class="entry" v-model="newStageDateId">
        <option
          v-for="fesDate in fesDateList"
          :value="fesDate.id"
          :key="fesDate.id"
        >
          {{ fesDate.date }}
        </option>
      </select>
      <div class="text">第一希望場所</div>
      <select class="entry" v-model="newStageFirst">
        <option
          v-for="stageFirst in stageList"
          :key="stageFirst.id"
          :value="stageFirst.id"
        >
          {{ stageFirst.name }}
        </option>
      </select>
      <div class="text">第二希望場所</div>
      <select class="entry" v-model="newStageSecond">
        <option
          v-for="stageSecond in stageList"
          :key="stageSecond.id"
          :value="stageSecond.id"
        >
          {{ stageSecond.name }}
        </option>
      </select>
      <div>
        <div class="text">準備時間幅</div>
        <input class="entry" v-model="newPrepareTimeInterval" />
        <div class="text">使用時間幅</div>
        <input class="entry" v-model="newUseTimeInterval" />
        <div class="text">片付け時間幅</div>
        <input class="entry" v-model="newCleanupTimeInterval" />
      </div>
      <div class="flex justify-between mt-8 mx-8">
        <RegistPageButton text="リセット" @click="reset()"></RegistPageButton>
        <RegistPageButton text="✓編集" @click="editStage()"></RegistPageButton>
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
  border-top : solid 1px #717171;
  border-bottom : solid 1px #e0e0e0;
  border-radius: 5px;
  background-color: white;
}
</style>
