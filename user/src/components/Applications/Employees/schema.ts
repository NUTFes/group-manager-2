import { NEED_APPLICATION } from '@/utils/constants';
import { z } from 'zod';

const VALIDATION_MESSAGES = {
  NAME: 'applications.employees.validation.name',
  STUDENT_ID: 'applications.employees.validation.studentId',
} as const;

export const employeeFormItemSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, VALIDATION_MESSAGES.NAME),
  studentId: z.string().regex(/^\d{8}$/, VALIDATION_MESSAGES.STUDENT_ID),
});

export const employeesFormSchema = z.object({
  needApplication: z
    .enum([NEED_APPLICATION.YES, NEED_APPLICATION.NO])
    .optional(),
  employees: z.array(employeeFormItemSchema).optional(),
});

export type EmployeeFormItem = z.infer<typeof employeeFormItemSchema>;
export type EmployeesForm = z.infer<typeof employeesFormSchema>;
