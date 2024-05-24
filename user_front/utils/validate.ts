import { object, string, ref, boolean, number, array } from 'yup';

// user登録のバリデーション
export const userSchema = object({
  name: string().required("入力してください\nPlease enter"),
  department: string().required("入力してください\nPlease enter"),
  grade: string().required("入力してください\nPlease enter"),
  studentId: string().matches(/^[0-9]{8}$/, "半角数字8桁で入力してください\nPlease enter 8 single-byte numbers").required("入力してください\nPlease enter"),
  password: string().required("入力してください\nPlease enter").min(8, "8桁以上入力してください\nPlease enter at least 8 digits"),
  passwordConfirm: string().required("パスワードを再入力してください\nPlease re-enter your password").oneOf([ref("password")], "パスワードが一致しませんでした\nPassword did not match"),
  email: string().email('メールアドレスをご確認ください\nPlease check your e-mail address').required("入力してください\nPlease enter"),
  tel: string().matches(/^[0-9]{10,11}$/, "10桁または11桁の半角数字で入力してください\nPlease enter 10 or 11 half-digits").required("入力してください\nPlease enter")
});

export const userDetailSchema = object({
  name: string().required("入力してください\nPlease enter"),
  department: string().required("入力してください\nPlease enter"),
  grade: string().required("入力してください\nPlease enter"),
  studentId: string().matches(/^[0-9]{8}$/, "半角数字8桁で入力してください\nPlease enter 8 single-byte numbers").required("入力してください\nPlease enter"),
  email: string().email('メールアドレスをご確認ください\nPlease check your e-mail address').required("入力してください\nPlease enter"),
  tel: string().matches(/^[0-9]{10,11}$/, "10桁または11桁の半角数字で入力してください\nPlease enter 10 or 11 half-digits").required("入力してください\nPlease enter")
})

// group登録のバリデーション
export const groupSchema = object({
  groupName: string().required("入力してください\nPlease enter"),
  projectName: string().required("入力してください\nPlease enter"),
  category: string().required("入力してください\nPlease enter"),
  activity: string().required("入力してください\nPlease enter"),
});

// subRep登録のバリデーション
export const subRepSchema = object({
  name: string().required("入力してください\nPlease enter").notOneOf(['false'],"代表者とは異なる氏名を入力してください"),
  department: string().required("入力してください\nPlease enter"),
  grade: string().required("入力してください\nPlease enter"),
  studentId: string().matches(/^[0-9]{8}$/, "半角数字8桁で入力してください\nPlease enter 8 single-byte numbers").required("入力してください\nPlease enter").notOneOf(['false'],"代表者とは異なる学籍番号を入力してください"),
  email: string().email('メールアドレスをご確認ください\nPlease check your e-mail address').required("入力してください\nPlease enter").notOneOf(['false'],"代表者とは異なるメールアドレスを入力してください"),
  tel: string().matches(/^[0-9]{10,11}$/, "10桁または11桁の半角数字で入力してください\nPlease enter 10 or 11 half-digits").required("入力してください\nPlease enter").notOneOf(['false'],"代表者とは異なる電話番号を入力してください"),
});

// place登録のバリデーション
export const placeSchema = object({
  first: string().required("入力してください\nPlease enter"),
  second: string().required("入力してください\nPlease enter"),
  third: string().required("入力してください\nPlease enter"),
});

// stage登録のバリデーション
export const stageSchema = object({
  weather: string().typeError('入力してください\nPlease enter').required("入力してください\nPlease enter"),
  fesDate: number().typeError('入力してください\nPlease enter').required("入力してください\nPlease enter"),
  first: number().typeError('入力してください\nPlease enter').required("入力してください\nPlease enter")
    .test({
      name: 'first',
      message: "同じステージを選択しています\nThe same stage is selected",
      test(value) {
        const second = this.resolve(ref("second")) ?? 1;
        if (second === 1) {
          return true;
        }
        return value !== second;
      },
    }),
  second: number().typeError('入力してください\nPlease enter').required("入力してください\nPlease enter")
    .test({
      name: 'second',
      message: "同じステージを選択しています\nThe same stage is selected",
      test(value) {
        const first = this.resolve(ref("first")) ?? 1;
        if (first === 1) {
          return true;
        }
        return value !== first;
      },
    }),
  performanceTime: number().typeError('入力してください\nPlease enter').required("入力してください\nPlease enter").min(0, "0分以上で入力してください\nPlease enter more than 0 minutes")
    .test({
      name: 'cleanUpTime',
      message: "合計120分以内で入力してください\nPlease enter up to 120 minutes total",
      test(value) {
        const preparationTime = this.resolve(ref("preparationTime")) || 0;
        const cleanUpTime = this.resolve(ref("cleanUpTime")) || 0;
        return value + Number(preparationTime) + Number(cleanUpTime) <= 120;
      },
    }),
  preparationTime: number().typeError('入力してください\nPlease enter').required("入力してください\nPlease enter").min(0, "0分以上で入力してください\nPlease enter more than 0 minutes")
  .test({
    name: 'cleanUpTime',
    message: "合計120分以内で入力してください\nPlease enter up to 120 minutes total",
    test(value) {
      const performanceTime = this.resolve(ref("performanceTime")) || 0;
      const cleanUpTime = this.resolve(ref("cleanUpTime")) || 0;
      return value + Number(performanceTime) + Number(cleanUpTime) <= 120;
    },
  }),
  cleanUpTime: number().typeError('入力してください\nPlease enter').required("入力してください\nPlease enter").min(0, "0分以上で入力してください\nPlease enter more than 0 minutes")
    .test({
      name: 'cleanUpTime',
      message: "合計120分以内で入力してください\nPlease enter up to 120 minutes total",
      test(value) {
        const performanceTime = this.resolve(ref("performanceTime")) || 0;
        const preparationTime = this.resolve(ref("preparationTime")) || 0;
        return value + Number(performanceTime) + Number(preparationTime) <= 120;
      },
    }),
});

// stage編集のバリデーション
export const editStageSchema = object({
  fesDate: number().typeError('入力してください\nPlease enter').required("入力してください\nPlease enter"),
  first: number().typeError('入力してください\nPlease enter').required("入力してください\nPlease enter")
    .test({
      name: 'first',
      message: "同じステージを選択しています\nThe same stage is selected",
      test(value) {
        const second = this.resolve(ref("second")) ?? 1;
        if (second === 1) {
          return true;
        }
        return value !== second;
      },
    }),
  second: number().typeError('入力してください\nPlease enter').required("入力してください\nPlease enter")
    .test({
      name: 'second',
      message: "同じステージを選択しています\nThe same stage is selected",
      test(value) {
        const first = this.resolve(ref("first")) ?? 1;
        if (first === 1) {
          return true;
        }
        return value !== first;
      },
    }),
  performanceTime: number().typeError('入力してください\nPlease enter').required("入力してください\nPlease enter").min(0, "0分以上で入力してください\nPlease enter more than 0 minutes")
    .test({
      name: 'cleanUpTime',
      message: "合計120分以内で入力してください\nPlease enter up to 120 minutes total",
      test(value) {
        const preparationTime = this.resolve(ref("preparationTime")) || 0;
        const cleanUpTime = this.resolve(ref("cleanUpTime")) || 0;
        return value + Number(preparationTime) + Number(cleanUpTime) <= 120;
      },
    }),
  preparationTime: number().typeError('入力してください\nPlease enter').required("入力してください\nPlease enter").min(0, "0分以上で入力してください\nPlease enter more than 0 minutes")
  .test({
    name: 'cleanUpTime',
    message: "合計120分以内で入力してください\nPlease enter up to 120 minutes total",
    test(value) {
      const performanceTime = this.resolve(ref("performanceTime")) || 0;
      const cleanUpTime = this.resolve(ref("cleanUpTime")) || 0;
      return value + Number(performanceTime) + Number(cleanUpTime) <= 120;
    },
  }),
  cleanUpTime: number().typeError('入力してください\nPlease enter').required("入力してください\nPlease enter").min(0, "0分以上で入力してください\nPlease enter more than 0 minutes")
    .test({
      name: 'cleanUpTime',
      message: "合計120分以内で入力してください\nPlease enter up to 120 minutes total",
      test(value) {
        const performanceTime = this.resolve(ref("performanceTime")) || 0;
        const preparationTime = this.resolve(ref("preparationTime")) || 0;
        return value + Number(performanceTime) + Number(preparationTime) <= 120;
      },
    }),
});

// stageOption登録のバリデーション
export const stageOptionSchema = object({
  isItem: boolean().required("入力してください\nPlease enter"),
  isMusic: boolean().required("入力してください\nPlease enter"),
  isCamera: boolean().required("入力してください\nPlease enter"),
  isNoise: boolean().required("入力してください\nPlease enter"),
});

// item登録のバリデーション
export const itemSchema = object({
  items: array()
    .of(
      object().shape({
        itemNameId: number().typeError('入力してください\nPlease enter').required("入力してください\nPlease enter"),
        itemNum: number().typeError('半角数字を入力してください\nPlease enter one-byte numbers').required("入力してください\nPlease enter").min(1, "0個以上で入力してください\nPlease enter 1 or more."),
      })
    ).strict(),
});
export const editItemSchema = object({
  itemNameId: number().typeError('入力してください\nPlease enter').required("入力してください\nPlease enter"),
  itemNum: number().typeError('半角数字を入力してください\nPlease enter one-byte numbers').required("入力してください\nPlease enter").min(1, "0個以上で入力してください\nPlease enter 1 or more."),
});

// power登録のバリデーション
export const powerSchema = object({
  powers: array()
    .of(
      object().shape({
        productName: string().required("入力してください\nPlease enter"),
        maxPower: number().required("入力してください\nPlease enter").min(1, "0W以上で入力してください\nPlease enter more than 0 W").typeError('半角数字を入力してください\nPlease enter one-byte numbers'),
        manufacturer: string().required("入力してください\nPlease enter"),
        model: string().required("入力してください\nPlease enter"),
        url: string().required("入力してください\nPlease enter").url("URLを入力してください\nPlease enter URL"),
      })
    ).strict(),
});
export const editPowerSchema = object({
  productName: string().required("入力してください\nPlease enter"),
  maxPower: number().required("入力してください\nPlease enter").min(1, "0W以上で入力してください\nPlease enter more than 0 W").typeError('半角数字を入力してください\nPlease enter one-byte numbers'),
  manufacturer: string().required("入力してください\nPlease enter"),
  model: string().required("入力してください\nPlease enter"),
  url: string().required("入力してください\nPlease enter").url("URLを入力してください\nPlease enter URL"),
});

// employee登録のバリデーション
export const employeeSchema = object({
  employees: array()
  .of(
    object().shape({
      name: string().required("入力してください\nPlease enter"),
      studentId: string().required("入力してください\nPlease enter").matches(/^[0-9]{8}$/, "半角数字8桁で入力してください\nPlease enter 8 single-byte numbers"),
    })
  ).strict(),
});
export const editEmployeeSchema = object({
  name: string().required("入力してください\nPlease enter"),
  studentId: string().required("入力してください\nPlease enter").matches(/^[0-9]{8}$/, "半角数字8桁で入力してください\nPlease enter 8 single-byte numbers"),
});

// purchase登録のバリデーション
export const purchaseSchema = object({
  purchaseList: array()
  .of(
    object().shape({
      foodProductId: string().required("選択してください\nPlease select").typeError("選択してください\nPlease select"),
      shopId: string().required("選択してください\nPlease select").typeError("選択してください\nPlease select"),
      item: string().required("入力してください\nPlease enter").typeError("入力してください\nPlease enter"),
      purchaseDate: string().required("選択してください\nPlease select").typeError("選択してください\nPlease select"),
    })
  ).strict(),
});
export const editPurchaseSchema = object({
  foodProductId: string().required("選択してください\nPlease select").typeError("選択してください\nPlease select"),
  shopId: string().required("選択してください\nPlease select").typeError("選択してください\nPlease select"),
  item: string().required("入力してください\nPlease enter").typeError("入力してください\nPlease enter"),
  purchaseDate: string().required("選択してください\nPlease select").typeError("選択してください\nPlease select"),
});

// food登録のバリデーション
export const foodSchema = object({
  foods: array()
  .of(
    object().shape({
      dishName: string().required("入力してください\nPlease enter"),
      numFirstDay: number().typeError('半角数字を入力してください\nPlease enter one-byte numbers').required("入力してください\nPlease enter").min(1,"1以上登録してください\nRegister 1 or more"),
      numSecondDay:number().typeError('半角数字を入力してください\nPlease enter one-byte numbers').required("入力してください\nPlease enter").min(1,"1以上登録してください\nRegister 1 or more"),
    })
  ).strict(),
});
export const editFoodSchema = object({
  dishName: string().required("入力してください\nPlease enter"),
  numFirstDay: number().typeError('半角数字を入力してください\nPlease enter one-byte numbers').required("入力してください\nPlease enter").min(1,"1以上登録してください\nRegister 1 or more"),
  numSecondDay: number().typeError('半角数字を入力してください\nPlease enter one-byte numbers').required("入力してください\nPlease enter").min(1,"1以上登録してください\nRegister 1 or more"),
});

// passwordReset登録のバリデーション
export const passwordResetSchema = object({
  password: string().required("入力してください\nPlease enter").min(8, "8桁以上入力してください\nPlease enter at least 8 digits"),
  passwordConfirm: string().required("パスワードを再入力してください\nPlease re-enter your password").oneOf([ref("password")], "パスワードが一致しませんでした\nPassword did not match")
});

// contactPerson登録のバリデーション
export const contactPersonSchema = object({
  name: string().required("入力してください\nPlease enter"),
  email: string().email('メールアドレスをご確認ください\nPlease check your e-mail address').required("入力してください\nPlease enter")
});

// cookingProcess登録のバリデーション
export const cookingProcessOrderSchema = object({
  preOpenKitchen: boolean().required("入力してください\nPlease enter"),
  duringOpenKitchen: boolean().required("入力してください\nPlease enter"),
  tent: string().required("入力してください\nPlease enter"),
});

// announcement登録のバリデーション
export const announcementSchema = object({
  message: string().required("入力してください\nPlease enter")
    .test('is-valid-length', '日本語の場合は300字未満、英語の場合は125words未満で入力してください\nPlease enter less than 300 characters for Japanese and less than 125 words for English', (value) => {
      if (!value) return true;
      const isJapanese = /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}ーa-zA-Z0-9ａ-ｚＡ-Ｚ０-９々〆〤]/u.test(value);
      if (isJapanese) {
        return value.length <= 300;
      } else {
        const wordCount = value.split(' ').length;
        return wordCount <= 125;
      }
    }),
  status: string().required("選択してください\nPlease select"),
});
