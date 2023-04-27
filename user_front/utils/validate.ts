import { object, string, ref, boolean, number, array } from 'yup';

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
  fesDate: number().required("入力してください"),
  first: number().required("入力してください"),
  second: number().required("入力してください"),
  performanceTime: string().required("入力してください").matches(/\d+/, '半角数字を入力してください').matches(/\b^(?!-).*$\b/, '正の数を入力してください'),
  preparationTime: string().required("入力してください").matches(/\d+/, '半角数字を入力してください').matches(/\b^(?!-).*$\b/, '正の数を入力してください'),
  cleanUpTime: string().required("入力してください").matches(/\d+/, '半角数字を入力してください').matches(/\b^(?!-).*$\b/, '正の数を入力してください')
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
  items: array()
    .of(
      object().shape({
        itemNameId: number().required("入力してください"),
        itemNum: string().typeError('半角数字を入力してください').required("入力してください").matches(/\d+/, '半角数字を入力してください').matches(/\b^(?!-).*$\b/, '正の数を入力してください'),
      })
    ).strict(),
});

// power登録のバリデーション
export const powerSchema = object({
  powers: array()
    .of(
      object().shape({
        productName: string().required("入力してください"),
        maxPower: string().required("入力してください").typeError('半角数字を入力してください').matches(/\b^(?!-).*$\b/, '正の数を入力してください').matches(/\b[0-9]\b|\b[1-9][0-9]\b|\b[1-9][0-9][0-9]\b|\b1[0-4][0-9][0-9]\b|\b1500\b/, '1500以下を入力してください'),
        manufacturer: string().required("入力してください"),
        model: string().required("入力してください"),
        url: string().required("入力してください").url("URLを入力してください"),
      })
    ).strict(),
});

// employee登録のバリデーション
export const employeeSchema = object({
  employees: array()
  .of(
    object().shape({
      name: string().required("入力してください"),
      studentId: string().required("入力してください").matches(/^[0-9]{8}$/, "半角数字8桁で入力してください"),
    })
  ).strict(),
});

// purchase登録のバリデーション
export const purchaseSchema = object({
  purchaseList: array()
  .of(
    object().shape({
      foodProductId: number().required("選択してください").typeError("選択してください"),
      shopId: number().required("選択してください").typeError("選択してください"),
      item: string().required("入力してください").typeError("入力してください"),
      isFresh: string().required("選択してください").typeError("選択してください"),
      fesDateId: number().required("選択してください").typeError("選択してください"),
    })
  ).strict(),
});

// food登録のバリデーション
export const foodSchema = object({
  foods: array()
  .of(
    object().shape({
      dishName: string().required("入力してください"),
      numFirstDay: string().typeError('半角数字を入力してください').required("入力してください").matches(/\d+/, '半角数字を入力してください').matches(/\b^(?!-).*$\b/, '正の数を入力してください'),
      numSecondDay: string().typeError('半角数字を入力してください').required("入力してください").matches(/\d+/, '半角数字を入力してください').matches(/\b^(?!-).*$\b/, '正の数を入力してください'),
    })
  ).strict(),
});
