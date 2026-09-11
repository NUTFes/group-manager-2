import { z } from 'zod';

const VALIDATION_MESSAGES = {
  NAME: 'applications.viceRepresentative.validation.name',
  STUDENT_ID_INTEGER:
    'applications.viceRepresentative.validation.studentIdInteger',
  STUDENT_ID_LENGTH:
    'applications.viceRepresentative.validation.studentIdLength',
  GRADE: 'applications.viceRepresentative.validation.gradeId',
  DEPARTMENT: 'applications.viceRepresentative.validation.departmentId',
  EMAIL_REQUIRED: 'applications.viceRepresentative.validation.email',
  EMAIL_INVALID: 'applications.viceRepresentative.validation.emailFormat',
  TEL: 'applications.viceRepresentative.validation.tel',
} as const;

export const viceRepresentativeSchema = z.object({
  groupId: z.number(),
  name: z.string().min(1, { message: VALIDATION_MESSAGES.NAME }),
  studentId: z
    .number()
    .int({ message: VALIDATION_MESSAGES.STUDENT_ID_INTEGER })
    .gte(10000000, { message: VALIDATION_MESSAGES.STUDENT_ID_LENGTH })
    .lte(99999999, { message: VALIDATION_MESSAGES.STUDENT_ID_LENGTH }),
  gradeId: z.number().gt(0, { message: VALIDATION_MESSAGES.GRADE }),
  departmentId: z.number().gt(0, { message: VALIDATION_MESSAGES.DEPARTMENT }),
  email: z
    .string()
    .min(1, { message: VALIDATION_MESSAGES.EMAIL_REQUIRED })
    .email({ message: VALIDATION_MESSAGES.EMAIL_INVALID }),
  tel: z.string().regex(/^0\d{9,10}$/, {
    message: VALIDATION_MESSAGES.TEL,
  }),
});

export type ViceRepresentativeForm = z.infer<typeof viceRepresentativeSchema>;
