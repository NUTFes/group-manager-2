<script lang="ts" setup>
import { FesYear, SunnyStage } from '@/types/regist/stage'
import { loginCheck } from '@/utils/methods'

const config = useRuntimeConfig();
const router = useRouter();
const state = reactive({
  groupId: 0,
});
const fesDateList = ref<FesYear[]>([]);
const sunnyStageList = ref<SunnyStage[]>([]);

const registerParams = reactive({
  fesDateId: 0,
  firstPreference: 0,
  secondPreference: 0,
  performanceTime: "",
  preparationTime: "",
  cleanUpTime: "",
});

onMounted(async()=>{
loginCheck();
state.groupId = Number(localStorage.getItem("group_id"));
const fesDate = await $fetch<{data : FesYear[]}>(
  config.APIURL + "/api/v1/get_current_fes_dates"
);
fesDateList.value = fesDate.data;

const sunnyStage = await $fetch<{data:SunnyStage[]}>(
  config.APIURL + "/sunny/stages"
)
sunnyStageList.value = sunnyStage.data;
})

const registerRainStage = async () => {
  await $fetch(config.APIURL + "/stage_orders", {
    method: "POST",
    params: {
      group_id: state.groupId,
      is_sunny: true,
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
  router.push("/regist/stage/rain");
};

const skip = () =>{
  router.push("/regist/stage/rain");
}


</script>

<template>
  <div>
    <div class="mx-[20%] my-[5%]">
      <Card>
        <h1 class="text-3xl">Registration of stage on a sunny day</h1>
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
              <option v-for = "sunnyStage in sunnyStageList" :value="sunnyStage.id">{{sunnyStage.name}}</option>
            </select>
          </div>

          <div class="flex">
            <p class="label">second preference</p>
            <select style="width:180px;" v-model="registerParams.secondPreference">
              <option value="" selected disabled></option>
              <option v-for = "sunnyStage in sunnyStageList" :value="sunnyStage.id">{{sunnyStage.name}}</option>
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
</style>>
