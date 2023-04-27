<script lang="ts" setup>
import { FesYear, RainStage } from '@/types/regist/stage'
import { loginCheck } from '@/utils/methods'
import { useField, useForm } from 'vee-validate'
import { stageSchema } from '~~/utils/validate'

const { meta, isSubmitting } = useForm({
  validationSchema: stageSchema,
});

const { handleChange: handleFesDate, errorMessage: fesDateError } = useField('fesDate')
const { handleChange: handleFirst, errorMessage: firstError } = useField('first')
const { handleChange: handleSecond, errorMessage: secondError } = useField('second')
const { handleChange: handlePerformanceTime, errorMessage: performanceTimeError } = useField('performanceTime')
const { handleChange: handlePreparationTime, errorMessage: preparationTimeError } = useField('preparationTime')
const { handleChange: handleCleanUpTime, errorMessage: cleanUpTimeError } = useField('cleanUpTime')

const config = useRuntimeConfig();
const router = useRouter();
const state = reactive({
  groupId: 0,
});
const fesDateList = ref<FesYear[]>([]);
const rainStageList = ref<RainStage[]>([]);

const registerParams = reactive({
  fesDateId: 0,
  firstPreference: 0,
  secondPreference: 0,
  performanceTime: "",
  preparationTime: "",
  cleanUpTime: "",
});

onMounted(async()=>{
  // ログインしていない場合は/welcomeに遷移させる
  loginCheck();
  state.groupId = Number(localStorage.getItem("group_id"));
  const fesDate = await $fetch<{data : FesYear[]}>(
    config.APIURL + "/api/v1/get_current_fes_dates"
  );
  fesDateList.value = fesDate.data;

  const rainStage = await $fetch<{data: RainStage[]}>(
    config.APIURL + "/rainy/stages"
  )
  rainStageList.value = rainStage.data;
})

const registerRainStage = async () => {
  await $fetch(config.APIURL + "/stage_orders", {
    method: "POST",
    params: {
      group_id: state.groupId,
      is_sunny: false,
      fes_date_id: registerParams.fesDateId,
      stage_first: registerParams.firstPreference,
      stage_second: registerParams.secondPreference,
      use_time_interval: registerParams.performanceTime,
      prepare_time_interval: registerParams.preparationTime,
      cleanup_time_interval: registerParams.cleanUpTime,
    },
    headers: {
      "Content-Type": "application/json",
    },
  })
  router.push("/regist/stageOption");
};

const skip = () =>{
  router.push("/regist/stageOption");
}

</script>

<template>
  <div>
    <div class="mx-[20%] my-[5%]">
      <Card>
        <h1 class="text-3xl">Registration of stage on a rain day</h1>
        <Card border="none" align="end">

          <div class="flex">
            <p class="label">date</p>
            <select style="width:180px;" v-model="registerParams.fesDateId" @change="handleFesDate">
              <option value="" selected disabled></option>
              <option v-for = "fesDate in fesDateList" :value="fesDate.id">{{fesDate.date}}</option>
            </select>
          </div>
          <div class="text-rose-600">{{ fesDateError }}</div>

          <div class="flex">
            <p class="label">first preference</p>
            <select style="width:180px;" v-model="registerParams.firstPreference" @change="handleFirst">
              <option value="" selected disabled></option>
              <option v-for = "rainStage in rainStageList" :value="rainStage.id">{{rainStage.name}}</option>
            </select>
          </div>
          <div class="text-rose-600">{{ firstError }}</div>

          <div class="flex">
            <p class="label">second preference</p>
            <select style="width:180px;" v-model="registerParams.secondPreference" @change="handleSecond">
              <option value="" selected disabled></option>
              <option v-for = "rainStage in rainStageList" :value="rainStage.id">{{rainStage.name}}</option>
            </select>
          </div>
          <div class="text-rose-600">{{ secondError }}</div>

          <div class="flex">
            <p class="label">performance time</p>
            <input class="form" v-model="registerParams.performanceTime" @change="handlePerformanceTime">
            <p>min</p>
          </div>
          <div class="text-rose-600">{{ performanceTimeError }}</div>

          <div class="flex">
            <p class="label">preparation time</p>
            <input class="form" v-model="registerParams.preparationTime" @change="handlePreparationTime">
            <p>min</p>
          </div>
          <div class="text-rose-600">{{ preparationTimeError }}</div>

          <div class="flex">
            <p class="label">clean-up time</p>
            <input class="form" v-model="registerParams.cleanUpTime" @change="handleCleanUpTime">
            <p>min</p>
          </div>
          <div class="text-rose-600">{{ cleanUpTimeError }}</div>

        </Card>
        <Row>
          <RegistPageButton text="reset"></RegistPageButton>
          <RegistPageButton :disabled="!meta.valid || isSubmitting" @click="registerRainStage" text="登録"></RegistPageButton>
          <RegistPageButton text="skip" @click="skip"></RegistPageButton>
        </Row>
      </Card>
    </div>
  </div>
</template>

<style scoped>
  .label {
    @apply
      flex-none
      text-xl
      pr-5
  }
  .form {
    @apply
    flex-none
    border-solid
    border-2
  }
</style>
