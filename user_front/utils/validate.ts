import { object, string, ref } from 'yup';

export const userSchema = object({
  name: string().required("入力してください"),
  department: string().required("入力してください"),
  grade: string().required("入力してください"),
  studentId: string().matches(/^[0-9]{8}$/, "半角数字8桁で入力してください").required("入力してください"),
  password: string().required("入力してください").min(8, "8桁以上入力してください"),
  passwordConfirm: string().required("パスワードを再入力してください").oneOf([ref("password")], "パスワードが一致しませんでした"),
  email: string().email('メールアドレスをご確認ください').required("入力してください"),
  tel: string().matches(/^[0-9]{10,11}$/, "10桁または11桁の半角数字で入力してください").required("入力してください")
});

export const groupSchema = object({
  groupName: string().required("入力してください"),
  projectName: string().required("入力してください"),
  category: string().required("入力してください"),
  activity: string().required("入力してください"),
});
