import { object, string, ref, boolean, number } from 'yup';

// user登録のバリデーション
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

// group登録のバリデーション
export const groupSchema = object({
  groupName: string().required("入力してください"),
  projectName: string().required("入力してください"),
  category: string().required("入力してください"),
  activity: string().required("入力してください"),
});

// subRep登録のバリデーション
export const subRepSchema = object({
  name: string().required("入力してください"),
  department: string().required("入力してください"),
  grade: string().required("入力してください"),
  studentId: string().matches(/^[0-9]{8}$/, "半角数字8桁で入力してください").required("入力してください"),
  email: string().email('メールアドレスをご確認ください').required("入力してください"),
  tel: string().matches(/^[0-9]{10,11}$/, "10桁または11桁の半角数字で入力してください").required("入力してください")
});

// place登録のバリデーション
export const placeSchema = object({
  first: string().required("入力してください"),
  second: string().required("入力してください"),
  third: string().required("入力してください"),
  remark: string().required("入力してください"),
});

// stage登録のバリデーション
export const stageSchema = object({
  fesDate: string().required("入力してください"),
  first: string().required("入力してください"),
  second: string().required("入力してください"),
  useTimeInterval: string().required("入力してください"),
  prepareTimeInterval: string().required("入力してください"),
  clenupTimeInterval: string().required("入力してください"),
});

// stageOption登録のバリデーション
export const stageOptionSchema = object({
  isItem: boolean().required("入力してください"),
  isMusic: boolean().required("入力してください"),
  isCamera: boolean().required("入力してください"),
  isNoise: boolean().required("入力してください"),
  stageContent: string().required("入力してください"),
});

// item登録のバリデーション
export const itemSchema = object({
  itemName: string().required("入力してください"),
  itemNum: number().required("入力してください"),
});

// power登録のバリデーション
export const powerSchema = object({
  productName: string().required("入力してください"),
  powerNum: number().max(1500).required("入力してください"),
  manufacturer: string().required("入力してください"),
  model: string().required("入力してください"),
  url: string().required("入力してください"),
});

// employee登録のバリデーション
export const employeeSchema = object({
  name: string().required("入力してください"),
  studentId: string().matches(/^[0-9]{8}$/, "半角数字8桁で入力してください").required("入力してください"),
});

// purchase登録のバリデーション
export const purchaseSchema = object({
  foodProductId: number().required("入力してください"),
  shopId: number().required("入力してください"),
  item: string().required("入力してください"),
  isFresh: boolean().required("入力してください"),
  fesDateId: number().required("入力してください"),
});

// food登録のバリデーション
export const foodSchema = object({
  dishName: string().required("入力してください"),
  isCook: boolean().required("入力してください"),
  numFirstDay: number().required("入力してください"),
  numSecondDay: number().required("入力してください"),
});
