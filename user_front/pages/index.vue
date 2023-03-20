<script lang="ts" setup>
  import { useField, useForm } from 'vee-validate';
  import { object, string, number } from 'yup';

  const schema = object({
    studentId: string().matches(/^[0-9]{8}$/, "半角数字のみ8桁").required("必須項目"),
    password: string().matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, "半角英字と半角数字を1文字以上使用し8桁以上").required("必須項目")
  });

  const { errors } = useForm({
    validationSchema: schema,
  });

  const { value: studentId } = useField('studentId');
  const { value: password, meta } = useField('password');

</script>

<template>
  <h1>Vee-Validateでフォームバリデーション</h1>
  <div><label for="studentId">学籍番号</label></div>
  <input type="text" v-model="studentId" id="studentId"/>
  <p>{{ errors.studentId }}</p>
  <div>
    <label for="password" >パスワード(半角数字のみ8桁)</label>
    <Button />
  </div>
  <input type="text" v-model="password" id="password"/>
  <p>{{ errors.password }}</p>
</template>
