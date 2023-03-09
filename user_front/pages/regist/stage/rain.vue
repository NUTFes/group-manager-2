<script lang="ts" setup>
import { FesYear, RainStage } from '@/types/regist/stage'

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
  router.push("/mypage");
};


</script>

<template>
  <div>
    <div class="mx-[20%] my-[5%]">
      <Card>
        <h1 class="text-3xl">Registration of stage on a rain day</h1>
        <Card border="none" align="end" gap="10px">

          <div class="flex">
            <p class="label">date</p>
            <select style="width:180px;" v-model="registerParams.fesDateId">
              <option value="" selected disabled></option>
              <option v-for = "fesDate in fesDateList" :value="fesDate.id">{{fesDate.date}}</option>
            </select>
          </div>

          <div class="flex">
            <p class="label">first preference</p>
            <select style="width:180px;" v-model="registerParams.firstPreference">
              <option value="" selected disabled></option>
              <option v-for = "rainStage in rainStageList" :value="rainStage.id">{{rainStage.name}}</option>
            </select>
          </div>

          <div class="flex">
            <p class="label">second preference</p>
            <select style="width:180px;" v-model="registerParams.secondPreference">
              <option value="" selected disabled></option>
              <option v-for = "rainStage in rainStageList" :value="rainStage.id">{{rainStage.name}}</option>
            </select>
          </div>

          <div class="flex">
            <p class="label">performance time</p>
            <input class="form" v-model="registerParams.performanceTime">
            <p>min</p>
          </div>

          <div class="flex">
            <p class="label">preparation time</p>
            <input class="form" v-model="registerParams.preparationTime">
            <p>min</p>
          </div>

          <div class="flex">
            <p class="label">clean-up time</p>
            <input class="form" v-model="registerParams.cleanUpTime">
            <p>min</p>
          </div>

        </Card>
        <Row>
          <RegistPageButton text="reset"></RegistPageButton>
          <RegistPageButton @click="registerRainStage" text="登録"></RegistPageButton>
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
</style>>
