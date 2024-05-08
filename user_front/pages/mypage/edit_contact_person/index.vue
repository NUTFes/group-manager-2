<script lang="ts" setup>
import axios from "axios";
import { ContactPerson } from '@/types/regist/contactPerson';
import { useForm, useField } from "vee-validate";
import { contactPersonSchema } from "~~/utils/validate";
import { loginCheck } from "@/utils/methods";

const router = useRouter();
const config = useRuntimeConfig();

const ContactPersonName = ref<string>("");
const ContactPersonEmail = ref<string>("");
const groupId = Number(localStorage.getItem("group_id"));
const isSubmitting = ref<boolean>(false);

const { meta } = useForm({
  validationSchema: contactPersonSchema,
});

const { handleChange: handleChangeContactPersonName, errorMessage: ContactPersonNameError } = useField("name");
const { handleChange: handleChangeContactPersonEmail, errorMessage: ContactPersonEmailError,} = useField("email");

onMounted(() => {
  loginCheck();
  const contactPersonUrl = config.APIURL + "/contact_persons/";
  axios.get(contactPersonUrl).then((response) => {
    const contactPersons: ContactPerson[] = response.data;
    const contactPerson = contactPersons.find((cp) => cp.group_id === groupId);
    ContactPersonName.value = contactPerson?.name || "";
    ContactPersonEmail.value = contactPerson?.email || "";
    console.log(contactPerson)
    console.log(ContactPersonName.value)
    console.log(ContactPersonEmail.value)
  });
});

const register = () => {
  isSubmitting.value = true;
  console.log(ContactPersonName.value)

  if (ContactPersonName.value) {
    const contactPersonUrl = config.APIURL + "/contact_persons/" + groupId;
    axios
    .put(contactPersonUrl, {
      group_id: groupId,
      name: ContactPersonName.value,
      email: ContactPersonEmail.value,
    })
    .then(() => {
      alert("登録できました\nRegistration Success");
      router.push("/mypage");
    })
    .catch(() => {
      alert("登録できませんでした\nRegistration Failure");
    });
  } else {
    const contactPersonUrl = config.APIURL + "/contact_persons/";
    axios
    .post(contactPersonUrl, {
      group_id: groupId,
      name: ContactPersonName.value,
      email: ContactPersonEmail.value,
    })
    .then(() => {
      alert("登録できました\nRegistration Success");
      router.push("/mypage");
    })
    .catch(() => {
      alert("登録できませんでした\nRegistration Failure");
    });
  }
};

const buttonDisabled = computed(() => {
  return !!(
    ContactPersonNameError.value ||
    ContactPersonEmailError.value
  );
});
</script>

<template>
  <div class="w-2/3 mx-auto">
    <div class="w-full text-2xl my-8 font-bold bg-[#eceff1] p-2 rounded-md">
      {{ $t("contactPerson.editContactPerson") }}
    </div>
    <div class="border p-4 my-4 rounded-md flex flex-col gap-8">
      <div class="flex flex-col gap-2">
        <div class="text-lg">
          {{ $t("contactPerson.name") }}
        </div>
        <input
          class="rounded-md border border-black p-2 text-xl"
          id="name"
          type="text"
          v-model="ContactPersonName"
          @change="handleChangeContactPersonName"
        />
        <p class="text-red-500 text-sm" v-if="ContactPersonNameError">
          {{ ContactPersonNameError }}
        </p>
      </div>
      <div class="flex flex-col gap-2">
        <div class="text-lg">
          {{ $t("contactPerson.mail") }}
        </div>
        <input
          class="rounded-md border border-black p-2 text-xl"
          id="email"
          type="text"
          v-model="ContactPersonEmail"
          @change="handleChangeContactPersonEmail"
        />
        <p class="text-red-500 text-sm" v-if="ContactPersonEmailError">
          {{ ContactPersonEmailError }}
        </p>
      </div>
    </div>
    <div class="w-fit ml-auto mt-4 mb-12">
      <button
        @click="register"
        class="text-xl text-gray-800 bg-gray-300 rounded-lg py-2 px-4 font-bold disabled:opacity-50 bg-gradient-to-r hover:from-pink-400 hover:to-yellow-500"
        :disabled="buttonDisabled || isSubmitting"
      >
        {{ $t("Button.edit") }}
      </button>
    </div>
  </div>
</template>
