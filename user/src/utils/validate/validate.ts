import { z } from 'zod';

// user登録のバリデーション
export const userSchema = z
  .object({
    name: z.string().nonempty('入力してください\nPlease enter'),
    department: z.string().nonempty('入力してください\nPlease enter'),
    grade: z.string().nonempty('入力してください\nPlease enter'),
    studentId: z
      .string()
      .regex(
        /^[0-9]{8}$/,
        '半角数字8桁で入力してください\nPlease enter 8 single-byte numbers'
      ),
    password: z
      .string()
      .min(8, '8桁以上入力してください\nPlease enter at least 8 digits'),
    passwordConfirm: z
      .string()
      .nonempty(
        'パスワードを再入力してください\nPlease re-enter your password'
      ),
    email: z
      .string()
      .nonempty('入力してください\nPlease enter')
      .email(
        'メールアドレスをご確認ください\nPlease check your e-mail address'
      ),
    tel: z
      .string()
      .regex(
        /^[0-9]{10,11}$/,
        '10桁または11桁の半角数字で入力してください\nPlease enter 10 or 11 half-digits'
      ),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'パスワードが一致しませんでした\nPassword did not match',
    path: ['passwordConfirm'],
  });

export const userDetailSchema = z.object({
  name: z.string().nonempty('入力してください\nPlease enter'),
  department: z.string().nonempty('入力してください\nPlease enter'),
  grade: z.string().nonempty('入力してください\nPlease enter'),
  studentId: z
    .string()
    .regex(
      /^[0-9]{8}$/,
      '半角数字8桁で入力してください\nPlease enter 8 single-byte numbers'
    ),
  email: z
    .string()
    .nonempty('入力してください\nPlease enter')
    .email('メールアドレスをご確認ください\nPlease check your e-mail address'),
  tel: z
    .string()
    .regex(
      /^[0-9]{10,11}$/,
      '10桁または11桁の半角数字で入力してください\nPlease enter 10 or 11 half-digits'
    ),
});

// group登録のバリデーション
export const groupSchema = z.object({
  groupName: z.string().nonempty('入力してください\nPlease enter'),
  projectName: z.string().nonempty('入力してください\nPlease enter'),
  category: z.string().nonempty('入力してください\nPlease enter'),
  activity: z.string().nonempty('入力してください\nPlease enter'),
});

// subRep登録のバリデーション
export const subRepSchema = z.object({
  name: z
    .string()
    .nonempty('入力してください\nPlease enter')
    .refine((val) => val !== 'false', {
      message: '代表者とは異なる氏名を入力してください',
    }),
  department: z.string().nonempty('入力してください\nPlease enter'),
  grade: z.string().nonempty('入力してください\nPlease enter'),
  studentId: z
    .string()
    .regex(
      /^[0-9]{8}$/,
      '半角数字8桁で入力してください\nPlease enter 8 single-byte numbers'
    )
    .nonempty('入力してください\nPlease enter')
    .refine((val) => val !== 'false', {
      message: '代表者とは異なる学籍番号を入力してください',
    }),
  email: z
    .string()
    .nonempty('入力してください\nPlease enter')
    .email('メールアドレスをご確認ください\nPlease check your e-mail address')
    .refine((val) => val !== 'false', {
      message: '代表者とは異なるメールアドレスを入力してください',
    }),
  tel: z
    .string()
    .regex(
      /^[0-9]{10,11}$/,
      '10桁または11桁の半角数字で入力してください\nPlease enter 10 or 11 half-digits'
    )
    .nonempty('入力してください\nPlease enter')
    .refine((val) => val !== 'false', {
      message: '代表者とは異なる電話番号を入力してください',
    }),
});

// place登録のバリデーション
export const placeSchema = z.object({
  first: z.string().nonempty('入力してください\nPlease enter'),
  second: z.string().nonempty('入力してください\nPlease enter'),
  third: z.string().nonempty('入力してください\nPlease enter'),
});

// stage登録のバリデーション
export const stageSchema = z
  .object({
    date: z.string().nonempty('form.validation.required'),
    sunnyFirstChoice: z
      .string()
      .nonempty('applications.stage.validation.sunnyFirst'),
    sunnySecondChoice: z
      .string()
      .nonempty('applications.stage.validation.sunnySecond'),
    rainyFirstChoice: z
      .string()
      .nonempty('applications.stage.validation.rainyFirst'),
    rainySecondChoice: z
      .string()
      .nonempty('applications.stage.validation.rainySecond'),
    prepTime: z
      .string()
      .nonempty('applications.stage.validation.prepTimeRequired')
      .refine(
        (val) => !isNaN(Number(val)) && Number(val) >= 0,
        'applications.stage.validation.prepTimeInvalid'
      ),
    performTime: z
      .string()
      .nonempty('applications.stage.validation.performTimeRequired')
      .refine(
        (val) => !isNaN(Number(val)) && Number(val) >= 0,
        'applications.stage.validation.performTimeInvalid'
      ),
    cleanupTime: z
      .string()
      .nonempty('applications.stage.validation.cleanupTimeRequired')
      .refine(
        (val) => !isNaN(Number(val)) && Number(val) >= 0,
        'applications.stage.validation.cleanupTimeInvalid'
      ),
    remarks: z.string().optional(),
    groupId: z.string().optional(),
  })
  .refine(
    (data) => {
      const total =
        Number(data.prepTime) +
        Number(data.performTime) +
        Number(data.cleanupTime);
      return total <= 120;
    },
    {
      message: 'applications.stage.validation.totalTime',
      path: ['totalTime'],
    }
  )
  .refine(
    (data) => {
      return (
        data.sunnyFirstChoice !== data.sunnySecondChoice ||
        data.sunnyFirstChoice === ''
      );
    },
    {
      message: 'applications.stage.validation.sunnyChoiceDuplicate',
      path: ['sunnySecondChoice'],
    }
  )
  .refine(
    (data) => {
      return (
        data.rainyFirstChoice !== data.rainySecondChoice ||
        data.rainyFirstChoice === ''
      );
    },
    {
      message: 'applications.stage.validation.rainyChoiceDuplicate',
      path: ['rainySecondChoice'],
    }
  );

export type StageFormData = z.infer<typeof stageSchema>;

// stage編集のバリデーション
export const editStageSchema = z
  .object({
    fesDate: z.number({ invalid_type_error: '入力してください\nPlease enter' }),
    first: z.number({ invalid_type_error: '入力してください\nPlease enter' }),
    second: z.number({ invalid_type_error: '入力してください\nPlease enter' }),
    performanceTime: z
      .number({ invalid_type_error: '入力してください\nPlease enter' })
      .min(0, '0分以上で入力してください\nPlease enter more than 0 minutes'),
    preparationTime: z
      .number({ invalid_type_error: '入力してください\nPlease enter' })
      .min(0, '0分以上で入力してください\nPlease enter more than 0 minutes'),
    cleanUpTime: z
      .number({ invalid_type_error: '入力してください\nPlease enter' })
      .min(0, '0分以上で入力してください\nPlease enter more than 0 minutes'),
  })
  .superRefine((data, ctx) => {
    if (data.first !== 1 && data.second !== 1 && data.first === data.second) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['first'],
        message: '同じステージを選択しています\nThe same stage is selected',
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['second'],
        message: '同じステージを選択しています\nThe same stage is selected',
      });
    }
    const total =
      Number(data.performanceTime) +
      Number(data.preparationTime) +
      Number(data.cleanUpTime);
    if (total > 120) {
      const errorMsg =
        '合計120分以内で入力してください\nPlease enter up to 120 minutes total';
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['performanceTime'],
        message: errorMsg,
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['preparationTime'],
        message: errorMsg,
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['cleanUpTime'],
        message: errorMsg,
      });
    }
  });

// stageOption登録のバリデーション
export const stageOptionSchema = z.object({
  isItem: z.boolean({ required_error: '入力してください\nPlease enter' }),
  isMusic: z.boolean({ required_error: '入力してください\nPlease enter' }),
  isCamera: z.boolean({ required_error: '入力してください\nPlease enter' }),
  isNoise: z.boolean({ required_error: '入力してください\nPlease enter' }),
});

// item登録のバリデーション
export const itemSchema = z.object({
  items: z.array(
    z.object({
      itemNameId: z.number({
        invalid_type_error: '入力してください\nPlease enter',
      }),
      itemNum: z
        .number({
          invalid_type_error:
            '半角数字を入力してください\nPlease enter one-byte numbers',
        })
        .min(1, '0個以上で入力してください\nPlease enter 1 or more.'),
    })
  ),
});

export const editItemSchema = z.object({
  itemNameId: z.number({
    invalid_type_error: '入力してください\nPlease enter',
  }),
  itemNum: z
    .number({
      invalid_type_error:
        '半角数字を入力してください\nPlease enter one-byte numbers',
    })
    .min(1, '0個以上で入力してください\nPlease enter 1 or more.'),
});

// power登録のバリデーション
export const powerSchema = z.object({
  powers: z.array(
    z.object({
      productName: z.string().nonempty('入力してください\nPlease enter'),
      maxPower: z
        .number({
          invalid_type_error:
            '半角数字を入力してください\nPlease enter one-byte numbers',
        })
        .min(1, '0W以上で入力してください\nPlease enter more than 0 W'),
      manufacturer: z.string().nonempty('入力してください\nPlease enter'),
      model: z.string().nonempty('入力してください\nPlease enter'),
      url: z
        .string()
        .nonempty('入力してください\nPlease enter')
        .url('URLを入力してください\nPlease enter URL'),
    })
  ),
});

export const editPowerSchema = z.object({
  productName: z.string().nonempty('入力してください\nPlease enter'),
  maxPower: z
    .number({
      invalid_type_error:
        '半角数字を入力してください\nPlease enter one-byte numbers',
    })
    .min(1, '0W以上で入力してください\nPlease enter more than 0 W'),
  manufacturer: z.string().nonempty('入力してください\nPlease enter'),
  model: z.string().nonempty('入力してください\nPlease enter'),
  url: z
    .string()
    .nonempty('入力してください\nPlease enter')
    .url('URLを入力してください\nPlease enter URL'),
});

// employee登録のバリデーション
export const employeeSchema = z.object({
  employees: z.array(
    z.object({
      name: z.string().nonempty('入力してください\nPlease enter'),
      studentId: z
        .string()
        .nonempty('入力してください\nPlease enter')
        .regex(
          /^[0-9]{8}$/,
          '半角数字8桁で入力してください\nPlease enter 8 single-byte numbers'
        ),
    })
  ),
});

export const editEmployeeSchema = z.object({
  name: z.string().nonempty('入力してください\nPlease enter'),
  studentId: z
    .string()
    .nonempty('入力してください\nPlease enter')
    .regex(
      /^[0-9]{8}$/,
      '半角数字8桁で入力してください\nPlease enter 8 single-byte numbers'
    ),
});

// purchase登録のバリデーション
export const purchaseSchema = z.object({
  purchaseList: z.array(
    z.object({
      foodProductId: z.string().nonempty('選択してください\nPlease select'),
      shopId: z.string().nonempty('選択してください\nPlease select'),
      item: z.string().nonempty('入力してください\nPlease enter'),
      purchaseDate: z.string().nonempty('選択してください\nPlease select'),
    })
  ),
});

export const editPurchaseSchema = z.object({
  foodProductId: z.string().nonempty('選択してください\nPlease select'),
  shopId: z.string().nonempty('選択してください\nPlease select'),
  item: z.string().nonempty('入力してください\nPlease enter'),
  purchaseDate: z.string().nonempty('選択してください\nPlease select'),
});

// food登録のバリデーション
export const foodSchema = z.object({
  foods: z.array(
    z.object({
      dishName: z.string().nonempty('入力してください\nPlease enter'),
      numFirstDay: z
        .number({
          invalid_type_error:
            '半角数字を入力してください\nPlease enter one-byte numbers',
        })
        .min(1, '1以上登録してください\nRegister 1 or more'),
      numSecondDay: z
        .number({
          invalid_type_error:
            '半角数字を入力してください\nPlease enter one-byte numbers',
        })
        .min(1, '1以上登録してください\nRegister 1 or more'),
    })
  ),
});

export const editFoodSchema = z.object({
  dishName: z.string().nonempty('入力してください\nPlease enter'),
  numFirstDay: z
    .number({
      invalid_type_error:
        '半角数字を入力してください\nPlease enter one-byte numbers',
    })
    .min(1, '1以上登録してください\nRegister 1 or more'),
  numSecondDay: z
    .number({
      invalid_type_error:
        '半角数字を入力してください\nPlease enter one-byte numbers',
    })
    .min(1, '1以上登録してください\nRegister 1 or more'),
});

// passwordReset登録のバリデーション
export const passwordResetSchema = z
  .object({
    password: z
      .string()
      .min(8, '8桁以上入力してください\nPlease enter at least 8 digits'),
    passwordConfirm: z
      .string()
      .nonempty(
        'パスワードを再入力してください\nPlease re-enter your password'
      ),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'パスワードが一致しませんでした\nPassword did not match',
    path: ['passwordConfirm'],
  });

// contactPerson登録のバリデーション
export const contactPersonSchema = z.object({
  name: z.string().nonempty('入力してください\nPlease enter'),
  email: z
    .string()
    .nonempty('入力してください\nPlease enter')
    .email('メールアドレスをご確認ください\nPlease check your e-mail address'),
});

// cookingProcess登録のバリデーション
export const cookingProcessOrderSchema = z.object({
  preOpenKitchen: z.boolean({
    required_error: '入力してください\nPlease enter',
  }),
  duringOpenKitchen: z.boolean({
    required_error: '入力してください\nPlease enter',
  }),
  tent: z.string().nonempty('入力してください\nPlease enter'),
});

// announcement登録のバリデーション
export const announcementSchema = z.object({
  message: z
    .string()
    .nonempty('入力してください\nPlease enter')
    .refine(
      (value) => {
        const isJapanese =
          /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}ーa-zA-Z0-9ａ-ｚＡ-Ｚ０-９々〆〤]/u.test(
            value
          );
        if (isJapanese) {
          return value.length <= 300;
        } else {
          const wordCount = value.split(' ').length;
          return wordCount <= 125;
        }
      },
      {
        message:
          '日本語の場合は300字未満、英語の場合は125words未満で入力してください\nPlease enter less than 300 characters for Japanese and less than 125 words for English',
      }
    ),
  status: z.string().nonempty('選択してください\nPlease select'),
});
