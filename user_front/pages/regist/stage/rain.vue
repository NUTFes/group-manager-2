<script lang="ts" setup>
  import {Stage} from '@/types'
  // baseURLの設定
  const config = useRuntimeConfig();
  // useStateで配列を定義
  const stageArray = useState("stageArray", () => [] as string[])
  const {data:stages} = await useFetch<Stage[]>(config.baseURL+"/stages");
    !!stages.value!.data && stages.value!.data.forEach((stage:Stage)=>{
    stageArray.value.push(stage['name'])
  })
  var minuteNumber: number[] = new Array( 60 );
  for (var i = 0; i<=60; i++){
    minuteNumber[i] = i
  }
  var hourNumber: number[] = new Array( 24 );
  for (var i = 0; i<=24; i++){
    hourNumber[i] = i
  }
  var result: number[] = new Array( 36 );
  for (var i = 0; i<=36; i++){
    result[i] = i
  }
  var minuteInterval: number[] = result.map(function( value ) {
    return value * 5;
  });
</script>

<template>
  <div>
    <div class="mx-[20%] my-[5%]">
      <Card>
        <h1 class="text-3xl">Registration of stage on a rain day</h1>
        <Card border="none" align="end" gap="10px">
          <div class="flex">
            <p class="label">first preference</p>
            <select style="width:180px;">
              <option value="" selected disabled></option>
              <option v-for = "stage in stageArray" :key="stage">{{stage}}</option>
            </select>
          </div>
          <div class="flex">
            <p class="label">second preference</p>
            <select style="width:180px;">
              <option value="" selected disabled></option>
              <option v-for = "stage in stageArray" :key="stage">{{stage}}</option>
            </select>
          </div>
          <div class="flex">
            <p class="label">preparation start time</p>
            <Row>
              <select style="width:50px;">
                <option value="" selected disabled></option>
                <option v-for = "time in hourNumber" :key="time">{{time}}</option>
              </select>
              <p>時</p>
              <select style="width:50px;">
                <option value="" selected disabled></option>
                <option v-for = "time in minuteNumber" :key="time">{{time}}</option>
              </select>
              <p>分</p>
            </Row>
          </div>
          <div class="flex">
            <p class="label">performance start time</p>
            <Row>
              <select style="width:50px;">
                <option value="" selected disabled></option>
                <option v-for = "time in hourNumber" :key="time">{{time}}</option>
              </select>
              <p>時</p>
              <select style="width:50px;">
                <option value="" selected disabled></option>
                <option v-for = "time in minuteNumber" :key="time">{{time}}</option>
              </select>
              <p>分</p>
            </Row>
          </div>
          <div class="flex">
            <p class="label">preparation end time</p>
            <Row>
              <select style="width:50px;">
                <option value="" selected disabled></option>
                <option v-for = "time in hourNumber" :key="time">{{time}}</option>
              </select>
              <p>時</p>
              <select style="width:50px;">
                <option value="" selected disabled></option>
                <option v-for = "time in minuteNumber" :key="time">{{time}}</option>
              </select>
              <p>分</p>
            </Row>
          </div>
          <div class="flex">
            <p class="label">clean-up end time</p>
            <Row>
              <select style="width:50px;">
                <option value="" selected disabled></option>
                <option v-for = "time in hourNumber" :key="time">{{time}}</option>
              </select>
              <p>時</p>
              <select style="width:50px;">
                <option value="" selected disabled></option>
                <option v-for = "time in minuteNumber" :key="time">{{time}}</option>
              </select>
              <p>分</p>
            </Row>
          </div>
          <div class="flex">
            <p class="label">performance time</p>
            <Row>
              <select style="width:50px;">
                <option value="" selected disabled></option>
                <option v-for = "time in minuteInterval" :key="time">{{time}}</option>
              </select>
              <p>分間</p>
            </Row>
          </div>
          <div class="flex">
            <p class="label">preparation time</p>
            <Row>
              <select style="width:50px;">
                <option value="" selected disabled></option>
                <option v-for = "time in minuteInterval" :key="time">{{time}}</option>
              </select>
              <p>分間</p>
            </Row>
          </div>
          <div class="flex">
            <p class="label">clean-up time</p>
            <Row>
              <select style="width:50px;">
                <option value="" selected disabled></option>
                <option v-for = "time in minuteInterval" :key="time">{{time}}</option>
              </select>
              <p>分間</p>
            </Row>
          </div>
        </Card>
        <Row>
          <RegistButton />
          <ResetButton />
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
