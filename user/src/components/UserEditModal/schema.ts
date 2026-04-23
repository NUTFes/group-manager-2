import { z } from 'zod';

const VALIDATION_MESSAGES = {
  NAME: 'userEditModal.validation.name',
  STUDENT_ID: 'userEditModal.validation.studentId',
  TEL: 'userEditModal.validation.tel',
  TEL_MIN: 'userEditModal.validation.telMin',
  TEL_MAX: 'userEditModal.validation.telMax',
  EMAIL: 'userEditModal.validation.email',
  DEPARTMENT: 'userEditModal.validation.department',
  GRADE: 'userEditModal.validation.grade',
} as const;

export const EditUserDetailsSchema = z.object({
  name: z.string().min(1, VALIDATION_MESSAGES.NAME),
  studentId: z.string().regex(/^\d{8}$/, VALIDATION_MESSAGES.STUDENT_ID),
  tel: z
    .string()
    .regex(/^0\d{9,10}$/, VALIDATION_MESSAGES.TEL)
    .min(10, VALIDATION_MESSAGES.TEL_MIN)
    .max(11, VALIDATION_MESSAGES.TEL_MAX),
  mail: z.string().email(VALIDATION_MESSAGES.EMAIL),
  departmentId: z.number().min(1, VALIDATION_MESSAGES.DEPARTMENT),
  gradeId: z.number().min(1, VALIDATION_MESSAGES.GRADE),
});

export type EditUserDetailsFormSchema = z.infer<typeof EditUserDetailsSchema>;
