<script lang="ts" setup>
import axios from 'axios'

const config = useRuntimeConfig()

const item = ref("")
const num = ref('')
const resultNum = ref(0)
const itemList = ref([""])
const setting = ref("")
const groupId = ref("")



onMounted(() => {
  const url = config.baseURL + "/api/v1/current_user/current_regist_info";
    axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          "access-token": localStorage.getItem("access-token"),
          client: localStorage.getItem("client"),
          uid: localStorage.getItem("uid"),
      },
        })
        .then((response) => {
          itemList.value = response.data.data[0].rental_orders;
        });
  console.log(itemList.value)
  const settingurl = config.APIURL + "/user_page_settings";
  axios.get(settingurl).then((response) => {
    setting.value = response.data.data[0];
  });
})

// const register = () => {
//   if (!!item.value && resultNum.value > 0) {
//     axios.defaults.headers.common["Content-Type"] = "application/json";
//     let params = new URLSearchParams();
//     params.append("group_id", groupId.value);
//     params.append("rental_item_id", item.value);
//     params.append("num", num.value);
//     axios
//       .post(config.app.baseURL + "/rental_orders", params)
//       .then((response) => {
//         console.log(response);
//         // $emit("closeAddItem");
//         // $emit("reload");
//       });
//   }
// }

</script>

<template>
  {{ setting }}
  <div>title</div>
  {{ itemList }}
  <RegistInfoNarrowCard>
    <template #body>
      <div class="absolute w-full mt-8 text-4xl font-[350] text-center">
        パーテーション足
      </div>
      <p class="absolute bottom-4 left-16 font-[350]">
        <span class="text-5xl">
          100
        </span>
        <span class="text-2xl">個</span>
      </p>
    </template>
    <template #method>
      <div class="absolute right-4 bottom-2">
        <div class="my-2">
          <EditButton />
        </div>
      <DeleteButton />
      </div>
    </template>
  </RegistInfoNarrowCard>
</template>
